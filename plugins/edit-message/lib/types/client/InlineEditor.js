import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The editor that stands in the edited message's own bubble: same background,
 * radius, padding and type, at the width the bubble would have had — and
 * resizable from its corner, because a one-line message should not force a
 * one-line edit box.
 * @module @dookoi/dsh-client-ui-edit-message/client/InlineEditor
 */
import { useLayoutEffect, useRef } from 'react';
import { Button, IconInfoOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './EditMessage.module.css';
import { MIN_HEIGHT, MIN_WIDTH } from "./surface.js";
/**
 * Widest the editor may get: the message row, not the bubble stack. The stack
 * shrink-wraps its (now hidden) bubble, so its own width would pin the editor
 * to whatever it already is and no drag could widen it.
 */
function widthLimit(node, fallback) {
    const scope = node.closest('[data-chat-flow-kind]') ?? node.parentElement;
    return Math.max(MIN_WIDTH, Math.round(scope?.clientWidth ?? fallback));
}
/**
 * Auto-growing textarea: exactly as tall as the draft — unless a height was
 * dragged, in which case the frame owns the height and the input scrolls.
 */
function useAutoHeight(value, locked, width) {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const node = ref.current;
        /* v8 ignore next -- a rendered textarea always fills its ref before a layout effect. */
        if (node === null)
            return;
        if (locked) {
            // Drop the measured height so the flex rule owns it instead.
            node.style.height = '';
            return;
        }
        node.style.height = 'auto';
        node.style.height = `${node.scrollHeight}px`;
    }, [value, locked, width]);
    return ref;
}
/** Corner grip: drag to size, arrows for keyboard, double-click to reset. */
function ResizeGrip({ surface, box, t }) {
    const drag = useRef(null);
    const stop = () => {
        const active = drag.current;
        /* v8 ignore next -- only listeners installed by a drag can call stop. */
        if (active === null)
            return;
        const grip = active.target;
        grip.removeEventListener('pointermove', active.move);
        grip.removeEventListener('pointerup', stop);
        grip.removeEventListener('pointercancel', stop);
        if (grip.hasPointerCapture(active.id))
            grip.releasePointerCapture(active.id);
        document.body.style.userSelect = active.selection;
        drag.current = null;
    };
    const onPointerDown = (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0)
            return;
        const node = box.current;
        /* v8 ignore next -- the grip only receives pointer events while its box is mounted. */
        if (node === null)
            return;
        event.preventDefault();
        const rect = node.getBoundingClientRect();
        const origin = { x: event.clientX, y: event.clientY, width: rect.width, height: rect.height };
        const maxWidth = widthLimit(node, rect.width);
        const target = event.currentTarget;
        const id = event.pointerId;
        const move = (moveEvent) => {
            const width = Math.round(Math.min(maxWidth, Math.max(MIN_WIDTH, origin.width + moveEvent.clientX - origin.x)));
            const height = Math.round(Math.max(MIN_HEIGHT, origin.height + moveEvent.clientY - origin.y));
            surface.resize(width, height);
        };
        target.setPointerCapture(id);
        target.addEventListener('pointermove', move);
        target.addEventListener('pointerup', stop);
        target.addEventListener('pointercancel', stop);
        drag.current = { move, target, id, selection: document.body.style.userSelect };
        document.body.style.userSelect = 'none';
    };
    const onKeyDown = (event) => {
        const step = event.shiftKey ? 48 : 16;
        const node = box.current;
        /* v8 ignore next -- the grip only receives key events while its box is mounted. */
        if (node === null)
            return;
        const rect = node.getBoundingClientRect();
        const delta = {
            ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step],
        }[event.key];
        if (delta === undefined)
            return;
        event.preventDefault();
        const maxWidth = widthLimit(node, rect.width);
        surface.resize(Math.round(Math.min(maxWidth, Math.max(MIN_WIDTH, rect.width + delta[0]))), Math.round(Math.max(MIN_HEIGHT, rect.height + delta[1])));
    };
    return (_jsx("span", { className: css.grip, "data-edit-message-grip": "", role: "separator", tabIndex: 0, title: t('editor.grip'), "aria-label": t('editor.gripLabel'), onPointerDown: onPointerDown, onDoubleClick: (event) => { event.preventDefault(); surface.resetSize(); }, onKeyDown: onKeyDown, children: _jsx("svg", { viewBox: "0 0 10 10", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", children: _jsx("path", { d: "M9 3.2 3.2 9M9 6.6 6.6 9" }) }) }));
}
/** Width and height the frame applies, plus the copied bubble box. */
function frameStyle(frame, size) {
    const box = frame === null
        ? {}
        : {
            background: frame.background,
            borderRadius: frame.radius,
            padding: frame.padding,
            fontSize: frame.fontSize,
            lineHeight: frame.lineHeight,
            fontFamily: frame.fontFamily,
            color: frame.color,
            letterSpacing: frame.letterSpacing,
        };
    const width = size.width !== null
        ? { width: `${size.width}px`, maxWidth: '100%' }
        // Opens at the shipped bubble cap, which is width-independent: a two-word
        // message still gets a usable box. Without a frame the fallback CSS sizes it.
        : frame === null ? {} : { width: 'calc(var(--dsh-chat-content-width, 748px) * 0.702)' };
    const height = size.height !== null ? { height: `${size.height}px`, maxHeight: '70vh' } : {};
    return { ...box, ...width, ...height };
}
/**
 * The editor standing in the bubble's frame.
 * @param props.state - the surface snapshot (draft, status, size).
 * @param props.frame - the copied bubble box, or null in the fallback panel.
 * @param props.surface - the surface the editor writes back to.
 * @param props.t - the namespace resolver.
 * @returns the editor box, its failure line, and its action row.
 */
export function InlineEditor({ state, frame, surface, t }) {
    const heightLocked = state.size.height !== null;
    const textarea = useAutoHeight(state.draft, heightLocked, state.size.width);
    const box = useRef(null);
    if (state.target === null)
        return null;
    const busy = state.status === 'submitting';
    const empty = state.draft.trim() === '';
    const submit = () => { void surface.submit(); };
    return (_jsxs("div", { ref: box, className: css.inline, "data-edit-message-editor": "", "data-height-locked": heightLocked ? '' : undefined, "data-resized": state.size.width !== null || heightLocked ? '' : undefined, style: frameStyle(frame, state.size), children: [_jsx("textarea", { ref: textarea, className: css.input, "data-edit-message-input": "", value: state.draft, rows: 1, autoFocus: true, disabled: busy, "aria-label": t('editor.label'), onChange: (event) => { surface.edit(event.target.value); }, onKeyDown: (event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                        event.preventDefault();
                        submit();
                    }
                    else if (event.key === 'Escape') {
                        event.preventDefault();
                        surface.dismiss();
                    }
                } }), state.error === null ? null : (_jsx("p", { className: css.error, role: "alert", children: t(state.error.key, state.error.detail === undefined ? undefined : { detail: state.error.detail }) })), _jsxs("div", { className: css.row, children: [_jsxs("span", { className: css.note, children: [_jsx("span", { className: css.noteIcon, children: _jsx(IconInfoOutlineRegular, {}) }), _jsx("span", { className: css.noteText, children: busy ? t('editor.busy') : t('editor.note') })] }), _jsx(Button, { variant: "ghost", size: "md", disabled: busy, onClick: () => { surface.dismiss(); }, children: t('editor.cancel') }), _jsx(Button, { variant: "primary", size: "md", disabled: busy || empty, onClick: submit, children: busy ? t('editor.sending') : t('editor.send') })] }), _jsx(ResizeGrip, { surface: surface, box: box, t: t })] }));
}
//# sourceMappingURL=InlineEditor.js.map