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
import { Disposable } from '../../../../base/common/lifecycle.js';
import { StandaloneColorPickerParticipant } from './colorHoverParticipant.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { EditorHoverStatusBar } from '../../hover/browser/contentHover.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { Emitter } from '../../../../base/common/event.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { registerEditorContribution } from '../../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IModelService } from '../../../common/services/model.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { DefaultDocumentColorProvider } from './defaultDocumentColorProvider.js';
import * as dom from '../../../../base/browser/dom.js';
import './colorPicker.css';
export let StandaloneColorPickerController = class StandaloneColorPickerController extends Disposable {
    constructor(_editor, _contextKeyService, _modelService, _keybindingService, _instantiationService, _languageFeatureService, _languageConfigurationService) {
        super();
        this._editor = _editor;
        this._modelService = _modelService;
        this._keybindingService = _keybindingService;
        this._instantiationService = _instantiationService;
        this._languageFeatureService = _languageFeatureService;
        this._languageConfigurationService = _languageConfigurationService;
        this._standaloneColorPickerWidget = null;
        this._standaloneColorPickerVisible = EditorContextKeys.standaloneColorPickerVisible.bindTo(_contextKeyService);
        this._standaloneColorPickerFocused = EditorContextKeys.standaloneColorPickerFocused.bindTo(_contextKeyService);
    }
    showOrFocus() {
        var _a;
        if (!this._editor.hasModel()) {
            return;
        }
        if (!this._standaloneColorPickerVisible.get()) {
            this._standaloneColorPickerWidget = new StandaloneColorPickerWidget(this._editor, this._standaloneColorPickerVisible, this._standaloneColorPickerFocused, this._instantiationService, this._modelService, this._keybindingService, this._languageFeatureService, this._languageConfigurationService);
        }
        else if (!this._standaloneColorPickerFocused.get()) {
            (_a = this._standaloneColorPickerWidget) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }
    hide() {
        var _a;
        this._standaloneColorPickerFocused.set(false);
        this._standaloneColorPickerVisible.set(false);
        (_a = this._standaloneColorPickerWidget) === null || _a === void 0 ? void 0 : _a.hide();
        this._editor.focus();
    }
    insertColor() {
        var _a;
        (_a = this._standaloneColorPickerWidget) === null || _a === void 0 ? void 0 : _a.updateEditor();
        this.hide();
    }
    static get(editor) {
        return editor.getContribution(StandaloneColorPickerController.ID);
    }
};
StandaloneColorPickerController.ID = 'editor.contrib.standaloneColorPickerController';
StandaloneColorPickerController = __decorate([
    __param(1, IContextKeyService),
    __param(2, IModelService),
    __param(3, IKeybindingService),
    __param(4, IInstantiationService),
    __param(5, ILanguageFeaturesService),
    __param(6, ILanguageConfigurationService)
], StandaloneColorPickerController);
registerEditorContribution(StandaloneColorPickerController.ID, StandaloneColorPickerController, 1 /* EditorContributionInstantiation.AfterFirstRender */);
const PADDING = 8;
const CLOSE_BUTTON_WIDTH = 22;
export let StandaloneColorPickerWidget = class StandaloneColorPickerWidget extends Disposable {
    constructor(_editor, _standaloneColorPickerVisible, _standaloneColorPickerFocused, _instantiationService, _modelService, _keybindingService, _languageFeaturesService, _languageConfigurationService) {
        var _a;
        super();
        this._editor = _editor;
        this._standaloneColorPickerVisible = _standaloneColorPickerVisible;
        this._standaloneColorPickerFocused = _standaloneColorPickerFocused;
        this._modelService = _modelService;
        this._keybindingService = _keybindingService;
        this._languageFeaturesService = _languageFeaturesService;
        this._languageConfigurationService = _languageConfigurationService;
        this.allowEditorOverflow = true;
        this.body = document.createElement('div');
        this._position = undefined;
        this._colorHover = null;
        this._selectionSetInEditor = false;
        this._onResult = this._register(new Emitter());
        this.onResult = this._onResult.event;
        this._standaloneColorPickerVisible.set(true);
        this._standaloneColorPickerParticipant = _instantiationService.createInstance(StandaloneColorPickerParticipant, this._editor);
        this._position = (_a = this._editor._getViewModel()) === null || _a === void 0 ? void 0 : _a.getPrimaryCursorState().modelState.position;
        const editorSelection = this._editor.getSelection();
        const selection = editorSelection ?
            {
                startLineNumber: editorSelection.startLineNumber,
                startColumn: editorSelection.startColumn,
                endLineNumber: editorSelection.endLineNumber,
                endColumn: editorSelection.endColumn
            } : { startLineNumber: 0, endLineNumber: 0, endColumn: 0, startColumn: 0 };
        const focusTracker = this._register(dom.trackFocus(this.body));
        this._register(focusTracker.onDidBlur(_ => {
            this.hide();
        }));
        this._register(focusTracker.onDidFocus(_ => {
            this.focus();
        }));
        // When the cursor position changes, hide the color picker
        this._register(this._editor.onDidChangeCursorPosition(() => {
            // Do not hide the color picker when the cursor changes position due to the keybindings
            if (!this._selectionSetInEditor) {
                this.hide();
            }
            else {
                this._selectionSetInEditor = false;
            }
        }));
        this._register(this._editor.onMouseMove((e) => {
            var _a;
            const classList = (_a = e.target.element) === null || _a === void 0 ? void 0 : _a.classList;
            if (classList && classList.contains('colorpicker-color-decoration')) {
                this.hide();
            }
        }));
        this._register(this.onResult((result) => {
            this._render(result.value, result.foundInEditor);
        }));
        this._start(selection);
        this._editor.addContentWidget(this);
    }
    updateEditor() {
        if (this._colorHover) {
            this._standaloneColorPickerParticipant.updateEditorModel(this._colorHover);
        }
    }
    getId() {
        return StandaloneColorPickerWidget.ID;
    }
    getDomNode() {
        return this.body;
    }
    getPosition() {
        if (!this._position) {
            return null;
        }
        const positionPreference = this._editor.getOption(58 /* EditorOption.hover */).above;
        return {
            position: this._position,
            secondaryPosition: this._position,
            preference: positionPreference ? [1 /* ContentWidgetPositionPreference.ABOVE */, 2 /* ContentWidgetPositionPreference.BELOW */] : [2 /* ContentWidgetPositionPreference.BELOW */, 1 /* ContentWidgetPositionPreference.ABOVE */],
            positionAffinity: 2 /* PositionAffinity.None */
        };
    }
    hide() {
        this.dispose();
        this._standaloneColorPickerVisible.set(false);
        this._standaloneColorPickerFocused.set(false);
        this._editor.removeContentWidget(this);
        this._editor.focus();
    }
    focus() {
        this._standaloneColorPickerFocused.set(true);
        this.body.focus();
    }
    _start(selection) {
        return __awaiter(this, void 0, void 0, function* () {
            const computeAsyncResult = yield this._computeAsync(selection);
            if (!computeAsyncResult) {
                return;
            }
            this._onResult.fire(new StandaloneColorPickerResult(computeAsyncResult.result, computeAsyncResult.foundInEditor));
        });
    }
    _computeAsync(range) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._editor.hasModel()) {
                return null;
            }
            const colorInfo = {
                range: range,
                color: { red: 0, green: 0, blue: 0, alpha: 1 }
            };
            const colorHoverResult = yield this._standaloneColorPickerParticipant.createColorHover(colorInfo, new DefaultDocumentColorProvider(this._modelService, this._languageConfigurationService), this._languageFeaturesService.colorProvider);
            if (!colorHoverResult) {
                return null;
            }
            return { result: colorHoverResult.colorHover, foundInEditor: colorHoverResult.foundInEditor };
        });
    }
    _render(colorHover, foundInEditor) {
        const fragment = document.createDocumentFragment();
        const statusBar = this._register(new EditorHoverStatusBar(this._keybindingService));
        let colorPickerWidget;
        const context = {
            fragment,
            statusBar,
            setColorPicker: (widget) => colorPickerWidget = widget,
            onContentsChanged: () => { },
            hide: () => this.hide()
        };
        this._colorHover = colorHover;
        this._register(this._standaloneColorPickerParticipant.renderHoverParts(context, [colorHover]));
        if (colorPickerWidget === undefined) {
            return;
        }
        this.body.classList.add('standalone-colorpicker-body');
        this.body.style.maxHeight = Math.max(this._editor.getLayoutInfo().height / 4, 250) + 'px';
        this.body.style.maxWidth = Math.max(this._editor.getLayoutInfo().width * 0.66, 500) + 'px';
        this.body.tabIndex = 0;
        this.body.appendChild(fragment);
        colorPickerWidget.layout();
        const colorPickerBody = colorPickerWidget.body;
        const saturationBoxWidth = colorPickerBody.saturationBox.domNode.clientWidth;
        const widthOfOriginalColorBox = colorPickerBody.domNode.clientWidth - saturationBoxWidth - CLOSE_BUTTON_WIDTH - PADDING;
        const enterButton = colorPickerWidget.body.enterButton;
        enterButton === null || enterButton === void 0 ? void 0 : enterButton.onClicked(() => {
            this.updateEditor();
            this.hide();
        });
        const colorPickerHeader = colorPickerWidget.header;
        const pickedColorNode = colorPickerHeader.pickedColorNode;
        pickedColorNode.style.width = saturationBoxWidth + PADDING + 'px';
        const originalColorNode = colorPickerHeader.originalColorNode;
        originalColorNode.style.width = widthOfOriginalColorBox + 'px';
        const closeButton = colorPickerWidget.header.closeButton;
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.onClicked(() => {
            this.hide();
        });
        // When found in the editor, highlight the selection in the editor
        if (foundInEditor) {
            if (enterButton) {
                enterButton.button.textContent = 'Replace';
            }
            this._selectionSetInEditor = true;
            this._editor.setSelection(colorHover.range);
        }
        this._editor.layoutContentWidget(this);
    }
};
StandaloneColorPickerWidget.ID = 'editor.contrib.standaloneColorPickerWidget';
StandaloneColorPickerWidget = __decorate([
    __param(3, IInstantiationService),
    __param(4, IModelService),
    __param(5, IKeybindingService),
    __param(6, ILanguageFeaturesService),
    __param(7, ILanguageConfigurationService)
], StandaloneColorPickerWidget);
class StandaloneColorPickerResult {
    // The color picker result consists of: an array of color results and a boolean indicating if the color was found in the editor
    constructor(value, foundInEditor) {
        this.value = value;
        this.foundInEditor = foundInEditor;
    }
}
