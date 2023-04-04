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
var _a;
import * as dom from '../../../../base/browser/dom.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import * as strings from '../../../../base/common/strings.js';
import './ghostText.css';
import { applyFontInfo } from '../../../browser/config/domFontInfo.js';
import { EditorFontLigatures } from '../../../common/config/editorOptions.js';
import { LineTokens } from '../../../common/tokens/lineTokens.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { StringBuilder } from '../../../common/core/stringBuilder.js';
import { InjectedTextCursorStops } from '../../../common/model.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { LineDecoration } from '../../../common/viewLayout/lineDecorations.js';
import { RenderLineInput, renderViewLine } from '../../../common/viewLayout/viewLineRenderer.js';
import { GhostTextReplacement } from './ghostText.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { AudioCue, IAudioCueService } from '../../../../platform/audioCues/browser/audioCueService.js';
const ttPolicy = (_a = window.trustedTypes) === null || _a === void 0 ? void 0 : _a.createPolicy('editorGhostText', { createHTML: value => value });
let GhostTextWidget = class GhostTextWidget extends Disposable {
    constructor(editor, model, instantiationService, languageService, audioCueService) {
        super();
        this.editor = editor;
        this.model = model;
        this.instantiationService = instantiationService;
        this.languageService = languageService;
        this.audioCueService = audioCueService;
        this.disposed = false;
        this.partsWidget = this._register(this.instantiationService.createInstance(DecorationsWidget, this.editor));
        this.additionalLinesWidget = this._register(new AdditionalLinesWidget(this.editor, this.languageService.languageIdCodec));
        this.viewMoreContentWidget = undefined;
        this.replacementDecoration = this._register(new DisposableDecorations(this.editor));
        this._register(this.editor.onDidChangeConfiguration((e) => {
            if (e.hasChanged(31 /* EditorOption.disableMonospaceOptimizations */)
                || e.hasChanged(112 /* EditorOption.stopRenderingLineAfter */)
                || e.hasChanged(94 /* EditorOption.renderWhitespace */)
                || e.hasChanged(89 /* EditorOption.renderControlCharacters */)
                || e.hasChanged(49 /* EditorOption.fontLigatures */)
                || e.hasChanged(48 /* EditorOption.fontInfo */)
                || e.hasChanged(64 /* EditorOption.lineHeight */)) {
                this.update();
            }
        }));
        this._register(toDisposable(() => {
            var _a;
            this.disposed = true;
            this.update();
            (_a = this.viewMoreContentWidget) === null || _a === void 0 ? void 0 : _a.dispose();
            this.viewMoreContentWidget = undefined;
        }));
        this._register(model.onDidChange(() => this.update(true)));
        this.update(true);
    }
    shouldShowHoverAtViewZone(viewZoneId) {
        return (this.additionalLinesWidget.viewZoneId === viewZoneId);
    }
    update(notifyUser) {
        var _a;
        const ghostText = this.model.ghostText;
        if (!this.editor.hasModel() || !ghostText || this.disposed) {
            this.partsWidget.clear();
            this.additionalLinesWidget.clear();
            this.replacementDecoration.clear();
            return;
        }
        const inlineTexts = new Array();
        const additionalLines = new Array();
        function addToAdditionalLines(lines, className) {
            if (additionalLines.length > 0) {
                const lastLine = additionalLines[additionalLines.length - 1];
                if (className) {
                    lastLine.decorations.push(new LineDecoration(lastLine.content.length + 1, lastLine.content.length + 1 + lines[0].length, className, 0 /* InlineDecorationType.Regular */));
                }
                lastLine.content += lines[0];
                lines = lines.slice(1);
            }
            for (const line of lines) {
                additionalLines.push({
                    content: line,
                    decorations: className ? [new LineDecoration(1, line.length + 1, className, 0 /* InlineDecorationType.Regular */)] : []
                });
            }
        }
        if (ghostText instanceof GhostTextReplacement) {
            this.replacementDecoration.setDecorations([
                {
                    range: new Range(ghostText.lineNumber, ghostText.columnStart, ghostText.lineNumber, ghostText.columnStart + ghostText.length),
                    options: {
                        inlineClassName: 'inline-completion-text-to-replace',
                        description: 'GhostTextReplacement'
                    }
                },
            ]);
        }
        else {
            this.replacementDecoration.setDecorations([]);
        }
        const textBufferLine = this.editor.getModel().getLineContent(ghostText.lineNumber);
        let hiddenTextStartColumn = undefined;
        let lastIdx = 0;
        for (const part of ghostText.parts) {
            let lines = part.lines;
            if (hiddenTextStartColumn === undefined) {
                inlineTexts.push({
                    column: part.column,
                    text: lines[0],
                    preview: part.preview,
                });
                lines = lines.slice(1);
            }
            else {
                addToAdditionalLines([textBufferLine.substring(lastIdx, part.column - 1)], undefined);
            }
            if (lines.length > 0) {
                addToAdditionalLines(lines, 'ghost-text');
                if (hiddenTextStartColumn === undefined && part.column <= textBufferLine.length) {
                    hiddenTextStartColumn = part.column;
                }
            }
            lastIdx = part.column - 1;
        }
        if (hiddenTextStartColumn !== undefined) {
            addToAdditionalLines([textBufferLine.substring(lastIdx)], undefined);
        }
        this.partsWidget.setParts(ghostText.lineNumber, inlineTexts, hiddenTextStartColumn !== undefined ? { column: hiddenTextStartColumn, length: textBufferLine.length + 1 - hiddenTextStartColumn } : undefined);
        this.additionalLinesWidget.updateLines(ghostText.lineNumber, additionalLines, ghostText.additionalReservedLineCount);
        if (notifyUser) {
            this.audioCueService.playAudioCue(AudioCue.inlineSuggestion).then(() => {
                var _a;
                if (this.editor.getOption(6 /* EditorOption.screenReaderAnnounceInlineSuggestion */)) {
                    const lineText = (_a = this.editor.getModel()) === null || _a === void 0 ? void 0 : _a.getLineContent(ghostText.lineNumber);
                    if (lineText) {
                        alert(ghostText.renderForScreenReader(lineText));
                    }
                }
            });
        }
        if (0 < 0) {
            // Not supported at the moment, condition is always false.
            this.viewMoreContentWidget = this.renderViewMoreLines(new Position(ghostText.lineNumber, this.editor.getModel().getLineMaxColumn(ghostText.lineNumber)), '', 0);
        }
        else {
            (_a = this.viewMoreContentWidget) === null || _a === void 0 ? void 0 : _a.dispose();
            this.viewMoreContentWidget = undefined;
        }
    }
    renderViewMoreLines(position, firstLineText, remainingLinesLength) {
        const fontInfo = this.editor.getOption(48 /* EditorOption.fontInfo */);
        const domNode = document.createElement('div');
        domNode.className = 'suggest-preview-additional-widget';
        applyFontInfo(domNode, fontInfo);
        const spacer = document.createElement('span');
        spacer.className = 'content-spacer';
        spacer.append(firstLineText);
        domNode.append(spacer);
        const newline = document.createElement('span');
        newline.className = 'content-newline suggest-preview-text';
        newline.append('⏎  ');
        domNode.append(newline);
        const disposableStore = new DisposableStore();
        const button = document.createElement('div');
        button.className = 'button suggest-preview-text';
        button.append(`+${remainingLinesLength} lines…`);
        disposableStore.add(dom.addStandardDisposableListener(button, 'mousedown', (e) => {
            var _a;
            (_a = this.model) === null || _a === void 0 ? void 0 : _a.setExpanded(true);
            e.preventDefault();
            this.editor.focus();
        }));
        domNode.append(button);
        return new ViewMoreLinesContentWidget(this.editor, position, domNode, disposableStore);
    }
};
GhostTextWidget = __decorate([
    __param(2, IInstantiationService),
    __param(3, ILanguageService),
    __param(4, IAudioCueService)
], GhostTextWidget);
export { GhostTextWidget };
class DisposableDecorations {
    constructor(editor) {
        this.editor = editor;
        this.decorationIds = [];
    }
    setDecorations(decorations) {
        // Using change decorations ensures that we update the id's before some event handler is called.
        this.editor.changeDecorations(accessor => {
            this.decorationIds = accessor.deltaDecorations(this.decorationIds, decorations);
        });
    }
    clear() {
        this.setDecorations([]);
    }
    dispose() {
        this.clear();
    }
}
class DecorationsWidget {
    constructor(editor) {
        this.editor = editor;
        this.decorationIds = [];
    }
    dispose() {
        this.clear();
    }
    clear() {
        // Using change decorations ensures that we update the id's before some event handler is called.
        this.editor.changeDecorations(accessor => {
            this.decorationIds = accessor.deltaDecorations(this.decorationIds, []);
        });
    }
    setParts(lineNumber, parts, hiddenText) {
        const textModel = this.editor.getModel();
        if (!textModel) {
            return;
        }
        const hiddenTextDecorations = new Array();
        if (hiddenText) {
            hiddenTextDecorations.push({
                range: Range.fromPositions(new Position(lineNumber, hiddenText.column), new Position(lineNumber, hiddenText.column + hiddenText.length)),
                options: {
                    inlineClassName: 'ghost-text-hidden',
                    description: 'ghost-text-hidden',
                }
            });
        }
        // Using change decorations ensures that we update the id's before some event handler is called.
        this.editor.changeDecorations(accessor => {
            this.decorationIds = accessor.deltaDecorations(this.decorationIds, parts.map(p => {
                return ({
                    range: Range.fromPositions(new Position(lineNumber, p.column)),
                    options: {
                        description: 'ghost-text',
                        after: { content: p.text, inlineClassName: p.preview ? 'ghost-text-decoration-preview' : 'ghost-text-decoration', cursorStops: InjectedTextCursorStops.Left },
                        showIfCollapsed: true,
                    }
                });
            }).concat(hiddenTextDecorations));
        });
    }
}
class AdditionalLinesWidget {
    get viewZoneId() { return this._viewZoneId; }
    constructor(editor, languageIdCodec) {
        this.editor = editor;
        this.languageIdCodec = languageIdCodec;
        this._viewZoneId = undefined;
    }
    dispose() {
        this.clear();
    }
    clear() {
        this.editor.changeViewZones((changeAccessor) => {
            if (this._viewZoneId) {
                changeAccessor.removeZone(this._viewZoneId);
                this._viewZoneId = undefined;
            }
        });
    }
    updateLines(lineNumber, additionalLines, minReservedLineCount) {
        const textModel = this.editor.getModel();
        if (!textModel) {
            return;
        }
        const { tabSize } = textModel.getOptions();
        this.editor.changeViewZones((changeAccessor) => {
            if (this._viewZoneId) {
                changeAccessor.removeZone(this._viewZoneId);
                this._viewZoneId = undefined;
            }
            const heightInLines = Math.max(additionalLines.length, minReservedLineCount);
            if (heightInLines > 0) {
                const domNode = document.createElement('div');
                renderLines(domNode, tabSize, additionalLines, this.editor.getOptions(), this.languageIdCodec);
                this._viewZoneId = changeAccessor.addZone({
                    afterLineNumber: lineNumber,
                    heightInLines: heightInLines,
                    domNode,
                    afterColumnAffinity: 1 /* PositionAffinity.Right */
                });
            }
        });
    }
}
function renderLines(domNode, tabSize, lines, opts, languageIdCodec) {
    const disableMonospaceOptimizations = opts.get(31 /* EditorOption.disableMonospaceOptimizations */);
    const stopRenderingLineAfter = opts.get(112 /* EditorOption.stopRenderingLineAfter */);
    // To avoid visual confusion, we don't want to render visible whitespace
    const renderWhitespace = 'none';
    const renderControlCharacters = opts.get(89 /* EditorOption.renderControlCharacters */);
    const fontLigatures = opts.get(49 /* EditorOption.fontLigatures */);
    const fontInfo = opts.get(48 /* EditorOption.fontInfo */);
    const lineHeight = opts.get(64 /* EditorOption.lineHeight */);
    const sb = new StringBuilder(10000);
    sb.appendString('<div class="suggest-preview-text">');
    for (let i = 0, len = lines.length; i < len; i++) {
        const lineData = lines[i];
        const line = lineData.content;
        sb.appendString('<div class="view-line');
        sb.appendString('" style="top:');
        sb.appendString(String(i * lineHeight));
        sb.appendString('px;width:1000000px;">');
        const isBasicASCII = strings.isBasicASCII(line);
        const containsRTL = strings.containsRTL(line);
        const lineTokens = LineTokens.createEmpty(line, languageIdCodec);
        renderViewLine(new RenderLineInput((fontInfo.isMonospace && !disableMonospaceOptimizations), fontInfo.canUseHalfwidthRightwardsArrow, line, false, isBasicASCII, containsRTL, 0, lineTokens, lineData.decorations, tabSize, 0, fontInfo.spaceWidth, fontInfo.middotWidth, fontInfo.wsmiddotWidth, stopRenderingLineAfter, renderWhitespace, renderControlCharacters, fontLigatures !== EditorFontLigatures.OFF, null), sb);
        sb.appendString('</div>');
    }
    sb.appendString('</div>');
    applyFontInfo(domNode, fontInfo);
    const html = sb.build();
    const trustedhtml = ttPolicy ? ttPolicy.createHTML(html) : html;
    domNode.innerHTML = trustedhtml;
}
class ViewMoreLinesContentWidget extends Disposable {
    constructor(editor, position, domNode, disposableStore) {
        super();
        this.editor = editor;
        this.position = position;
        this.domNode = domNode;
        this.allowEditorOverflow = false;
        this.suppressMouseDown = false;
        this._register(disposableStore);
        this._register(toDisposable(() => {
            this.editor.removeContentWidget(this);
        }));
        this.editor.addContentWidget(this);
    }
    getId() {
        return 'editor.widget.viewMoreLinesWidget';
    }
    getDomNode() {
        return this.domNode;
    }
    getPosition() {
        return {
            position: this.position,
            preference: [0 /* ContentWidgetPositionPreference.EXACT */]
        };
    }
}
