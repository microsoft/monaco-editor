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
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { Position } from '../../../common/core/position.js';
import { InlineCompletionTriggerKind } from '../../../common/languages.js';
import { InlineCompletionsModel, SynchronizedInlineCompletionsCache } from './inlineCompletionsModel.js';
import { SuggestWidgetPreviewModel } from './suggestWidgetPreviewModel.js';
import { createDisposableRef } from './utils.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
export class DelegatingModel extends Disposable {
    constructor() {
        super(...arguments);
        this.onDidChangeEmitter = new Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.hasCachedGhostText = false;
        this.currentModelRef = this._register(new MutableDisposable());
    }
    get targetModel() {
        var _a;
        return (_a = this.currentModelRef.value) === null || _a === void 0 ? void 0 : _a.object;
    }
    setTargetModel(model) {
        var _a;
        if (((_a = this.currentModelRef.value) === null || _a === void 0 ? void 0 : _a.object) === model) {
            return;
        }
        this.currentModelRef.clear();
        this.currentModelRef.value = model ? createDisposableRef(model, model.onDidChange(() => {
            this.hasCachedGhostText = false;
            this.onDidChangeEmitter.fire();
        })) : undefined;
        this.hasCachedGhostText = false;
        this.onDidChangeEmitter.fire();
    }
    get ghostText() {
        var _a, _b;
        if (!this.hasCachedGhostText) {
            this.cachedGhostText = (_b = (_a = this.currentModelRef.value) === null || _a === void 0 ? void 0 : _a.object) === null || _b === void 0 ? void 0 : _b.ghostText;
            this.hasCachedGhostText = true;
        }
        return this.cachedGhostText;
    }
    setExpanded(expanded) {
        var _a;
        (_a = this.targetModel) === null || _a === void 0 ? void 0 : _a.setExpanded(expanded);
    }
    get minReservedLineCount() {
        return this.targetModel ? this.targetModel.minReservedLineCount : 0;
    }
}
/**
 * A ghost text model that is both driven by inline completions and the suggest widget.
*/
let GhostTextModel = class GhostTextModel extends DelegatingModel {
    get activeInlineCompletionsModel() {
        if (this.targetModel === this.inlineCompletionsModel) {
            return this.inlineCompletionsModel;
        }
        return undefined;
    }
    constructor(editor, instantiationService) {
        super();
        this.editor = editor;
        this.instantiationService = instantiationService;
        this.sharedCache = this._register(new SharedInlineCompletionCache());
        this.suggestWidgetAdapterModel = this._register(this.instantiationService.createInstance(SuggestWidgetPreviewModel, this.editor, this.sharedCache));
        this.inlineCompletionsModel = this._register(this.instantiationService.createInstance(InlineCompletionsModel, this.editor, this.sharedCache));
        this._register(this.suggestWidgetAdapterModel.onDidChange(() => {
            this.updateModel();
        }));
        this.updateModel();
    }
    updateModel() {
        this.setTargetModel(this.suggestWidgetAdapterModel.isActive
            ? this.suggestWidgetAdapterModel
            : this.inlineCompletionsModel);
        this.inlineCompletionsModel.setActive(this.targetModel === this.inlineCompletionsModel);
    }
    shouldShowHoverAt(hoverRange) {
        var _a;
        const ghostText = (_a = this.activeInlineCompletionsModel) === null || _a === void 0 ? void 0 : _a.ghostText;
        if (ghostText) {
            return ghostText.parts.some(p => hoverRange.containsPosition(new Position(ghostText.lineNumber, p.column)));
        }
        return false;
    }
    triggerInlineCompletion() {
        var _a;
        (_a = this.activeInlineCompletionsModel) === null || _a === void 0 ? void 0 : _a.trigger(InlineCompletionTriggerKind.Explicit);
    }
    commitInlineCompletion() {
        var _a;
        (_a = this.activeInlineCompletionsModel) === null || _a === void 0 ? void 0 : _a.commitCurrentSuggestion();
    }
    commitInlineCompletionPartially() {
        var _a;
        (_a = this.activeInlineCompletionsModel) === null || _a === void 0 ? void 0 : _a.commitCurrentSuggestionPartially();
    }
    hideInlineCompletion() {
        var _a;
        (_a = this.activeInlineCompletionsModel) === null || _a === void 0 ? void 0 : _a.hide();
    }
    showNextInlineCompletion() {
        var _a;
        (_a = this.activeInlineCompletionsModel) === null || _a === void 0 ? void 0 : _a.showNext();
    }
    showPreviousInlineCompletion() {
        var _a;
        (_a = this.activeInlineCompletionsModel) === null || _a === void 0 ? void 0 : _a.showPrevious();
    }
};
GhostTextModel = __decorate([
    __param(1, IInstantiationService)
], GhostTextModel);
export { GhostTextModel };
export class SharedInlineCompletionCache extends Disposable {
    constructor() {
        super(...arguments);
        this.onDidChangeEmitter = new Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.cache = this._register(new MutableDisposable());
    }
    get value() {
        return this.cache.value;
    }
    setValue(editor, completionsSource, triggerKind) {
        this.cache.value = new SynchronizedInlineCompletionsCache(completionsSource, editor, () => this.onDidChangeEmitter.fire(), triggerKind);
    }
    clearAndLeak() {
        return this.cache.clearAndLeak();
    }
    clear() {
        this.cache.clear();
    }
}
