/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { localize } from '../../../nls.js';
import { basename } from '../../../base/common/path.js';
import { TernarySearchTree } from '../../../base/common/ternarySearchTree.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
export const IWorkspaceContextService = createDecorator('contextService');
export function isSingleFolderWorkspaceIdentifier(obj) {
    const singleFolderIdentifier = obj;
    return typeof (singleFolderIdentifier === null || singleFolderIdentifier === void 0 ? void 0 : singleFolderIdentifier.id) === 'string' && URI.isUri(singleFolderIdentifier.uri);
}
export function isEmptyWorkspaceIdentifier(obj) {
    const emptyWorkspaceIdentifier = obj;
    return typeof (emptyWorkspaceIdentifier === null || emptyWorkspaceIdentifier === void 0 ? void 0 : emptyWorkspaceIdentifier.id) === 'string'
        && !isSingleFolderWorkspaceIdentifier(obj)
        && !isWorkspaceIdentifier(obj);
}
export const EXTENSION_DEVELOPMENT_EMPTY_WINDOW_WORKSPACE = { id: 'ext-dev' };
export const UNKNOWN_EMPTY_WINDOW_WORKSPACE = { id: 'empty-window' };
export function toWorkspaceIdentifier(arg0, isExtensionDevelopment) {
    // Empty workspace
    if (typeof arg0 === 'string' || typeof arg0 === 'undefined') {
        // With a backupPath, the basename is the empty workspace identifier
        if (typeof arg0 === 'string') {
            return {
                id: basename(arg0)
            };
        }
        // Extension development empty windows have backups disabled
        // so we return a constant workspace identifier for extension
        // authors to allow to restore their workspace state even then.
        if (isExtensionDevelopment) {
            return EXTENSION_DEVELOPMENT_EMPTY_WINDOW_WORKSPACE;
        }
        return UNKNOWN_EMPTY_WINDOW_WORKSPACE;
    }
    // Multi root
    const workspace = arg0;
    if (workspace.configuration) {
        return {
            id: workspace.id,
            configPath: workspace.configuration
        };
    }
    // Single folder
    if (workspace.folders.length === 1) {
        return {
            id: workspace.id,
            uri: workspace.folders[0].uri
        };
    }
    // Empty window
    return {
        id: workspace.id
    };
}
export function isWorkspaceIdentifier(obj) {
    const workspaceIdentifier = obj;
    return typeof (workspaceIdentifier === null || workspaceIdentifier === void 0 ? void 0 : workspaceIdentifier.id) === 'string' && URI.isUri(workspaceIdentifier.configPath);
}
export class Workspace {
    constructor(_id, folders, _transient, _configuration, _ignorePathCasing) {
        this._id = _id;
        this._transient = _transient;
        this._configuration = _configuration;
        this._ignorePathCasing = _ignorePathCasing;
        this._foldersMap = TernarySearchTree.forUris(this._ignorePathCasing, () => true);
        this.folders = folders;
    }
    get folders() {
        return this._folders;
    }
    set folders(folders) {
        this._folders = folders;
        this.updateFoldersMap();
    }
    get id() {
        return this._id;
    }
    get transient() {
        return this._transient;
    }
    get configuration() {
        return this._configuration;
    }
    set configuration(configuration) {
        this._configuration = configuration;
    }
    getFolder(resource) {
        if (!resource) {
            return null;
        }
        return this._foldersMap.findSubstr(resource) || null;
    }
    updateFoldersMap() {
        this._foldersMap = TernarySearchTree.forUris(this._ignorePathCasing, () => true);
        for (const folder of this.folders) {
            this._foldersMap.set(folder.uri, folder);
        }
    }
    toJSON() {
        return { id: this.id, folders: this.folders, transient: this.transient, configuration: this.configuration };
    }
}
export class WorkspaceFolder {
    constructor(data, 
    /**
     * Provides access to the original metadata for this workspace
     * folder. This can be different from the metadata provided in
     * this class:
     * - raw paths can be relative
     * - raw paths are not normalized
     */
    raw) {
        this.raw = raw;
        this.uri = data.uri;
        this.index = data.index;
        this.name = data.name;
    }
    toJSON() {
        return { uri: this.uri, name: this.name, index: this.index };
    }
}
export const WORKSPACE_EXTENSION = 'code-workspace';
export const WORKSPACE_FILTER = [{ name: localize('codeWorkspace', "Code Workspace"), extensions: [WORKSPACE_EXTENSION] }];
