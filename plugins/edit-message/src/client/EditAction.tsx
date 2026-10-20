/**
 * The pencil in a user message's action row and the editor it opens.
 *
 * The editor is portalled into the message's own bubble stack and takes over
 * the bubble's box, while the bubble steps aside through the surface's
 * `data-editing` marker. A row that left the virtual window would swallow the
 * portal, so a recycled bubble degrades to a centered panel.
 * @module @dookoi/dsh-client-ui-edit-message/client/EditAction
 */

import { useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconEditOutlineRegular, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import css from './EditMessage.module.css'
import { InlineEditor } from './InlineEditor.tsx'
import type { EditActionProps } from './slots.ts'

/**
 * One user message's edit entry.
 * @param props - the owner's message identity and text, the injected surface,
 * the Session hook, and the translator.
 * @returns the pencil toolbar button plus the open editor's portal.
 */
export function EditAction({
  messageId, seq, turnStartSeq, text, surface, useSession, t,
}: EditActionProps): ReactNode {
  const edit = useSyncExternalStore(
    listener => surface.state.subscribe(listener),
    () => surface.state.getSnapshot(),
  )
  const running = useSession(snapshot => snapshot.running)
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const button = useRef<HTMLButtonElement>(null)
  const editing = edit.target !== null
  const unavailable = turnStartSeq === undefined || running
  const reason = turnStartSeq === undefined
    ? t('action.unavailable.window')
    : running ? t('action.unavailable.running') : t('action.edit')

  const open = (): void => {
    const row = button.current?.closest('[data-chat-flow-kind="user"]')
    const bubble = row?.querySelector<HTMLElement>('[data-user-bubble]') ?? null
    /* v8 ignore next -- an unloaded row binds no handler, so the 0 is a type backstop. */
    surface.open({ messageId, seq, turnStartSeq: turnStartSeq ?? 0, text }, bubble)
    setContainer(bubble?.parentElement ?? document.body)
  }

  // A container that left the virtual window would swallow the portal, so the
  // editor falls back to a centered panel over the page.
  const attached = container !== null && (container === document.body || container.isConnected)
  const modal = container === document.body

  return (
    <>
      <Tooltip label={reason} side="bottom">
        <button
          type="button"
          ref={button}
          className={css.action}
          data-edit-message-action=""
          data-editing={editing ? '' : undefined}
          // Native disabled buttons do not deliver the hover/focus events Tooltip needs.
          data-unavailable={unavailable || undefined}
          aria-disabled={unavailable || undefined}
          aria-label={reason}
          onClick={unavailable ? undefined : () => { if (editing) surface.dismiss(); else open() }}
        >
          <IconEditOutlineRegular />
        </button>
      </Tooltip>
      {editing && attached
        ? createPortal(
          modal
            ? <div className={css.fallback}><InlineEditor state={edit} frame={null} surface={surface} t={t} /></div>
            : <InlineEditor state={edit} frame={surface.frame} surface={surface} t={t} />,
          container,
        )
        : null}
    </>
  )
}
