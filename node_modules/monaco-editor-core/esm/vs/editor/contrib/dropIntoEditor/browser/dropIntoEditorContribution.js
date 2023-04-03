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
import { raceCancellation } from '../../../../base/common/async.js';
import { UriList, VSDataTransfer } from '../../../../base/common/dataTransfer.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../base/common/mime.js';
import { relativePath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { addExternalEditorsDropData, toVSDataTransfer } from '../../../browser/dnd.js';
import { registerEditorContribution } from '../../../browser/editorExtensions.js';
import { IBulkEditService, ResourceTextEdit } from '../../../browser/services/bulkEditService.js';
import { Range } from '../../../common/core/range.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { EditorStateCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { SnippetParser } from '../../snippet/browser/snippetParser.js';
import { localize } from '../../../../nls.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
let DropIntoEditorController = class DropIntoEditorController extends Disposable {
    constructor(editor, _bulkEditService, _languageFeaturesService, _progressService, workspaceContextService) {
        super();
        this._bulkEditService = _bulkEditService;
        this._languageFeaturesService = _languageFeaturesService;
        this._progressService = _progressService;
        this._register(editor.onDropIntoEditor(e => this.onDropIntoEditor(editor, e.position, e.event)));
        this._languageFeaturesService.documentOnDropEditProvider.register('*', new DefaultOnDropProvider(workspaceContextService));
    }
    onDropIntoEditor(editor, position, dragEvent) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!dragEvent.dataTransfer || !editor.hasModel()) {
                return;
            }
            const model = editor.getModel();
            const initialModelVersion = model.getVersionId();
            const ourDataTransfer = yield this.extractDataTransferData(dragEvent);
            if (ourDataTransfer.size === 0) {
                return;
            }
            if (editor.getModel().getVersionId() !== initialModelVersion) {
                return;
            }
            const tokenSource = new EditorStateCancellationTokenSource(editor, 1 /* CodeEditorStateFlag.Value */);
            try {
                const providers = this._languageFeaturesService.documentOnDropEditProvider.ordered(model);
                const providerEdit = yield this._progressService.withProgress({
                    location: 15 /* ProgressLocation.Notification */,
                    delay: 750,
                    title: localize('dropProgressTitle', "Running drop handlers..."),
                    cancellable: true,
                }, () => {
                    return raceCancellation((() => __awaiter(this, void 0, void 0, function* () {
                        for (const provider of providers) {
                            const edit = yield provider.provideDocumentOnDropEdits(model, position, ourDataTransfer, tokenSource.token);
                            if (tokenSource.token.isCancellationRequested) {
                                return undefined;
                            }
                            if (edit) {
                                return edit;
                            }
                        }
                        return undefined;
                    }))(), tokenSource.token);
                }, () => {
                    tokenSource.cancel();
                });
                if (tokenSource.token.isCancellationRequested || editor.getModel().getVersionId() !== initialModelVersion) {
                    return;
                }
                if (providerEdit) {
                    const snippet = typeof providerEdit.insertText === 'string' ? SnippetParser.escape(providerEdit.insertText) : providerEdit.insertText.snippet;
                    const combinedWorkspaceEdit = {
                        edits: [
                            new ResourceTextEdit(model.uri, {
                                range: new Range(position.lineNumber, position.column, position.lineNumber, position.column),
                                text: snippet,
                                insertAsSnippet: true,
                            }),
                            ...((_b = (_a = providerEdit.additionalEdit) === null || _a === void 0 ? void 0 : _a.edits) !== null && _b !== void 0 ? _b : [])
                        ]
                    };
                    editor.focus();
                    yield this._bulkEditService.apply(combinedWorkspaceEdit, { editor });
                    return;
                }
            }
            finally {
                tokenSource.dispose();
            }
        });
    }
    extractDataTransferData(dragEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dragEvent.dataTransfer) {
                return new VSDataTransfer();
            }
            const textEditorDataTransfer = toVSDataTransfer(dragEvent.dataTransfer);
            addExternalEditorsDropData(textEditorDataTransfer, dragEvent);
            return textEditorDataTransfer;
        });
    }
};
DropIntoEditorController.ID = 'editor.contrib.dropIntoEditorController';
DropIntoEditorController = __decorate([
    __param(1, IBulkEditService),
    __param(2, ILanguageFeaturesService),
    __param(3, IProgressService),
    __param(4, IWorkspaceContextService)
], DropIntoEditorController);
export { DropIntoEditorController };
let DefaultOnDropProvider = class DefaultOnDropProvider {
    constructor(_workspaceContextService) {
        this._workspaceContextService = _workspaceContextService;
    }
    provideDocumentOnDropEdits(_model, _position, dataTransfer, _token) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const urlListEntry = dataTransfer.get(Mimes.uriList);
            if (urlListEntry) {
                const urlList = yield urlListEntry.asString();
                const snippet = this.getUriListInsertText(urlList);
                if (snippet) {
                    return { insertText: snippet };
                }
            }
            const textEntry = (_a = dataTransfer.get('text')) !== null && _a !== void 0 ? _a : dataTransfer.get(Mimes.text);
            if (textEntry) {
                const text = yield textEntry.asString();
                return { insertText: text };
            }
            return undefined;
        });
    }
    getUriListInsertText(strUriList) {
        const uris = [];
        for (const resource of UriList.parse(strUriList)) {
            try {
                uris.push(URI.parse(resource));
            }
            catch (_a) {
                // noop
            }
        }
        if (!uris.length) {
            return;
        }
        return uris
            .map(uri => {
            const root = this._workspaceContextService.getWorkspaceFolder(uri);
            if (root) {
                const rel = relativePath(root.uri, uri);
                if (rel) {
                    return rel;
                }
            }
            return uri.fsPath;
        })
            .join(' ');
    }
};
DefaultOnDropProvider = __decorate([
    __param(0, IWorkspaceContextService)
], DefaultOnDropProvider);
registerEditorContribution(DropIntoEditorController.ID, DropIntoEditorController, 2 /* EditorContributionInstantiation.BeforeFirstInteraction */);
