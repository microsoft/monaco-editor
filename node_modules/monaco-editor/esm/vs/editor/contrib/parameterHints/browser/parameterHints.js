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
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { EditorAction, EditorCommand, registerEditorAction, registerEditorCommand, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import * as languages from '../../../common/languages.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ParameterHintsModel } from './parameterHintsModel.js';
import { Context } from './provideSignatureHelp.js';
import * as nls from '../../../../nls.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ParameterHintsWidget } from './parameterHintsWidget.js';
let ParameterHintsController = class ParameterHintsController extends Disposable {
    static get(editor) {
        return editor.getContribution(ParameterHintsController.ID);
    }
    constructor(editor, instantiationService, languageFeaturesService) {
        super();
        this.editor = editor;
        this.model = this._register(new ParameterHintsModel(editor, languageFeaturesService.signatureHelpProvider));
        this._register(this.model.onChangedHints(newParameterHints => {
            var _a;
            if (newParameterHints) {
                this.widget.value.show();
                this.widget.value.render(newParameterHints);
            }
            else {
                (_a = this.widget.rawValue) === null || _a === void 0 ? void 0 : _a.hide();
            }
        }));
        this.widget = new Lazy(() => this._register(instantiationService.createInstance(ParameterHintsWidget, this.editor, this.model)));
    }
    cancel() {
        this.model.cancel();
    }
    previous() {
        var _a;
        (_a = this.widget.rawValue) === null || _a === void 0 ? void 0 : _a.previous();
    }
    next() {
        var _a;
        (_a = this.widget.rawValue) === null || _a === void 0 ? void 0 : _a.next();
    }
    trigger(context) {
        this.model.trigger(context, 0);
    }
};
ParameterHintsController.ID = 'editor.controller.parameterHints';
ParameterHintsController = __decorate([
    __param(1, IInstantiationService),
    __param(2, ILanguageFeaturesService)
], ParameterHintsController);
export class TriggerParameterHintsAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.triggerParameterHints',
            label: nls.localize('parameterHints.trigger.label', "Trigger Parameter Hints"),
            alias: 'Trigger Parameter Hints',
            precondition: EditorContextKeys.hasSignatureHelpProvider,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* KeyMod.CtrlCmd */ | 1024 /* KeyMod.Shift */ | 10 /* KeyCode.Space */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const controller = ParameterHintsController.get(editor);
        controller === null || controller === void 0 ? void 0 : controller.trigger({
            triggerKind: languages.SignatureHelpTriggerKind.Invoke
        });
    }
}
registerEditorContribution(ParameterHintsController.ID, ParameterHintsController, 2 /* EditorContributionInstantiation.BeforeFirstInteraction */);
registerEditorAction(TriggerParameterHintsAction);
const weight = 100 /* KeybindingWeight.EditorContrib */ + 75;
const ParameterHintsCommand = EditorCommand.bindToContribution(ParameterHintsController.get);
registerEditorCommand(new ParameterHintsCommand({
    id: 'closeParameterHints',
    precondition: Context.Visible,
    handler: x => x.cancel(),
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.focus,
        primary: 9 /* KeyCode.Escape */,
        secondary: [1024 /* KeyMod.Shift */ | 9 /* KeyCode.Escape */]
    }
}));
registerEditorCommand(new ParameterHintsCommand({
    id: 'showPrevParameterHint',
    precondition: ContextKeyExpr.and(Context.Visible, Context.MultipleSignatures),
    handler: x => x.previous(),
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.focus,
        primary: 16 /* KeyCode.UpArrow */,
        secondary: [512 /* KeyMod.Alt */ | 16 /* KeyCode.UpArrow */],
        mac: { primary: 16 /* KeyCode.UpArrow */, secondary: [512 /* KeyMod.Alt */ | 16 /* KeyCode.UpArrow */, 256 /* KeyMod.WinCtrl */ | 46 /* KeyCode.KeyP */] }
    }
}));
registerEditorCommand(new ParameterHintsCommand({
    id: 'showNextParameterHint',
    precondition: ContextKeyExpr.and(Context.Visible, Context.MultipleSignatures),
    handler: x => x.next(),
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.focus,
        primary: 18 /* KeyCode.DownArrow */,
        secondary: [512 /* KeyMod.Alt */ | 18 /* KeyCode.DownArrow */],
        mac: { primary: 18 /* KeyCode.DownArrow */, secondary: [512 /* KeyMod.Alt */ | 18 /* KeyCode.DownArrow */, 256 /* KeyMod.WinCtrl */ | 44 /* KeyCode.KeyN */] }
    }
}));
