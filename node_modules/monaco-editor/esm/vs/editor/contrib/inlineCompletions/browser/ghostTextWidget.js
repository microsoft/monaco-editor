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
import { createTrustedTypesPolicy } from '../../../../base/browser/trustedTypes.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, derived, observableFromEvent, observableSignalFromEvent, observableValue } from '../../../../base/common/observable.js';
import * as strings from '../../../../base/common/strings.js';
import './ghostText.css';
import { applyFontInfo } from '../../../browser/config/domFontInfo.js';
import { EditorFontLigatures } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { StringBuilder } from '../../../common/core/stringBuilder.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { InjectedTextCursorStops } from '../../../common/model.js';
import { LineTokens } from '../../../common/tokens/lineTokens.js';
import { LineDecoration } from '../../../common/viewLayout/lineDecorations.js';
import { RenderLineInput, renderViewLine } from '../../../common/viewLayout/viewLineRenderer.js';
import { GhostTextReplacement } from './ghostText.js';
import { ColumnRange, applyObservableDecorations } from './utils.js';
export let GhostTextWidget = class GhostTextWidget extends Disposable {
    constructor(editor, model, languageService) {
        super();
        this.editor = editor;
        this.model = model;
        this.languageService = languageService;
        this.isDisposed = observableValue('isDisposed', false);
        this.currentTextModel = observableFromEvent(this.editor.onDidChangeModel, () => this.editor.getModel());
        this.uiState = derived('uiState', reader => {
            if (this.isDisposed.read(reader)) {
                return undefined;
            }
            const textModel = this.currentTextModel.read(reader);
            if (textModel !== this.model.targetTextModel.read(reader)) {
                return undefined;
            }
            const ghostText = this.model.ghostText.read(reader);
            if (!ghostText) {
                return undefined;
            }
            const replacedRange = ghostText instanceof GhostTextReplacement ? ghostText.columnRange : undefined;
            const inlineTexts = [];
            const additionalLines = [];
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
            const textBufferLine = textModel.getLineContent(ghostText.lineNumber);
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
            const hiddenRange = hiddenTextStartColumn !== undefined ? new ColumnRange(hiddenTextStartColumn, textBufferLine.length + 1) : undefined;
            return {
                replacedRange,
                inlineTexts,
                additionalLines,
                hiddenRange,
                lineNumber: ghostText.lineNumber,
                additionalReservedLineCount: this.model.minReservedLineCount.read(reader),
                targetTextModel: textModel,
            };
        });
        this.decorations = derived('decorations', reader => {
            const uiState = this.uiState.read(reader);
            if (!uiState) {
                return [];
            }
            const decorations = [];
            if (uiState.replacedRange) {
                decorations.push({
                    range: uiState.replacedRange.toRange(uiState.lineNumber),
                    options: { inlineClassName: 'inline-completion-text-to-replace', description: 'GhostTextReplacement' }
                });
            }
            if (uiState.hiddenRange) {
                decorations.push({
                    range: uiState.hiddenRange.toRange(uiState.lineNumber),
                    options: { inlineClassName: 'ghost-text-hidden', description: 'ghost-text-hidden', }
                });
            }
            for (const p of uiState.inlineTexts) {
                decorations.push({
                    range: Range.fromPositions(new Position(uiState.lineNumber, p.column)),
                    options: {
                        description: 'ghost-text',
                        after: { content: p.text, inlineClassName: p.preview ? 'ghost-text-decoration-preview' : 'ghost-text-decoration', cursorStops: InjectedTextCursorStops.Left },
                        showIfCollapsed: true,
                    }
                });
            }
            return decorations;
        });
        this.additionalLinesWidget = this._register(new AdditionalLinesWidget(this.editor, this.languageService.languageIdCodec, derived('lines', (reader) => {
            const uiState = this.uiState.read(reader);
            return uiState ? {
                lineNumber: uiState.lineNumber,
                additionalLines: uiState.additionalLines,
                minReservedLineCount: uiState.additionalReservedLineCount,
                targetTextModel: uiState.targetTextModel,
            } : undefined;
        })));
        this._register(toDisposable(() => { this.isDisposed.set(true, undefined); }));
        this._register(applyObservableDecorations(this.editor, this.decorations));
    }
    ownsViewZone(viewZoneId) {
        return this.additionalLinesWidget.viewZoneId === viewZoneId;
    }
};
GhostTextWidget = __decorate([
    __param(2, ILanguageService)
], GhostTextWidget);
class AdditionalLinesWidget extends Disposable {
    get viewZoneId() { return this._viewZoneId; }
    constructor(editor, languageIdCodec, lines) {
        super();
        this.editor = editor;
        this.languageIdCodec = languageIdCodec;
        this.lines = lines;
        this._viewZoneId = undefined;
        this.editorOptionsChanged = observableSignalFromEvent('editorOptionChanged', Event.filter(this.editor.onDidChangeConfiguration, e => e.hasChanged(31 /* EditorOption.disableMonospaceOptimizations */)
            || e.hasChanged(114 /* EditorOption.stopRenderingLineAfter */)
            || e.hasChanged(96 /* EditorOption.renderWhitespace */)
            || e.hasChanged(91 /* EditorOption.renderControlCharacters */)
            || e.hasChanged(49 /* EditorOption.fontLigatures */)
            || e.hasChanged(48 /* EditorOption.fontInfo */)
            || e.hasChanged(64 /* EditorOption.lineHeight */)));
        this._register(autorun('update view zone', reader => {
            const lines = this.lines.read(reader);
            this.editorOptionsChanged.read(reader);
            if (lines) {
                this.updateLines(lines.lineNumber, lines.additionalLines, lines.minReservedLineCount);
            }
            else {
                this.clear();
            }
        }));
    }
    dispose() {
        super.dispose();
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
    const stopRenderingLineAfter = opts.get(114 /* EditorOption.stopRenderingLineAfter */);
    // To avoid visual confusion, we don't want to render visible whitespace
    const renderWhitespace = 'none';
    const renderControlCharacters = opts.get(91 /* EditorOption.renderControlCharacters */);
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
const ttPolicy = createTrustedTypesPolicy('editorGhostText', { createHTML: value => value });
