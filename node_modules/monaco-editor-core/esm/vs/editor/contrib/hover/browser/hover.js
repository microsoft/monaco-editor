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
import { KeyChord } from '../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { EditorAction, registerEditorAction, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { Range } from '../../../common/core/range.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { GotoDefinitionAtPositionEditorContribution } from '../../gotoSymbol/browser/link/goToDefinitionAtPosition.js';
import { ContentHoverWidget, ContentHoverController } from './contentHover.js';
import { MarginHoverWidget } from './marginHover.js';
import * as nls from '../../../../nls.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { editorHoverBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { HoverParticipantRegistry } from './hoverTypes.js';
import { MarkdownHoverParticipant } from './markdownHoverParticipant.js';
import { MarkerHoverParticipant } from './markerHoverParticipant.js';
import './hover.css';
import { InlineSuggestionHintsContentWidget } from '../../inlineCompletions/browser/inlineSuggestionHintsWidget.js';
let ModesHoverController = class ModesHoverController {
    static get(editor) {
        return editor.getContribution(ModesHoverController.ID);
    }
    constructor(_editor, _instantiationService, _openerService, _languageService, _contextKeyService) {
        this._editor = _editor;
        this._instantiationService = _instantiationService;
        this._openerService = _openerService;
        this._languageService = _languageService;
        this._toUnhook = new DisposableStore();
        this._isMouseDown = false;
        this._hoverClicked = false;
        this._contentWidget = null;
        this._glyphWidget = null;
        this._hookEvents();
        this._didChangeConfigurationHandler = this._editor.onDidChangeConfiguration((e) => {
            if (e.hasChanged(57 /* EditorOption.hover */)) {
                this._unhookEvents();
                this._hookEvents();
            }
        });
    }
    _hookEvents() {
        const hideWidgetsEventHandler = () => this._hideWidgets();
        const hoverOpts = this._editor.getOption(57 /* EditorOption.hover */);
        this._isHoverEnabled = hoverOpts.enabled;
        this._isHoverSticky = hoverOpts.sticky;
        if (this._isHoverEnabled) {
            this._toUnhook.add(this._editor.onMouseDown((e) => this._onEditorMouseDown(e)));
            this._toUnhook.add(this._editor.onMouseUp((e) => this._onEditorMouseUp(e)));
            this._toUnhook.add(this._editor.onMouseMove((e) => this._onEditorMouseMove(e)));
            this._toUnhook.add(this._editor.onKeyDown((e) => this._onKeyDown(e)));
        }
        else {
            this._toUnhook.add(this._editor.onMouseMove((e) => this._onEditorMouseMove(e)));
            this._toUnhook.add(this._editor.onKeyDown((e) => this._onKeyDown(e)));
        }
        this._toUnhook.add(this._editor.onMouseLeave((e) => this._onEditorMouseLeave(e)));
        this._toUnhook.add(this._editor.onDidChangeModel(hideWidgetsEventHandler));
        this._toUnhook.add(this._editor.onDidScrollChange((e) => this._onEditorScrollChanged(e)));
    }
    _unhookEvents() {
        this._toUnhook.clear();
    }
    _onEditorScrollChanged(e) {
        if (e.scrollTopChanged || e.scrollLeftChanged) {
            this._hideWidgets();
        }
    }
    _onEditorMouseDown(mouseEvent) {
        this._isMouseDown = true;
        const target = mouseEvent.target;
        if (target.type === 9 /* MouseTargetType.CONTENT_WIDGET */ && target.detail === ContentHoverWidget.ID) {
            this._hoverClicked = true;
            // mouse down on top of content hover widget
            return;
        }
        if (target.type === 12 /* MouseTargetType.OVERLAY_WIDGET */ && target.detail === MarginHoverWidget.ID) {
            // mouse down on top of overlay hover widget
            return;
        }
        if (target.type !== 12 /* MouseTargetType.OVERLAY_WIDGET */) {
            this._hoverClicked = false;
        }
        this._hideWidgets();
    }
    _onEditorMouseUp(mouseEvent) {
        this._isMouseDown = false;
    }
    _onEditorMouseLeave(mouseEvent) {
        var _a;
        const targetEm = (mouseEvent.event.browserEvent.relatedTarget);
        if ((_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.containsNode(targetEm)) {
            // when the mouse is inside hover widget
            return;
        }
        this._hideWidgets();
    }
    _onEditorMouseMove(mouseEvent) {
        var _a, _b, _c, _d, _e, _f;
        const target = mouseEvent.target;
        if (this._isMouseDown && this._hoverClicked) {
            return;
        }
        if (this._isHoverSticky && target.type === 9 /* MouseTargetType.CONTENT_WIDGET */ && target.detail === ContentHoverWidget.ID) {
            // mouse moved on top of content hover widget
            return;
        }
        if (this._isHoverSticky && !((_b = (_a = mouseEvent.event.browserEvent.view) === null || _a === void 0 ? void 0 : _a.getSelection()) === null || _b === void 0 ? void 0 : _b.isCollapsed)) {
            // selected text within content hover widget
            return;
        }
        if (!this._isHoverSticky && target.type === 9 /* MouseTargetType.CONTENT_WIDGET */ && target.detail === ContentHoverWidget.ID
            && ((_c = this._contentWidget) === null || _c === void 0 ? void 0 : _c.isColorPickerVisible())) {
            // though the hover is not sticky, the color picker needs to.
            return;
        }
        if (this._isHoverSticky && target.type === 12 /* MouseTargetType.OVERLAY_WIDGET */ && target.detail === MarginHoverWidget.ID) {
            // mouse moved on top of overlay hover widget
            return;
        }
        if (this._isHoverSticky && ((_d = this._contentWidget) === null || _d === void 0 ? void 0 : _d.isVisibleFromKeyboard())) {
            // Sticky mode is on and the hover has been shown via keyboard
            // so moving the mouse has no effect
            return;
        }
        if (!this._isHoverEnabled) {
            this._hideWidgets();
            return;
        }
        const contentWidget = this._getOrCreateContentWidget();
        if (contentWidget.maybeShowAt(mouseEvent)) {
            (_e = this._glyphWidget) === null || _e === void 0 ? void 0 : _e.hide();
            return;
        }
        if (target.type === 2 /* MouseTargetType.GUTTER_GLYPH_MARGIN */ && target.position) {
            (_f = this._contentWidget) === null || _f === void 0 ? void 0 : _f.hide();
            if (!this._glyphWidget) {
                this._glyphWidget = new MarginHoverWidget(this._editor, this._languageService, this._openerService);
            }
            this._glyphWidget.startShowingAt(target.position.lineNumber);
            return;
        }
        this._hideWidgets();
    }
    _onKeyDown(e) {
        if (e.keyCode !== 5 /* KeyCode.Ctrl */ && e.keyCode !== 6 /* KeyCode.Alt */ && e.keyCode !== 57 /* KeyCode.Meta */ && e.keyCode !== 4 /* KeyCode.Shift */) {
            // Do not hide hover when a modifier key is pressed
            this._hideWidgets();
        }
    }
    _hideWidgets() {
        var _a, _b, _c;
        if ((this._isMouseDown && this._hoverClicked && ((_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.isColorPickerVisible())) || InlineSuggestionHintsContentWidget.dropDownVisible) {
            return;
        }
        this._hoverClicked = false;
        (_b = this._glyphWidget) === null || _b === void 0 ? void 0 : _b.hide();
        (_c = this._contentWidget) === null || _c === void 0 ? void 0 : _c.hide();
    }
    _getOrCreateContentWidget() {
        if (!this._contentWidget) {
            this._contentWidget = this._instantiationService.createInstance(ContentHoverController, this._editor);
        }
        return this._contentWidget;
    }
    isColorPickerVisible() {
        var _a;
        return ((_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.isColorPickerVisible()) || false;
    }
    showContentHover(range, mode, source, focus) {
        this._getOrCreateContentWidget().startShowingAtRange(range, mode, source, focus);
    }
    dispose() {
        var _a, _b;
        this._unhookEvents();
        this._toUnhook.dispose();
        this._didChangeConfigurationHandler.dispose();
        (_a = this._glyphWidget) === null || _a === void 0 ? void 0 : _a.dispose();
        (_b = this._contentWidget) === null || _b === void 0 ? void 0 : _b.dispose();
    }
};
ModesHoverController.ID = 'editor.contrib.hover';
ModesHoverController = __decorate([
    __param(1, IInstantiationService),
    __param(2, IOpenerService),
    __param(3, ILanguageService),
    __param(4, IContextKeyService)
], ModesHoverController);
export { ModesHoverController };
class ShowHoverAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.showHover',
            label: nls.localize({
                key: 'showHover',
                comment: [
                    'Label for action that will trigger the showing of a hover in the editor.',
                    'This allows for users to show the hover without using the mouse.'
                ]
            }, "Show Hover"),
            alias: 'Show Hover',
            precondition: undefined,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 39 /* KeyCode.KeyI */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        if (!editor.hasModel()) {
            return;
        }
        const controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        const position = editor.getPosition();
        const range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
        const focus = editor.getOption(2 /* EditorOption.accessibilitySupport */) === 2 /* AccessibilitySupport.Enabled */;
        controller.showContentHover(range, 1 /* HoverStartMode.Immediate */, 1 /* HoverStartSource.Keyboard */, focus);
    }
}
class ShowDefinitionPreviewHoverAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.showDefinitionPreviewHover',
            label: nls.localize({
                key: 'showDefinitionPreviewHover',
                comment: [
                    'Label for action that will trigger the showing of definition preview hover in the editor.',
                    'This allows for users to show the definition preview hover without using the mouse.'
                ]
            }, "Show Definition Preview Hover"),
            alias: 'Show Definition Preview Hover',
            precondition: undefined
        });
    }
    run(accessor, editor) {
        const controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        const position = editor.getPosition();
        if (!position) {
            return;
        }
        const range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
        const goto = GotoDefinitionAtPositionEditorContribution.get(editor);
        if (!goto) {
            return;
        }
        const promise = goto.startFindDefinitionFromCursor(position);
        promise.then(() => {
            controller.showContentHover(range, 1 /* HoverStartMode.Immediate */, 1 /* HoverStartSource.Keyboard */, true);
        });
    }
}
registerEditorContribution(ModesHoverController.ID, ModesHoverController, 2 /* EditorContributionInstantiation.BeforeFirstInteraction */);
registerEditorAction(ShowHoverAction);
registerEditorAction(ShowDefinitionPreviewHoverAction);
HoverParticipantRegistry.register(MarkdownHoverParticipant);
HoverParticipantRegistry.register(MarkerHoverParticipant);
// theming
registerThemingParticipant((theme, collector) => {
    const hoverBorder = theme.getColor(editorHoverBorder);
    if (hoverBorder) {
        collector.addRule(`.monaco-editor .monaco-hover .hover-row:not(:first-child):not(:empty) { border-top: 1px solid ${hoverBorder.transparent(0.5)}; }`);
        collector.addRule(`.monaco-editor .monaco-hover hr { border-top: 1px solid ${hoverBorder.transparent(0.5)}; }`);
        collector.addRule(`.monaco-editor .monaco-hover hr { border-bottom: 0px solid ${hoverBorder.transparent(0.5)}; }`);
    }
});
