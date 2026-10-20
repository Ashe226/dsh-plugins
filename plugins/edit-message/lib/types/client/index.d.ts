/**
 * Edit-message plugin, browser half: the pencil in a user message's action row
 * and the inline editor it opens. Saving forks the Session just before the
 * edited message, sends the edited text into the child, opens it, and archives
 * the source — the rest of the conversation is replaced without rewriting a
 * log that only ever appends.
 *
 * One EditSurface per Session backs every user message in that Session, so the
 * draft, the in-flight state and the dragged size survive moving between
 * messages.
 * @module @dookoi/dsh-client-ui-edit-message/client
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
export type { Translate } from './InlineEditor.tsx';
export type { EditActionProps, EditMessageInjected } from './slots.ts';
export type { BubbleFrame, EditFailure, EditSize, EditState, EditStatus, EditTarget, } from './surface.ts';
export type { EditMessageKey } from './locales.ts';
/** Required services: the slot registry, Session commands, navigation, prompt, copy. */
export declare const inject: string[];
/**
 * Client plugin body: the dictionaries and the one user-actions entry.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map