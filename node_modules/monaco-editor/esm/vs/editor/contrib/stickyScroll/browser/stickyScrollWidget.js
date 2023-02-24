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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import * as dom from '../../../../base/browser/dom.js';
import { StringBuilder } from '../../../common/core/stringBuilder.js';
import { RenderLineInput, renderViewLine } from '../../../common/viewLayout/viewLineRenderer.js';
import { LineDecoration } from '../../../common/viewLayout/lineDecorations.js';
import { Position } from '../../../common/core/position.js';
import { ClickLinkGesture } from '../../gotoSymbol/browser/link/clickLinkGesture.js';
import { getDefinitionsAtPosition } from '../../gotoSymbol/browser/goToSymbol.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { goToDefinitionWithLocation } from '../../inlayHints/browser/inlayHintsLocations.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Range } from '../../../common/core/range.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import './stickyScroll.css';
import { EmbeddedCodeEditorWidget } from '../../../browser/widget/embeddedCodeEditorWidget.js';
export class StickyScrollWidgetState {
    constructor(lineNumbers, lastLineRelativePosition) {
        this.lineNumbers = lineNumbers;
        this.lastLineRelativePosition = lastLineRelativePosition;
    }
}
const _ttPolicy = (_a = window.trustedTypes) === null || _a === void 0 ? void 0 : _a.createPolicy('stickyScrollViewLayer', { createHTML: value => value });
let StickyScrollWidget = class StickyScrollWidget extends Disposable {
    constructor(_editor, _languageFeatureService, _instaService) {
        super();
        this._editor = _editor;
        this._languageFeatureService = _languageFeatureService;
        this._instaService = _instaService;
        this._rootDomNode = document.createElement('div');
        this._disposableStore = this._register(new DisposableStore());
        this._lineNumbers = [];
        this._lastLineRelativePosition = 0;
        this._hoverOnLine = -1;
        this._hoverOnColumn = -1;
        this._candidateDefinitionsLength = -1;
        this._layoutInfo = this._editor.getLayoutInfo();
        this._rootDomNode = document.createElement('div');
        this._rootDomNode.className = 'sticky-widget';
        this._rootDomNode.classList.toggle('peek', _editor instanceof EmbeddedCodeEditorWidget);
        this._rootDomNode.style.width = `${this._layoutInfo.width - this._layoutInfo.minimap.minimapCanvasOuterWidth - this._layoutInfo.verticalScrollbarWidth}px`;
        this._register(this._updateLinkGesture());
    }
    _updateLinkGesture() {
        const linkGestureStore = new DisposableStore();
        const sessionStore = new DisposableStore();
        linkGestureStore.add(sessionStore);
        const gesture = new ClickLinkGesture(this._editor, true);
        linkGestureStore.add(gesture);
        linkGestureStore.add(gesture.onMouseMoveOrRelevantKeyDown(([mouseEvent, _keyboardEvent]) => {
            if (!this._editor.hasModel() || !mouseEvent.hasTriggerModifier) {
                sessionStore.clear();
                return;
            }
            const targetMouseEvent = mouseEvent.target;
            if (targetMouseEvent.detail === this.getId() && targetMouseEvent.element.innerText === targetMouseEvent.element.innerHTML) {
                const text = targetMouseEvent.element.innerText;
                if (this._hoverOnColumn === -1) {
                    return;
                }
                const lineNumber = this._hoverOnLine;
                const column = this._hoverOnColumn;
                const stickyPositionProjectedOnEditor = new Range(lineNumber, column, lineNumber, column + text.length);
                if (!stickyPositionProjectedOnEditor.equalsRange(this._stickyRangeProjectedOnEditor)) {
                    this._stickyRangeProjectedOnEditor = stickyPositionProjectedOnEditor;
                    sessionStore.clear();
                }
                else if (targetMouseEvent.element.style.textDecoration === 'underline') {
                    return;
                }
                const cancellationToken = new CancellationTokenSource();
                sessionStore.add(toDisposable(() => cancellationToken.dispose(true)));
                let currentHTMLChild;
                getDefinitionsAtPosition(this._languageFeatureService.definitionProvider, this._editor.getModel(), new Position(lineNumber, column + 1), cancellationToken.token).then((candidateDefinitions => {
                    if (cancellationToken.token.isCancellationRequested) {
                        return;
                    }
                    if (candidateDefinitions.length !== 0) {
                        this._candidateDefinitionsLength = candidateDefinitions.length;
                        const childHTML = targetMouseEvent.element;
                        if (currentHTMLChild !== childHTML) {
                            sessionStore.clear();
                            currentHTMLChild = childHTML;
                            currentHTMLChild.style.textDecoration = 'underline';
                            sessionStore.add(toDisposable(() => {
                                currentHTMLChild.style.textDecoration = 'none';
                            }));
                        }
                        else if (!currentHTMLChild) {
                            currentHTMLChild = childHTML;
                            currentHTMLChild.style.textDecoration = 'underline';
                            sessionStore.add(toDisposable(() => {
                                currentHTMLChild.style.textDecoration = 'none';
                            }));
                        }
                    }
                    else {
                        sessionStore.clear();
                    }
                }));
            }
            else {
                sessionStore.clear();
            }
        }));
        linkGestureStore.add(gesture.onCancel(() => {
            sessionStore.clear();
        }));
        linkGestureStore.add(gesture.onExecute((e) => __awaiter(this, void 0, void 0, function* () {
            if (e.target.detail !== this.getId()) {
                return;
            }
            if (e.hasTriggerModifier) {
                // Control click
                if (this._candidateDefinitionsLength > 1) {
                    this._editor.revealPosition({ lineNumber: this._hoverOnLine, column: 1 });
                }
                this._instaService.invokeFunction(goToDefinitionWithLocation, e, this._editor, { uri: this._editor.getModel().uri, range: this._stickyRangeProjectedOnEditor });
            }
            else if (!e.isRightClick) {
                // Normal click
                const position = { lineNumber: this._hoverOnLine, column: this._hoverOnColumn };
                this._editor.revealPosition(position);
                this._editor.setSelection(Range.fromPositions(position));
                this._editor.focus();
            }
        })));
        return linkGestureStore;
    }
    getCurrentLines() {
        return this._lineNumbers;
    }
    setState(state) {
        this._disposableStore.clear();
        this._lineNumbers.length = 0;
        dom.clearNode(this._rootDomNode);
        this._lastLineRelativePosition = state.lastLineRelativePosition;
        this._lineNumbers = state.lineNumbers;
        this._renderRootNode();
    }
    _renderChildNode(index, line) {
        const child = document.createElement('div');
        const viewModel = this._editor._getViewModel();
        const viewLineNumber = viewModel.coordinatesConverter.convertModelPositionToViewPosition(new Position(line, 1)).lineNumber;
        const lineRenderingData = viewModel.getViewLineRenderingData(viewLineNumber);
        const layoutInfo = this._editor.getLayoutInfo();
        const width = layoutInfo.width - layoutInfo.minimap.minimapCanvasOuterWidth - layoutInfo.verticalScrollbarWidth;
        const minimapSide = this._editor.getOption(69 /* EditorOption.minimap */).side;
        const lineHeight = this._editor.getOption(63 /* EditorOption.lineHeight */);
        const lineNumberOption = this._editor.getOption(64 /* EditorOption.lineNumbers */);
        let actualInlineDecorations;
        try {
            actualInlineDecorations = LineDecoration.filter(lineRenderingData.inlineDecorations, viewLineNumber, lineRenderingData.minColumn, lineRenderingData.maxColumn);
        }
        catch (err) {
            actualInlineDecorations = [];
        }
        const renderLineInput = new RenderLineInput(true, true, lineRenderingData.content, lineRenderingData.continuesWithWrappedLine, lineRenderingData.isBasicASCII, lineRenderingData.containsRTL, 0, lineRenderingData.tokens, actualInlineDecorations, lineRenderingData.tabSize, lineRenderingData.startVisibleColumn, 1, 1, 1, 500, 'none', true, true, null);
        const sb = new StringBuilder(2000);
        renderViewLine(renderLineInput, sb);
        let newLine;
        if (_ttPolicy) {
            newLine = _ttPolicy.createHTML(sb.build());
        }
        else {
            newLine = sb.build();
        }
        const lineHTMLNode = document.createElement('span');
        lineHTMLNode.className = 'sticky-line';
        lineHTMLNode.classList.add(`stickyLine${line}`);
        lineHTMLNode.style.lineHeight = `${lineHeight}px`;
        lineHTMLNode.innerHTML = newLine;
        const lineNumberHTMLNode = document.createElement('span');
        lineNumberHTMLNode.className = 'sticky-line';
        lineNumberHTMLNode.style.lineHeight = `${lineHeight}px`;
        if (minimapSide === 'left') {
            lineNumberHTMLNode.style.width = `${layoutInfo.contentLeft - layoutInfo.minimap.minimapCanvasOuterWidth}px`;
        }
        else if (minimapSide === 'right') {
            lineNumberHTMLNode.style.width = `${layoutInfo.contentLeft}px`;
        }
        const innerLineNumberHTML = document.createElement('span');
        if (lineNumberOption.renderType === 1 /* RenderLineNumbersType.On */ || lineNumberOption.renderType === 3 /* RenderLineNumbersType.Interval */ && line % 10 === 0) {
            innerLineNumberHTML.innerText = line.toString();
        }
        else if (lineNumberOption.renderType === 2 /* RenderLineNumbersType.Relative */) {
            innerLineNumberHTML.innerText = Math.abs(line - this._editor.getPosition().lineNumber).toString();
        }
        innerLineNumberHTML.className = 'sticky-line-number';
        innerLineNumberHTML.style.lineHeight = `${lineHeight}px`;
        innerLineNumberHTML.style.width = `${layoutInfo.lineNumbersWidth}px`;
        if (minimapSide === 'left') {
            innerLineNumberHTML.style.paddingLeft = `${layoutInfo.lineNumbersLeft - layoutInfo.minimap.minimapCanvasOuterWidth}px`;
        }
        else if (minimapSide === 'right') {
            innerLineNumberHTML.style.paddingLeft = `${layoutInfo.lineNumbersLeft}px`;
        }
        lineNumberHTMLNode.appendChild(innerLineNumberHTML);
        this._editor.applyFontInfo(lineHTMLNode);
        this._editor.applyFontInfo(innerLineNumberHTML);
        child.appendChild(lineNumberHTMLNode);
        child.appendChild(lineHTMLNode);
        child.className = 'sticky-line-root';
        child.style.lineHeight = `${lineHeight}px`;
        child.style.width = `${width}px`;
        child.style.height = `${lineHeight}px`;
        child.style.zIndex = '0';
        // Special case for the last line of sticky scroll
        if (index === this._lineNumbers.length - 1) {
            child.style.position = 'relative';
            child.style.zIndex = '-1';
            child.style.top = this._lastLineRelativePosition + 'px';
        }
        this._disposableStore.add(dom.addDisposableListener(child, 'mouseover', (e) => {
            if (this._editor.hasModel()) {
                const mouseOverEvent = new StandardMouseEvent(e);
                const text = mouseOverEvent.target.innerText;
                this._hoverOnLine = line;
                // TODO: workaround to find the column index, perhaps need a more solid solution
                this._hoverOnColumn = this._editor.getModel().getLineContent(line).indexOf(text) + 1 || -1;
            }
        }));
        return child;
    }
    _renderRootNode() {
        if (!this._editor._getViewModel()) {
            return;
        }
        for (const [index, line] of this._lineNumbers.entries()) {
            this._rootDomNode.appendChild(this._renderChildNode(index, line));
        }
        const editorLineHeight = this._editor.getOption(63 /* EditorOption.lineHeight */);
        const widgetHeight = this._lineNumbers.length * editorLineHeight + this._lastLineRelativePosition;
        this._rootDomNode.style.display = widgetHeight > 0 ? 'block' : 'none';
        this._rootDomNode.style.height = widgetHeight.toString() + 'px';
        const minimapSide = this._editor.getOption(69 /* EditorOption.minimap */).side;
        if (minimapSide === 'left') {
            this._rootDomNode.style.marginLeft = this._editor.getLayoutInfo().minimap.minimapCanvasOuterWidth + 'px';
        }
    }
    getId() {
        return 'editor.contrib.stickyScrollWidget';
    }
    getDomNode() {
        return this._rootDomNode;
    }
    getPosition() {
        return {
            preference: null
        };
    }
};
StickyScrollWidget = __decorate([
    __param(1, ILanguageFeaturesService),
    __param(2, IInstantiationService)
], StickyScrollWidget);
export { StickyScrollWidget };
