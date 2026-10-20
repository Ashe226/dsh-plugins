import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The pencil in a user message's action row and the editor it opens.
 *
 * The editor is portalled into the message's own bubble stack and takes over
 * the bubble's box, while the bubble steps aside through the surface's
 * `data-editing` marker. A row that left the virtual window would swallow the
 * portal, so a recycled bubble degrades to a centered panel.
 * @module @dookoi/dsh-client-ui-edit-message/client/EditAction
 */
import { useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { IconEditOutlineRegular, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './EditMessage.module.css';
import { InlineEditor } from "./InlineEditor.js";
/**
 * One user message's edit entry.
 * @param props - the owner's message identity and text, the injected surface,
 * the Session hook, and the translator.
 * @returns the pencil toolbar button plus the open editor's portal.
 */
export function EditAction({ messageId, seq, turnStartSeq, text, surface, useSession, t, }) {
    const edit = useSyncExternalStore(listener => surface.state.subscribe(listener), () => surface.state.getSnapshot());
    const running = useSession(snapshot => snapshot.running);
    const [container, setContainer] = useState(null);
    const button = useRef(null);
    const editing = edit.target !== null;
    const unavailable = turnStartSeq === undefined || running;
    const reason = turnStartSeq === undefined
        ? t('action.unavailable.window')
        : running ? t('action.unavailable.running') : t('action.edit');
    const open = () => {
        const row = button.current?.closest('[data-chat-flow-kind="user"]');
        const bubble = row?.querySelector('[data-user-bubble]') ?? null;
        /* v8 ignore next -- an unloaded row binds no handler, so the 0 is a type backstop. */
        surface.open({ messageId, seq, turnStartSeq: turnStartSeq ?? 0, text }, bubble);
        setContainer(bubble?.parentElement ?? document.body);
    };
    // A container that left the virtual window would swallow the portal, so the
    // editor falls back to a centered panel over the page.
    const attached = container !== null && (container === document.body || container.isConnected);
    const modal = container === document.body;
    return (_jsxs(_Fragment, { children: [_jsx(Tooltip, { label: reason, side: "bottom", children: _jsx("button", { type: "button", ref: button, className: css.action, "data-edit-message-action": "", "data-editing": editing ? '' : undefined, "data-unavailable": unavailable || undefined, "aria-disabled": unavailable || undefined, "aria-label": reason, onClick: unavailable ? undefined : () => { if (editing)
                        surface.dismiss();
                    else
                        open(); }, children: _jsx(IconEditOutlineRegular, {}) }) }), editing && attached
                ? createPortal(modal
                    ? _jsx("div", { className: css.fallback, children: _jsx(InlineEditor, { state: edit, frame: null, surface: surface, t: t }) })
                    : _jsx(InlineEditor, { state: edit, frame: surface.frame, surface: surface, t: t }), container)
                : null] }));
}
//# sourceMappingURL=EditAction.js.map