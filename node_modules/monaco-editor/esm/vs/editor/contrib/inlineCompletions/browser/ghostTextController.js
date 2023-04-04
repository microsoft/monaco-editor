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
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { firstNonWhitespaceIndex } from '../../../../base/common/strings.js';
import { EditorAction } from '../../../browser/editorExtensions.js';
import { CursorColumns } from '../../../common/core/cursorColumns.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { inlineSuggestCommitId, showNextInlineSuggestionActionId, showPreviousInlineSuggestionActionId } from './consts.js';
import { GhostTextModel } from './ghostTextModel.js';
import { GhostTextWidget } from './ghostTextWidget.js';
import * as nls from '../../../../nls.js';
import { Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
let GhostTextController = class GhostTextController extends Disposable {
    static get(editor) {
        return editor.getContribution(GhostTextController.ID);
    }
    get activeModel() {
        var _a;
        return (_a = this.activeController.value) === null || _a === void 0 ? void 0 : _a.model;
    }
    constructor(editor, instantiationService, contextKeyService) {
        super();
        this.editor = editor;
        this.instantiationService = instantiationService;
        this.contextKeyService = contextKeyService;
        this.triggeredExplicitly = false;
        this.activeController = this._register(new MutableDisposable());
        this.activeModelDidChangeEmitter = this._register(new Emitter());
        /**
         * Tracks the first alternative version id until which only partial inline suggestions can be undone.
         * Any other content change will invalidate this.
         * This field is used to set the corresponding context key.
         */
        this.firstUndoableVersionId = undefined;
        this.alwaysShowInlineSuggestionToolbar = GhostTextController.alwaysShowInlineSuggestionToolbar.bindTo(this.contextKeyService);
        this._register(this.editor.onDidChangeModelContent((e) => {
            var _a;
            if (!e.isUndoing || this.firstUndoableVersionId && this.editor.getModel().getAlternativeVersionId() < this.firstUndoableVersionId) {
                (_a = this.activeController.value) === null || _a === void 0 ? void 0 : _a.contextKeys.canUndoInlineSuggestion.reset();
                this.firstUndoableVersionId = undefined; // Will be set again if this change was caused by an inline suggestion.
            }
        }));
        this._register(this.editor.onDidChangeCursorPosition((e) => {
            var _a;
            if (e.reason === 3 /* CursorChangeReason.Explicit */) {
                (_a = this.activeController.value) === null || _a === void 0 ? void 0 : _a.contextKeys.canUndoInlineSuggestion.reset();
                this.firstUndoableVersionId = undefined;
            }
        }));
        this._register(this.editor.onDidChangeModel(() => {
            this.update();
        }));
        this._register(this.editor.onDidChangeConfiguration((e) => {
            if (e.hasChanged(113 /* EditorOption.suggest */) || e.hasChanged(60 /* EditorOption.inlineSuggest */)) {
                this.update();
            }
        }));
        this.update();
    }
    // Don't call this method when not necessary. It will recreate the activeController.
    update() {
        const suggestOptions = this.editor.getOption(113 /* EditorOption.suggest */);
        const inlineSuggestOptions = this.editor.getOption(60 /* EditorOption.inlineSuggest */);
        this.alwaysShowInlineSuggestionToolbar.set(inlineSuggestOptions.showToolbar === 'always');
        const shouldCreate = this.editor.hasModel() && (suggestOptions.preview || inlineSuggestOptions.enabled || this.triggeredExplicitly);
        if (shouldCreate !== !!this.activeController.value) {
            this.activeController.value = undefined;
            // ActiveGhostTextController is only created if one of those settings is set or if the inline completions are triggered explicitly.
            this.activeController.value =
                shouldCreate ? this.instantiationService.createInstance(ActiveGhostTextController, this.editor)
                    : undefined;
            this.activeModelDidChangeEmitter.fire();
        }
    }
    shouldShowHoverAt(hoverRange) {
        var _a;
        return ((_a = this.activeModel) === null || _a === void 0 ? void 0 : _a.shouldShowHoverAt(hoverRange)) || false;
    }
    shouldShowHoverAtViewZone(viewZoneId) {
        var _a, _b;
        return ((_b = (_a = this.activeController.value) === null || _a === void 0 ? void 0 : _a.widget) === null || _b === void 0 ? void 0 : _b.shouldShowHoverAtViewZone(viewZoneId)) || false;
    }
    trigger() {
        var _a;
        this.triggeredExplicitly = true;
        if (!this.activeController.value) {
            this.update();
        }
        (_a = this.activeModel) === null || _a === void 0 ? void 0 : _a.triggerInlineCompletion();
    }
    commitPartially() {
        var _a, _b, _c;
        const nextVersion = this.firstUndoableVersionId; // Read this before committing, as it will be reset.
        (_a = this.activeModel) === null || _a === void 0 ? void 0 : _a.commitInlineCompletionPartially();
        (_c = (_b = this.activeController) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.contextKeys.canUndoInlineSuggestion.set(true);
        // Don't override this field if the previous command already accepted some inline suggestion.
        this.firstUndoableVersionId = nextVersion !== null && nextVersion !== void 0 ? nextVersion : this.editor.getModel().getAlternativeVersionId();
    }
    commit() {
        var _a;
        (_a = this.activeModel) === null || _a === void 0 ? void 0 : _a.commitInlineCompletion();
    }
    hide() {
        var _a;
        (_a = this.activeModel) === null || _a === void 0 ? void 0 : _a.hideInlineCompletion();
    }
    showNextInlineCompletion() {
        var _a;
        (_a = this.activeModel) === null || _a === void 0 ? void 0 : _a.showNextInlineCompletion();
    }
    showPreviousInlineCompletion() {
        var _a;
        (_a = this.activeModel) === null || _a === void 0 ? void 0 : _a.showPreviousInlineCompletion();
    }
};
GhostTextController.inlineSuggestionVisible = new RawContextKey('inlineSuggestionVisible', false, nls.localize('inlineSuggestionVisible', "Whether an inline suggestion is visible"));
GhostTextController.inlineSuggestionHasIndentation = new RawContextKey('inlineSuggestionHasIndentation', false, nls.localize('inlineSuggestionHasIndentation', "Whether the inline suggestion starts with whitespace"));
GhostTextController.inlineSuggestionHasIndentationLessThanTabSize = new RawContextKey('inlineSuggestionHasIndentationLessThanTabSize', true, nls.localize('inlineSuggestionHasIndentationLessThanTabSize', "Whether the inline suggestion starts with whitespace that is less than what would be inserted by tab"));
/**
 * Enables to use Ctrl+Left to undo partially accepted inline completions.
 */
GhostTextController.canUndoInlineSuggestion = new RawContextKey('canUndoInlineSuggestion', false, nls.localize('canUndoInlineSuggestion', "Whether undo would undo an inline suggestion"));
GhostTextController.alwaysShowInlineSuggestionToolbar = new RawContextKey('alwaysShowInlineSuggestionToolbar', false, nls.localize('alwaysShowInlineSuggestionToolbar', "Whether the inline suggestion toolbar should always be visible"));
GhostTextController.ID = 'editor.contrib.ghostTextController';
GhostTextController = __decorate([
    __param(1, IInstantiationService),
    __param(2, IContextKeyService)
], GhostTextController);
export { GhostTextController };
class GhostTextContextKeys {
    constructor(contextKeyService) {
        this.contextKeyService = contextKeyService;
        this.inlineCompletionVisible = GhostTextController.inlineSuggestionVisible.bindTo(this.contextKeyService);
        this.inlineCompletionSuggestsIndentation = GhostTextController.inlineSuggestionHasIndentation.bindTo(this.contextKeyService);
        this.inlineCompletionSuggestsIndentationLessThanTabSize = GhostTextController.inlineSuggestionHasIndentationLessThanTabSize.bindTo(this.contextKeyService);
        this.canUndoInlineSuggestion = GhostTextController.canUndoInlineSuggestion.bindTo(this.contextKeyService);
    }
}
/**
 * The controller for a text editor with an initialized text model.
 * Must be disposed as soon as the model detaches from the editor.
*/
let ActiveGhostTextController = class ActiveGhostTextController extends Disposable {
    constructor(editor, instantiationService, contextKeyService) {
        super();
        this.editor = editor;
        this.instantiationService = instantiationService;
        this.contextKeyService = contextKeyService;
        this.contextKeys = new GhostTextContextKeys(this.contextKeyService);
        this.model = this._register(this.instantiationService.createInstance(GhostTextModel, this.editor));
        this.widget = this._register(this.instantiationService.createInstance(GhostTextWidget, this.editor, this.model));
        this._register(toDisposable(() => {
            this.contextKeys.inlineCompletionVisible.set(false);
            this.contextKeys.inlineCompletionSuggestsIndentation.set(false);
            this.contextKeys.inlineCompletionSuggestsIndentationLessThanTabSize.set(true);
        }));
        this._register(this.model.onDidChange(() => {
            this.updateContextKeys();
        }));
        this.updateContextKeys();
    }
    updateContextKeys() {
        var _a;
        this.contextKeys.inlineCompletionVisible.set(((_a = this.model.activeInlineCompletionsModel) === null || _a === void 0 ? void 0 : _a.ghostText) !== undefined);
        let startsWithIndentation = false;
        let startsWithIndentationLessThanTabSize = true;
        const ghostText = this.model.inlineCompletionsModel.ghostText;
        if (!!this.model.activeInlineCompletionsModel && ghostText && ghostText.parts.length > 0) {
            const { column, lines } = ghostText.parts[0];
            const firstLine = lines[0];
            const indentationEndColumn = this.editor.getModel().getLineIndentColumn(ghostText.lineNumber);
            const inIndentation = column <= indentationEndColumn;
            if (inIndentation) {
                let firstNonWsIdx = firstNonWhitespaceIndex(firstLine);
                if (firstNonWsIdx === -1) {
                    firstNonWsIdx = firstLine.length - 1;
                }
                startsWithIndentation = firstNonWsIdx > 0;
                const tabSize = this.editor.getModel().getOptions().tabSize;
                const visibleColumnIndentation = CursorColumns.visibleColumnFromColumn(firstLine, firstNonWsIdx + 1, tabSize);
                startsWithIndentationLessThanTabSize = visibleColumnIndentation < tabSize;
            }
        }
        this.contextKeys.inlineCompletionSuggestsIndentation.set(startsWithIndentation);
        this.contextKeys.inlineCompletionSuggestsIndentationLessThanTabSize.set(startsWithIndentationLessThanTabSize);
    }
};
ActiveGhostTextController = __decorate([
    __param(1, IInstantiationService),
    __param(2, IContextKeyService)
], ActiveGhostTextController);
export { ActiveGhostTextController };
class ShowNextInlineSuggestionAction extends EditorAction {
    constructor() {
        super({
            id: ShowNextInlineSuggestionAction.ID,
            label: nls.localize('action.inlineSuggest.showNext', "Show Next Inline Suggestion"),
            alias: 'Show Next Inline Suggestion',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, GhostTextController.inlineSuggestionVisible),
            kbOpts: {
                weight: 100,
                primary: 512 /* KeyMod.Alt */ | 89 /* KeyCode.BracketRight */,
            },
        });
    }
    run(accessor, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = GhostTextController.get(editor);
            if (controller) {
                controller.showNextInlineCompletion();
            }
        });
    }
}
ShowNextInlineSuggestionAction.ID = showNextInlineSuggestionActionId;
export { ShowNextInlineSuggestionAction };
class ShowPreviousInlineSuggestionAction extends EditorAction {
    constructor() {
        super({
            id: ShowPreviousInlineSuggestionAction.ID,
            label: nls.localize('action.inlineSuggest.showPrevious', "Show Previous Inline Suggestion"),
            alias: 'Show Previous Inline Suggestion',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, GhostTextController.inlineSuggestionVisible),
            kbOpts: {
                weight: 100,
                primary: 512 /* KeyMod.Alt */ | 87 /* KeyCode.BracketLeft */,
            },
        });
    }
    run(accessor, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = GhostTextController.get(editor);
            if (controller) {
                controller.showPreviousInlineCompletion();
            }
        });
    }
}
ShowPreviousInlineSuggestionAction.ID = showPreviousInlineSuggestionActionId;
export { ShowPreviousInlineSuggestionAction };
export class TriggerInlineSuggestionAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.inlineSuggest.trigger',
            label: nls.localize('action.inlineSuggest.trigger', "Trigger Inline Suggestion"),
            alias: 'Trigger Inline Suggestion',
            precondition: EditorContextKeys.writable
        });
    }
    run(accessor, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = GhostTextController.get(editor);
            controller === null || controller === void 0 ? void 0 : controller.trigger();
        });
    }
}
export class AcceptNextWordOfInlineCompletion extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.inlineSuggest.acceptNextWord',
            label: nls.localize('action.inlineSuggest.acceptNextWord', "Accept Next Word Of Inline Suggestion"),
            alias: 'Accept Next Word Of Inline Suggestion',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, GhostTextController.inlineSuggestionVisible),
            kbOpts: {
                weight: 100 /* KeybindingWeight.EditorContrib */ + 1,
                primary: 2048 /* KeyMod.CtrlCmd */ | 17 /* KeyCode.RightArrow */,
            },
            menuOpts: [{
                    menuId: MenuId.InlineSuggestionToolbar,
                    title: nls.localize('acceptWord', 'Accept Word'),
                    group: 'primary',
                    order: 2,
                }],
        });
    }
    run(accessor, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = GhostTextController.get(editor);
            if (controller) {
                controller.commitPartially();
            }
        });
    }
}
export class AcceptInlineCompletion extends EditorAction {
    constructor() {
        super({
            id: inlineSuggestCommitId,
            label: nls.localize('action.inlineSuggest.accept', "Accept Inline Suggestion"),
            alias: 'Accept Inline Suggestion',
            precondition: GhostTextController.inlineSuggestionVisible,
            menuOpts: [{
                    menuId: MenuId.InlineSuggestionToolbar,
                    title: nls.localize('accept', "Accept"),
                    group: 'primary',
                    order: 1,
                }],
            kbOpts: {
                primary: 2 /* KeyCode.Tab */,
                weight: 200,
                kbExpr: ContextKeyExpr.and(GhostTextController.inlineSuggestionVisible, EditorContextKeys.tabMovesFocus.toNegated(), GhostTextController.inlineSuggestionHasIndentationLessThanTabSize),
            }
        });
    }
    run(accessor, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = GhostTextController.get(editor);
            if (controller) {
                controller.commit();
                controller.editor.focus();
            }
        });
    }
}
class HideInlineCompletion extends EditorAction {
    constructor() {
        super({
            id: HideInlineCompletion.ID,
            label: nls.localize('action.inlineSuggest.hide', "Hide Inline Suggestion"),
            alias: 'Hide Inline Suggestion',
            precondition: GhostTextController.inlineSuggestionVisible,
            kbOpts: {
                weight: 100,
                primary: 9 /* KeyCode.Escape */,
            }
        });
    }
    run(accessor, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = GhostTextController.get(editor);
            if (controller) {
                controller.hide();
            }
        });
    }
}
HideInlineCompletion.ID = 'editor.action.inlineSuggest.hide';
export { HideInlineCompletion };
class ToggleAlwaysShowInlineSuggestionToolbar extends Action2 {
    constructor() {
        super({
            id: ToggleAlwaysShowInlineSuggestionToolbar.ID,
            title: nls.localize('action.inlineSuggest.alwaysShowToolbar', "Always Show Toolbar"),
            f1: false,
            precondition: undefined,
            menu: [{
                    id: MenuId.InlineSuggestionToolbar,
                    group: 'secondary',
                    order: 10,
                }],
            toggled: GhostTextController.alwaysShowInlineSuggestionToolbar,
        });
    }
    run(accessor, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            const configService = accessor.get(IConfigurationService);
            const currentValue = configService.getValue('editor.inlineSuggest.showToolbar');
            const newValue = currentValue === 'always' ? 'onHover' : 'always';
            configService.updateValue('editor.inlineSuggest.showToolbar', newValue);
        });
    }
}
ToggleAlwaysShowInlineSuggestionToolbar.ID = 'editor.action.inlineSuggest.toggleAlwaysShowToolbar';
export { ToggleAlwaysShowInlineSuggestionToolbar };
export class UndoAcceptPart extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.inlineSuggest.undo',
            label: nls.localize('action.inlineSuggest.undo', "Undo Accept Word"),
            alias: 'Undo Accept Word',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, GhostTextController.canUndoInlineSuggestion),
            kbOpts: {
                weight: 100 /* KeybindingWeight.EditorContrib */ + 1,
                primary: 2048 /* KeyMod.CtrlCmd */ | 15 /* KeyCode.LeftArrow */,
                kbExpr: ContextKeyExpr.and(EditorContextKeys.writable, GhostTextController.canUndoInlineSuggestion),
            },
            menuOpts: [{
                    menuId: MenuId.InlineSuggestionToolbar,
                    title: nls.localize('undoAcceptWord', 'Undo Accept Word'),
                    group: 'secondary',
                    order: 3,
                }],
        });
    }
    run(accessor, editor) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = editor.getModel()) === null || _a === void 0 ? void 0 : _a.undo();
        });
    }
}
