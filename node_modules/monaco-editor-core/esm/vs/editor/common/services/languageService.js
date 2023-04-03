/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { LanguagesRegistry } from './languagesRegistry.js';
import { firstOrDefault } from '../../../base/common/arrays.js';
import { TokenizationRegistry } from '../languages.js';
import { PLAINTEXT_LANGUAGE_ID } from '../languages/modesRegistry.js';
class LanguageService extends Disposable {
    constructor(warnOnOverwrite = false) {
        super();
        this._onDidRequestBasicLanguageFeatures = this._register(new Emitter());
        this.onDidRequestBasicLanguageFeatures = this._onDidRequestBasicLanguageFeatures.event;
        this._onDidRequestRichLanguageFeatures = this._register(new Emitter());
        this.onDidRequestRichLanguageFeatures = this._onDidRequestRichLanguageFeatures.event;
        this._onDidChange = this._register(new Emitter({ leakWarningThreshold: 200 /* https://github.com/microsoft/vscode/issues/119968 */ }));
        this.onDidChange = this._onDidChange.event;
        this._requestedBasicLanguages = new Set();
        this._requestedRichLanguages = new Set();
        LanguageService.instanceCount++;
        this._registry = this._register(new LanguagesRegistry(true, warnOnOverwrite));
        this.languageIdCodec = this._registry.languageIdCodec;
        this._register(this._registry.onDidChange(() => this._onDidChange.fire()));
    }
    dispose() {
        LanguageService.instanceCount--;
        super.dispose();
    }
    isRegisteredLanguageId(languageId) {
        return this._registry.isRegisteredLanguageId(languageId);
    }
    getLanguageIdByLanguageName(languageName) {
        return this._registry.getLanguageIdByLanguageName(languageName);
    }
    getLanguageIdByMimeType(mimeType) {
        return this._registry.getLanguageIdByMimeType(mimeType);
    }
    guessLanguageIdByFilepathOrFirstLine(resource, firstLine) {
        const languageIds = this._registry.guessLanguageIdByFilepathOrFirstLine(resource, firstLine);
        return firstOrDefault(languageIds, null);
    }
    createById(languageId) {
        return new LanguageSelection(this.onDidChange, () => {
            return this._createAndGetLanguageIdentifier(languageId);
        });
    }
    createByFilepathOrFirstLine(resource, firstLine) {
        return new LanguageSelection(this.onDidChange, () => {
            const languageId = this.guessLanguageIdByFilepathOrFirstLine(resource, firstLine);
            return this._createAndGetLanguageIdentifier(languageId);
        });
    }
    _createAndGetLanguageIdentifier(languageId) {
        if (!languageId || !this.isRegisteredLanguageId(languageId)) {
            // Fall back to plain text if language is unknown
            languageId = PLAINTEXT_LANGUAGE_ID;
        }
        return languageId;
    }
    requestBasicLanguageFeatures(languageId) {
        if (!this._requestedBasicLanguages.has(languageId)) {
            this._requestedBasicLanguages.add(languageId);
            this._onDidRequestBasicLanguageFeatures.fire(languageId);
        }
    }
    requestRichLanguageFeatures(languageId) {
        if (!this._requestedRichLanguages.has(languageId)) {
            this._requestedRichLanguages.add(languageId);
            // Ensure basic features are requested
            this.requestBasicLanguageFeatures(languageId);
            // Ensure tokenizers are created
            TokenizationRegistry.getOrCreate(languageId);
            this._onDidRequestRichLanguageFeatures.fire(languageId);
        }
    }
}
LanguageService.instanceCount = 0;
export { LanguageService };
class LanguageSelection {
    constructor(_onDidChangeLanguages, _selector) {
        this._onDidChangeLanguages = _onDidChangeLanguages;
        this._selector = _selector;
        this._listener = null;
        this._emitter = null;
        this.languageId = this._selector();
    }
    _dispose() {
        if (this._listener) {
            this._listener.dispose();
            this._listener = null;
        }
        if (this._emitter) {
            this._emitter.dispose();
            this._emitter = null;
        }
    }
    get onDidChange() {
        if (!this._listener) {
            this._listener = this._onDidChangeLanguages(() => this._evaluate());
        }
        if (!this._emitter) {
            this._emitter = new Emitter({
                onDidRemoveLastListener: () => {
                    this._dispose();
                }
            });
        }
        return this._emitter.event;
    }
    _evaluate() {
        var _a;
        const languageId = this._selector();
        if (languageId === this.languageId) {
            // no change
            return;
        }
        this.languageId = languageId;
        (_a = this._emitter) === null || _a === void 0 ? void 0 : _a.fire(this.languageId);
    }
}
