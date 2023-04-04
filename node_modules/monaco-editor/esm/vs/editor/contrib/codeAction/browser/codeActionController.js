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
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { applyCodeAction, ApplyCodeActionReason } from './codeAction.js';
import { CodeActionUi } from './codeActionUi.js';
import { MessageController } from '../../message/browser/messageController.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IMarkerService } from '../../../../platform/markers/common/markers.js';
import { IEditorProgressService } from '../../../../platform/progress/common/progress.js';
import { CodeActionTriggerSource } from '../common/types.js';
import { CodeActionModel } from './codeActionModel.js';
let CodeActionController = class CodeActionController extends Disposable {
    static get(editor) {
        return editor.getContribution(CodeActionController.ID);
    }
    constructor(editor, markerService, contextKeyService, progressService, _instantiationService, languageFeaturesService) {
        super();
        this._instantiationService = _instantiationService;
        this._editor = editor;
        this._model = this._register(new CodeActionModel(this._editor, languageFeaturesService.codeActionProvider, markerService, contextKeyService, progressService));
        this._register(this._model.onDidChangeState(newState => this._ui.value.update(newState)));
        this._ui = new Lazy(() => this._register(_instantiationService.createInstance(CodeActionUi, editor, {
            applyCodeAction: (action, retrigger, preview) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this._applyCodeAction(action, preview);
                }
                finally {
                    if (retrigger) {
                        this._trigger({ type: 2 /* CodeActionTriggerType.Auto */, triggerAction: CodeActionTriggerSource.QuickFix, filter: {} });
                    }
                }
            })
        })));
    }
    showCodeActions(_trigger, actions, at) {
        return this._ui.value.showCodeActionList(actions, at, { includeDisabledActions: false, fromLightbulb: false });
    }
    manualTriggerAtCurrentPosition(notAvailableMessage, triggerAction, filter, autoApply) {
        var _a;
        if (!this._editor.hasModel()) {
            return;
        }
        (_a = MessageController.get(this._editor)) === null || _a === void 0 ? void 0 : _a.closeMessage();
        const triggerPosition = this._editor.getPosition();
        this._trigger({ type: 1 /* CodeActionTriggerType.Invoke */, triggerAction, filter, autoApply, context: { notAvailableMessage, position: triggerPosition } });
    }
    _trigger(trigger) {
        return this._model.trigger(trigger);
    }
    _applyCodeAction(action, preview) {
        return this._instantiationService.invokeFunction(applyCodeAction, action, ApplyCodeActionReason.FromCodeActions, { preview, editor: this._editor });
    }
};
CodeActionController.ID = 'editor.contrib.codeActionController';
CodeActionController = __decorate([
    __param(1, IMarkerService),
    __param(2, IContextKeyService),
    __param(3, IEditorProgressService),
    __param(4, IInstantiationService),
    __param(5, ILanguageFeaturesService)
], CodeActionController);
export { CodeActionController };
