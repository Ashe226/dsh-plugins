/**
 * The injected face of this package's single entry. The
 * 'conversation.chat.user-actions' slot is declared and typed by ui-chat; this
 * package only contributes an entry, so no SlotMap merge lives here. Live
 * editor state reaches the component through the surface itself
 * (`useSyncExternalStore` over `surface.state`), which is why this face is one
 * object and not one observable per message.
 * @module @dookoi/dsh-client-ui-edit-message/client/slots
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { EditSurface } from './surface.ts';
/** Injected business face of one user-message edit entry. */
export interface EditMessageInjected {
    /** The Session's edit surface, shared by every user message in it. */
    surface: EditSurface;
}
/** Full props of one user-message edit entry. */
export type EditActionProps = PropsRuntime<'conversation.chat.user-actions'> & InjectFace<EditMessageInjected> & PropsLocale<'editMessage'>;
//# sourceMappingURL=slots.d.ts.map