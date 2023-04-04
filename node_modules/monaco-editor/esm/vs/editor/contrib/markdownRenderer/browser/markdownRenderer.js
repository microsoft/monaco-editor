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
var _a;
import { renderMarkdown } from '../../../../base/browser/markdownRenderer.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import './renderedMarkdown.css';
import { applyFontInfo } from '../../../browser/config/domFontInfo.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../common/languages/modesRegistry.js';
import { tokenizeToString } from '../../../common/languages/textToHtmlTokenizer.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
/**
 * Markdown renderer that can render codeblocks with the editor mechanics. This
 * renderer should always be preferred.
 */
let MarkdownRenderer = class MarkdownRenderer {
    constructor(_options, _languageService, _openerService) {
        this._options = _options;
        this._languageService = _languageService;
        this._openerService = _openerService;
        this._onDidRenderAsync = new Emitter();
        this.onDidRenderAsync = this._onDidRenderAsync.event;
    }
    dispose() {
        this._onDidRenderAsync.dispose();
    }
    render(markdown, options, markedOptions) {
        if (!markdown) {
            const element = document.createElement('span');
            return { element, dispose: () => { } };
        }
        const disposables = new DisposableStore();
        const rendered = disposables.add(renderMarkdown(markdown, Object.assign(Object.assign({}, this._getRenderOptions(markdown, disposables)), options), markedOptions));
        rendered.element.classList.add('rendered-markdown');
        return {
            element: rendered.element,
            dispose: () => disposables.dispose()
        };
    }
    _getRenderOptions(markdown, disposables) {
        return {
            codeBlockRenderer: (languageAlias, value) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                // In markdown,
                // it is possible that we stumble upon language aliases (e.g.js instead of javascript)
                // it is possible no alias is given in which case we fall back to the current editor lang
                let languageId;
                if (languageAlias) {
                    languageId = this._languageService.getLanguageIdByLanguageName(languageAlias);
                }
                else if (this._options.editor) {
                    languageId = (_a = this._options.editor.getModel()) === null || _a === void 0 ? void 0 : _a.getLanguageId();
                }
                if (!languageId) {
                    languageId = PLAINTEXT_LANGUAGE_ID;
                }
                const html = yield tokenizeToString(this._languageService, value, languageId);
                const element = document.createElement('span');
                element.innerHTML = ((_c = (_b = MarkdownRenderer._ttpTokenizer) === null || _b === void 0 ? void 0 : _b.createHTML(html)) !== null && _c !== void 0 ? _c : html);
                // use "good" font
                if (this._options.editor) {
                    const fontInfo = this._options.editor.getOption(48 /* EditorOption.fontInfo */);
                    applyFontInfo(element, fontInfo);
                }
                else if (this._options.codeBlockFontFamily) {
                    element.style.fontFamily = this._options.codeBlockFontFamily;
                }
                if (this._options.codeBlockFontSize !== undefined) {
                    element.style.fontSize = this._options.codeBlockFontSize;
                }
                return element;
            }),
            asyncRenderCallback: () => this._onDidRenderAsync.fire(),
            actionHandler: {
                callback: (link) => openLinkFromMarkdown(this._openerService, link, markdown.isTrusted),
                disposables: disposables
            }
        };
    }
};
MarkdownRenderer._ttpTokenizer = (_a = window.trustedTypes) === null || _a === void 0 ? void 0 : _a.createPolicy('tokenizeToString', {
    createHTML(html) {
        return html;
    }
});
MarkdownRenderer = __decorate([
    __param(1, ILanguageService),
    __param(2, IOpenerService)
], MarkdownRenderer);
export { MarkdownRenderer };
export function openLinkFromMarkdown(openerService, link, isTrusted) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield openerService.open(link, {
                fromUserGesture: true,
                allowContributedOpeners: true,
                allowCommands: toAllowCommandsOption(isTrusted),
            });
        }
        catch (e) {
            onUnexpectedError(e);
            return false;
        }
    });
}
function toAllowCommandsOption(isTrusted) {
    if (isTrusted === true) {
        return true; // Allow all commands
    }
    if (isTrusted && Array.isArray(isTrusted.enabledCommands)) {
        return isTrusted.enabledCommands; // Allow subset of commands
    }
    return false; // Block commands
}
