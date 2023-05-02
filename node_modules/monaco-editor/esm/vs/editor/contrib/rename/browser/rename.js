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
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { raceCancellation } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { EditorStateCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { EditorAction, EditorCommand, registerEditorAction, registerEditorCommand, registerEditorContribution, registerModelAndPositionCommand } from '../../../browser/editorExtensions.js';
import { IBulkEditService } from '../../../browser/services/bulkEditService.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ITextResourceConfigurationService } from '../../../common/services/textResourceConfiguration.js';
import { MessageController } from '../../message/browser/messageController.js';
import * as nls from '../../../../nls.js';
import { Extensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IEditorProgressService } from '../../../../platform/progress/common/progress.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { CONTEXT_RENAME_INPUT_VISIBLE, RenameInputField } from './renameInputField.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
class RenameSkeleton {
    constructor(model, position, registry) {
        this.model = model;
        this.position = position;
        this._providerRenameIdx = 0;
        this._providers = registry.ordered(model);
    }
    hasProvider() {
        return this._providers.length > 0;
    }
    resolveRenameLocation(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const rejects = [];
            for (this._providerRenameIdx = 0; this._providerRenameIdx < this._providers.length; this._providerRenameIdx++) {
                const provider = this._providers[this._providerRenameIdx];
                if (!provider.resolveRenameLocation) {
                    break;
                }
                const res = yield provider.resolveRenameLocation(this.model, this.position, token);
                if (!res) {
                    continue;
                }
                if (res.rejectReason) {
                    rejects.push(res.rejectReason);
                    continue;
                }
                return res;
            }
            const word = this.model.getWordAtPosition(this.position);
            if (!word) {
                return {
                    range: Range.fromPositions(this.position),
                    text: '',
                    rejectReason: rejects.length > 0 ? rejects.join('\n') : undefined
                };
            }
            return {
                range: new Range(this.position.lineNumber, word.startColumn, this.position.lineNumber, word.endColumn),
                text: word.word,
                rejectReason: rejects.length > 0 ? rejects.join('\n') : undefined
            };
        });
    }
    provideRenameEdits(newName, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._provideRenameEdits(newName, this._providerRenameIdx, [], token);
        });
    }
    _provideRenameEdits(newName, i, rejects, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = this._providers[i];
            if (!provider) {
                return {
                    edits: [],
                    rejectReason: rejects.join('\n')
                };
            }
            const result = yield provider.provideRenameEdits(this.model, this.position, newName, token);
            if (!result) {
                return this._provideRenameEdits(newName, i + 1, rejects.concat(nls.localize('no result', "No result.")), token);
            }
            else if (result.rejectReason) {
                return this._provideRenameEdits(newName, i + 1, rejects.concat(result.rejectReason), token);
            }
            return result;
        });
    }
}
export function rename(registry, model, position, newName) {
    return __awaiter(this, void 0, void 0, function* () {
        const skeleton = new RenameSkeleton(model, position, registry);
        const loc = yield skeleton.resolveRenameLocation(CancellationToken.None);
        if (loc === null || loc === void 0 ? void 0 : loc.rejectReason) {
            return { edits: [], rejectReason: loc.rejectReason };
        }
        return skeleton.provideRenameEdits(newName, CancellationToken.None);
    });
}
// ---  register actions and commands
let RenameController = class RenameController {
    static get(editor) {
        return editor.getContribution(RenameController.ID);
    }
    constructor(editor, _instaService, _notificationService, _bulkEditService, _progressService, _logService, _configService, _languageFeaturesService) {
        this.editor = editor;
        this._instaService = _instaService;
        this._notificationService = _notificationService;
        this._bulkEditService = _bulkEditService;
        this._progressService = _progressService;
        this._logService = _logService;
        this._configService = _configService;
        this._languageFeaturesService = _languageFeaturesService;
        this._disposableStore = new DisposableStore();
        this._cts = new CancellationTokenSource();
        this._renameInputField = this._disposableStore.add(this._instaService.createInstance(RenameInputField, this.editor, ['acceptRenameInput', 'acceptRenameInputWithPreview']));
    }
    dispose() {
        this._disposableStore.dispose();
        this._cts.dispose(true);
    }
    run() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // set up cancellation token to prevent reentrant rename, this
            // is the parent to the resolve- and rename-tokens
            this._cts.dispose(true);
            this._cts = new CancellationTokenSource();
            if (!this.editor.hasModel()) {
                return undefined;
            }
            const position = this.editor.getPosition();
            const skeleton = new RenameSkeleton(this.editor.getModel(), position, this._languageFeaturesService.renameProvider);
            if (!skeleton.hasProvider()) {
                return undefined;
            }
            // part 1 - resolve rename location
            const cts1 = new EditorStateCancellationTokenSource(this.editor, 4 /* CodeEditorStateFlag.Position */ | 1 /* CodeEditorStateFlag.Value */, undefined, this._cts.token);
            let loc;
            try {
                const resolveLocationOperation = skeleton.resolveRenameLocation(cts1.token);
                this._progressService.showWhile(resolveLocationOperation, 250);
                loc = yield resolveLocationOperation;
            }
            catch (e) {
                (_a = MessageController.get(this.editor)) === null || _a === void 0 ? void 0 : _a.showMessage(e || nls.localize('resolveRenameLocationFailed', "An unknown error occurred while resolving rename location"), position);
                return undefined;
            }
            finally {
                cts1.dispose();
            }
            if (!loc) {
                return undefined;
            }
            if (loc.rejectReason) {
                (_b = MessageController.get(this.editor)) === null || _b === void 0 ? void 0 : _b.showMessage(loc.rejectReason, position);
                return undefined;
            }
            if (cts1.token.isCancellationRequested) {
                return undefined;
            }
            // part 2 - do rename at location
            const cts2 = new EditorStateCancellationTokenSource(this.editor, 4 /* CodeEditorStateFlag.Position */ | 1 /* CodeEditorStateFlag.Value */, loc.range, this._cts.token);
            const selection = this.editor.getSelection();
            let selectionStart = 0;
            let selectionEnd = loc.text.length;
            if (!Range.isEmpty(selection) && !Range.spansMultipleLines(selection) && Range.containsRange(loc.range, selection)) {
                selectionStart = Math.max(0, selection.startColumn - loc.range.startColumn);
                selectionEnd = Math.min(loc.range.endColumn, selection.endColumn) - loc.range.startColumn;
            }
            const supportPreview = this._bulkEditService.hasPreviewHandler() && this._configService.getValue(this.editor.getModel().uri, 'editor.rename.enablePreview');
            const inputFieldResult = yield this._renameInputField.getInput(loc.range, loc.text, selectionStart, selectionEnd, supportPreview, cts2.token);
            // no result, only hint to focus the editor or not
            if (typeof inputFieldResult === 'boolean') {
                if (inputFieldResult) {
                    this.editor.focus();
                }
                cts2.dispose();
                return undefined;
            }
            this.editor.focus();
            const renameOperation = raceCancellation(skeleton.provideRenameEdits(inputFieldResult.newName, cts2.token), cts2.token).then((renameResult) => __awaiter(this, void 0, void 0, function* () {
                if (!renameResult || !this.editor.hasModel()) {
                    return;
                }
                if (renameResult.rejectReason) {
                    this._notificationService.info(renameResult.rejectReason);
                    return;
                }
                // collapse selection to active end
                this.editor.setSelection(Range.fromPositions(this.editor.getSelection().getPosition()));
                this._bulkEditService.apply(renameResult, {
                    editor: this.editor,
                    showPreview: inputFieldResult.wantsPreview,
                    label: nls.localize('label', "Renaming '{0}' to '{1}'", loc === null || loc === void 0 ? void 0 : loc.text, inputFieldResult.newName),
                    code: 'undoredo.rename',
                    quotableLabel: nls.localize('quotableLabel', "Renaming {0} to {1}", loc === null || loc === void 0 ? void 0 : loc.text, inputFieldResult.newName),
                    respectAutoSaveConfig: true
                }).then(result => {
                    if (result.ariaSummary) {
                        alert(nls.localize('aria', "Successfully renamed '{0}' to '{1}'. Summary: {2}", loc.text, inputFieldResult.newName, result.ariaSummary));
                    }
                }).catch(err => {
                    this._notificationService.error(nls.localize('rename.failedApply', "Rename failed to apply edits"));
                    this._logService.error(err);
                });
            }), err => {
                this._notificationService.error(nls.localize('rename.failed', "Rename failed to compute edits"));
                this._logService.error(err);
            }).finally(() => {
                cts2.dispose();
            });
            this._progressService.showWhile(renameOperation, 250);
            return renameOperation;
        });
    }
    acceptRenameInput(wantsPreview) {
        this._renameInputField.acceptInput(wantsPreview);
    }
    cancelRenameInput() {
        this._renameInputField.cancelInput(true);
    }
};
RenameController.ID = 'editor.contrib.renameController';
RenameController = __decorate([
    __param(1, IInstantiationService),
    __param(2, INotificationService),
    __param(3, IBulkEditService),
    __param(4, IEditorProgressService),
    __param(5, ILogService),
    __param(6, ITextResourceConfigurationService),
    __param(7, ILanguageFeaturesService)
], RenameController);
// ---- action implementation
export class RenameAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.rename',
            label: nls.localize('rename.label', "Rename Symbol"),
            alias: 'Rename Symbol',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasRenameProvider),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 60 /* KeyCode.F2 */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            },
            contextMenuOpts: {
                group: '1_modification',
                order: 1.1
            }
        });
    }
    runCommand(accessor, args) {
        const editorService = accessor.get(ICodeEditorService);
        const [uri, pos] = Array.isArray(args) && args || [undefined, undefined];
        if (URI.isUri(uri) && Position.isIPosition(pos)) {
            return editorService.openCodeEditor({ resource: uri }, editorService.getActiveCodeEditor()).then(editor => {
                if (!editor) {
                    return;
                }
                editor.setPosition(pos);
                editor.invokeWithinContext(accessor => {
                    this.reportTelemetry(accessor, editor);
                    return this.run(accessor, editor);
                });
            }, onUnexpectedError);
        }
        return super.runCommand(accessor, args);
    }
    run(accessor, editor) {
        const controller = RenameController.get(editor);
        if (controller) {
            return controller.run();
        }
        return Promise.resolve();
    }
}
registerEditorContribution(RenameController.ID, RenameController, 4 /* EditorContributionInstantiation.Lazy */);
registerEditorAction(RenameAction);
const RenameCommand = EditorCommand.bindToContribution(RenameController.get);
registerEditorCommand(new RenameCommand({
    id: 'acceptRenameInput',
    precondition: CONTEXT_RENAME_INPUT_VISIBLE,
    handler: x => x.acceptRenameInput(false),
    kbOpts: {
        weight: 100 /* KeybindingWeight.EditorContrib */ + 99,
        kbExpr: ContextKeyExpr.and(EditorContextKeys.focus, ContextKeyExpr.not('isComposing')),
        primary: 3 /* KeyCode.Enter */
    }
}));
registerEditorCommand(new RenameCommand({
    id: 'acceptRenameInputWithPreview',
    precondition: ContextKeyExpr.and(CONTEXT_RENAME_INPUT_VISIBLE, ContextKeyExpr.has('config.editor.rename.enablePreview')),
    handler: x => x.acceptRenameInput(true),
    kbOpts: {
        weight: 100 /* KeybindingWeight.EditorContrib */ + 99,
        kbExpr: ContextKeyExpr.and(EditorContextKeys.focus, ContextKeyExpr.not('isComposing')),
        primary: 1024 /* KeyMod.Shift */ + 3 /* KeyCode.Enter */
    }
}));
registerEditorCommand(new RenameCommand({
    id: 'cancelRenameInput',
    precondition: CONTEXT_RENAME_INPUT_VISIBLE,
    handler: x => x.cancelRenameInput(),
    kbOpts: {
        weight: 100 /* KeybindingWeight.EditorContrib */ + 99,
        kbExpr: EditorContextKeys.focus,
        primary: 9 /* KeyCode.Escape */,
        secondary: [1024 /* KeyMod.Shift */ | 9 /* KeyCode.Escape */]
    }
}));
// ---- api bridge command
registerModelAndPositionCommand('_executeDocumentRenameProvider', function (accessor, model, position, ...args) {
    const [newName] = args;
    assertType(typeof newName === 'string');
    const { renameProvider } = accessor.get(ILanguageFeaturesService);
    return rename(renameProvider, model, position, newName);
});
registerModelAndPositionCommand('_executePrepareRename', function (accessor, model, position) {
    return __awaiter(this, void 0, void 0, function* () {
        const { renameProvider } = accessor.get(ILanguageFeaturesService);
        const skeleton = new RenameSkeleton(model, position, renameProvider);
        const loc = yield skeleton.resolveRenameLocation(CancellationToken.None);
        if (loc === null || loc === void 0 ? void 0 : loc.rejectReason) {
            throw new Error(loc.rejectReason);
        }
        return loc;
    });
});
//todo@jrieken use editor options world
Registry.as(Extensions.Configuration).registerConfiguration({
    id: 'editor',
    properties: {
        'editor.rename.enablePreview': {
            scope: 5 /* ConfigurationScope.LANGUAGE_OVERRIDABLE */,
            description: nls.localize('enablePreview', "Enable/disable the ability to preview changes before renaming"),
            default: true,
            type: 'boolean'
        }
    }
});
