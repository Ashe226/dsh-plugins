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
import { EditAction } from "./EditAction.js";
import { en, zh } from "./locales.js";
import { EditSurface, NS } from "./surface.js";
/** Required services: the slot registry, Session commands, navigation, prompt, copy. */
export const inject = ['slots', 'sessions', 'uiWorkspace', 'remote', 'remote.session', 'locale'];
/**
 * Client plugin body: the dictionaries and the one user-actions entry.
 * @param ctx - client root context.
 */
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-edit-message: dictionaries');
    const surfaces = new Map();
    const surfaceFor = (sessionId) => {
        let surface = surfaces.get(sessionId);
        if (surface === undefined) {
            surface = new EditSurface(ctx, sessionId);
            surfaces.set(sessionId, surface);
        }
        return surface;
    };
    ctx.effect(() => () => {
        for (const surface of surfaces.values())
            surface.dismiss();
        surfaces.clear();
    }, 'ui-edit-message: per-session surfaces');
    ctx.slots.inject('conversation.chat.user-actions', () => ctx.slots.register({
        name: 'conversation.chat.user-actions',
        id: 'edit-message',
        order: 20,
        locale: NS,
        inject: (sessionId) => ({ surface: surfaceFor(sessionId) }),
    }, EditAction));
}
//# sourceMappingURL=index.js.map