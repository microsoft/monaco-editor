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
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { KeyChord } from '../../../../base/common/keyCodes.js';
import './anchorSelect.css';
import { EditorAction, registerEditorAction, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { Selection } from '../../../common/core/selection.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { localize } from '../../../../nls.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
export const SelectionAnchorSet = new RawContextKey('selectionAnchorSet', false);
let SelectionAnchorController = class SelectionAnchorController {
    static get(editor) {
        return editor.getContribution(SelectionAnchorController.ID);
    }
    constructor(editor, contextKeyService) {
        this.editor = editor;
        this.selectionAnchorSetContextKey = SelectionAnchorSet.bindTo(contextKeyService);
        this.modelChangeListener = editor.onDidChangeModel(() => this.selectionAnchorSetContextKey.reset());
    }
    setSelectionAnchor() {
        if (this.editor.hasModel()) {
            const position = this.editor.getPosition();
            this.editor.changeDecorations((accessor) => {
                if (this.decorationId) {
                    accessor.removeDecoration(this.decorationId);
                }
                this.decorationId = accessor.addDecoration(Selection.fromPositions(position, position), {
                    description: 'selection-anchor',
                    stickiness: 1 /* TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges */,
                    hoverMessage: new MarkdownString().appendText(localize('selectionAnchor', "Selection Anchor")),
                    className: 'selection-anchor'
                });
            });
            this.selectionAnchorSetContextKey.set(!!this.decorationId);
            alert(localize('anchorSet', "Anchor set at {0}:{1}", position.lineNumber, position.column));
        }
    }
    goToSelectionAnchor() {
        if (this.editor.hasModel() && this.decorationId) {
            const anchorPosition = this.editor.getModel().getDecorationRange(this.decorationId);
            if (anchorPosition) {
                this.editor.setPosition(anchorPosition.getStartPosition());
            }
        }
    }
    selectFromAnchorToCursor() {
        if (this.editor.hasModel() && this.decorationId) {
            const start = this.editor.getModel().getDecorationRange(this.decorationId);
            if (start) {
                const end = this.editor.getPosition();
                this.editor.setSelection(Selection.fromPositions(start.getStartPosition(), end));
                this.cancelSelectionAnchor();
            }
        }
    }
    cancelSelectionAnchor() {
        if (this.decorationId) {
            const decorationId = this.decorationId;
            this.editor.changeDecorations((accessor) => {
                accessor.removeDecoration(decorationId);
                this.decorationId = undefined;
            });
            this.selectionAnchorSetContextKey.set(false);
        }
    }
    dispose() {
        this.cancelSelectionAnchor();
        this.modelChangeListener.dispose();
    }
};
SelectionAnchorController.ID = 'editor.contrib.selectionAnchorController';
SelectionAnchorController = __decorate([
    __param(1, IContextKeyService)
], SelectionAnchorController);
class SetSelectionAnchor extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.setSelectionAnchor',
            label: localize('setSelectionAnchor', "Set Selection Anchor"),
            alias: 'Set Selection Anchor',
            precondition: undefined,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 32 /* KeyCode.KeyB */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(_accessor, editor) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = SelectionAnchorController.get(editor)) === null || _a === void 0 ? void 0 : _a.setSelectionAnchor();
        });
    }
}
class GoToSelectionAnchor extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.goToSelectionAnchor',
            label: localize('goToSelectionAnchor', "Go to Selection Anchor"),
            alias: 'Go to Selection Anchor',
            precondition: SelectionAnchorSet,
        });
    }
    run(_accessor, editor) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = SelectionAnchorController.get(editor)) === null || _a === void 0 ? void 0 : _a.goToSelectionAnchor();
        });
    }
}
class SelectFromAnchorToCursor extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.selectFromAnchorToCursor',
            label: localize('selectFromAnchorToCursor', "Select from Anchor to Cursor"),
            alias: 'Select from Anchor to Cursor',
            precondition: SelectionAnchorSet,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(_accessor, editor) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = SelectionAnchorController.get(editor)) === null || _a === void 0 ? void 0 : _a.selectFromAnchorToCursor();
        });
    }
}
class CancelSelectionAnchor extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.cancelSelectionAnchor',
            label: localize('cancelSelectionAnchor', "Cancel Selection Anchor"),
            alias: 'Cancel Selection Anchor',
            precondition: SelectionAnchorSet,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 9 /* KeyCode.Escape */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(_accessor, editor) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = SelectionAnchorController.get(editor)) === null || _a === void 0 ? void 0 : _a.cancelSelectionAnchor();
        });
    }
}
registerEditorContribution(SelectionAnchorController.ID, SelectionAnchorController, 4 /* EditorContributionInstantiation.Lazy */);
registerEditorAction(SetSelectionAnchor);
registerEditorAction(GoToSelectionAnchor);
registerEditorAction(SelectFromAnchorToCursor);
registerEditorAction(CancelSelectionAnchor);
