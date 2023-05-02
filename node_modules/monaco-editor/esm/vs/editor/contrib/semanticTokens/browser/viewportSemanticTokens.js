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
import { createCancelablePromise, RunOnceScheduler } from '../../../../base/common/async.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { registerEditorContribution } from '../../../browser/editorExtensions.js';
import { getDocumentRangeSemanticTokens, hasDocumentRangeSemanticTokensProvider } from '../common/getSemanticTokens.js';
import { isSemanticColoringEnabled, SEMANTIC_HIGHLIGHTING_SETTING_ID } from '../common/semanticTokensConfig.js';
import { toMultilineTokens2 } from '../../../common/services/semanticTokensProviderStyling.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ISemanticTokensStylingService } from '../../../common/services/semanticTokensStyling.js';
export let ViewportSemanticTokensContribution = class ViewportSemanticTokensContribution extends Disposable {
    constructor(editor, _semanticTokensStylingService, _themeService, _configurationService, languageFeatureDebounceService, languageFeaturesService) {
        super();
        this._semanticTokensStylingService = _semanticTokensStylingService;
        this._themeService = _themeService;
        this._configurationService = _configurationService;
        this._editor = editor;
        this._provider = languageFeaturesService.documentRangeSemanticTokensProvider;
        this._debounceInformation = languageFeatureDebounceService.for(this._provider, 'DocumentRangeSemanticTokens', { min: 100, max: 500 });
        this._tokenizeViewport = this._register(new RunOnceScheduler(() => this._tokenizeViewportNow(), 100));
        this._outstandingRequests = [];
        const scheduleTokenizeViewport = () => {
            if (this._editor.hasModel()) {
                this._tokenizeViewport.schedule(this._debounceInformation.get(this._editor.getModel()));
            }
        };
        this._register(this._editor.onDidScrollChange(() => {
            scheduleTokenizeViewport();
        }));
        this._register(this._editor.onDidChangeModel(() => {
            this._cancelAll();
            scheduleTokenizeViewport();
        }));
        this._register(this._editor.onDidChangeModelContent((e) => {
            this._cancelAll();
            scheduleTokenizeViewport();
        }));
        this._register(this._provider.onDidChange(() => {
            this._cancelAll();
            scheduleTokenizeViewport();
        }));
        this._register(this._configurationService.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration(SEMANTIC_HIGHLIGHTING_SETTING_ID)) {
                this._cancelAll();
                scheduleTokenizeViewport();
            }
        }));
        this._register(this._themeService.onDidColorThemeChange(() => {
            this._cancelAll();
            scheduleTokenizeViewport();
        }));
        scheduleTokenizeViewport();
    }
    _cancelAll() {
        for (const request of this._outstandingRequests) {
            request.cancel();
        }
        this._outstandingRequests = [];
    }
    _removeOutstandingRequest(req) {
        for (let i = 0, len = this._outstandingRequests.length; i < len; i++) {
            if (this._outstandingRequests[i] === req) {
                this._outstandingRequests.splice(i, 1);
                return;
            }
        }
    }
    _tokenizeViewportNow() {
        if (!this._editor.hasModel()) {
            return;
        }
        const model = this._editor.getModel();
        if (model.tokenization.hasCompleteSemanticTokens()) {
            return;
        }
        if (!isSemanticColoringEnabled(model, this._themeService, this._configurationService)) {
            if (model.tokenization.hasSomeSemanticTokens()) {
                model.tokenization.setSemanticTokens(null, false);
            }
            return;
        }
        if (!hasDocumentRangeSemanticTokensProvider(this._provider, model)) {
            if (model.tokenization.hasSomeSemanticTokens()) {
                model.tokenization.setSemanticTokens(null, false);
            }
            return;
        }
        const visibleRanges = this._editor.getVisibleRangesPlusViewportAboveBelow();
        this._outstandingRequests = this._outstandingRequests.concat(visibleRanges.map(range => this._requestRange(model, range)));
    }
    _requestRange(model, range) {
        const requestVersionId = model.getVersionId();
        const request = createCancelablePromise(token => Promise.resolve(getDocumentRangeSemanticTokens(this._provider, model, range, token)));
        const sw = new StopWatch(false);
        request.then((r) => {
            this._debounceInformation.update(model, sw.elapsed());
            if (!r || !r.tokens || model.isDisposed() || model.getVersionId() !== requestVersionId) {
                return;
            }
            const { provider, tokens: result } = r;
            const styling = this._semanticTokensStylingService.getStyling(provider);
            model.tokenization.setPartialSemanticTokens(range, toMultilineTokens2(result, styling, model.getLanguageId()));
        }).then(() => this._removeOutstandingRequest(request), () => this._removeOutstandingRequest(request));
        return request;
    }
};
ViewportSemanticTokensContribution.ID = 'editor.contrib.viewportSemanticTokens';
ViewportSemanticTokensContribution = __decorate([
    __param(1, ISemanticTokensStylingService),
    __param(2, IThemeService),
    __param(3, IConfigurationService),
    __param(4, ILanguageFeatureDebounceService),
    __param(5, ILanguageFeaturesService)
], ViewportSemanticTokensContribution);
registerEditorContribution(ViewportSemanticTokensContribution.ID, ViewportSemanticTokensContribution, 1 /* EditorContributionInstantiation.AfterFirstRender */);
