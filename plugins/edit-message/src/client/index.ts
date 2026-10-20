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

import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
// Type-only: pulls the generated Remote API and ctx.remote merge through the Client assembly boundary.
import type {} from '@deepseek-ai/dsh-api-remotes/client'
// Type-only: pulls the sessions service merge (ctx.sessions).
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the Session standard kit (the `useSession` prop).
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
// Type-only: pulls the SlotRegistry service merge (ctx.slots).
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
// Type-only: pulls the workspace navigation merge (ctx.uiWorkspace).
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
// Type-only: pulls the ui-chat SlotMap merge (the user-actions entry).
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import { EditAction } from './EditAction.tsx'
import { en, zh } from './locales.ts'
import type { EditMessageInjected } from './slots.ts'
import { EditSurface, NS } from './surface.ts'

export type { Translate } from './InlineEditor.tsx'
export type { EditActionProps, EditMessageInjected } from './slots.ts'
export type {
  BubbleFrame, EditFailure, EditSize, EditState, EditStatus, EditTarget,
} from './surface.ts'
export type { EditMessageKey } from './locales.ts'

/** Required services: the slot registry, Session commands, navigation, prompt, copy. */
export const inject = ['slots', 'sessions', 'uiWorkspace', 'remote', 'remote.session', 'locale']

/**
 * Client plugin body: the dictionaries and the one user-actions entry.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-edit-message: dictionaries')

  const surfaces = new Map<SessionId, EditSurface>()
  const surfaceFor = (sessionId: SessionId): EditSurface => {
    let surface = surfaces.get(sessionId)
    if (surface === undefined) {
      surface = new EditSurface(ctx, sessionId)
      surfaces.set(sessionId, surface)
    }
    return surface
  }
  ctx.effect(() => () => {
    for (const surface of surfaces.values()) surface.dismiss()
    surfaces.clear()
  }, 'ui-edit-message: per-session surfaces')

  ctx.slots.inject('conversation.chat.user-actions', () => ctx.slots.register({
    name: 'conversation.chat.user-actions',
    id: 'edit-message',
    order: 20,
    locale: NS,
    inject: (sessionId): EditMessageInjected => ({ surface: surfaceFor(sessionId) }),
  }, EditAction))
}
