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
import * as dom from '../../../../base/browser/dom.js';
import { HoverAction, HoverWidget } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { TokenizationRegistry } from '../../../common/languages.js';
import { HoverOperation } from './hoverOperation.js';
import { HoverParticipantRegistry, HoverRangeAnchor } from './hoverTypes.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { AsyncIterableObject } from '../../../../base/common/async.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ResizableContentWidget } from './resizableContentWidget.js';
const $ = dom.$;
export let ContentHoverController = class ContentHoverController extends Disposable {
    constructor(_editor, _instantiationService, _keybindingService) {
        super();
        this._editor = _editor;
        this._instantiationService = _instantiationService;
        this._keybindingService = _keybindingService;
        this._widget = this._register(this._instantiationService.createInstance(ContentHoverWidget, this._editor));
        this._currentResult = null;
        // Instantiate participants and sort them by `hoverOrdinal` which is relevant for rendering order.
        this._participants = [];
        for (const participant of HoverParticipantRegistry.getAll()) {
            this._participants.push(this._instantiationService.createInstance(participant, this._editor));
        }
        this._participants.sort((p1, p2) => p1.hoverOrdinal - p2.hoverOrdinal);
        this._computer = new ContentHoverComputer(this._editor, this._participants);
        this._hoverOperation = this._register(new HoverOperation(this._editor, this._computer));
        this._register(this._hoverOperation.onResult((result) => {
            if (!this._computer.anchor) {
                // invalid state, ignore result
                return;
            }
            const messages = (result.hasLoadingMessage ? this._addLoadingMessage(result.value) : result.value);
            this._withResult(new HoverResult(this._computer.anchor, messages, result.isComplete));
        }));
        this._register(dom.addStandardDisposableListener(this._widget.getDomNode(), 'keydown', (e) => {
            if (e.equals(9 /* KeyCode.Escape */)) {
                this.hide();
            }
        }));
        this._register(TokenizationRegistry.onDidChange(() => {
            if (this._widget.position && this._currentResult) {
                this._setCurrentResult(this._currentResult); // render again
            }
        }));
    }
    get widget() {
        return this._widget;
    }
    /**
     * Returns true if the hover shows now or will show.
     */
    maybeShowAt(mouseEvent) {
        if (this._widget.isResizing) {
            return true;
        }
        const anchorCandidates = [];
        for (const participant of this._participants) {
            if (participant.suggestHoverAnchor) {
                const anchor = participant.suggestHoverAnchor(mouseEvent);
                if (anchor) {
                    anchorCandidates.push(anchor);
                }
            }
        }
        const target = mouseEvent.target;
        if (target.type === 6 /* MouseTargetType.CONTENT_TEXT */) {
            anchorCandidates.push(new HoverRangeAnchor(0, target.range, mouseEvent.event.posx, mouseEvent.event.posy));
        }
        if (target.type === 7 /* MouseTargetType.CONTENT_EMPTY */) {
            const epsilon = this._editor.getOption(48 /* EditorOption.fontInfo */).typicalHalfwidthCharacterWidth / 2;
            if (!target.detail.isAfterLines && typeof target.detail.horizontalDistanceToText === 'number' && target.detail.horizontalDistanceToText < epsilon) {
                // Let hover kick in even when the mouse is technically in the empty area after a line, given the distance is small enough
                anchorCandidates.push(new HoverRangeAnchor(0, target.range, mouseEvent.event.posx, mouseEvent.event.posy));
            }
        }
        if (anchorCandidates.length === 0) {
            return this._startShowingOrUpdateHover(null, 0 /* HoverStartMode.Delayed */, 0 /* HoverStartSource.Mouse */, false, mouseEvent);
        }
        anchorCandidates.sort((a, b) => b.priority - a.priority);
        return this._startShowingOrUpdateHover(anchorCandidates[0], 0 /* HoverStartMode.Delayed */, 0 /* HoverStartSource.Mouse */, false, mouseEvent);
    }
    startShowingAtRange(range, mode, source, focus) {
        this._startShowingOrUpdateHover(new HoverRangeAnchor(0, range, undefined, undefined), mode, source, focus, null);
    }
    /**
     * Returns true if the hover shows now or will show.
     */
    _startShowingOrUpdateHover(anchor, mode, source, focus, mouseEvent) {
        if (!this._widget.position || !this._currentResult) {
            // The hover is not visible
            if (anchor) {
                this._startHoverOperationIfNecessary(anchor, mode, source, focus, false);
                return true;
            }
            return false;
        }
        // The hover is currently visible
        const hoverIsSticky = this._editor.getOption(58 /* EditorOption.hover */).sticky;
        const isGettingCloser = (hoverIsSticky && mouseEvent && this._widget.isMouseGettingCloser(mouseEvent.event.posx, mouseEvent.event.posy));
        if (isGettingCloser) {
            // The mouse is getting closer to the hover, so we will keep the hover untouched
            // But we will kick off a hover update at the new anchor, insisting on keeping the hover visible.
            if (anchor) {
                this._startHoverOperationIfNecessary(anchor, mode, source, focus, true);
            }
            return true;
        }
        if (!anchor) {
            this._setCurrentResult(null);
            return false;
        }
        if (anchor && this._currentResult.anchor.equals(anchor)) {
            // The widget is currently showing results for the exact same anchor, so no update is needed
            return true;
        }
        if (!anchor.canAdoptVisibleHover(this._currentResult.anchor, this._widget.position)) {
            // The new anchor is not compatible with the previous anchor
            this._setCurrentResult(null);
            this._startHoverOperationIfNecessary(anchor, mode, source, focus, false);
            return true;
        }
        // We aren't getting any closer to the hover, so we will filter existing results
        // and keep those which also apply to the new anchor.
        this._setCurrentResult(this._currentResult.filter(anchor));
        this._startHoverOperationIfNecessary(anchor, mode, source, focus, false);
        return true;
    }
    _startHoverOperationIfNecessary(anchor, mode, source, focus, insistOnKeepingHoverVisible) {
        if (this._computer.anchor && this._computer.anchor.equals(anchor)) {
            // We have to start a hover operation at the exact same anchor as before, so no work is needed
            return;
        }
        this._hoverOperation.cancel();
        this._computer.anchor = anchor;
        this._computer.shouldFocus = focus;
        this._computer.source = source;
        this._computer.insistOnKeepingHoverVisible = insistOnKeepingHoverVisible;
        this._hoverOperation.start(mode);
    }
    _setCurrentResult(hoverResult) {
        if (this._currentResult === hoverResult) {
            // avoid updating the DOM to avoid resetting the user selection
            return;
        }
        if (hoverResult && hoverResult.messages.length === 0) {
            hoverResult = null;
        }
        this._currentResult = hoverResult;
        if (this._currentResult) {
            this._renderMessages(this._currentResult.anchor, this._currentResult.messages);
        }
        else {
            this._widget.hide();
        }
    }
    hide() {
        this._computer.anchor = null;
        this._hoverOperation.cancel();
        this._setCurrentResult(null);
    }
    isColorPickerVisible() {
        return this._widget.isColorPickerVisible;
    }
    isVisibleFromKeyboard() {
        return this._widget.isVisibleFromKeyboard;
    }
    isVisible() {
        return this._widget.isVisible;
    }
    containsNode(node) {
        return (node ? this._widget.getDomNode().contains(node) : false);
    }
    _addLoadingMessage(result) {
        if (this._computer.anchor) {
            for (const participant of this._participants) {
                if (participant.createLoadingMessage) {
                    const loadingMessage = participant.createLoadingMessage(this._computer.anchor);
                    if (loadingMessage) {
                        return result.slice(0).concat([loadingMessage]);
                    }
                }
            }
        }
        return result;
    }
    _withResult(hoverResult) {
        if (this._widget.position && this._currentResult && this._currentResult.isComplete) {
            // The hover is visible with a previous complete result.
            if (!hoverResult.isComplete) {
                // Instead of rendering the new partial result, we wait for the result to be complete.
                return;
            }
            if (this._computer.insistOnKeepingHoverVisible && hoverResult.messages.length === 0) {
                // The hover would now hide normally, so we'll keep the previous messages
                return;
            }
        }
        this._setCurrentResult(hoverResult);
    }
    _renderMessages(anchor, messages) {
        const { showAtPosition, showAtSecondaryPosition, highlightRange } = ContentHoverController.computeHoverRanges(this._editor, anchor.range, messages);
        const disposables = new DisposableStore();
        const statusBar = disposables.add(new EditorHoverStatusBar(this._keybindingService));
        const fragment = document.createDocumentFragment();
        let colorPicker = null;
        const context = {
            fragment,
            statusBar,
            setColorPicker: (widget) => colorPicker = widget,
            onContentsChanged: () => this._widget.onContentsChanged(),
            hide: () => this.hide()
        };
        for (const participant of this._participants) {
            const hoverParts = messages.filter(msg => msg.owner === participant);
            if (hoverParts.length > 0) {
                disposables.add(participant.renderHoverParts(context, hoverParts));
            }
        }
        const isBeforeContent = messages.some(m => m.isBeforeContent);
        if (statusBar.hasContent) {
            fragment.appendChild(statusBar.hoverElement);
        }
        if (fragment.hasChildNodes()) {
            if (highlightRange) {
                const highlightDecoration = this._editor.createDecorationsCollection();
                highlightDecoration.set([{
                        range: highlightRange,
                        options: ContentHoverController._DECORATION_OPTIONS
                    }]);
                disposables.add(toDisposable(() => {
                    highlightDecoration.clear();
                }));
            }
            this._widget.showAt(fragment, new ContentHoverVisibleData(colorPicker, showAtPosition, showAtSecondaryPosition, this._editor.getOption(58 /* EditorOption.hover */).above, this._computer.shouldFocus, this._computer.source, isBeforeContent, anchor.initialMousePosX, anchor.initialMousePosY, disposables));
        }
        else {
            disposables.dispose();
        }
    }
    static computeHoverRanges(editor, anchorRange, messages) {
        let startColumnBoundary = 1;
        if (editor.hasModel()) {
            // Ensure the range is on the current view line
            const viewModel = editor._getViewModel();
            const coordinatesConverter = viewModel.coordinatesConverter;
            const anchorViewRange = coordinatesConverter.convertModelRangeToViewRange(anchorRange);
            const anchorViewRangeStart = new Position(anchorViewRange.startLineNumber, viewModel.getLineMinColumn(anchorViewRange.startLineNumber));
            startColumnBoundary = coordinatesConverter.convertViewPositionToModelPosition(anchorViewRangeStart).column;
        }
        // The anchor range is always on a single line
        const anchorLineNumber = anchorRange.startLineNumber;
        let renderStartColumn = anchorRange.startColumn;
        let highlightRange = messages[0].range;
        let forceShowAtRange = null;
        for (const msg of messages) {
            highlightRange = Range.plusRange(highlightRange, msg.range);
            if (msg.range.startLineNumber === anchorLineNumber && msg.range.endLineNumber === anchorLineNumber) {
                // this message has a range that is completely sitting on the line of the anchor
                renderStartColumn = Math.max(Math.min(renderStartColumn, msg.range.startColumn), startColumnBoundary);
            }
            if (msg.forceShowAtRange) {
                forceShowAtRange = msg.range;
            }
        }
        return {
            showAtPosition: forceShowAtRange ? forceShowAtRange.getStartPosition() : new Position(anchorLineNumber, anchorRange.startColumn),
            showAtSecondaryPosition: forceShowAtRange ? forceShowAtRange.getStartPosition() : new Position(anchorLineNumber, renderStartColumn),
            highlightRange
        };
    }
    focus() {
        this._widget.focus();
    }
    scrollUp() {
        this._widget.scrollUp();
    }
    scrollDown() {
        this._widget.scrollDown();
    }
    scrollLeft() {
        this._widget.scrollLeft();
    }
    scrollRight() {
        this._widget.scrollRight();
    }
    pageUp() {
        this._widget.pageUp();
    }
    pageDown() {
        this._widget.pageDown();
    }
    goToTop() {
        this._widget.goToTop();
    }
    goToBottom() {
        this._widget.goToBottom();
    }
    escape() {
        this._widget.escape();
    }
};
ContentHoverController._DECORATION_OPTIONS = ModelDecorationOptions.register({
    description: 'content-hover-highlight',
    className: 'hoverHighlight'
});
ContentHoverController = __decorate([
    __param(1, IInstantiationService),
    __param(2, IKeybindingService)
], ContentHoverController);
class HoverResult {
    constructor(anchor, messages, isComplete) {
        this.anchor = anchor;
        this.messages = messages;
        this.isComplete = isComplete;
    }
    filter(anchor) {
        const filteredMessages = this.messages.filter((m) => m.isValidForHoverAnchor(anchor));
        if (filteredMessages.length === this.messages.length) {
            return this;
        }
        return new FilteredHoverResult(this, this.anchor, filteredMessages, this.isComplete);
    }
}
class FilteredHoverResult extends HoverResult {
    constructor(original, anchor, messages, isComplete) {
        super(anchor, messages, isComplete);
        this.original = original;
    }
    filter(anchor) {
        return this.original.filter(anchor);
    }
}
class ContentHoverVisibleData {
    constructor(colorPicker, showAtPosition, showAtSecondaryPosition, preferAbove, stoleFocus, source, isBeforeContent, initialMousePosX, initialMousePosY, disposables) {
        this.colorPicker = colorPicker;
        this.showAtPosition = showAtPosition;
        this.showAtSecondaryPosition = showAtSecondaryPosition;
        this.preferAbove = preferAbove;
        this.stoleFocus = stoleFocus;
        this.source = source;
        this.isBeforeContent = isBeforeContent;
        this.initialMousePosX = initialMousePosX;
        this.initialMousePosY = initialMousePosY;
        this.disposables = disposables;
        this.closestMouseDistance = undefined;
    }
}
const HORIZONTAL_SCROLLING_BY = 30;
const SCROLLBAR_WIDTH = 10;
const CONTAINER_HEIGHT_PADDING = 6;
export let ContentHoverWidget = class ContentHoverWidget extends ResizableContentWidget {
    get isColorPickerVisible() {
        var _a;
        return Boolean((_a = this._visibleData) === null || _a === void 0 ? void 0 : _a.colorPicker);
    }
    get isVisibleFromKeyboard() {
        var _a;
        return (((_a = this._visibleData) === null || _a === void 0 ? void 0 : _a.source) === 1 /* HoverStartSource.Keyboard */);
    }
    get isVisible() {
        var _a;
        return (_a = this._hoverVisibleKey.get()) !== null && _a !== void 0 ? _a : false;
    }
    constructor(editor, contextKeyService) {
        super(editor);
        this._hover = this._register(new HoverWidget());
        this._hoverVisibleKey = EditorContextKeys.hoverVisible.bindTo(contextKeyService);
        this._hoverFocusedKey = EditorContextKeys.hoverFocused.bindTo(contextKeyService);
        dom.append(this._resizableNode.domNode, this._hover.containerDomNode);
        this._resizableNode.domNode.style.zIndex = '50';
        this._register(this._editor.onDidLayoutChange(() => this._layout()));
        this._register(this._editor.onDidChangeConfiguration((e) => {
            if (e.hasChanged(48 /* EditorOption.fontInfo */)) {
                this._updateFont();
            }
        }));
        const focusTracker = this._register(dom.trackFocus(this._resizableNode.domNode));
        this._register(focusTracker.onDidFocus(() => {
            this._hoverFocusedKey.set(true);
        }));
        this._register(focusTracker.onDidBlur(() => {
            this._hoverFocusedKey.set(false);
        }));
        this._setHoverData(undefined);
        this._layout();
        this._editor.addContentWidget(this);
    }
    dispose() {
        var _a;
        super.dispose();
        (_a = this._visibleData) === null || _a === void 0 ? void 0 : _a.disposables.dispose();
        this._editor.removeContentWidget(this);
    }
    getId() {
        return ContentHoverWidget.ID;
    }
    static _applyDimensions(container, width, height) {
        const transformedWidth = typeof width === 'number' ? `${width}px` : width;
        const transformedHeight = typeof height === 'number' ? `${height}px` : height;
        container.style.width = transformedWidth;
        container.style.height = transformedHeight;
    }
    _setContentsDomNodeDimensions(width, height) {
        const contentsDomNode = this._hover.contentsDomNode;
        return ContentHoverWidget._applyDimensions(contentsDomNode, width, height);
    }
    _setContainerDomNodeDimensions(width, height) {
        const containerDomNode = this._hover.containerDomNode;
        return ContentHoverWidget._applyDimensions(containerDomNode, width, height);
    }
    _setHoverWidgetDimensions(width, height) {
        this._setContentsDomNodeDimensions(width, height);
        this._setContainerDomNodeDimensions(width, height);
        this._layoutContentWidget();
    }
    _setContentsDomNodeMaxDimensions(width, height) {
        const transformedWidth = typeof width === 'number' ? `${width}px` : width;
        const transformedHeight = typeof height === 'number' ? `${height}px` : height;
        const contentsDomNode = this._hover.contentsDomNode;
        contentsDomNode.style.maxWidth = transformedWidth;
        contentsDomNode.style.maxHeight = transformedHeight;
    }
    _hasHorizontalScrollbar() {
        const scrollDimensions = this._hover.scrollbar.getScrollDimensions();
        const hasHorizontalScrollbar = scrollDimensions.scrollWidth > scrollDimensions.width;
        return hasHorizontalScrollbar;
    }
    _adjustContentsBottomPadding() {
        const contentsDomNode = this._hover.contentsDomNode;
        const extraBottomPadding = `${this._hover.scrollbar.options.horizontalScrollbarSize}px`;
        if (contentsDomNode.style.paddingBottom !== extraBottomPadding) {
            contentsDomNode.style.paddingBottom = extraBottomPadding;
        }
    }
    _setAdjustedHoverWidgetDimensions(size) {
        this._setContentsDomNodeMaxDimensions('none', 'none');
        const width = size.width;
        const height = size.height;
        this._setHoverWidgetDimensions(width, height);
        // measure if widget has horizontal scrollbar after setting the dimensions
        if (this._hasHorizontalScrollbar()) {
            this._adjustContentsBottomPadding();
            this._setContentsDomNodeDimensions(width, height - SCROLLBAR_WIDTH);
        }
    }
    _setResizableNodeMaxDimensions() {
        var _a, _b;
        const maxRenderingWidth = (_a = this._findMaximumRenderingWidth()) !== null && _a !== void 0 ? _a : Infinity;
        const maxRenderingHeight = (_b = this._findMaximumRenderingHeight()) !== null && _b !== void 0 ? _b : Infinity;
        this._resizableNode.maxSize = new dom.Dimension(maxRenderingWidth, maxRenderingHeight);
    }
    _resize(size) {
        var _a, _b;
        this._setAdjustedHoverWidgetDimensions(size);
        this._resizableNode.layout(size.height, size.width);
        this._setResizableNodeMaxDimensions();
        this._hover.scrollbar.scanDomNode();
        this._editor.layoutContentWidget(this);
        (_b = (_a = this._visibleData) === null || _a === void 0 ? void 0 : _a.colorPicker) === null || _b === void 0 ? void 0 : _b.layout();
    }
    _findAvailableSpaceVertically() {
        var _a;
        const position = (_a = this._visibleData) === null || _a === void 0 ? void 0 : _a.showAtPosition;
        if (!position) {
            return;
        }
        return this._positionPreference === 1 /* ContentWidgetPositionPreference.ABOVE */ ? this._availableVerticalSpaceAbove(position) : this._availableVerticalSpaceBelow(position);
    }
    _findMaximumRenderingHeight() {
        const availableSpace = this._findAvailableSpaceVertically();
        if (!availableSpace) {
            return;
        }
        // Padding needed in order to stop the resizing down to a smaller height
        let maximumHeight = CONTAINER_HEIGHT_PADDING;
        Array.from(this._hover.contentsDomNode.children).forEach((hoverPart) => {
            maximumHeight += hoverPart.clientHeight;
        });
        if (this._hasHorizontalScrollbar()) {
            maximumHeight += SCROLLBAR_WIDTH;
        }
        return Math.min(availableSpace, maximumHeight);
    }
    _findMaximumRenderingWidth() {
        if (!this._editor || !this._editor.hasModel()) {
            return;
        }
        const bodyBoxWidth = dom.getClientArea(document.body).width;
        const horizontalPadding = 14;
        return bodyBoxWidth - horizontalPadding;
    }
    isMouseGettingCloser(posx, posy) {
        if (!this._visibleData) {
            return false;
        }
        if (typeof this._visibleData.initialMousePosX === 'undefined' || typeof this._visibleData.initialMousePosY === 'undefined') {
            this._visibleData.initialMousePosX = posx;
            this._visibleData.initialMousePosY = posy;
            return false;
        }
        const widgetRect = dom.getDomNodePagePosition(this.getDomNode());
        if (typeof this._visibleData.closestMouseDistance === 'undefined') {
            this._visibleData.closestMouseDistance = computeDistanceFromPointToRectangle(this._visibleData.initialMousePosX, this._visibleData.initialMousePosY, widgetRect.left, widgetRect.top, widgetRect.width, widgetRect.height);
        }
        const distance = computeDistanceFromPointToRectangle(posx, posy, widgetRect.left, widgetRect.top, widgetRect.width, widgetRect.height);
        if (distance > this._visibleData.closestMouseDistance + 4 /* tolerance of 4 pixels */) {
            // The mouse is getting farther away
            return false;
        }
        this._visibleData.closestMouseDistance = Math.min(this._visibleData.closestMouseDistance, distance);
        return true;
    }
    _setHoverData(hoverData) {
        var _a;
        (_a = this._visibleData) === null || _a === void 0 ? void 0 : _a.disposables.dispose();
        this._visibleData = hoverData;
        this._hoverVisibleKey.set(!!hoverData);
        this._hover.containerDomNode.classList.toggle('hidden', !hoverData);
    }
    _layout() {
        const height = Math.max(this._editor.getLayoutInfo().height / 4, 250);
        const { fontSize, lineHeight } = this._editor.getOption(48 /* EditorOption.fontInfo */);
        const contentsDomNode = this._hover.contentsDomNode;
        contentsDomNode.style.fontSize = `${fontSize}px`;
        contentsDomNode.style.lineHeight = `${lineHeight / fontSize}`;
        this._setContentsDomNodeMaxDimensions(Math.max(this._editor.getLayoutInfo().width * 0.66, 500), height);
    }
    _updateFont() {
        const codeClasses = Array.prototype.slice.call(this._hover.contentsDomNode.getElementsByClassName('code'));
        codeClasses.forEach(node => this._editor.applyFontInfo(node));
    }
    _updateContent(node) {
        const contentsDomNode = this._hover.contentsDomNode;
        contentsDomNode.style.paddingBottom = '';
        contentsDomNode.textContent = '';
        contentsDomNode.appendChild(node);
    }
    _layoutContentWidget() {
        this._editor.layoutContentWidget(this);
        this._hover.onContentsChanged();
    }
    _updateContentsDomNodeMaxDimensions() {
        const width = Math.max(this._editor.getLayoutInfo().width * 0.66, 500);
        const height = Math.max(this._editor.getLayoutInfo().height / 4, 250);
        this._setContentsDomNodeMaxDimensions(width, height);
    }
    _render(node, hoverData) {
        this._setHoverData(hoverData);
        this._updateFont();
        this._updateContent(node);
        this._updateContentsDomNodeMaxDimensions();
        this.onContentsChanged();
        // Simply force a synchronous render on the editor
        // such that the widget does not really render with left = '0px'
        this._editor.render();
    }
    getPosition() {
        var _a;
        if (!this._visibleData) {
            return null;
        }
        return {
            position: this._visibleData.showAtPosition,
            secondaryPosition: this._visibleData.showAtSecondaryPosition,
            positionAffinity: this._visibleData.isBeforeContent ? 3 /* PositionAffinity.LeftOfInjectedText */ : undefined,
            preference: [(_a = this._positionPreference) !== null && _a !== void 0 ? _a : 1 /* ContentWidgetPositionPreference.ABOVE */]
        };
    }
    showAt(node, hoverData) {
        var _a, _b;
        if (!this._editor || !this._editor.hasModel()) {
            return;
        }
        this._render(node, hoverData);
        const widgetHeight = dom.getTotalHeight(this._hover.containerDomNode);
        const widgetPosition = hoverData.showAtPosition;
        this._positionPreference = (_a = this._findPositionPreference(widgetHeight, widgetPosition)) !== null && _a !== void 0 ? _a : 1 /* ContentWidgetPositionPreference.ABOVE */;
        // See https://github.com/microsoft/vscode/issues/140339
        // TODO: Doing a second layout of the hover after force rendering the editor
        this.onContentsChanged();
        if (hoverData.stoleFocus) {
            this._hover.containerDomNode.focus();
        }
        (_b = hoverData.colorPicker) === null || _b === void 0 ? void 0 : _b.layout();
    }
    hide() {
        if (!this._visibleData) {
            return;
        }
        const stoleFocus = this._visibleData.stoleFocus;
        this._setHoverData(undefined);
        this._resizableNode.maxSize = new dom.Dimension(Infinity, Infinity);
        this._resizableNode.clearSashHoverState();
        this._hoverFocusedKey.set(false);
        this._editor.layoutContentWidget(this);
        if (stoleFocus) {
            this._editor.focus();
        }
    }
    _removeConstraintsRenderNormally() {
        // Added because otherwise the initial size of the hover content is smaller than should be
        const layoutInfo = this._editor.getLayoutInfo();
        this._resizableNode.layout(layoutInfo.height, layoutInfo.width);
        this._setHoverWidgetDimensions('auto', 'auto');
    }
    _adjustHoverHeightForScrollbar(height) {
        var _a;
        const containerDomNode = this._hover.containerDomNode;
        const contentsDomNode = this._hover.contentsDomNode;
        const maxRenderingHeight = (_a = this._findMaximumRenderingHeight()) !== null && _a !== void 0 ? _a : Infinity;
        this._setContainerDomNodeDimensions(dom.getTotalWidth(containerDomNode), Math.min(maxRenderingHeight, height));
        this._setContentsDomNodeDimensions(dom.getTotalWidth(contentsDomNode), Math.min(maxRenderingHeight, height - SCROLLBAR_WIDTH));
    }
    onContentsChanged() {
        this._removeConstraintsRenderNormally();
        const containerDomNode = this._hover.containerDomNode;
        let height = dom.getTotalHeight(containerDomNode);
        let width = dom.getTotalWidth(containerDomNode);
        this._resizableNode.layout(height, width);
        this._setHoverWidgetDimensions(width, height);
        height = dom.getTotalHeight(containerDomNode);
        width = dom.getTotalWidth(containerDomNode);
        this._resizableNode.layout(height, width);
        if (this._hasHorizontalScrollbar()) {
            this._adjustContentsBottomPadding();
            this._adjustHoverHeightForScrollbar(height);
        }
        this._layoutContentWidget();
    }
    focus() {
        this._hover.containerDomNode.focus();
    }
    scrollUp() {
        const scrollTop = this._hover.scrollbar.getScrollPosition().scrollTop;
        const fontInfo = this._editor.getOption(48 /* EditorOption.fontInfo */);
        this._hover.scrollbar.setScrollPosition({ scrollTop: scrollTop - fontInfo.lineHeight });
    }
    scrollDown() {
        const scrollTop = this._hover.scrollbar.getScrollPosition().scrollTop;
        const fontInfo = this._editor.getOption(48 /* EditorOption.fontInfo */);
        this._hover.scrollbar.setScrollPosition({ scrollTop: scrollTop + fontInfo.lineHeight });
    }
    scrollLeft() {
        const scrollLeft = this._hover.scrollbar.getScrollPosition().scrollLeft;
        this._hover.scrollbar.setScrollPosition({ scrollLeft: scrollLeft - HORIZONTAL_SCROLLING_BY });
    }
    scrollRight() {
        const scrollLeft = this._hover.scrollbar.getScrollPosition().scrollLeft;
        this._hover.scrollbar.setScrollPosition({ scrollLeft: scrollLeft + HORIZONTAL_SCROLLING_BY });
    }
    pageUp() {
        const scrollTop = this._hover.scrollbar.getScrollPosition().scrollTop;
        const scrollHeight = this._hover.scrollbar.getScrollDimensions().height;
        this._hover.scrollbar.setScrollPosition({ scrollTop: scrollTop - scrollHeight });
    }
    pageDown() {
        const scrollTop = this._hover.scrollbar.getScrollPosition().scrollTop;
        const scrollHeight = this._hover.scrollbar.getScrollDimensions().height;
        this._hover.scrollbar.setScrollPosition({ scrollTop: scrollTop + scrollHeight });
    }
    goToTop() {
        this._hover.scrollbar.setScrollPosition({ scrollTop: 0 });
    }
    goToBottom() {
        this._hover.scrollbar.setScrollPosition({ scrollTop: this._hover.scrollbar.getScrollDimensions().scrollHeight });
    }
    escape() {
        this._editor.focus();
    }
};
ContentHoverWidget.ID = 'editor.contrib.resizableContentHoverWidget';
ContentHoverWidget = __decorate([
    __param(1, IContextKeyService)
], ContentHoverWidget);
export let EditorHoverStatusBar = class EditorHoverStatusBar extends Disposable {
    get hasContent() {
        return this._hasContent;
    }
    constructor(_keybindingService) {
        super();
        this._keybindingService = _keybindingService;
        this._hasContent = false;
        this.hoverElement = $('div.hover-row.status-bar');
        this.actionsElement = dom.append(this.hoverElement, $('div.actions'));
    }
    addAction(actionOptions) {
        const keybinding = this._keybindingService.lookupKeybinding(actionOptions.commandId);
        const keybindingLabel = keybinding ? keybinding.getLabel() : null;
        this._hasContent = true;
        return this._register(HoverAction.render(this.actionsElement, actionOptions, keybindingLabel));
    }
    append(element) {
        const result = dom.append(this.actionsElement, element);
        this._hasContent = true;
        return result;
    }
};
EditorHoverStatusBar = __decorate([
    __param(0, IKeybindingService)
], EditorHoverStatusBar);
class ContentHoverComputer {
    get anchor() { return this._anchor; }
    set anchor(value) { this._anchor = value; }
    get shouldFocus() { return this._shouldFocus; }
    set shouldFocus(value) { this._shouldFocus = value; }
    get source() { return this._source; }
    set source(value) { this._source = value; }
    get insistOnKeepingHoverVisible() { return this._insistOnKeepingHoverVisible; }
    set insistOnKeepingHoverVisible(value) { this._insistOnKeepingHoverVisible = value; }
    constructor(_editor, _participants) {
        this._editor = _editor;
        this._participants = _participants;
        this._anchor = null;
        this._shouldFocus = false;
        this._source = 0 /* HoverStartSource.Mouse */;
        this._insistOnKeepingHoverVisible = false;
    }
    static _getLineDecorations(editor, anchor) {
        if (anchor.type !== 1 /* HoverAnchorType.Range */ && !anchor.supportsMarkerHover) {
            return [];
        }
        const model = editor.getModel();
        const lineNumber = anchor.range.startLineNumber;
        if (lineNumber > model.getLineCount()) {
            // invalid line
            return [];
        }
        const maxColumn = model.getLineMaxColumn(lineNumber);
        return editor.getLineDecorations(lineNumber).filter((d) => {
            if (d.options.isWholeLine) {
                return true;
            }
            const startColumn = (d.range.startLineNumber === lineNumber) ? d.range.startColumn : 1;
            const endColumn = (d.range.endLineNumber === lineNumber) ? d.range.endColumn : maxColumn;
            if (d.options.showIfCollapsed) {
                // Relax check around `showIfCollapsed` decorations to also include +/- 1 character
                if (startColumn > anchor.range.startColumn + 1 || anchor.range.endColumn - 1 > endColumn) {
                    return false;
                }
            }
            else {
                if (startColumn > anchor.range.startColumn || anchor.range.endColumn > endColumn) {
                    return false;
                }
            }
            return true;
        });
    }
    computeAsync(token) {
        const anchor = this._anchor;
        if (!this._editor.hasModel() || !anchor) {
            return AsyncIterableObject.EMPTY;
        }
        const lineDecorations = ContentHoverComputer._getLineDecorations(this._editor, anchor);
        return AsyncIterableObject.merge(this._participants.map((participant) => {
            if (!participant.computeAsync) {
                return AsyncIterableObject.EMPTY;
            }
            return participant.computeAsync(anchor, lineDecorations, token);
        }));
    }
    computeSync() {
        if (!this._editor.hasModel() || !this._anchor) {
            return [];
        }
        const lineDecorations = ContentHoverComputer._getLineDecorations(this._editor, this._anchor);
        let result = [];
        for (const participant of this._participants) {
            result = result.concat(participant.computeSync(this._anchor, lineDecorations));
        }
        return coalesce(result);
    }
}
function computeDistanceFromPointToRectangle(pointX, pointY, left, top, width, height) {
    const x = (left + width / 2); // x center of rectangle
    const y = (top + height / 2); // y center of rectangle
    const dx = Math.max(Math.abs(pointX - x) - width / 2, 0);
    const dy = Math.max(Math.abs(pointY - y) - height / 2, 0);
    return Math.sqrt(dx * dx + dy * dy);
}
