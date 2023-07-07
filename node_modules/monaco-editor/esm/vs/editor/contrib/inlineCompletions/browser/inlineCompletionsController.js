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
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, constObservable, observableFromEvent, observableValue } from '../../../../base/common/observable.js';
import { disposableObservableValue, transaction } from '../../../../base/common/observableImpl/base.js';
import { CoreEditingCommands } from '../../../browser/coreCommands.js';
import { Position } from '../../../common/core/position.js';
import { ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { inlineSuggestCommitId } from './commandIds.js';
import { GhostTextWidget } from './ghostTextWidget.js';
import { InlineCompletionContextKeys } from './inlineCompletionContextKeys.js';
import { InlineCompletionsHintsWidget, InlineSuggestionHintsContentWidget } from './inlineCompletionsHintsWidget.js';
import { InlineCompletionsModel, VersionIdChangeReason } from './inlineCompletionsModel.js';
import { SuggestWidgetAdaptor } from './suggestWidgetInlineCompletionProvider.js';
import { AudioCue, IAudioCueService } from '../../../../platform/audioCues/browser/audioCueService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
export let InlineCompletionsController = class InlineCompletionsController extends Disposable {
    static get(editor) {
        return editor.getContribution(InlineCompletionsController.ID);
    }
    constructor(editor, instantiationService, contextKeyService, configurationService, commandService, debounceService, languageFeaturesService, audioCueService) {
        super();
        this.editor = editor;
        this.instantiationService = instantiationService;
        this.contextKeyService = contextKeyService;
        this.configurationService = configurationService;
        this.commandService = commandService;
        this.debounceService = debounceService;
        this.languageFeaturesService = languageFeaturesService;
        this.audioCueService = audioCueService;
        this.model = disposableObservableValue('inlineCompletionModel', undefined);
        this.textModelVersionId = observableValue('textModelVersionId', -1);
        this.cursorPosition = observableValue('cursorPosition', new Position(1, 1));
        this.suggestWidgetAdaptor = this._register(new SuggestWidgetAdaptor(this.editor, () => { var _a, _b; return (_b = (_a = this.model.get()) === null || _a === void 0 ? void 0 : _a.selectedInlineCompletion.get()) === null || _b === void 0 ? void 0 : _b.toSingleTextEdit(undefined); }, (tx) => this.updateObservables(tx, VersionIdChangeReason.Other)));
        this._enabled = observableFromEvent(this.editor.onDidChangeConfiguration, () => this.editor.getOption(60 /* EditorOption.inlineSuggest */).enabled);
        this.ghostTextWidget = this._register(this.instantiationService.createInstance(GhostTextWidget, this.editor, {
            ghostText: this.model.map((v, reader) => v === null || v === void 0 ? void 0 : v.ghostText.read(reader)),
            minReservedLineCount: constObservable(0),
            targetTextModel: this.model.map(v => v === null || v === void 0 ? void 0 : v.textModel),
        }));
        this._debounceValue = this.debounceService.for(this.languageFeaturesService.inlineCompletionsProvider, 'InlineCompletionsDebounce', { min: 50, max: 50 });
        this._register(new InlineCompletionContextKeys(this.contextKeyService, this.model));
        this._register(Event.runAndSubscribe(editor.onDidChangeModel, () => transaction(tx => {
            /** @description onDidChangeModel */
            this.model.set(undefined, tx);
            this.updateObservables(tx, VersionIdChangeReason.Other);
            const textModel = editor.getModel();
            if (textModel) {
                const model = instantiationService.createInstance(InlineCompletionsModel, textModel, this.suggestWidgetAdaptor.selectedItem, this.cursorPosition, this.textModelVersionId, this._debounceValue, observableFromEvent(editor.onDidChangeConfiguration, () => editor.getOption(115 /* EditorOption.suggest */).preview), observableFromEvent(editor.onDidChangeConfiguration, () => editor.getOption(115 /* EditorOption.suggest */).previewMode), observableFromEvent(editor.onDidChangeConfiguration, () => editor.getOption(60 /* EditorOption.inlineSuggest */).mode), this._enabled);
                this.model.set(model, tx);
            }
        })));
        const getReason = (e) => {
            var _a;
            if (e.isUndoing) {
                return VersionIdChangeReason.Undo;
            }
            if (e.isRedoing) {
                return VersionIdChangeReason.Redo;
            }
            if ((_a = this.model.get()) === null || _a === void 0 ? void 0 : _a.isAcceptingPartially) {
                return VersionIdChangeReason.AcceptWord;
            }
            return VersionIdChangeReason.Other;
        };
        this._register(editor.onDidChangeModelContent((e) => transaction(tx => 
        /** @description onDidChangeModelContent */
        this.updateObservables(tx, getReason(e)))));
        this._register(editor.onDidChangeCursorPosition(e => transaction(tx => {
            var _a;
            /** @description onDidChangeCursorPosition */
            this.updateObservables(tx, VersionIdChangeReason.Other);
            if (e.reason === 3 /* CursorChangeReason.Explicit */) {
                (_a = this.model.get()) === null || _a === void 0 ? void 0 : _a.stop(tx);
            }
        })));
        this._register(editor.onDidType(() => transaction(tx => {
            var _a;
            /** @description onDidType */
            this.updateObservables(tx, VersionIdChangeReason.Other);
            if (this._enabled.get()) {
                (_a = this.model.get()) === null || _a === void 0 ? void 0 : _a.trigger(tx);
            }
        })));
        this._register(this.commandService.onDidExecuteCommand((e) => {
            // These commands don't trigger onDidType.
            const commands = new Set([
                CoreEditingCommands.Tab.id,
                CoreEditingCommands.DeleteLeft.id,
                CoreEditingCommands.DeleteRight.id,
                inlineSuggestCommitId,
                'acceptSelectedSuggestion',
            ]);
            if (commands.has(e.commandId) && editor.hasTextFocus() && this._enabled.get()) {
                transaction(tx => {
                    var _a;
                    /** @description onDidExecuteCommand */
                    (_a = this.model.get()) === null || _a === void 0 ? void 0 : _a.trigger(tx);
                });
            }
        }));
        this._register(this.editor.onDidBlurEditorWidget(() => {
            // This is a hidden setting very useful for debugging
            if (this.configurationService.getValue('editor.inlineSuggest.keepOnBlur') ||
                editor.getOption(60 /* EditorOption.inlineSuggest */).keepOnBlur) {
                return;
            }
            if (InlineSuggestionHintsContentWidget.dropDownVisible) {
                return;
            }
            transaction(tx => {
                var _a;
                /** @description onDidBlurEditorWidget */
                (_a = this.model.get()) === null || _a === void 0 ? void 0 : _a.stop(tx);
            });
        }));
        this._register(autorun('forceRenderingAbove', reader => {
            var _a;
            const state = (_a = this.model.read(reader)) === null || _a === void 0 ? void 0 : _a.state.read(reader);
            if (state === null || state === void 0 ? void 0 : state.suggestItem) {
                if (state.ghostText.lineCount >= 2) {
                    this.suggestWidgetAdaptor.forceRenderingAbove();
                }
            }
            else {
                this.suggestWidgetAdaptor.stopForceRenderingAbove();
            }
        }));
        this._register(toDisposable(() => {
            this.suggestWidgetAdaptor.stopForceRenderingAbove();
        }));
        let lastInlineCompletionId = undefined;
        this._register(autorun('play audio cue & read suggestion', reader => {
            const model = this.model.read(reader);
            const state = model === null || model === void 0 ? void 0 : model.state.read(reader);
            if (!model || !state || !state.completion) {
                lastInlineCompletionId = undefined;
                return;
            }
            if (state.completion.semanticId !== lastInlineCompletionId) {
                lastInlineCompletionId = state.completion.semanticId;
                if (model.isNavigatingCurrentInlineCompletion) {
                    return;
                }
                this.audioCueService.playAudioCue(AudioCue.inlineSuggestion).then(() => {
                    if (this.editor.getOption(6 /* EditorOption.screenReaderAnnounceInlineSuggestion */)) {
                        const lineText = model.textModel.getLineContent(state.ghostText.lineNumber);
                        alert(state.ghostText.renderForScreenReader(lineText));
                    }
                });
            }
        }));
        this._register(new InlineCompletionsHintsWidget(this.editor, this.model, this.instantiationService));
    }
    /**
     * Copies over the relevant state from the text model to observables.
     * This solves all kind of eventing issues, as we make sure we always operate on the latest state,
     * regardless of who calls into us.
     */
    updateObservables(tx, changeReason) {
        var _a, _b;
        const newModel = this.editor.getModel();
        this.textModelVersionId.set((_a = newModel === null || newModel === void 0 ? void 0 : newModel.getVersionId()) !== null && _a !== void 0 ? _a : -1, tx, changeReason);
        this.cursorPosition.set((_b = this.editor.getPosition()) !== null && _b !== void 0 ? _b : new Position(1, 1), tx);
    }
    shouldShowHoverAt(range) {
        var _a;
        const ghostText = (_a = this.model.get()) === null || _a === void 0 ? void 0 : _a.ghostText.get();
        if (ghostText) {
            return ghostText.parts.some(p => range.containsPosition(new Position(ghostText.lineNumber, p.column)));
        }
        return false;
    }
    shouldShowHoverAtViewZone(viewZoneId) {
        return this.ghostTextWidget.ownsViewZone(viewZoneId);
    }
};
InlineCompletionsController.ID = 'editor.contrib.inlineCompletionsController';
InlineCompletionsController = __decorate([
    __param(1, IInstantiationService),
    __param(2, IContextKeyService),
    __param(3, IConfigurationService),
    __param(4, ICommandService),
    __param(5, ILanguageFeatureDebounceService),
    __param(6, ILanguageFeaturesService),
    __param(7, IAudioCueService)
], InlineCompletionsController);
