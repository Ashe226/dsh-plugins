/**
 * One per-Session edit surface: which message is being edited, the draft, the
 * in-flight state, and the size the editor was dragged to.
 *
 * "Replace the rest of the conversation" needs no Host rewrite — Session logs
 * are append-only. Saving forks the Session at the event immediately before the
 * edited message, prompts the edited text into the child, opens it, and
 * archives the source; the sidebar is then left with one conversation
 * continuing from the edit.
 * @module @dookoi/dsh-client-ui-edit-message/client/surface
 */

import type { Context } from '@deepseek-ai/cordis'
import type { MessageId } from '@deepseek-ai/dsh-api-remotes/client'
import type { SessionRequestId } from '@deepseek-ai/dsh-api-session-controller/types'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { HostObservable } from '@deepseek-ai/dsh-client-ui-slots'
import type { EditMessageKey } from './locales.ts'

/** Dictionary namespace owned by this plugin. */
export const NS = 'editMessage'

/** `null` on an axis means "automatic": the bubble's width, height follows the draft. */
export interface EditSize {
  readonly width: number | null
  readonly height: number | null
}

/** Automatic size: a dragged size replaces it whole. */
export const AUTO_SIZE: EditSize = { width: null, height: null }

/** Narrowest editor the grip allows; below this the footer no longer fits. */
export const MIN_WIDTH = 200
/** Shortest editor the grip allows: one text line plus the action row. */
export const MIN_HEIGHT = 104

/** A dragged size outlives the page, so the next edit opens the shape you left. */
const SIZE_KEY = 'dsh.edit-message.size'

/** The edited message's identity and the two event seqs that describe it. */
export interface EditTarget {
  readonly messageId: MessageId
  /** Seq of the `user/message` surface event — the fork cut is `seq - 1`. */
  readonly seq: number
  /** Seq of the owning `turn/start`; 0 marks the first Turn. */
  readonly turnStartSeq: number
  readonly text: string
}

/** Editor lifecycle: idle until the fork starts, then submitting or failed. */
export type EditStatus = 'idle' | 'submitting' | 'failed'

/** A failure the editor shows in place; `detail` fills the dictionary's hole. */
export interface EditFailure {
  readonly key: EditMessageKey
  readonly detail?: string
}

/** Everything the editor renders from. */
export interface EditState {
  readonly target: EditTarget | null
  readonly draft: string
  readonly status: EditStatus
  readonly error: EditFailure | null
  readonly size: EditSize
}

/**
 * The live bubble's own frame, copied once at open time: the editor then sits
 * in the same rounded box under the active theme and font preference.
 */
export interface BubbleFrame {
  readonly background: string
  readonly radius: string
  readonly padding: string
  readonly fontSize: string
  readonly lineHeight: string
  readonly fontFamily: string
  readonly color: string
  readonly letterSpacing: string
}

/** Minimal observable with the getSnapshot/subscribe pair the slot kit binds. */
function createSnapshot<T>(initial: T): HostObservable<T> & { set(next: T): void } {
  let value = initial
  const listeners = new Set<() => void>()
  return {
    getSnapshot: () => value,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    set: (next) => {
      if (next === value) return
      value = next
      for (const listener of [...listeners]) listener()
    },
  }
}

/** Read the last dragged size; an unreadable or absent entry means automatic. */
function readStoredSize(): EditSize {
  try {
    const raw = window.localStorage.getItem(SIZE_KEY)
    if (raw === null) return AUTO_SIZE
    const parsed = JSON.parse(raw) as Partial<EditSize>
    return {
      width: typeof parsed.width === 'number' ? Math.max(MIN_WIDTH, Math.round(parsed.width)) : null,
      height: typeof parsed.height === 'number' ? Math.max(MIN_HEIGHT, Math.round(parsed.height)) : null,
    }
  } catch {
    return AUTO_SIZE
  }
}

/** Remember a dragged size; a private-mode refusal only resets it next time. */
function storeSize(size: EditSize): void {
  try {
    window.localStorage.setItem(SIZE_KEY, JSON.stringify(size))
  } catch {
    /* Storage unavailable: the editor simply opens automatic again. */
  }
}

/**
 * Copy the live bubble's box so the editor replaces it without a visual jump.
 * @param bubble - the message bubble being taken over.
 * @returns the subset of its computed style the editor reproduces.
 */
export function bubbleFrame(bubble: HTMLElement): BubbleFrame {
  const style = getComputedStyle(bubble)
  return {
    background: style.backgroundColor,
    radius: style.borderRadius,
    padding: style.padding,
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    fontFamily: style.fontFamily,
    color: style.color,
    letterSpacing: style.letterSpacing,
  }
}

/** One user-facing dictionary key per known failure; unknown ones keep their message. */
function describeFailure(error: unknown): EditFailure {
  const code = (error as { code?: unknown; rpcError?: { code?: unknown } } | null)?.code
    ?? (error as { rpcError?: { code?: unknown } } | null)?.rpcError?.code
  if (code === 'session/fork-unavailable') return { key: 'error.fork' }
  if (code === 'session/not-found') return { key: 'error.notFound' }
  if (code === 'session/migration-required') return { key: 'error.migration' }
  const message = error instanceof Error && error.message !== '' ? error.message : 'unknown error'
  return { key: 'error.generic', detail: message }
}

/** The edited bubble and the frame the editor took over from it. */
interface Anchor {
  bubble: HTMLElement | null
  frame: BubbleFrame | null
  host: HTMLElement | null
}

/** Per-Session editor state machine and the fork that replaces the tail. */
export class EditSurface {
  /** Observable the slot kit binds into the component's `useEdit` hook. */
  readonly state: HostObservable<EditState> & { set(next: EditState): void }

  private anchor: Anchor = { bubble: null, frame: null, host: null }

  /** Sticky on purpose: the next message opens at the size you last dragged. */
  private size: EditSize = AUTO_SIZE

  private readonly t: (key: EditMessageKey, params?: Record<string, string>) => string

  /** The frame the editor copied from the live bubble; null before open/recycled. */
  get frame(): BubbleFrame | null {
    return this.anchor.frame
  }

  /**
   * @param ctx - client root context (sessions, remotes, workspace, locale).
   * @param sessionId - the Session whose messages this surface edits.
   */
  constructor(private readonly ctx: Context, private readonly sessionId: SessionId) {
    this.t = ctx.locale.bind(NS)
    this.size = readStoredSize()
    this.state = createSnapshot<EditState>({
      target: null, draft: '', status: 'idle', error: null, size: this.size,
    })
  }

  /**
   * Take over one message's bubble.
   * @param target - the message identity and its event coordinates.
   * @param bubble - the live bubble element, or null when it was recycled.
   */
  open(target: EditTarget, bubble: HTMLElement | null): void {
    const previous = this.anchor
    // Opening on another message must hand the previous bubble back too: a
    // bubble left marked `data-editing` stays hidden behind an editor that no
    // longer exists.
    if (previous.bubble !== null && previous.bubble.isConnected) previous.bubble.removeAttribute('data-editing')
    if (previous.host !== null && previous.host.isConnected) previous.host.removeAttribute('data-edit-message-host')
    this.anchor = { bubble, frame: bubble === null ? null : bubbleFrame(bubble), host: null }
    if (bubble !== null) {
      bubble.setAttribute('data-editing', '')
      const host = bubble.parentElement
      if (host !== null) {
        host.setAttribute('data-edit-message-host', '')
        this.anchor.host = host
      }
    }
    this.state.set({ target, draft: target.text, status: 'idle', error: null, size: this.size })
  }

  /**
   * Replace the draft.
   * @param draft - the textarea's current contents.
   */
  edit(draft: string): void {
    this.state.set({ ...this.state.getSnapshot(), draft, error: null })
  }

  /**
   * Pin the editor to a dragged size.
   * @param width - exact width in CSS pixels.
   * @param height - exact height in CSS pixels.
   */
  resize(width: number, height: number): void {
    this.size = { width, height }
    storeSize(this.size)
    this.state.set({ ...this.state.getSnapshot(), size: this.size })
  }

  /** Back to "bubble width, height follows the text". */
  resetSize(): void {
    this.size = AUTO_SIZE
    storeSize(AUTO_SIZE)
    this.state.set({ ...this.state.getSnapshot(), size: AUTO_SIZE })
  }

  /** Close the editor and hand the bubble back to the live message. */
  dismiss(): void {
    const { bubble, host } = this.anchor
    if (bubble !== null && bubble.isConnected) bubble.removeAttribute('data-editing')
    if (host !== null && host.isConnected) host.removeAttribute('data-edit-message-host')
    this.anchor = { bubble: null, frame: null, host: null }
    this.state.set({ target: null, draft: '', status: 'idle', error: null, size: this.size })
  }

  /**
   * Fork from just before the edited message, send the edited text into the
   * child, show it, and archive the source.
   * @returns completion after the navigation; failures land in the editor.
   */
  async submit(): Promise<void> {
    const snapshot = this.state.getSnapshot()
    if (snapshot.target === null) return
    const text = snapshot.draft.trim()
    if (text === '') {
      this.state.set({ ...snapshot, error: { key: 'error.empty' } })
      return
    }
    this.state.set({ ...snapshot, status: 'submitting', error: null })
    let childId: SessionId
    try {
      childId = await this.replacementFor(snapshot.target)
    } catch (error) {
      this.state.set({ ...snapshot, status: 'failed', error: describeFailure(error) })
      return
    }
    try {
      await this.ctx.remote.session.prompt({
        // The Host mints ids by brand; every submission is a fresh uuid here.
        requestId: globalThis.crypto.randomUUID() as SessionRequestId,
        sessionId: childId,
        mode: 'queue',
        content: [{ type: 'text', text }],
        clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    } catch (error) {
      // The replacement exists; say so instead of pretending nothing happened.
      const failure = describeFailure(error)
      this.state.set({
        ...snapshot,
        status: 'failed',
        error: {
          key: 'error.prompt',
          detail: failure.detail ?? this.t(failure.key),
        },
      })
      this.ctx.uiWorkspace.openSession(childId)
      return
    }
    this.dismiss()
    this.ctx.uiWorkspace.openSession(childId)
    // Archive after the selection moved: one conversation is left in the
    // sidebar, which is what "overwrite" means without a log rewrite.
    void this.ctx.uiWorkspace.archiveSession(this.sessionId).catch((reason: unknown) => {
      console.warn('edit-message: source archive rejected:', reason)
    })
  }

  /**
   * Cut the source immediately before the edited message — not before its
   * Turn.
   *
   * A message the app queued while a Turn was running reaches the Session
   * through the agent inbox: it is spliced in *before* the Turn starts and
   * drained only by the event right before the message. Cutting at
   * `turnStartSeq - 1` keeps the splice and drops the drain, so the child
   * inherits a still-pending inbox item and answers the OLD text before the
   * edited one. Cutting at `seq - 1` keeps the drain and leaves the inbox
   * empty; the half-open Turn left behind is closed by the Host's fork closers.
   *
   * The first Turn has no prefix to inherit, so it starts a fresh Session in
   * the same directory.
   * @param target - the message being replaced.
   * @returns the child Session id.
   */
  private async replacementFor(target: EditTarget): Promise<SessionId> {
    const cut = target.seq - 1
    if (target.turnStartSeq > 0 && cut >= 0) {
      return this.ctx.sessions.fork({ sessionId: this.sessionId, atSeq: cut, increaseTitle: false })
    }
    const cwd = this.ctx.sessions.list.getSnapshot().byId[this.sessionId]?.cwd
    return this.ctx.sessions.create(cwd === undefined ? {} : { cwd })
  }
}
