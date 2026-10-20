/**
 * `editMessage` namespace dictionaries. The plugin ships no copy of its own
 * outside this module: the pencil tooltip, the editor's info line, its two
 * actions, and every failure sentence resolve through `ctx.locale`.
 * @module @dookoi/dsh-client-ui-edit-message/client/locales
 */
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    'action.edit': string;
    'action.unavailable.window': string;
    'action.unavailable.running': string;
    'editor.label': string;
    'editor.note': string;
    'editor.busy': string;
    'editor.cancel': string;
    'editor.send': string;
    'editor.sending': string;
    'editor.grip': string;
    'editor.gripLabel': string;
    'error.empty': string;
    'error.fork': string;
    'error.notFound': string;
    'error.migration': string;
    'error.prompt': string;
    'error.generic': string;
};
/** The editMessage namespace key union. */
export type EditMessageKey = keyof typeof zh;
/** English dictionary, checked complete against the zh key set. */
export declare const en: {
    'action.edit': string;
    'action.unavailable.window': string;
    'action.unavailable.running': string;
    'editor.label': string;
    'editor.note': string;
    'editor.busy': string;
    'editor.cancel': string;
    'editor.send': string;
    'editor.sending': string;
    'editor.grip': string;
    'editor.gripLabel': string;
    'error.empty': string;
    'error.fork': string;
    'error.notFound': string;
    'error.migration': string;
    'error.prompt': string;
    'error.generic': string;
};
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** This plugin's dictionary. */
        editMessage: EditMessageKey;
    }
}
//# sourceMappingURL=locales.d.ts.map