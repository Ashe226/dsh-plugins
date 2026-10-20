/**
 * The pencil in a user message's action row and the editor it opens.
 *
 * The editor is portalled into the message's own bubble stack and takes over
 * the bubble's box, while the bubble steps aside through the surface's
 * `data-editing` marker. A row that left the virtual window would swallow the
 * portal, so a recycled bubble degrades to a centered panel.
 * @module @dookoi/dsh-client-ui-edit-message/client/EditAction
 */
import { type ReactNode } from 'react';
import type { EditActionProps } from './slots.ts';
/**
 * One user message's edit entry.
 * @param props - the owner's message identity and text, the injected surface,
 * the Session hook, and the translator.
 * @returns the pencil toolbar button plus the open editor's portal.
 */
export declare function EditAction({ messageId, seq, turnStartSeq, text, surface, useSession, t, }: EditActionProps): ReactNode;
//# sourceMappingURL=EditAction.d.ts.map