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
import type { Context } from '@deepseek-ai/cordis';
import type { MessageId } from '@deepseek-ai/dsh-api-remotes/client';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { HostObservable } from '@deepseek-ai/dsh-client-ui-slots';
import type { EditMessageKey } from './locales.ts';
/** Dictionary namespace owned by this plugin. */
export declare const NS = "editMessage";
/** `null` on an axis means "automatic": the bubble's width, height follows the draft. */
export interface EditSize {
    readonly width: number | null;
    readonly height: number | null;
}
/** Automatic size: a dragged size replaces it whole. */
export declare const AUTO_SIZE: EditSize;
/** Narrowest editor the grip allows; below this the footer no longer fits. */
export declare const MIN_WIDTH = 200;
/** Shortest editor the grip allows: one text line plus the action row. */
export declare const MIN_HEIGHT = 104;
/** The edited message's identity and the two event seqs that describe it. */
export interface EditTarget {
    readonly messageId: MessageId;
    /** Seq of the `user/message` surface event — the fork cut is `seq - 1`. */
    readonly seq: number;
    /** Seq of the owning `turn/start`; 0 marks the first Turn. */
    readonly turnStartSeq: number;
    readonly text: string;
}
/** Editor lifecycle: idle until the fork starts, then submitting or failed. */
export type EditStatus = 'idle' | 'submitting' | 'failed';
/** A failure the editor shows in place; `detail` fills the dictionary's hole. */
export interface EditFailure {
    readonly key: EditMessageKey;
    readonly detail?: string;
}
/** Everything the editor renders from. */
export interface EditState {
    readonly target: EditTarget | null;
    readonly draft: string;
    readonly status: EditStatus;
    readonly error: EditFailure | null;
    readonly size: EditSize;
}
/**
 * The live bubble's own frame, copied once at open time: the editor then sits
 * in the same rounded box under the active theme and font preference.
 */
export interface BubbleFrame {
    readonly background: string;
    readonly radius: string;
    readonly padding: string;
    readonly fontSize: string;
    readonly lineHeight: string;
    readonly fontFamily: string;
    readonly color: string;
    readonly letterSpacing: string;
}
/**
 * Copy the live bubble's box so the editor replaces it without a visual jump.
 * @param bubble - the message bubble being taken over.
 * @returns the subset of its computed style the editor reproduces.
 */
export declare function bubbleFrame(bubble: HTMLElement): BubbleFrame;
/** Per-Session editor state machine and the fork that replaces the tail. */
export declare class EditSurface {
    private readonly ctx;
    private readonly sessionId;
    /** Observable the slot kit binds into the component's `useEdit` hook. */
    readonly state: HostObservable<EditState> & {
        set(next: EditState): void;
    };
    private anchor;
    /** Sticky on purpose: the next message opens at the size you last dragged. */
    private size;
    private readonly t;
    /** The frame the editor copied from the live bubble; null before open/recycled. */
    get frame(): BubbleFrame | null;
    /**
     * @param ctx - client root context (sessions, remotes, workspace, locale).
     * @param sessionId - the Session whose messages this surface edits.
     */
    constructor(ctx: Context, sessionId: SessionId);
    /**
     * Take over one message's bubble.
     * @param target - the message identity and its event coordinates.
     * @param bubble - the live bubble element, or null when it was recycled.
     */
    open(target: EditTarget, bubble: HTMLElement | null): void;
    /**
     * Replace the draft.
     * @param draft - the textarea's current contents.
     */
    edit(draft: string): void;
    /**
     * Pin the editor to a dragged size.
     * @param width - exact width in CSS pixels.
     * @param height - exact height in CSS pixels.
     */
    resize(width: number, height: number): void;
    /** Back to "bubble width, height follows the text". */
    resetSize(): void;
    /** Close the editor and hand the bubble back to the live message. */
    dismiss(): void;
    /**
     * Fork from just before the edited message, send the edited text into the
     * child, show it, and archive the source.
     * @returns completion after the navigation; failures land in the editor.
     */
    submit(): Promise<void>;
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
    private replacementFor;
}
//# sourceMappingURL=surface.d.ts.map