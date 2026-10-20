//#region lib/types/index.js
/**
* Edit-message plugin, node half. The feature is client orchestration over the
* existing Session Remotes (`sessions.fork`, `remote.session.prompt`,
* `uiWorkspace.openSession/archiveSession`), so the Host contributes no
* behavior: this module exists to occupy one Loader row, which is what makes
* the package's browser half discoverable through `dsh.client`.
*/
/** Host plugin body — no host-side behavior for this surface plugin. */
function apply() {}
//#endregion
export { apply };
