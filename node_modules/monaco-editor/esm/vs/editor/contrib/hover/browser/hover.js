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
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { editorHoverBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { HoverParticipantRegistry } from './hoverTypes.js';
import { MarkdownHoverParticipant } from './markdownHoverParticipant.js';
import { MarkerHoverParticipant } from './markerHoverParticipant.js';
import './hover.css';
import { InlineSuggestionHintsContentWidget } from '../../inlineCompletions/browser/inlineSuggestionHintsWidget.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
let ModesHoverController = class ModesHoverController {
    static get(editor) {
        return editor.getContribution(ModesHoverController.ID);
    }
    constructor(_editor, _instantiationService, _openerService, _languageService, _keybindingService) {
        this._editor = _editor;
        this._instantiationService = _instantiationService;
        this._openerService = _openerService;
        this._languageService = _languageService;
        this._keybindingService = _keybindingService;
        this._toUnhook = new DisposableStore();
        this._isMouseDown = false;
        this._hoverClicked = false;
        this._contentWidget = null;
        this._glyphWidget = null;
        this._hookEvents();
        this._didChangeConfigurationHandler = this._editor.onDidChangeConfiguration((e) => {
            if (e.hasChanged(58 /* EditorOption.hover */)) {
                this._unhookEvents();
                this._hookEvents();
            }
        });
    }
    _hookEvents() {
        const hideWidgetsEventHandler = () => this._hideWidgets();
        const hoverOpts = this._editor.getOption(58 /* EditorOption.hover */);
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
        var _a;
        if (!this._editor.hasModel()) {
            return;
        }
        const resolvedKeyboardEvent = this._keybindingService.softDispatch(e, this._editor.getDomNode());
        // If the beginning of a multi-chord keybinding is pressed, or the command aims to focus the hover, set the variable to true, otherwise false
        const mightTriggerFocus = ((resolvedKeyboardEvent === null || resolvedKeyboardEvent === void 0 ? void 0 : resolvedKeyboardEvent.kind) === 1 /* ResultKind.MoreChordsNeeded */ || (resolvedKeyboardEvent && resolvedKeyboardEvent.kind === 2 /* ResultKind.KbFound */ && resolvedKeyboardEvent.commandId === 'editor.action.showHover' && ((_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.isVisible())));
        if (e.keyCode !== 5 /* KeyCode.Ctrl */ && e.keyCode !== 6 /* KeyCode.Alt */ && e.keyCode !== 57 /* KeyCode.Meta */ && e.keyCode !== 4 /* KeyCode.Shift */
            && !mightTriggerFocus) {
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
    focus() {
        var _a;
        (_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.focus();
    }
    scrollUp() {
        var _a;
        (_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.scrollUp();
    }
    scrollDown() {
        var _a;
        (_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.scrollDown();
    }
    scrollLeft() {
        var _a;
        (_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.scrollLeft();
    }
    scrollRight() {
        var _a;
        (_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.scrollRight();
    }
    pageUp() {
        var _a;
        (_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.pageUp();
    }
    pageDown() {
        var _a;
        (_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.pageDown();
    }
    goToTop() {
        var _a;
        (_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.goToTop();
    }
    goToBottom() {
        var _a;
        (_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.goToBottom();
    }
    escape() {
        var _a;
        (_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.escape();
    }
    isHoverVisible() {
        var _a;
        return (_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.isVisible();
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
    __param(4, IKeybindingService)
], ModesHoverController);
export { ModesHoverController };
class ShowOrFocusHoverAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.showHover',
            label: nls.localize({
                key: 'showOrFocusHover',
                comment: [
                    'Label for action that will trigger the showing/focusing of a hover in the editor.',
                    'If the hover is not visible, it will show the hover.',
                    'This allows for users to show the hover without using the mouse.',
                    'If the hover is already visible, it will take focus.'
                ]
            }, "Show or Focus Hover"),
            description: {
                description: `Show or Focus Hover`,
                args: [{
                        name: 'args',
                        schema: {
                            type: 'object',
                            properties: {
                                'focus': {
                                    description: 'Controls if when triggered with the keyboard, the hover should take focus immediately.',
                                    type: 'boolean',
                                    default: false
                                }
                            },
                        }
                    }]
            },
            alias: 'Show or Focus Hover',
            precondition: undefined,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 39 /* KeyCode.KeyI */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor, args) {
        if (!editor.hasModel()) {
            return;
        }
        const controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        const position = editor.getPosition();
        const range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
        const focus = editor.getOption(2 /* EditorOption.accessibilitySupport */) === 2 /* AccessibilitySupport.Enabled */ || !!(args === null || args === void 0 ? void 0 : args.focus);
        if (controller.isHoverVisible()) {
            controller.focus();
        }
        else {
            controller.showContentHover(range, 1 /* HoverStartMode.Immediate */, 1 /* HoverStartSource.Keyboard */, focus);
        }
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
class ScrollUpHoverAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.scrollUpHover',
            label: nls.localize({
                key: 'scrollUpHover',
                comment: [
                    'Action that allows to scroll up in the hover widget with the up arrow when the hover widget is focused.'
                ]
            }, "Scroll Up Hover"),
            alias: 'Scroll Up Hover',
            precondition: EditorContextKeys.hoverFocused,
            kbOpts: {
                kbExpr: EditorContextKeys.hoverFocused,
                primary: 16 /* KeyCode.UpArrow */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        controller.scrollUp();
    }
}
class ScrollDownHoverAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.scrollDownHover',
            label: nls.localize({
                key: 'scrollDownHover',
                comment: [
                    'Action that allows to scroll down in the hover widget with the up arrow when the hover widget is focused.'
                ]
            }, "Scroll Down Hover"),
            alias: 'Scroll Down Hover',
            precondition: EditorContextKeys.hoverFocused,
            kbOpts: {
                kbExpr: EditorContextKeys.hoverFocused,
                primary: 18 /* KeyCode.DownArrow */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        controller.scrollDown();
    }
}
class ScrollLeftHoverAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.scrollLeftHover',
            label: nls.localize({
                key: 'scrollLeftHover',
                comment: [
                    'Action that allows to scroll left in the hover widget with the left arrow when the hover widget is focused.'
                ]
            }, "Scroll Left Hover"),
            alias: 'Scroll Left Hover',
            precondition: EditorContextKeys.hoverFocused,
            kbOpts: {
                kbExpr: EditorContextKeys.hoverFocused,
                primary: 15 /* KeyCode.LeftArrow */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        controller.scrollLeft();
    }
}
class ScrollRightHoverAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.scrollRightHover',
            label: nls.localize({
                key: 'scrollRightHover',
                comment: [
                    'Action that allows to scroll right in the hover widget with the right arrow when the hover widget is focused.'
                ]
            }, "Scroll Right Hover"),
            alias: 'Scroll Right Hover',
            precondition: EditorContextKeys.hoverFocused,
            kbOpts: {
                kbExpr: EditorContextKeys.hoverFocused,
                primary: 17 /* KeyCode.RightArrow */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        controller.scrollRight();
    }
}
class PageUpHoverAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.pageUpHover',
            label: nls.localize({
                key: 'pageUpHover',
                comment: [
                    'Action that allows to page up in the hover widget with the page up command when the hover widget is focused.'
                ]
            }, "Page Up Hover"),
            alias: 'Page Up Hover',
            precondition: EditorContextKeys.hoverFocused,
            kbOpts: {
                kbExpr: EditorContextKeys.hoverFocused,
                primary: 11 /* KeyCode.PageUp */,
                secondary: [512 /* KeyMod.Alt */ | 16 /* KeyCode.UpArrow */],
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        controller.pageUp();
    }
}
class PageDownHoverAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.pageDownHover',
            label: nls.localize({
                key: 'pageDownHover',
                comment: [
                    'Action that allows to page down in the hover widget with the page down command when the hover widget is focused.'
                ]
            }, "Page Down Hover"),
            alias: 'Page Down Hover',
            precondition: EditorContextKeys.hoverFocused,
            kbOpts: {
                kbExpr: EditorContextKeys.hoverFocused,
                primary: 12 /* KeyCode.PageDown */,
                secondary: [512 /* KeyMod.Alt */ | 18 /* KeyCode.DownArrow */],
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        controller.pageDown();
    }
}
class GoToTopHoverAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.goToTopHover',
            label: nls.localize({
                key: 'goToTopHover',
                comment: [
                    'Action that allows to go to the top of the hover widget with the home command when the hover widget is focused.'
                ]
            }, "Go To Top Hover"),
            alias: 'Go To Bottom Hover',
            precondition: EditorContextKeys.hoverFocused,
            kbOpts: {
                kbExpr: EditorContextKeys.hoverFocused,
                primary: 14 /* KeyCode.Home */,
                secondary: [2048 /* KeyMod.CtrlCmd */ | 16 /* KeyCode.UpArrow */],
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        controller.goToTop();
    }
}
class GoToBottomHoverAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.goToBottomHover',
            label: nls.localize({
                key: 'goToBottomHover',
                comment: [
                    'Action that allows to go to the bottom in the hover widget with the end command when the hover widget is focused.'
                ]
            }, "Go To Bottom Hover"),
            alias: 'Go To Bottom Hover',
            precondition: EditorContextKeys.hoverFocused,
            kbOpts: {
                kbExpr: EditorContextKeys.hoverFocused,
                primary: 13 /* KeyCode.End */,
                secondary: [2048 /* KeyMod.CtrlCmd */ | 18 /* KeyCode.DownArrow */],
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        controller.goToBottom();
    }
}
class EscapeFocusHoverAction extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.escapeFocusHover',
            label: nls.localize({
                key: 'escapeFocusHover',
                comment: [
                    'Action that allows to escape from the hover widget with the escape command when the hover widget is focused.'
                ]
            }, "Escape Focus Hover"),
            alias: 'Escape Focus Hover',
            precondition: EditorContextKeys.hoverFocused,
            kbOpts: {
                kbExpr: EditorContextKeys.hoverFocused,
                primary: 9 /* KeyCode.Escape */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        controller.escape();
    }
}
registerEditorContribution(ModesHoverController.ID, ModesHoverController, 2 /* EditorContributionInstantiation.BeforeFirstInteraction */);
registerEditorAction(ShowOrFocusHoverAction);
registerEditorAction(ShowDefinitionPreviewHoverAction);
registerEditorAction(ScrollUpHoverAction);
registerEditorAction(ScrollDownHoverAction);
registerEditorAction(ScrollLeftHoverAction);
registerEditorAction(ScrollRightHoverAction);
registerEditorAction(PageUpHoverAction);
registerEditorAction(PageDownHoverAction);
registerEditorAction(GoToTopHoverAction);
registerEditorAction(GoToBottomHoverAction);
registerEditorAction(EscapeFocusHoverAction);
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
