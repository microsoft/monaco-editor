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
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { StickyScrollWidget, StickyScrollWidgetState } from './stickyScrollWidget.js';
import { StickyLineCandidateProvider, StickyRange } from './stickyScrollProvider.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import * as dom from '../../../../base/browser/dom.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
let StickyScrollController = class StickyScrollController extends Disposable {
    constructor(_editor, _contextMenuService, languageFeaturesService, instaService) {
        super();
        this._editor = _editor;
        this._contextMenuService = _contextMenuService;
        this._sessionStore = new DisposableStore();
        this._maxStickyLines = Number.MAX_SAFE_INTEGER;
        this._stickyScrollWidget = new StickyScrollWidget(this._editor, languageFeaturesService, instaService);
        this._stickyLineCandidateProvider = new StickyLineCandidateProvider(this._editor, languageFeaturesService);
        this._widgetState = new StickyScrollWidgetState([], 0);
        this._register(this._stickyScrollWidget);
        this._register(this._stickyLineCandidateProvider);
        this._register(this._editor.onDidChangeConfiguration(e => {
            if (e.hasChanged(109 /* EditorOption.stickyScroll */)) {
                this._readConfiguration();
            }
        }));
        this._readConfiguration();
        this._register(dom.addDisposableListener(this._stickyScrollWidget.getDomNode(), dom.EventType.CONTEXT_MENU, (event) => __awaiter(this, void 0, void 0, function* () {
            this._onContextMenu(event);
        })));
    }
    _onContextMenu(event) {
        this._contextMenuService.showContextMenu({
            menuId: MenuId.StickyScrollContext,
            getAnchor: () => event,
        });
    }
    _readConfiguration() {
        const options = this._editor.getOption(109 /* EditorOption.stickyScroll */);
        if (options.enabled === false) {
            this._editor.removeOverlayWidget(this._stickyScrollWidget);
            this._sessionStore.clear();
            return;
        }
        else {
            this._editor.addOverlayWidget(this._stickyScrollWidget);
            this._sessionStore.add(this._editor.onDidScrollChange(() => this._renderStickyScroll()));
            this._sessionStore.add(this._editor.onDidLayoutChange(() => this._onDidResize()));
            this._sessionStore.add(this._editor.onDidChangeModelTokens((e) => this._onTokensChange(e)));
            this._sessionStore.add(this._stickyLineCandidateProvider.onDidChangeStickyScroll(() => this._renderStickyScroll()));
            const lineNumberOption = this._editor.getOption(64 /* EditorOption.lineNumbers */);
            if (lineNumberOption.renderType === 2 /* RenderLineNumbersType.Relative */) {
                this._sessionStore.add(this._editor.onDidChangeCursorPosition(() => this._renderStickyScroll()));
            }
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
        // make sure sticky scroll doesn't take up more than 25% of the editor
        const theoreticalLines = layoutInfo.height / this._editor.getOption(63 /* EditorOption.lineHeight */);
        this._maxStickyLines = Math.round(theoreticalLines * .25);
    }
    _renderStickyScroll() {
        if (!(this._editor.hasModel())) {
            return;
        }
        const model = this._editor.getModel();
        const stickyLineVersion = this._stickyLineCandidateProvider.getVersionId();
        if (stickyLineVersion === undefined || stickyLineVersion === model.getVersionId()) {
            this._widgetState = this.getScrollWidgetState();
            this._stickyScrollWidget.setState(this._widgetState);
        }
    }
    getScrollWidgetState() {
        const lineHeight = this._editor.getOption(63 /* EditorOption.lineHeight */);
        const maxNumberStickyLines = Math.min(this._maxStickyLines, this._editor.getOption(109 /* EditorOption.stickyScroll */).maxLineCount);
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
    __param(3, IInstantiationService)
], StickyScrollController);
export { StickyScrollController };
