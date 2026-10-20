window.__ModuleLoader__.load({
	id: "@dookoi/dsh-client-ui-edit-message",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_dom = require("react-dom");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:/Users/wenyi/Desktop/DSH/dsh-ai/deepseek-harness/packages/client/ui-edit-message/src/client/EditMessage.module.css.mjs
		const css = "[data-user-bubble][data-editing]{display:none}[data-edit-message-host][data-edit-message-host]{max-width:100%}._9cf85a_action{width:calc(28px + var(--dsh-content-font-delta,0px));height:calc(28px + var(--dsh-content-font-delta,0px));border-radius:var(--dsw-radius-sm);color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;justify-content:center;align-items:center;padding:6px;display:inline-flex}._9cf85a_action svg{width:calc(15px + var(--dsh-content-font-delta,0px));height:calc(15px + var(--dsh-content-font-delta,0px))}._9cf85a_action:hover:not([data-unavailable]){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}._9cf85a_action[data-unavailable]{cursor:default;opacity:.4}._9cf85a_action[data-unavailable]:hover{color:var(--dsw-alias-label-tertiary);background:0 0}._9cf85a_action[data-editing]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}._9cf85a_inline{box-sizing:border-box;flex-direction:column;gap:10px;min-width:200px;display:flex;position:relative}._9cf85a_inline[data-height-locked] ._9cf85a_input{flex:auto;min-height:0;overflow:auto}._9cf85a_inline[data-height-locked] ._9cf85a_row,._9cf85a_inline[data-height-locked] ._9cf85a_error{flex:none}._9cf85a_input{box-sizing:border-box;resize:none;width:100%;color:inherit;font:inherit;line-height:inherit;white-space:pre-wrap;word-break:break-word;background:0 0;border:0;outline:none;margin:0;padding:0;display:block;overflow:hidden}._9cf85a_error{color:var(--color-text-danger,#d4380d);white-space:pre-wrap;margin:0;font-size:12px;line-height:1.5}._9cf85a_row{align-items:center;gap:8px;margin-top:2px;display:flex}._9cf85a_note{min-width:0;color:var(--dsw-alias-label-tertiary);flex:auto;align-items:center;gap:6px;font-size:12px;line-height:1.4;display:inline-flex}._9cf85a_noteIcon{opacity:.8;flex:none;display:inline-flex}._9cf85a_noteIcon svg{width:13px;height:13px}._9cf85a_noteText{white-space:nowrap;text-overflow:ellipsis;min-width:0;overflow:hidden}._9cf85a_grip{width:12px;height:12px;color:var(--dsw-alias-label-tertiary);opacity:.45;cursor:nwse-resize;touch-action:none;border-radius:3px;place-items:center;display:grid;position:absolute;bottom:5px;right:5px}._9cf85a_grip:hover,._9cf85a_grip:focus-visible{opacity:1;background:var(--dsw-alias-interactive-bg-hover);outline:none}._9cf85a_grip svg{width:10px;height:10px}._9cf85a_fallback{z-index:80;background:#00000052;justify-content:center;align-items:center;padding:24px;display:flex;position:fixed;inset:0}._9cf85a_fallback>._9cf85a_inline{border-radius:var(--dsw-radius-xl);background:var(--dsw-surface,#fff);width:min(680px,100%);padding:16px;box-shadow:0 24px 64px #00000047}";
		const tagId = "@dookoi/dsh-client-ui-edit-message/EditMessage.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@dookoi/dsh-client-ui-edit-message";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var EditMessage_module_css_default = {
			"action": "_9cf85a_action",
			"error": "_9cf85a_error",
			"fallback": "_9cf85a_fallback",
			"grip": "_9cf85a_grip",
			"inline": "_9cf85a_inline",
			"input": "_9cf85a_input",
			"note": "_9cf85a_note",
			"noteIcon": "_9cf85a_noteIcon",
			"noteText": "_9cf85a_noteText",
			"row": "_9cf85a_row"
		};
		//#endregion
		//#region src/client/surface.ts
		/** Dictionary namespace owned by this plugin. */
		const NS = "editMessage";
		/** Automatic size: a dragged size replaces it whole. */
		const AUTO_SIZE = {
			width: null,
			height: null
		};
		/** A dragged size outlives the page, so the next edit opens the shape you left. */
		const SIZE_KEY = "dsh.edit-message.size";
		/** Minimal observable with the getSnapshot/subscribe pair the slot kit binds. */
		function createSnapshot(initial) {
			let value = initial;
			const listeners = /* @__PURE__ */ new Set();
			return {
				getSnapshot: () => value,
				subscribe: (listener) => {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				},
				set: (next) => {
					if (next === value) return;
					value = next;
					for (const listener of [...listeners]) listener();
				}
			};
		}
		/** Read the last dragged size; an unreadable or absent entry means automatic. */
		function readStoredSize() {
			try {
				const raw = window.localStorage.getItem(SIZE_KEY);
				if (raw === null) return AUTO_SIZE;
				const parsed = JSON.parse(raw);
				return {
					width: typeof parsed.width === "number" ? Math.max(200, Math.round(parsed.width)) : null,
					height: typeof parsed.height === "number" ? Math.max(104, Math.round(parsed.height)) : null
				};
			} catch {
				return AUTO_SIZE;
			}
		}
		/** Remember a dragged size; a private-mode refusal only resets it next time. */
		function storeSize(size) {
			try {
				window.localStorage.setItem(SIZE_KEY, JSON.stringify(size));
			} catch {}
		}
		/**
		* Copy the live bubble's box so the editor replaces it without a visual jump.
		* @param bubble - the message bubble being taken over.
		* @returns the subset of its computed style the editor reproduces.
		*/
		function bubbleFrame(bubble) {
			const style = getComputedStyle(bubble);
			return {
				background: style.backgroundColor,
				radius: style.borderRadius,
				padding: style.padding,
				fontSize: style.fontSize,
				lineHeight: style.lineHeight,
				fontFamily: style.fontFamily,
				color: style.color,
				letterSpacing: style.letterSpacing
			};
		}
		/** One user-facing dictionary key per known failure; unknown ones keep their message. */
		function describeFailure(error) {
			const code = error?.code ?? error?.rpcError?.code;
			if (code === "session/fork-unavailable") return { key: "error.fork" };
			if (code === "session/not-found") return { key: "error.notFound" };
			if (code === "session/migration-required") return { key: "error.migration" };
			return {
				key: "error.generic",
				detail: error instanceof Error && error.message !== "" ? error.message : "unknown error"
			};
		}
		/** Per-Session editor state machine and the fork that replaces the tail. */
		var EditSurface = class {
			ctx;
			sessionId;
			/** Observable the slot kit binds into the component's `useEdit` hook. */
			state;
			anchor = {
				bubble: null,
				frame: null,
				host: null
			};
			/** Sticky on purpose: the next message opens at the size you last dragged. */
			size = AUTO_SIZE;
			t;
			/** The frame the editor copied from the live bubble; null before open/recycled. */
			get frame() {
				return this.anchor.frame;
			}
			/**
			* @param ctx - client root context (sessions, remotes, workspace, locale).
			* @param sessionId - the Session whose messages this surface edits.
			*/
			constructor(ctx, sessionId) {
				this.ctx = ctx;
				this.sessionId = sessionId;
				this.t = ctx.locale.bind(NS);
				this.size = readStoredSize();
				this.state = createSnapshot({
					target: null,
					draft: "",
					status: "idle",
					error: null,
					size: this.size
				});
			}
			/**
			* Take over one message's bubble.
			* @param target - the message identity and its event coordinates.
			* @param bubble - the live bubble element, or null when it was recycled.
			*/
			open(target, bubble) {
				const previous = this.anchor;
				if (previous.bubble !== null && previous.bubble.isConnected) previous.bubble.removeAttribute("data-editing");
				if (previous.host !== null && previous.host.isConnected) previous.host.removeAttribute("data-edit-message-host");
				this.anchor = {
					bubble,
					frame: bubble === null ? null : bubbleFrame(bubble),
					host: null
				};
				if (bubble !== null) {
					bubble.setAttribute("data-editing", "");
					const host = bubble.parentElement;
					if (host !== null) {
						host.setAttribute("data-edit-message-host", "");
						this.anchor.host = host;
					}
				}
				this.state.set({
					target,
					draft: target.text,
					status: "idle",
					error: null,
					size: this.size
				});
			}
			/**
			* Replace the draft.
			* @param draft - the textarea's current contents.
			*/
			edit(draft) {
				this.state.set({
					...this.state.getSnapshot(),
					draft,
					error: null
				});
			}
			/**
			* Pin the editor to a dragged size.
			* @param width - exact width in CSS pixels.
			* @param height - exact height in CSS pixels.
			*/
			resize(width, height) {
				this.size = {
					width,
					height
				};
				storeSize(this.size);
				this.state.set({
					...this.state.getSnapshot(),
					size: this.size
				});
			}
			/** Back to "bubble width, height follows the text". */
			resetSize() {
				this.size = AUTO_SIZE;
				storeSize(AUTO_SIZE);
				this.state.set({
					...this.state.getSnapshot(),
					size: AUTO_SIZE
				});
			}
			/** Close the editor and hand the bubble back to the live message. */
			dismiss() {
				const { bubble, host } = this.anchor;
				if (bubble !== null && bubble.isConnected) bubble.removeAttribute("data-editing");
				if (host !== null && host.isConnected) host.removeAttribute("data-edit-message-host");
				this.anchor = {
					bubble: null,
					frame: null,
					host: null
				};
				this.state.set({
					target: null,
					draft: "",
					status: "idle",
					error: null,
					size: this.size
				});
			}
			/**
			* Fork from just before the edited message, send the edited text into the
			* child, show it, and archive the source.
			* @returns completion after the navigation; failures land in the editor.
			*/
			async submit() {
				const snapshot = this.state.getSnapshot();
				if (snapshot.target === null) return;
				const text = snapshot.draft.trim();
				if (text === "") {
					this.state.set({
						...snapshot,
						error: { key: "error.empty" }
					});
					return;
				}
				this.state.set({
					...snapshot,
					status: "submitting",
					error: null
				});
				let childId;
				try {
					childId = await this.replacementFor(snapshot.target);
				} catch (error) {
					this.state.set({
						...snapshot,
						status: "failed",
						error: describeFailure(error)
					});
					return;
				}
				try {
					await this.ctx.remote.session.prompt({
						requestId: globalThis.crypto.randomUUID(),
						sessionId: childId,
						mode: "queue",
						content: [{
							type: "text",
							text
						}],
						clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
					});
				} catch (error) {
					const failure = describeFailure(error);
					this.state.set({
						...snapshot,
						status: "failed",
						error: {
							key: "error.prompt",
							detail: failure.detail ?? this.t(failure.key)
						}
					});
					this.ctx.uiWorkspace.openSession(childId);
					return;
				}
				this.dismiss();
				this.ctx.uiWorkspace.openSession(childId);
				this.ctx.uiWorkspace.archiveSession(this.sessionId).catch((reason) => {
					console.warn("edit-message: source archive rejected:", reason);
				});
			}
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
			async replacementFor(target) {
				const cut = target.seq - 1;
				if (target.turnStartSeq > 0 && cut >= 0) return this.ctx.sessions.fork({
					sessionId: this.sessionId,
					atSeq: cut,
					increaseTitle: false
				});
				const cwd = this.ctx.sessions.list.getSnapshot().byId[this.sessionId]?.cwd;
				return this.ctx.sessions.create(cwd === void 0 ? {} : { cwd });
			}
		};
		//#endregion
		//#region src/client/InlineEditor.tsx
		/**
		* The editor that stands in the edited message's own bubble: same background,
		* radius, padding and type, at the width the bubble would have had — and
		* resizable from its corner, because a one-line message should not force a
		* one-line edit box.
		* @module @dookoi/dsh-client-ui-edit-message/client/InlineEditor
		*/
		/**
		* Widest the editor may get: the message row, not the bubble stack. The stack
		* shrink-wraps its (now hidden) bubble, so its own width would pin the editor
		* to whatever it already is and no drag could widen it.
		*/
		function widthLimit(node, fallback) {
			const scope = node.closest("[data-chat-flow-kind]") ?? node.parentElement;
			return Math.max(200, Math.round(scope?.clientWidth ?? fallback));
		}
		/**
		* Auto-growing textarea: exactly as tall as the draft — unless a height was
		* dragged, in which case the frame owns the height and the input scrolls.
		*/
		function useAutoHeight(value, locked, width) {
			const ref = (0, react.useRef)(null);
			(0, react.useLayoutEffect)(() => {
				const node = ref.current;
				/* v8 ignore next -- a rendered textarea always fills its ref before a layout effect. */
				if (node === null) return;
				if (locked) {
					node.style.height = "";
					return;
				}
				node.style.height = "auto";
				node.style.height = `${node.scrollHeight}px`;
			}, [
				value,
				locked,
				width
			]);
			return ref;
		}
		/** Corner grip: drag to size, arrows for keyboard, double-click to reset. */
		function ResizeGrip({ surface, box, t }) {
			const drag = (0, react.useRef)(null);
			const stop = () => {
				const active = drag.current;
				/* v8 ignore next -- only listeners installed by a drag can call stop. */
				if (active === null) return;
				const grip = active.target;
				grip.removeEventListener("pointermove", active.move);
				grip.removeEventListener("pointerup", stop);
				grip.removeEventListener("pointercancel", stop);
				if (grip.hasPointerCapture(active.id)) grip.releasePointerCapture(active.id);
				document.body.style.userSelect = active.selection;
				drag.current = null;
			};
			const onPointerDown = (event) => {
				if (event.pointerType === "mouse" && event.button !== 0) return;
				const node = box.current;
				/* v8 ignore next -- the grip only receives pointer events while its box is mounted. */
				if (node === null) return;
				event.preventDefault();
				const rect = node.getBoundingClientRect();
				const origin = {
					x: event.clientX,
					y: event.clientY,
					width: rect.width,
					height: rect.height
				};
				const maxWidth = widthLimit(node, rect.width);
				const target = event.currentTarget;
				const id = event.pointerId;
				const move = (moveEvent) => {
					const width = Math.round(Math.min(maxWidth, Math.max(200, origin.width + moveEvent.clientX - origin.x)));
					const height = Math.round(Math.max(104, origin.height + moveEvent.clientY - origin.y));
					surface.resize(width, height);
				};
				target.setPointerCapture(id);
				target.addEventListener("pointermove", move);
				target.addEventListener("pointerup", stop);
				target.addEventListener("pointercancel", stop);
				drag.current = {
					move,
					target,
					id,
					selection: document.body.style.userSelect
				};
				document.body.style.userSelect = "none";
			};
			const onKeyDown = (event) => {
				const step = event.shiftKey ? 48 : 16;
				const node = box.current;
				/* v8 ignore next -- the grip only receives key events while its box is mounted. */
				if (node === null) return;
				const rect = node.getBoundingClientRect();
				const delta = {
					ArrowLeft: [-step, 0],
					ArrowRight: [step, 0],
					ArrowUp: [0, -step],
					ArrowDown: [0, step]
				}[event.key];
				if (delta === void 0) return;
				event.preventDefault();
				const maxWidth = widthLimit(node, rect.width);
				surface.resize(Math.round(Math.min(maxWidth, Math.max(200, rect.width + delta[0]))), Math.round(Math.max(104, rect.height + delta[1])));
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: EditMessage_module_css_default.grip,
				"data-edit-message-grip": "",
				role: "separator",
				tabIndex: 0,
				title: t("editor.grip"),
				"aria-label": t("editor.gripLabel"),
				onPointerDown,
				onDoubleClick: (event) => {
					event.preventDefault();
					surface.resetSize();
				},
				onKeyDown,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 10 10",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: 1.4,
					strokeLinecap: "round",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M9 3.2 3.2 9M9 6.6 6.6 9" })
				})
			});
		}
		/** Width and height the frame applies, plus the copied bubble box. */
		function frameStyle(frame, size) {
			const box = frame === null ? {} : {
				background: frame.background,
				borderRadius: frame.radius,
				padding: frame.padding,
				fontSize: frame.fontSize,
				lineHeight: frame.lineHeight,
				fontFamily: frame.fontFamily,
				color: frame.color,
				letterSpacing: frame.letterSpacing
			};
			const width = size.width !== null ? {
				width: `${size.width}px`,
				maxWidth: "100%"
			} : frame === null ? {} : { width: "calc(var(--dsh-chat-content-width, 748px) * 0.702)" };
			const height = size.height !== null ? {
				height: `${size.height}px`,
				maxHeight: "70vh"
			} : {};
			return {
				...box,
				...width,
				...height
			};
		}
		/**
		* The editor standing in the bubble's frame.
		* @param props.state - the surface snapshot (draft, status, size).
		* @param props.frame - the copied bubble box, or null in the fallback panel.
		* @param props.surface - the surface the editor writes back to.
		* @param props.t - the namespace resolver.
		* @returns the editor box, its failure line, and its action row.
		*/
		function InlineEditor({ state, frame, surface, t }) {
			const heightLocked = state.size.height !== null;
			const textarea = useAutoHeight(state.draft, heightLocked, state.size.width);
			const box = (0, react.useRef)(null);
			if (state.target === null) return null;
			const busy = state.status === "submitting";
			const empty = state.draft.trim() === "";
			const submit = () => {
				surface.submit();
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: box,
				className: EditMessage_module_css_default.inline,
				"data-edit-message-editor": "",
				"data-height-locked": heightLocked ? "" : void 0,
				"data-resized": state.size.width !== null || heightLocked ? "" : void 0,
				style: frameStyle(frame, state.size),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
						ref: textarea,
						className: EditMessage_module_css_default.input,
						"data-edit-message-input": "",
						value: state.draft,
						rows: 1,
						autoFocus: true,
						disabled: busy,
						"aria-label": t("editor.label"),
						onChange: (event) => {
							surface.edit(event.target.value);
						},
						onKeyDown: (event) => {
							if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
								event.preventDefault();
								submit();
							} else if (event.key === "Escape") {
								event.preventDefault();
								surface.dismiss();
							}
						}
					}),
					state.error === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: EditMessage_module_css_default.error,
						role: "alert",
						children: t(state.error.key, state.error.detail === void 0 ? void 0 : { detail: state.error.detail })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: EditMessage_module_css_default.row,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: EditMessage_module_css_default.note,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: EditMessage_module_css_default.noteIcon,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconInfoOutlineRegular, {})
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: EditMessage_module_css_default.noteText,
									children: busy ? t("editor.busy") : t("editor.note")
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "ghost",
								size: "md",
								disabled: busy,
								onClick: () => {
									surface.dismiss();
								},
								children: t("editor.cancel")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "primary",
								size: "md",
								disabled: busy || empty,
								onClick: submit,
								children: busy ? t("editor.sending") : t("editor.send")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ResizeGrip, {
						surface,
						box,
						t
					})
				]
			});
		}
		//#endregion
		//#region src/client/EditAction.tsx
		/**
		* The pencil in a user message's action row and the editor it opens.
		*
		* The editor is portalled into the message's own bubble stack and takes over
		* the bubble's box, while the bubble steps aside through the surface's
		* `data-editing` marker. A row that left the virtual window would swallow the
		* portal, so a recycled bubble degrades to a centered panel.
		* @module @dookoi/dsh-client-ui-edit-message/client/EditAction
		*/
		/**
		* One user message's edit entry.
		* @param props - the owner's message identity and text, the injected surface,
		* the Session hook, and the translator.
		* @returns the pencil toolbar button plus the open editor's portal.
		*/
		function EditAction({ messageId, seq, turnStartSeq, text, surface, useSession, t }) {
			const edit = (0, react.useSyncExternalStore)((listener) => surface.state.subscribe(listener), () => surface.state.getSnapshot());
			const running = useSession((snapshot) => snapshot.running);
			const [container, setContainer] = (0, react.useState)(null);
			const button = (0, react.useRef)(null);
			const editing = edit.target !== null;
			const unavailable = turnStartSeq === void 0 || running;
			const reason = turnStartSeq === void 0 ? t("action.unavailable.window") : running ? t("action.unavailable.running") : t("action.edit");
			const open = () => {
				const bubble = (button.current?.closest("[data-chat-flow-kind=\"user\"]"))?.querySelector("[data-user-bubble]") ?? null;
				/* v8 ignore next -- an unloaded row binds no handler, so the 0 is a type backstop. */
				surface.open({
					messageId,
					seq,
					turnStartSeq: turnStartSeq ?? 0,
					text
				}, bubble);
				setContainer(bubble?.parentElement ?? document.body);
			};
			const attached = container !== null && (container === document.body || container.isConnected);
			const modal = container === document.body;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
				label: reason,
				side: "bottom",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					ref: button,
					className: EditMessage_module_css_default.action,
					"data-edit-message-action": "",
					"data-editing": editing ? "" : void 0,
					"data-unavailable": unavailable || void 0,
					"aria-disabled": unavailable || void 0,
					"aria-label": reason,
					onClick: unavailable ? void 0 : () => {
						if (editing) surface.dismiss();
						else open();
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEditOutlineRegular, {})
				})
			}), editing && attached ? (0, react_dom.createPortal)(modal ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: EditMessage_module_css_default.fallback,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InlineEditor, {
					state: edit,
					frame: null,
					surface,
					t
				})
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InlineEditor, {
				state: edit,
				frame: surface.frame,
				surface,
				t
			}), container) : null] });
		}
		//#endregion
		//#region src/client/locales.ts
		/**
		* `editMessage` namespace dictionaries. The plugin ships no copy of its own
		* outside this module: the pencil tooltip, the editor's info line, its two
		* actions, and every failure sentence resolve through `ctx.locale`.
		* @module @dookoi/dsh-client-ui-edit-message/client/locales
		*/
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"action.edit": "编辑并重新生成",
			"action.unavailable.window": "这条消息所在的历史区间还没加载完整",
			"action.unavailable.running": "会话正在生成，先停止或等待完成",
			"editor.label": "编辑消息",
			"editor.note": "编辑后将从此处重新开始对话，产物也将回退至此信息前版本",
			"editor.busy": "正在重新生成…",
			"editor.cancel": "取消",
			"editor.send": "发送",
			"editor.sending": "发送中…",
			"editor.grip": "拖动调整大小，双击恢复默认",
			"editor.gripLabel": "调整编辑框大小，方向键微调，双击恢复默认",
			"error.empty": "消息内容不能为空。",
			"error.fork": "这条消息所在的历史区间还没加载完整，请向上滚动后再试。",
			"error.notFound": "原会话已经不可读，无法重新生成。",
			"error.migration": "原会话需要先打开一次完成升级，然后再试。",
			"error.prompt": "已从这条消息重建会话，但消息没能送达：{detail} 可以在那里手动重发。",
			"error.generic": "操作失败：{detail}"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"action.edit": "Edit and regenerate",
			"action.unavailable.window": "This message is outside the loaded history window",
			"action.unavailable.running": "The session is generating; stop it or wait for it to finish",
			"editor.label": "Edit message",
			"editor.note": "Editing restarts the conversation here; later output is rolled back to just before this message",
			"editor.busy": "Regenerating…",
			"editor.cancel": "Cancel",
			"editor.send": "Send",
			"editor.sending": "Sending…",
			"editor.grip": "Drag to resize, double-click to reset",
			"editor.gripLabel": "Resize the editor; arrow keys nudge, double-click resets",
			"error.empty": "A message cannot be empty.",
			"error.fork": "The history around this message is not fully loaded; scroll up and try again.",
			"error.notFound": "The source conversation is no longer readable, so it cannot be regenerated.",
			"error.migration": "The source conversation must be opened once to finish upgrading, then try again.",
			"error.prompt": "The conversation was rebuilt from this message, but the message did not arrive: {detail} You can resend it there.",
			"error.generic": "That did not work: {detail}"
		};
		//#endregion
		//#region src/client/index.ts
		/** Required services: the slot registry, Session commands, navigation, prompt, copy. */
		const inject = [
			"slots",
			"sessions",
			"uiWorkspace",
			"remote",
			"remote.session",
			"locale"
		];
		/**
		* Client plugin body: the dictionaries and the one user-actions entry.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-edit-message: dictionaries");
			const surfaces = /* @__PURE__ */ new Map();
			const surfaceFor = (sessionId) => {
				let surface = surfaces.get(sessionId);
				if (surface === void 0) {
					surface = new EditSurface(ctx, sessionId);
					surfaces.set(sessionId, surface);
				}
				return surface;
			};
			ctx.effect(() => () => {
				for (const surface of surfaces.values()) surface.dismiss();
				surfaces.clear();
			}, "ui-edit-message: per-session surfaces");
			ctx.slots.inject("conversation.chat.user-actions", () => ctx.slots.register({
				name: "conversation.chat.user-actions",
				id: "edit-message",
				order: 20,
				locale: NS,
				inject: (sessionId) => ({ surface: surfaceFor(sessionId) })
			}, EditAction));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map