/**
 * `editMessage` namespace dictionaries. The plugin ships no copy of its own
 * outside this module: the pencil tooltip, the editor's info line, its two
 * actions, and every failure sentence resolve through `ctx.locale`.
 * @module @dookoi/dsh-client-ui-edit-message/client/locales
 */
/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
    'action.edit': '编辑并重新生成',
    'action.unavailable.window': '这条消息所在的历史区间还没加载完整',
    'action.unavailable.running': '会话正在生成，先停止或等待完成',
    'editor.label': '编辑消息',
    'editor.note': '编辑后将从此处重新开始对话，产物也将回退至此信息前版本',
    'editor.busy': '正在重新生成…',
    'editor.cancel': '取消',
    'editor.send': '发送',
    'editor.sending': '发送中…',
    'editor.grip': '拖动调整大小，双击恢复默认',
    'editor.gripLabel': '调整编辑框大小，方向键微调，双击恢复默认',
    'error.empty': '消息内容不能为空。',
    'error.fork': '这条消息所在的历史区间还没加载完整，请向上滚动后再试。',
    'error.notFound': '原会话已经不可读，无法重新生成。',
    'error.migration': '原会话需要先打开一次完成升级，然后再试。',
    'error.prompt': '已从这条消息重建会话，但消息没能送达：{detail} 可以在那里手动重发。',
    'error.generic': '操作失败：{detail}',
};
/** English dictionary, checked complete against the zh key set. */
export const en = {
    'action.edit': 'Edit and regenerate',
    'action.unavailable.window': 'This message is outside the loaded history window',
    'action.unavailable.running': 'The session is generating; stop it or wait for it to finish',
    'editor.label': 'Edit message',
    'editor.note': 'Editing restarts the conversation here; later output is rolled back to just before this message',
    'editor.busy': 'Regenerating…',
    'editor.cancel': 'Cancel',
    'editor.send': 'Send',
    'editor.sending': 'Sending…',
    'editor.grip': 'Drag to resize, double-click to reset',
    'editor.gripLabel': 'Resize the editor; arrow keys nudge, double-click resets',
    'error.empty': 'A message cannot be empty.',
    'error.fork': 'The history around this message is not fully loaded; scroll up and try again.',
    'error.notFound': 'The source conversation is no longer readable, so it cannot be regenerated.',
    'error.migration': 'The source conversation must be opened once to finish upgrading, then try again.',
    'error.prompt': 'The conversation was rebuilt from this message, but the message did not arrive: {detail} You can resend it there.',
    'error.generic': 'That did not work: {detail}',
};
//# sourceMappingURL=locales.js.map