/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { coalesce } from '../../../../base/common/arrays.js';
import { UriList } from '../../../../base/common/dataTransfer.js';
import { Mimes } from '../../../../base/common/mime.js';
import { Schemas } from '../../../../base/common/network.js';
import { relativePath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
class DefaultTextDropProvider {
    constructor() {
        this.dropMimeTypes = [Mimes.text, 'text'];
    }
    provideDocumentOnDropEdits(_model, _position, dataTransfer, _token) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const textEntry = (_a = dataTransfer.get('text')) !== null && _a !== void 0 ? _a : dataTransfer.get(Mimes.text);
            if (!textEntry) {
                return;
            }
            // Suppress if there's also a uriList entry.
            // Typically the uri-list contains the same text as the text entry so showing both is confusing.
            if (dataTransfer.has(Mimes.uriList)) {
                return;
            }
            const text = yield textEntry.asString();
            return {
                label: localize('defaultDropProvider.text.label', "Insert Plain Text"),
                insertText: text
            };
        });
    }
}
class UriListDropProvider {
    constructor() {
        this.dropMimeTypes = [Mimes.uriList];
    }
    provideDocumentOnDropEdits(_model, _position, dataTransfer, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const entries = yield extractUriList(dataTransfer);
            if (!entries.length || token.isCancellationRequested) {
                return;
            }
            let uriCount = 0;
            const insertText = entries
                .map(({ uri, originalText }) => {
                if (uri.scheme === Schemas.file) {
                    return uri.fsPath;
                }
                else {
                    uriCount++;
                    return originalText;
                }
            })
                .join(' ');
            let label;
            if (uriCount > 0) {
                // Dropping at least one generic uri (such as https) so use most generic label
                label = entries.length > 1
                    ? localize('defaultDropProvider.uriList.uris', "Insert Uris")
                    : localize('defaultDropProvider.uriList.uri', "Insert Uri");
            }
            else {
                // All the paths are file paths
                label = entries.length > 1
                    ? localize('defaultDropProvider.uriList.paths', "Insert Paths")
                    : localize('defaultDropProvider.uriList.path', "Insert Path");
            }
            return { insertText, label };
        });
    }
}
let RelativePathDropProvider = class RelativePathDropProvider {
    constructor(_workspaceContextService) {
        this._workspaceContextService = _workspaceContextService;
        this.dropMimeTypes = [Mimes.uriList];
    }
    provideDocumentOnDropEdits(_model, _position, dataTransfer, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const entries = yield extractUriList(dataTransfer);
            if (!entries.length || token.isCancellationRequested) {
                return;
            }
            const relativeUris = coalesce(entries.map(({ uri }) => {
                const root = this._workspaceContextService.getWorkspaceFolder(uri);
                return root ? relativePath(root.uri, uri) : undefined;
            }));
            if (!relativeUris.length) {
                return;
            }
            return {
                insertText: relativeUris.join(' '),
                label: entries.length > 1
                    ? localize('defaultDropProvider.uriList.relativePaths', "Insert Relative Paths")
                    : localize('defaultDropProvider.uriList.relativePath', "Insert Relative Path")
            };
        });
    }
};
RelativePathDropProvider = __decorate([
    __param(0, IWorkspaceContextService)
], RelativePathDropProvider);
function extractUriList(dataTransfer) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlListEntry = dataTransfer.get(Mimes.uriList);
        if (!urlListEntry) {
            return [];
        }
        const strUriList = yield urlListEntry.asString();
        const entries = [];
        for (const entry of UriList.parse(strUriList)) {
            try {
                entries.push({ uri: URI.parse(entry), originalText: entry });
            }
            catch (_a) {
                // noop
            }
        }
        return entries;
    });
}
let registeredDefaultProviders = false;
export function registerDefaultDropProviders(languageFeaturesService, workspaceContextService) {
    if (!registeredDefaultProviders) {
        registeredDefaultProviders = true;
        languageFeaturesService.documentOnDropEditProvider.register('*', new DefaultTextDropProvider());
        languageFeaturesService.documentOnDropEditProvider.register('*', new UriListDropProvider());
        languageFeaturesService.documentOnDropEditProvider.register('*', new RelativePathDropProvider(workspaceContextService));
    }
}
