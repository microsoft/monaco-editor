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
import { InlineSuggestionHintsContentWidget } from './inlineCompletionsHintsWidget.js';
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
        this.suggestWidgetAdaptor = this._register(new SuggestWidgetAdaptor(this.editor, () => { var _a, _b; return (_b = (_a = this.model.get()) === null || _a === void 0 ? void 0 : _a.selectedInlineCompletion.get()) === null || _b === void 0 ? void 0 : _b.toSingleTextEdit(undefined); }, (tx) => this.updateObservables(tx, VersionIdChangeReason.Other)));
        this.textModelVersionId = observableValue('textModelVersionId', -1);
        this.cursorPosition = observableValue('cursorPosition', new Position(1, 1));
        this.model = disposableObservableValue('inlineCompletionModel', undefined);
        this.ghostTextWidget = this._register(this.instantiationService.createInstance(GhostTextWidget, this.editor, {
            ghostText: this.model.map((v, reader) => v === null || v === void 0 ? void 0 : v.ghostText.read(reader)),
            minReservedLineCount: constObservable(0),
            targetTextModel: this.model.map(v => v === null || v === void 0 ? void 0 : v.textModel),
        }));
        this._debounceValue = this.debounceService.for(this.languageFeaturesService.inlineCompletionsProvider, 'InlineCompletionsDebounce', { min: 50, max: 50 });
        this._register(new InlineCompletionContextKeys(this.contextKeyService, this.model));
        const enabled = observableFromEvent(editor.onDidChangeConfiguration, () => editor.getOption(60 /* EditorOption.inlineSuggest */).enabled);
        this._register(Event.runAndSubscribe(editor.onDidChangeModel, () => {
            transaction(tx => {
                this.model.set(undefined, tx); // This disposes the model
                this.updateObservables(tx, VersionIdChangeReason.Other);
                const textModel = editor.getModel();
                if (textModel) {
                    const model = instantiationService.createInstance(InlineCompletionsModel, textModel, this.suggestWidgetAdaptor.selectedItem, this.cursorPosition, this.textModelVersionId, this._debounceValue, observableFromEvent(editor.onDidChangeConfiguration, () => editor.getOption(113 /* EditorOption.suggest */).preview), observableFromEvent(editor.onDidChangeConfiguration, () => editor.getOption(113 /* EditorOption.suggest */).previewMode), observableFromEvent(editor.onDidChangeConfiguration, () => editor.getOption(60 /* EditorOption.inlineSuggest */).mode), enabled);
                    this.model.set(model, tx);
                }
            });
        }));
        this._register(editor.onDidChangeModelContent((e) => transaction(tx => {
            var _a;
            return this.updateObservables(tx, e.isUndoing ? VersionIdChangeReason.Undo
                : e.isRedoing ? VersionIdChangeReason.Redo
                    : ((_a = this.model.get()) === null || _a === void 0 ? void 0 : _a.isAcceptingPartially) ? VersionIdChangeReason.AcceptWord
                        : VersionIdChangeReason.Other);
        })));
        this._register(editor.onDidChangeCursorPosition(e => transaction(tx => {
            var _a;
            this.updateObservables(tx, VersionIdChangeReason.Other);
            if (e.reason === 3 /* CursorChangeReason.Explicit */) {
                (_a = this.model.get()) === null || _a === void 0 ? void 0 : _a.stop(tx);
            }
        })));
        this._register(editor.onDidType(() => transaction(tx => {
            var _a;
            this.updateObservables(tx, VersionIdChangeReason.Other);
            if (enabled.get()) {
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
            if (commands.has(e.commandId) && editor.hasTextFocus() && enabled.get()) {
                transaction(tx => {
                    var _a;
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
                (_a = this.model.get()) === null || _a === void 0 ? void 0 : _a.stop(tx);
            });
        }));
        this._register(autorun('forceRenderingAbove', reader => {
            const model = this.model.read(reader);
            const ghostText = model === null || model === void 0 ? void 0 : model.ghostText.read(reader);
            const selectedSuggestItem = this.suggestWidgetAdaptor.selectedItem.read(reader);
            if (selectedSuggestItem) {
                if (ghostText && ghostText.lineCount >= 2) {
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
            const currentInlineCompletion = model === null || model === void 0 ? void 0 : model.selectedInlineCompletion.read(reader);
            if (!model || !currentInlineCompletion) {
                lastInlineCompletionId = undefined;
                return;
            }
            const ghostText = model === null || model === void 0 ? void 0 : model.ghostText.get();
            if (!ghostText) {
                lastInlineCompletionId = undefined;
                return;
            }
            const lineText = model.textModel.getLineContent(ghostText.lineNumber);
            if (currentInlineCompletion.semanticId !== lastInlineCompletionId) {
                lastInlineCompletionId = currentInlineCompletion.semanticId;
                if (model.isNavigatingCurrentInlineCompletion) {
                    return;
                }
                this.audioCueService.playAudioCue(AudioCue.inlineSuggestion).then(() => {
                    if (this.editor.getOption(6 /* EditorOption.screenReaderAnnounceInlineSuggestion */)) {
                        alert(ghostText.renderForScreenReader(lineText));
                    }
                });
            }
        }));
    }
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
