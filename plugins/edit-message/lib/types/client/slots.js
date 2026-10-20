/**
 * The injected face of this package's single entry. The
 * 'conversation.chat.user-actions' slot is declared and typed by ui-chat; this
 * package only contributes an entry, so no SlotMap merge lives here. Live
 * editor state reaches the component through the surface itself
 * (`useSyncExternalStore` over `surface.state`), which is why this face is one
 * object and not one observable per message.
 * @module @dookoi/dsh-client-ui-edit-message/client/slots
 */
export {};
//# sourceMappingURL=slots.js.map