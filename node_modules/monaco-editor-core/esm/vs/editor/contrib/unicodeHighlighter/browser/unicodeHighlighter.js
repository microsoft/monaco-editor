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
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import * as platform from '../../../../base/common/platform.js';
import { InvisibleCharacters, isBasicASCII } from '../../../../base/common/strings.js';
import './unicodeHighlighter.css';
import { EditorAction, registerEditorAction, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { inUntrustedWorkspace, unicodeHighlightConfigKeys } from '../../../common/config/editorOptions.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { UnicodeTextModelHighlighter } from '../../../common/services/unicodeTextModelHighlighter.js';
import { IEditorWorkerService } from '../../../common/services/editorWorker.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { isModelDecorationInComment, isModelDecorationInString, isModelDecorationVisible } from '../../../common/viewModel/viewModelDecorations.js';
import { HoverParticipantRegistry } from '../../hover/browser/hoverTypes.js';
import { MarkdownHover, renderMarkdownHovers } from '../../hover/browser/markdownHoverParticipant.js';
import { BannerController } from './bannerController.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
export const warningIcon = registerIcon('extensions-warning-message', Codicon.warning, nls.localize('warningIcon', 'Icon shown with a warning message in the extensions editor.'));
let UnicodeHighlighter = class UnicodeHighlighter extends Disposable {
    constructor(_editor, _editorWorkerService, _workspaceTrustService, instantiationService) {
        super();
        this._editor = _editor;
        this._editorWorkerService = _editorWorkerService;
        this._workspaceTrustService = _workspaceTrustService;
        this._highlighter = null;
        this._bannerClosed = false;
        this._updateState = (state) => {
            if (state && state.hasMore) {
                if (this._bannerClosed) {
                    return;
                }
                // This document contains many non-basic ASCII characters.
                const max = Math.max(state.ambiguousCharacterCount, state.nonBasicAsciiCharacterCount, state.invisibleCharacterCount);
                let data;
                if (state.nonBasicAsciiCharacterCount >= max) {
                    data = {
                        message: nls.localize('unicodeHighlighting.thisDocumentHasManyNonBasicAsciiUnicodeCharacters', 'This document contains many non-basic ASCII unicode characters'),
                        command: new DisableHighlightingOfNonBasicAsciiCharactersAction(),
                    };
                }
                else if (state.ambiguousCharacterCount >= max) {
                    data = {
                        message: nls.localize('unicodeHighlighting.thisDocumentHasManyAmbiguousUnicodeCharacters', 'This document contains many ambiguous unicode characters'),
                        command: new DisableHighlightingOfAmbiguousCharactersAction(),
                    };
                }
                else if (state.invisibleCharacterCount >= max) {
                    data = {
                        message: nls.localize('unicodeHighlighting.thisDocumentHasManyInvisibleUnicodeCharacters', 'This document contains many invisible unicode characters'),
                        command: new DisableHighlightingOfInvisibleCharactersAction(),
                    };
                }
                else {
                    throw new Error('Unreachable');
                }
                this._bannerController.show({
                    id: 'unicodeHighlightBanner',
                    message: data.message,
                    icon: warningIcon,
                    actions: [
                        {
                            label: data.command.shortLabel,
                            href: `command:${data.command.id}`
                        }
                    ],
                    onClose: () => {
                        this._bannerClosed = true;
                    },
                });
            }
            else {
                this._bannerController.hide();
            }
        };
        this._bannerController = this._register(instantiationService.createInstance(BannerController, _editor));
        this._register(this._editor.onDidChangeModel(() => {
            this._bannerClosed = false;
            this._updateHighlighter();
        }));
        this._options = _editor.getOption(120 /* EditorOption.unicodeHighlighting */);
        this._register(_workspaceTrustService.onDidChangeTrust(e => {
            this._updateHighlighter();
        }));
        this._register(_editor.onDidChangeConfiguration(e => {
            if (e.hasChanged(120 /* EditorOption.unicodeHighlighting */)) {
                this._options = _editor.getOption(120 /* EditorOption.unicodeHighlighting */);
                this._updateHighlighter();
            }
        }));
        this._updateHighlighter();
    }
    dispose() {
        if (this._highlighter) {
            this._highlighter.dispose();
            this._highlighter = null;
        }
        super.dispose();
    }
    _updateHighlighter() {
        this._updateState(null);
        if (this._highlighter) {
            this._highlighter.dispose();
            this._highlighter = null;
        }
        if (!this._editor.hasModel()) {
            return;
        }
        const options = resolveOptions(this._workspaceTrustService.isWorkspaceTrusted(), this._options);
        if ([
            options.nonBasicASCII,
            options.ambiguousCharacters,
            options.invisibleCharacters,
        ].every((option) => option === false)) {
            // Don't do anything if the feature is fully disabled
            return;
        }
        const highlightOptions = {
            nonBasicASCII: options.nonBasicASCII,
            ambiguousCharacters: options.ambiguousCharacters,
            invisibleCharacters: options.invisibleCharacters,
            includeComments: options.includeComments,
            includeStrings: options.includeStrings,
            allowedCodePoints: Object.keys(options.allowedCharacters).map(c => c.codePointAt(0)),
            allowedLocales: Object.keys(options.allowedLocales).map(locale => {
                if (locale === '_os') {
                    const osLocale = new Intl.NumberFormat().resolvedOptions().locale;
                    return osLocale;
                }
                else if (locale === '_vscode') {
                    return platform.language;
                }
                return locale;
            }),
        };
        if (this._editorWorkerService.canComputeUnicodeHighlights(this._editor.getModel().uri)) {
            this._highlighter = new DocumentUnicodeHighlighter(this._editor, highlightOptions, this._updateState, this._editorWorkerService);
        }
        else {
            this._highlighter = new ViewportUnicodeHighlighter(this._editor, highlightOptions, this._updateState);
        }
    }
    getDecorationInfo(decoration) {
        if (this._highlighter) {
            return this._highlighter.getDecorationInfo(decoration);
        }
        return null;
    }
};
UnicodeHighlighter.ID = 'editor.contrib.unicodeHighlighter';
UnicodeHighlighter = __decorate([
    __param(1, IEditorWorkerService),
    __param(2, IWorkspaceTrustManagementService),
    __param(3, IInstantiationService)
], UnicodeHighlighter);
export { UnicodeHighlighter };
function resolveOptions(trusted, options) {
    return {
        nonBasicASCII: options.nonBasicASCII === inUntrustedWorkspace ? !trusted : options.nonBasicASCII,
        ambiguousCharacters: options.ambiguousCharacters,
        invisibleCharacters: options.invisibleCharacters,
        includeComments: options.includeComments === inUntrustedWorkspace ? !trusted : options.includeComments,
        includeStrings: options.includeStrings === inUntrustedWorkspace ? !trusted : options.includeStrings,
        allowedCharacters: options.allowedCharacters,
        allowedLocales: options.allowedLocales,
    };
}
let DocumentUnicodeHighlighter = class DocumentUnicodeHighlighter extends Disposable {
    constructor(_editor, _options, _updateState, _editorWorkerService) {
        super();
        this._editor = _editor;
        this._options = _options;
        this._updateState = _updateState;
        this._editorWorkerService = _editorWorkerService;
        this._model = this._editor.getModel();
        this._decorations = this._editor.createDecorationsCollection();
        this._updateSoon = this._register(new RunOnceScheduler(() => this._update(), 250));
        this._register(this._editor.onDidChangeModelContent(() => {
            this._updateSoon.schedule();
        }));
        this._updateSoon.schedule();
    }
    dispose() {
        this._decorations.clear();
        super.dispose();
    }
    _update() {
        if (this._model.isDisposed()) {
            return;
        }
        if (!this._model.mightContainNonBasicASCII()) {
            this._decorations.clear();
            return;
        }
        const modelVersionId = this._model.getVersionId();
        this._editorWorkerService
            .computedUnicodeHighlights(this._model.uri, this._options)
            .then((info) => {
            if (this._model.isDisposed()) {
                return;
            }
            if (this._model.getVersionId() !== modelVersionId) {
                // model changed in the meantime
                return;
            }
            this._updateState(info);
            const decorations = [];
            if (!info.hasMore) {
                // Don't show decoration if there are too many.
                // In this case, a banner is shown.
                for (const range of info.ranges) {
                    decorations.push({
                        range: range,
                        options: Decorations.instance.getDecorationFromOptions(this._options),
                    });
                }
            }
            this._decorations.set(decorations);
        });
    }
    getDecorationInfo(decoration) {
        if (!this._decorations.has(decoration)) {
            return null;
        }
        const model = this._editor.getModel();
        if (!isModelDecorationVisible(model, decoration)) {
            return null;
        }
        const text = model.getValueInRange(decoration.range);
        return {
            reason: computeReason(text, this._options),
            inComment: isModelDecorationInComment(model, decoration),
            inString: isModelDecorationInString(model, decoration),
        };
    }
};
DocumentUnicodeHighlighter = __decorate([
    __param(3, IEditorWorkerService)
], DocumentUnicodeHighlighter);
class ViewportUnicodeHighlighter extends Disposable {
    constructor(_editor, _options, _updateState) {
        super();
        this._editor = _editor;
        this._options = _options;
        this._updateState = _updateState;
        this._model = this._editor.getModel();
        this._decorations = this._editor.createDecorationsCollection();
        this._updateSoon = this._register(new RunOnceScheduler(() => this._update(), 250));
        this._register(this._editor.onDidLayoutChange(() => {
            this._updateSoon.schedule();
        }));
        this._register(this._editor.onDidScrollChange(() => {
            this._updateSoon.schedule();
        }));
        this._register(this._editor.onDidChangeHiddenAreas(() => {
            this._updateSoon.schedule();
        }));
        this._register(this._editor.onDidChangeModelContent(() => {
            this._updateSoon.schedule();
        }));
        this._updateSoon.schedule();
    }
    dispose() {
        this._decorations.clear();
        super.dispose();
    }
    _update() {
        if (this._model.isDisposed()) {
            return;
        }
        if (!this._model.mightContainNonBasicASCII()) {
            this._decorations.clear();
            return;
        }
        const ranges = this._editor.getVisibleRanges();
        const decorations = [];
        const totalResult = {
            ranges: [],
            ambiguousCharacterCount: 0,
            invisibleCharacterCount: 0,
            nonBasicAsciiCharacterCount: 0,
            hasMore: false,
        };
        for (const range of ranges) {
            const result = UnicodeTextModelHighlighter.computeUnicodeHighlights(this._model, this._options, range);
            for (const r of result.ranges) {
                totalResult.ranges.push(r);
            }
            totalResult.ambiguousCharacterCount += totalResult.ambiguousCharacterCount;
            totalResult.invisibleCharacterCount += totalResult.invisibleCharacterCount;
            totalResult.nonBasicAsciiCharacterCount += totalResult.nonBasicAsciiCharacterCount;
            totalResult.hasMore = totalResult.hasMore || result.hasMore;
        }
        if (!totalResult.hasMore) {
            // Don't show decorations if there are too many.
            // A banner will be shown instead.
            for (const range of totalResult.ranges) {
                decorations.push({ range, options: Decorations.instance.getDecorationFromOptions(this._options) });
            }
        }
        this._updateState(totalResult);
        this._decorations.set(decorations);
    }
    getDecorationInfo(decoration) {
        if (!this._decorations.has(decoration)) {
            return null;
        }
        const model = this._editor.getModel();
        const text = model.getValueInRange(decoration.range);
        if (!isModelDecorationVisible(model, decoration)) {
            return null;
        }
        return {
            reason: computeReason(text, this._options),
            inComment: isModelDecorationInComment(model, decoration),
            inString: isModelDecorationInString(model, decoration),
        };
    }
}
let UnicodeHighlighterHoverParticipant = class UnicodeHighlighterHoverParticipant {
    constructor(_editor, _languageService, _openerService) {
        this._editor = _editor;
        this._languageService = _languageService;
        this._openerService = _openerService;
        this.hoverOrdinal = 5;
    }
    computeSync(anchor, lineDecorations) {
        if (!this._editor.hasModel() || anchor.type !== 1 /* HoverAnchorType.Range */) {
            return [];
        }
        const model = this._editor.getModel();
        const unicodeHighlighter = this._editor.getContribution(UnicodeHighlighter.ID);
        if (!unicodeHighlighter) {
            return [];
        }
        const result = [];
        let index = 300;
        for (const d of lineDecorations) {
            const highlightInfo = unicodeHighlighter.getDecorationInfo(d);
            if (!highlightInfo) {
                continue;
            }
            const char = model.getValueInRange(d.range);
            // text refers to a single character.
            const codePoint = char.codePointAt(0);
            const codePointStr = formatCodePointMarkdown(codePoint);
            let reason;
            switch (highlightInfo.reason.kind) {
                case 0 /* UnicodeHighlighterReasonKind.Ambiguous */: {
                    if (isBasicASCII(highlightInfo.reason.confusableWith)) {
                        reason = nls.localize('unicodeHighlight.characterIsAmbiguousASCII', 'The character {0} could be confused with the ASCII character {1}, which is more common in source code.', codePointStr, formatCodePointMarkdown(highlightInfo.reason.confusableWith.codePointAt(0)));
                    }
                    else {
                        reason = nls.localize('unicodeHighlight.characterIsAmbiguous', 'The character {0} could be confused with the character {1}, which is more common in source code.', codePointStr, formatCodePointMarkdown(highlightInfo.reason.confusableWith.codePointAt(0)));
                    }
                    break;
                }
                case 1 /* UnicodeHighlighterReasonKind.Invisible */:
                    reason = nls.localize('unicodeHighlight.characterIsInvisible', 'The character {0} is invisible.', codePointStr);
                    break;
                case 2 /* UnicodeHighlighterReasonKind.NonBasicAscii */:
                    reason = nls.localize('unicodeHighlight.characterIsNonBasicAscii', 'The character {0} is not a basic ASCII character.', codePointStr);
                    break;
            }
            const adjustSettingsArgs = {
                codePoint: codePoint,
                reason: highlightInfo.reason,
                inComment: highlightInfo.inComment,
                inString: highlightInfo.inString,
            };
            const adjustSettings = nls.localize('unicodeHighlight.adjustSettings', 'Adjust settings');
            const uri = `command:${ShowExcludeOptions.ID}?${encodeURIComponent(JSON.stringify(adjustSettingsArgs))}`;
            const markdown = new MarkdownString('', true)
                .appendMarkdown(reason)
                .appendText(' ')
                .appendLink(uri, adjustSettings);
            result.push(new MarkdownHover(this, d.range, [markdown], false, index++));
        }
        return result;
    }
    renderHoverParts(context, hoverParts) {
        return renderMarkdownHovers(context, hoverParts, this._editor, this._languageService, this._openerService);
    }
};
UnicodeHighlighterHoverParticipant = __decorate([
    __param(1, ILanguageService),
    __param(2, IOpenerService)
], UnicodeHighlighterHoverParticipant);
export { UnicodeHighlighterHoverParticipant };
function codePointToHex(codePoint) {
    return `U+${codePoint.toString(16).padStart(4, '0')}`;
}
function formatCodePointMarkdown(codePoint) {
    let value = `\`${codePointToHex(codePoint)}\``;
    if (!InvisibleCharacters.isInvisibleCharacter(codePoint)) {
        // Don't render any control characters or any invisible characters, as they cannot be seen anyways.
        value += ` "${`${renderCodePointAsInlineCode(codePoint)}`}"`;
    }
    return value;
}
function renderCodePointAsInlineCode(codePoint) {
    if (codePoint === 96 /* CharCode.BackTick */) {
        return '`` ` ``';
    }
    return '`' + String.fromCodePoint(codePoint) + '`';
}
function computeReason(char, options) {
    return UnicodeTextModelHighlighter.computeUnicodeHighlightReason(char, options);
}
class Decorations {
    constructor() {
        this.map = new Map();
    }
    getDecorationFromOptions(options) {
        return this.getDecoration(!options.includeComments, !options.includeStrings);
    }
    getDecoration(hideInComments, hideInStrings) {
        const key = `${hideInComments}${hideInStrings}`;
        let options = this.map.get(key);
        if (!options) {
            options = ModelDecorationOptions.createDynamic({
                description: 'unicode-highlight',
                stickiness: 1 /* TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges */,
                className: 'unicode-highlight',
                showIfCollapsed: true,
                overviewRuler: null,
                minimap: null,
                hideInCommentTokens: hideInComments,
                hideInStringTokens: hideInStrings,
            });
            this.map.set(key, options);
        }
        return options;
    }
}
Decorations.instance = new Decorations();
export class DisableHighlightingInCommentsAction extends EditorAction {
    constructor() {
        super({
            id: DisableHighlightingOfAmbiguousCharactersAction.ID,
            label: nls.localize('action.unicodeHighlight.disableHighlightingInComments', 'Disable highlighting of characters in comments'),
            alias: 'Disable highlighting of characters in comments',
            precondition: undefined
        });
        this.shortLabel = nls.localize('unicodeHighlight.disableHighlightingInComments.shortLabel', 'Disable Highlight In Comments');
    }
    run(accessor, editor, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const configurationService = accessor === null || accessor === void 0 ? void 0 : accessor.get(IConfigurationService);
            if (configurationService) {
                this.runAction(configurationService);
            }
        });
    }
    runAction(configurationService) {
        return __awaiter(this, void 0, void 0, function* () {
            yield configurationService.updateValue(unicodeHighlightConfigKeys.includeComments, false, 2 /* ConfigurationTarget.USER */);
        });
    }
}
export class DisableHighlightingInStringsAction extends EditorAction {
    constructor() {
        super({
            id: DisableHighlightingOfAmbiguousCharactersAction.ID,
            label: nls.localize('action.unicodeHighlight.disableHighlightingInStrings', 'Disable highlighting of characters in strings'),
            alias: 'Disable highlighting of characters in strings',
            precondition: undefined
        });
        this.shortLabel = nls.localize('unicodeHighlight.disableHighlightingInStrings.shortLabel', 'Disable Highlight In Strings');
    }
    run(accessor, editor, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const configurationService = accessor === null || accessor === void 0 ? void 0 : accessor.get(IConfigurationService);
            if (configurationService) {
                this.runAction(configurationService);
            }
        });
    }
    runAction(configurationService) {
        return __awaiter(this, void 0, void 0, function* () {
            yield configurationService.updateValue(unicodeHighlightConfigKeys.includeStrings, false, 2 /* ConfigurationTarget.USER */);
        });
    }
}
class DisableHighlightingOfAmbiguousCharactersAction extends EditorAction {
    constructor() {
        super({
            id: DisableHighlightingOfAmbiguousCharactersAction.ID,
            label: nls.localize('action.unicodeHighlight.disableHighlightingOfAmbiguousCharacters', 'Disable highlighting of ambiguous characters'),
            alias: 'Disable highlighting of ambiguous characters',
            precondition: undefined
        });
        this.shortLabel = nls.localize('unicodeHighlight.disableHighlightingOfAmbiguousCharacters.shortLabel', 'Disable Ambiguous Highlight');
    }
    run(accessor, editor, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const configurationService = accessor === null || accessor === void 0 ? void 0 : accessor.get(IConfigurationService);
            if (configurationService) {
                this.runAction(configurationService);
            }
        });
    }
    runAction(configurationService) {
        return __awaiter(this, void 0, void 0, function* () {
            yield configurationService.updateValue(unicodeHighlightConfigKeys.ambiguousCharacters, false, 2 /* ConfigurationTarget.USER */);
        });
    }
}
DisableHighlightingOfAmbiguousCharactersAction.ID = 'editor.action.unicodeHighlight.disableHighlightingOfAmbiguousCharacters';
export { DisableHighlightingOfAmbiguousCharactersAction };
class DisableHighlightingOfInvisibleCharactersAction extends EditorAction {
    constructor() {
        super({
            id: DisableHighlightingOfInvisibleCharactersAction.ID,
            label: nls.localize('action.unicodeHighlight.disableHighlightingOfInvisibleCharacters', 'Disable highlighting of invisible characters'),
            alias: 'Disable highlighting of invisible characters',
            precondition: undefined
        });
        this.shortLabel = nls.localize('unicodeHighlight.disableHighlightingOfInvisibleCharacters.shortLabel', 'Disable Invisible Highlight');
    }
    run(accessor, editor, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const configurationService = accessor === null || accessor === void 0 ? void 0 : accessor.get(IConfigurationService);
            if (configurationService) {
                this.runAction(configurationService);
            }
        });
    }
    runAction(configurationService) {
        return __awaiter(this, void 0, void 0, function* () {
            yield configurationService.updateValue(unicodeHighlightConfigKeys.invisibleCharacters, false, 2 /* ConfigurationTarget.USER */);
        });
    }
}
DisableHighlightingOfInvisibleCharactersAction.ID = 'editor.action.unicodeHighlight.disableHighlightingOfInvisibleCharacters';
export { DisableHighlightingOfInvisibleCharactersAction };
class DisableHighlightingOfNonBasicAsciiCharactersAction extends EditorAction {
    constructor() {
        super({
            id: DisableHighlightingOfNonBasicAsciiCharactersAction.ID,
            label: nls.localize('action.unicodeHighlight.disableHighlightingOfNonBasicAsciiCharacters', 'Disable highlighting of non basic ASCII characters'),
            alias: 'Disable highlighting of non basic ASCII characters',
            precondition: undefined
        });
        this.shortLabel = nls.localize('unicodeHighlight.disableHighlightingOfNonBasicAsciiCharacters.shortLabel', 'Disable Non ASCII Highlight');
    }
    run(accessor, editor, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const configurationService = accessor === null || accessor === void 0 ? void 0 : accessor.get(IConfigurationService);
            if (configurationService) {
                this.runAction(configurationService);
            }
        });
    }
    runAction(configurationService) {
        return __awaiter(this, void 0, void 0, function* () {
            yield configurationService.updateValue(unicodeHighlightConfigKeys.nonBasicASCII, false, 2 /* ConfigurationTarget.USER */);
        });
    }
}
DisableHighlightingOfNonBasicAsciiCharactersAction.ID = 'editor.action.unicodeHighlight.disableHighlightingOfNonBasicAsciiCharacters';
export { DisableHighlightingOfNonBasicAsciiCharactersAction };
class ShowExcludeOptions extends EditorAction {
    constructor() {
        super({
            id: ShowExcludeOptions.ID,
            label: nls.localize('action.unicodeHighlight.showExcludeOptions', "Show Exclude Options"),
            alias: 'Show Exclude Options',
            precondition: undefined
        });
    }
    run(accessor, editor, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codePoint, reason, inString, inComment } = args;
            const char = String.fromCodePoint(codePoint);
            const quickPickService = accessor.get(IQuickInputService);
            const configurationService = accessor.get(IConfigurationService);
            function getExcludeCharFromBeingHighlightedLabel(codePoint) {
                if (InvisibleCharacters.isInvisibleCharacter(codePoint)) {
                    return nls.localize('unicodeHighlight.excludeInvisibleCharFromBeingHighlighted', 'Exclude {0} (invisible character) from being highlighted', codePointToHex(codePoint));
                }
                return nls.localize('unicodeHighlight.excludeCharFromBeingHighlighted', 'Exclude {0} from being highlighted', `${codePointToHex(codePoint)} "${char}"`);
            }
            const options = [];
            if (reason.kind === 0 /* UnicodeHighlighterReasonKind.Ambiguous */) {
                for (const locale of reason.notAmbiguousInLocales) {
                    options.push({
                        label: nls.localize("unicodeHighlight.allowCommonCharactersInLanguage", "Allow unicode characters that are more common in the language \"{0}\".", locale),
                        run: () => __awaiter(this, void 0, void 0, function* () {
                            excludeLocaleFromBeingHighlighted(configurationService, [locale]);
                        }),
                    });
                }
            }
            options.push({
                label: getExcludeCharFromBeingHighlightedLabel(codePoint),
                run: () => excludeCharFromBeingHighlighted(configurationService, [codePoint])
            });
            if (inComment) {
                const action = new DisableHighlightingInCommentsAction();
                options.push({ label: action.label, run: () => __awaiter(this, void 0, void 0, function* () { return action.runAction(configurationService); }) });
            }
            else if (inString) {
                const action = new DisableHighlightingInStringsAction();
                options.push({ label: action.label, run: () => __awaiter(this, void 0, void 0, function* () { return action.runAction(configurationService); }) });
            }
            if (reason.kind === 0 /* UnicodeHighlighterReasonKind.Ambiguous */) {
                const action = new DisableHighlightingOfAmbiguousCharactersAction();
                options.push({ label: action.label, run: () => __awaiter(this, void 0, void 0, function* () { return action.runAction(configurationService); }) });
            }
            else if (reason.kind === 1 /* UnicodeHighlighterReasonKind.Invisible */) {
                const action = new DisableHighlightingOfInvisibleCharactersAction();
                options.push({ label: action.label, run: () => __awaiter(this, void 0, void 0, function* () { return action.runAction(configurationService); }) });
            }
            else if (reason.kind === 2 /* UnicodeHighlighterReasonKind.NonBasicAscii */) {
                const action = new DisableHighlightingOfNonBasicAsciiCharactersAction();
                options.push({ label: action.label, run: () => __awaiter(this, void 0, void 0, function* () { return action.runAction(configurationService); }) });
            }
            else {
                expectNever(reason);
            }
            const result = yield quickPickService.pick(options, { title: nls.localize('unicodeHighlight.configureUnicodeHighlightOptions', 'Configure Unicode Highlight Options') });
            if (result) {
                yield result.run();
            }
        });
    }
}
ShowExcludeOptions.ID = 'editor.action.unicodeHighlight.showExcludeOptions';
export { ShowExcludeOptions };
function excludeCharFromBeingHighlighted(configurationService, charCodes) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingValue = configurationService.getValue(unicodeHighlightConfigKeys.allowedCharacters);
        let value;
        if ((typeof existingValue === 'object') && existingValue) {
            value = existingValue;
        }
        else {
            value = {};
        }
        for (const charCode of charCodes) {
            value[String.fromCodePoint(charCode)] = true;
        }
        yield configurationService.updateValue(unicodeHighlightConfigKeys.allowedCharacters, value, 2 /* ConfigurationTarget.USER */);
    });
}
function excludeLocaleFromBeingHighlighted(configurationService, locales) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const existingValue = (_a = configurationService.inspect(unicodeHighlightConfigKeys.allowedLocales).user) === null || _a === void 0 ? void 0 : _a.value;
        let value;
        if ((typeof existingValue === 'object') && existingValue) {
            // Copy value, as the existing value is read only
            value = Object.assign({}, existingValue);
        }
        else {
            value = {};
        }
        for (const locale of locales) {
            value[locale] = true;
        }
        yield configurationService.updateValue(unicodeHighlightConfigKeys.allowedLocales, value, 2 /* ConfigurationTarget.USER */);
    });
}
function expectNever(value) {
    throw new Error(`Unexpected value: ${value}`);
}
registerEditorAction(DisableHighlightingOfAmbiguousCharactersAction);
registerEditorAction(DisableHighlightingOfInvisibleCharactersAction);
registerEditorAction(DisableHighlightingOfNonBasicAsciiCharactersAction);
registerEditorAction(ShowExcludeOptions);
registerEditorContribution(UnicodeHighlighter.ID, UnicodeHighlighter, 1 /* EditorContributionInstantiation.AfterFirstRender */);
HoverParticipantRegistry.register(UnicodeHighlighterHoverParticipant);
