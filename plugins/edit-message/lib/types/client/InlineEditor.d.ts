/**
 * The editor that stands in the edited message's own bubble: same background,
 * radius, padding and type, at the width the bubble would have had — and
 * resizable from its corner, because a one-line message should not force a
 * one-line edit box.
 * @module @dookoi/dsh-client-ui-edit-message/client/InlineEditor
 */
import { type ReactNode } from 'react';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { BubbleFrame, EditState, EditSurface } from './surface.ts';
/** The dictionary resolver this package's components render through. */
export type Translate = PropsLocale<'editMessage'>['t'];
/**
 * The editor standing in the bubble's frame.
 * @param props.state - the surface snapshot (draft, status, size).
 * @param props.frame - the copied bubble box, or null in the fallback panel.
 * @param props.surface - the surface the editor writes back to.
 * @param props.t - the namespace resolver.
 * @returns the editor box, its failure line, and its action row.
 */
export declare function InlineEditor({ state, frame, surface, t }: {
    state: EditState;
    frame: BubbleFrame | null;
    surface: EditSurface;
    t: Translate;
}): ReactNode;
//# sourceMappingURL=InlineEditor.d.ts.map