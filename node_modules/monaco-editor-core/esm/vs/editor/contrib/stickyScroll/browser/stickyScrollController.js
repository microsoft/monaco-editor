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
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { StickyScrollWidget, StickyScrollWidgetState } from './stickyScrollWidget.js';
import { StickyLineCandidateProvider } from './stickyScrollProvider.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ClickLinkGesture } from '../../gotoSymbol/browser/link/clickLinkGesture.js';
import { Range } from '../../../common/core/range.js';
import { getDefinitionsAtPosition } from '../../gotoSymbol/browser/goToSymbol.js';
import { goToDefinitionWithLocation } from '../../inlayHints/browser/inlayHintsLocations.js';
import { Position } from '../../../common/core/position.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import * as dom from '../../../../base/browser/dom.js';
import { StickyRange } from './stickyScrollElement.js';
let StickyScrollController = class StickyScrollController extends Disposable {
    constructor(_editor, _contextMenuService, _languageFeaturesService, _instaService, _languageConfigurationService, _languageFeatureDebounceService, _contextKeyService) {
        super();
        this._editor = _editor;
        this._contextMenuService = _contextMenuService;
        this._languageFeaturesService = _languageFeaturesService;
        this._instaService = _instaService;
        this._contextKeyService = _contextKeyService;
        this._sessionStore = new DisposableStore();
        this._maxStickyLines = Number.MAX_SAFE_INTEGER;
        this._candidateDefinitionsLength = -1;
        this._focusedStickyElementIndex = -1;
        this._enabled = false;
        this._focused = false;
        this._positionRevealed = false;
        this._onMouseDown = false;
        this._stickyScrollWidget = new StickyScrollWidget(this._editor);
        this._stickyLineCandidateProvider = new StickyLineCandidateProvider(this._editor, _languageFeaturesService, _languageConfigurationService);
        this._register(this._stickyScrollWidget);
        this._register(this._stickyLineCandidateProvider);
        this._widgetState = new StickyScrollWidgetState([], 0);
        this._readConfiguration();
        this._register(this._editor.onDidChangeConfiguration(e => {
            if (e.hasChanged(110 /* EditorOption.stickyScroll */)) {
                this._readConfiguration();
            }
        }));
        this._register(dom.addDisposableListener(this._stickyScrollWidget.getDomNode(), dom.EventType.CONTEXT_MENU, (event) => __awaiter(this, void 0, void 0, function* () {
            this._onContextMenu(event);
        })));
        this._stickyScrollFocusedContextKey = EditorContextKeys.stickyScrollFocused.bindTo(this._contextKeyService);
        this._stickyScrollVisibleContextKey = EditorContextKeys.stickyScrollVisible.bindTo(this._contextKeyService);
        const focusTracker = this._register(dom.trackFocus(this._stickyScrollWidget.getDomNode()));
        this._register(focusTracker.onDidBlur(_ => {
            const height = this._stickyScrollWidget.getDomNode().clientHeight;
            // Suppose that the blurring is caused by scrolling, then keep the focus on the sticky scroll
            // This is determined by the fact that the height of the widget has become zero and there has been no position revealing
            if (this._positionRevealed === false && height === 0) {
                this._focusedStickyElementIndex = -1;
                this.focus();
            }
            // In all other casees, dispose the focus on the sticky scroll
            else {
                this._disposeFocusStickyScrollStore();
            }
        }));
        this._register(focusTracker.onDidFocus(_ => {
            this.focus();
        }));
        this._register(this._createClickLinkGesture());
        // Suppose that mouse down on the sticky scroll, then do not focus on the sticky scroll because this will be followed by the revealing of a position
        this._register(dom.addDisposableListener(this._stickyScrollWidget.getDomNode(), dom.EventType.MOUSE_DOWN, (e) => {
            this._onMouseDown = true;
        }));
    }
    static get(editor) {
        return editor.getContribution(StickyScrollController.ID);
    }
    _disposeFocusStickyScrollStore() {
        var _a;
        this._stickyScrollFocusedContextKey.set(false);
        (_a = this._focusDisposableStore) === null || _a === void 0 ? void 0 : _a.dispose();
        this._focused = false;
        this._positionRevealed = false;
        this._onMouseDown = false;
    }
    focus() {
        // If the mouse is down, do not focus on the sticky scroll
        if (this._onMouseDown) {
            this._onMouseDown = false;
            this._editor.focus();
            return;
        }
        const focusState = this._stickyScrollFocusedContextKey.get();
        if (focusState === true) {
            return;
        }
        this._focused = true;
        this._focusDisposableStore = new DisposableStore();
        this._stickyScrollFocusedContextKey.set(true);
        const rootNode = this._stickyScrollWidget.getDomNode();
        rootNode.lastElementChild.focus();
        this._stickyElements = rootNode.children;
        this._focusedStickyElementIndex = this._stickyScrollWidget.lineNumbers.length - 1;
    }
    focusNext() {
        if (this._focusedStickyElementIndex < this._stickyElements.length - 1) {
            this._focusNav(true);
        }
    }
    focusPrevious() {
        if (this._focusedStickyElementIndex > 0) {
            this._focusNav(false);
        }
    }
    selectEditor() {
        this._editor.focus();
    }
    // True is next, false is previous
    _focusNav(direction) {
        this._focusedStickyElementIndex = direction ? this._focusedStickyElementIndex + 1 : this._focusedStickyElementIndex - 1;
        this._stickyElements.item(this._focusedStickyElementIndex).focus();
    }
    goToFocused() {
        const lineNumbers = this._stickyScrollWidget.lineNumbers;
        this._disposeFocusStickyScrollStore();
        this._revealPosition({ lineNumber: lineNumbers[this._focusedStickyElementIndex], column: 1 });
    }
    _revealPosition(position) {
        this._positionRevealed = true;
        this._editor.revealPosition(position);
        this._editor.setSelection(Range.fromPositions(position));
        this._editor.focus();
    }
    _createClickLinkGesture() {
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
            if (targetMouseEvent.detail === this._stickyScrollWidget.getId()
                && targetMouseEvent.element.innerText === targetMouseEvent.element.innerHTML) {
                const text = targetMouseEvent.element.innerText;
                if (this._stickyScrollWidget.hoverOnColumn === -1) {
                    return;
                }
                const lineNumber = this._stickyScrollWidget.hoverOnLine;
                const column = this._stickyScrollWidget.hoverOnColumn;
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
                getDefinitionsAtPosition(this._languageFeaturesService.definitionProvider, this._editor.getModel(), new Position(lineNumber, column + 1), cancellationToken.token).then((candidateDefinitions => {
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
            if (e.target.detail !== this._stickyScrollWidget.getId()) {
                return;
            }
            if (e.hasTriggerModifier) {
                // Control click
                if (this._candidateDefinitionsLength > 1) {
                    if (this._focused) {
                        this._disposeFocusStickyScrollStore();
                    }
                    this._revealPosition({ lineNumber: this._stickyScrollWidget.hoverOnLine, column: 1 });
                }
                this._instaService.invokeFunction(goToDefinitionWithLocation, e, this._editor, { uri: this._editor.getModel().uri, range: this._stickyRangeProjectedOnEditor });
            }
            else if (!e.isRightClick) {
                // Normal click
                if (this._focused) {
                    this._disposeFocusStickyScrollStore();
                }
                this._revealPosition({ lineNumber: this._stickyScrollWidget.hoverOnLine, column: this._stickyScrollWidget.hoverOnColumn });
            }
        })));
        return linkGestureStore;
    }
    _onContextMenu(event) {
        this._contextMenuService.showContextMenu({
            menuId: MenuId.StickyScrollContext,
            getAnchor: () => event,
        });
    }
    _readConfiguration() {
        const options = this._editor.getOption(110 /* EditorOption.stickyScroll */);
        if (options.enabled === false) {
            this._editor.removeOverlayWidget(this._stickyScrollWidget);
            this._sessionStore.clear();
            this._enabled = false;
            return;
        }
        else if (options.enabled && !this._enabled) {
            // When sticky scroll was just enabled, add the listeners on the sticky scroll
            this._editor.addOverlayWidget(this._stickyScrollWidget);
            this._sessionStore.add(this._editor.onDidScrollChange(() => this._renderStickyScroll()));
            this._sessionStore.add(this._editor.onDidLayoutChange(() => this._onDidResize()));
            this._sessionStore.add(this._editor.onDidChangeModelTokens((e) => this._onTokensChange(e)));
            this._sessionStore.add(this._stickyLineCandidateProvider.onDidChangeStickyScroll(() => this._renderStickyScroll()));
            this._enabled = true;
        }
        const lineNumberOption = this._editor.getOption(65 /* EditorOption.lineNumbers */);
        if (lineNumberOption.renderType === 2 /* RenderLineNumbersType.Relative */) {
            this._sessionStore.add(this._editor.onDidChangeCursorPosition(() => this._renderStickyScroll()));
        }
    }
    _needsUpdate(event) {
        const stickyLineNumbers = this._stickyScrollWidget.getCurrentLines();
        for (const stickyLineNumber of stickyLineNumbers) {
            for (const range of event.ranges) {
                if (stickyLineNumber >= range.fromLineNumber && stickyLineNumber <= range.toLineNumber) {
                    return true;
                }
            }
        }
        return false;
    }
    _onTokensChange(event) {
        if (this._needsUpdate(event)) {
            this._renderStickyScroll();
        }
    }
    _onDidResize() {
        const layoutInfo = this._editor.getLayoutInfo();
        const width = layoutInfo.width - layoutInfo.minimap.minimapCanvasOuterWidth - layoutInfo.verticalScrollbarWidth;
        this._stickyScrollWidget.getDomNode().style.width = `${width}px`;
        // Make sure sticky scroll doesn't take up more than 25% of the editor
        const theoreticalLines = layoutInfo.height / this._editor.getOption(64 /* EditorOption.lineHeight */);
        this._maxStickyLines = Math.round(theoreticalLines * .25);
    }
    _renderStickyScroll() {
        if (!(this._editor.hasModel())) {
            return;
        }
        const model = this._editor.getModel();
        const stickyLineVersion = this._stickyLineCandidateProvider.getVersionId();
        if (stickyLineVersion === undefined || stickyLineVersion === model.getVersionId()) {
            this._widgetState = this.findScrollWidgetState();
            this._stickyScrollVisibleContextKey.set(!(this._widgetState.lineNumbers.length === 0));
            if (!this._focused) {
                this._stickyScrollWidget.setState(this._widgetState);
            }
            else {
                this._stickyElements = this._stickyScrollWidget.getDomNode().children;
                // Suppose that previously the sticky scroll widget had height 0, then if there are visible lines, set the last line as focused
                if (this._focusedStickyElementIndex === -1) {
                    this._stickyScrollWidget.setState(this._widgetState);
                    this._focusedStickyElementIndex = this._stickyElements.length - 1;
                    if (this._focusedStickyElementIndex !== -1) {
                        this._stickyElements.item(this._focusedStickyElementIndex).focus();
                    }
                }
                else {
                    const focusedStickyElementLineNumber = this._stickyScrollWidget.lineNumbers[this._focusedStickyElementIndex];
                    this._stickyScrollWidget.setState(this._widgetState);
                    // Suppose that after setting the state, there are no sticky lines, set the focused index to -1
                    if (this._stickyElements.length === 0) {
                        this._focusedStickyElementIndex = -1;
                    }
                    else {
                        const previousFocusedLineNumberExists = this._stickyScrollWidget.lineNumbers.includes(focusedStickyElementLineNumber);
                        // If the line number is still there, do not change anything
                        // If the line number is not there, set the new focused line to be the last line
                        if (!previousFocusedLineNumberExists) {
                            this._focusedStickyElementIndex = this._stickyElements.length - 1;
                        }
                        this._stickyElements.item(this._focusedStickyElementIndex).focus();
                    }
                }
            }
        }
    }
    findScrollWidgetState() {
        const lineHeight = this._editor.getOption(64 /* EditorOption.lineHeight */);
        const maxNumberStickyLines = Math.min(this._maxStickyLines, this._editor.getOption(110 /* EditorOption.stickyScroll */).maxLineCount);
        const scrollTop = this._editor.getScrollTop();
        let lastLineRelativePosition = 0;
        const lineNumbers = [];
        const arrayVisibleRanges = this._editor.getVisibleRanges();
        if (arrayVisibleRanges.length !== 0) {
            const fullVisibleRange = new StickyRange(arrayVisibleRanges[0].startLineNumber, arrayVisibleRanges[arrayVisibleRanges.length - 1].endLineNumber);
            const candidateRanges = this._stickyLineCandidateProvider.getCandidateStickyLinesIntersecting(fullVisibleRange);
            for (const range of candidateRanges) {
                const start = range.startLineNumber;
                const end = range.endLineNumber;
                const depth = range.nestingDepth;
                if (end - start > 0) {
                    const topOfElementAtDepth = (depth - 1) * lineHeight;
                    const bottomOfElementAtDepth = depth * lineHeight;
                    const bottomOfBeginningLine = this._editor.getBottomForLineNumber(start) - scrollTop;
                    const topOfEndLine = this._editor.getTopForLineNumber(end) - scrollTop;
                    const bottomOfEndLine = this._editor.getBottomForLineNumber(end) - scrollTop;
                    if (topOfElementAtDepth > topOfEndLine && topOfElementAtDepth <= bottomOfEndLine) {
                        lineNumbers.push(start);
                        lastLineRelativePosition = bottomOfEndLine - bottomOfElementAtDepth;
                        break;
                    }
                    else if (bottomOfElementAtDepth > bottomOfBeginningLine && bottomOfElementAtDepth <= bottomOfEndLine) {
                        lineNumbers.push(start);
                    }
                    if (lineNumbers.length === maxNumberStickyLines) {
                        break;
                    }
                }
            }
        }
        return new StickyScrollWidgetState(lineNumbers, lastLineRelativePosition);
    }
    dispose() {
        super.dispose();
        this._sessionStore.dispose();
    }
};
StickyScrollController.ID = 'store.contrib.stickyScrollController';
StickyScrollController = __decorate([
    __param(1, IContextMenuService),
    __param(2, ILanguageFeaturesService),
    __param(3, IInstantiationService),
    __param(4, ILanguageConfigurationService),
    __param(5, ILanguageFeatureDebounceService),
    __param(6, IContextKeyService)
], StickyScrollController);
export { StickyScrollController };
