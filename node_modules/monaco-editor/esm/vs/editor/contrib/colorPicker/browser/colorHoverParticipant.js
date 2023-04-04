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
import { AsyncIterableObject } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Color, RGBA } from '../../../../base/common/color.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Range } from '../../../common/core/range.js';
import { getColorPresentations } from './color.js';
import { ColorDetector } from './colorDetector.js';
import { ColorPickerModel } from './colorPickerModel.js';
import { ColorPickerWidget } from './colorPickerWidget.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
export class ColorHover {
    constructor(owner, range, model, provider) {
        this.owner = owner;
        this.range = range;
        this.model = model;
        this.provider = provider;
        /**
         * Force the hover to always be rendered at this specific range,
         * even in the case of multiple hover parts.
         */
        this.forceShowAtRange = true;
    }
    isValidForHoverAnchor(anchor) {
        return (anchor.type === 1 /* HoverAnchorType.Range */
            && this.range.startColumn <= anchor.range.startColumn
            && this.range.endColumn >= anchor.range.endColumn);
    }
}
let ColorHoverParticipant = class ColorHoverParticipant {
    constructor(_editor, _themeService) {
        this._editor = _editor;
        this._themeService = _themeService;
        this.hoverOrdinal = 2;
    }
    computeSync(anchor, lineDecorations) {
        return [];
    }
    computeAsync(anchor, lineDecorations, token) {
        return AsyncIterableObject.fromPromise(this._computeAsync(anchor, lineDecorations, token));
    }
    _computeAsync(anchor, lineDecorations, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._editor.hasModel()) {
                return [];
            }
            const colorDetector = ColorDetector.get(this._editor);
            if (!colorDetector) {
                return [];
            }
            for (const d of lineDecorations) {
                if (!colorDetector.isColorDecoration(d)) {
                    continue;
                }
                const colorData = colorDetector.getColorData(d.range.getStartPosition());
                if (colorData) {
                    const colorHover = yield this._createColorHover(this._editor.getModel(), colorData.colorInfo, colorData.provider);
                    return [colorHover];
                }
            }
            return [];
        });
    }
    _createColorHover(editorModel, colorInfo, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalText = editorModel.getValueInRange(colorInfo.range);
            const { red, green, blue, alpha } = colorInfo.color;
            const rgba = new RGBA(Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255), alpha);
            const color = new Color(rgba);
            const colorPresentations = yield getColorPresentations(editorModel, colorInfo, provider, CancellationToken.None);
            const model = new ColorPickerModel(color, [], 0);
            model.colorPresentations = colorPresentations || [];
            model.guessColorPresentation(color, originalText);
            return new ColorHover(this, Range.lift(colorInfo.range), model, provider);
        });
    }
    renderHoverParts(context, hoverParts) {
        if (hoverParts.length === 0 || !this._editor.hasModel()) {
            return Disposable.None;
        }
        const disposables = new DisposableStore();
        const colorHover = hoverParts[0];
        const editorModel = this._editor.getModel();
        const model = colorHover.model;
        const widget = disposables.add(new ColorPickerWidget(context.fragment, model, this._editor.getOption(137 /* EditorOption.pixelRatio */), this._themeService));
        context.setColorPicker(widget);
        let range = new Range(colorHover.range.startLineNumber, colorHover.range.startColumn, colorHover.range.endLineNumber, colorHover.range.endColumn);
        const updateEditorModel = () => {
            let textEdits;
            let newRange;
            if (model.presentation.textEdit) {
                textEdits = [model.presentation.textEdit];
                newRange = new Range(model.presentation.textEdit.range.startLineNumber, model.presentation.textEdit.range.startColumn, model.presentation.textEdit.range.endLineNumber, model.presentation.textEdit.range.endColumn);
                const trackedRange = this._editor.getModel()._setTrackedRange(null, newRange, 3 /* TrackedRangeStickiness.GrowsOnlyWhenTypingAfter */);
                this._editor.pushUndoStop();
                this._editor.executeEdits('colorpicker', textEdits);
                newRange = this._editor.getModel()._getTrackedRange(trackedRange) || newRange;
            }
            else {
                textEdits = [{ range, text: model.presentation.label, forceMoveMarkers: false }];
                newRange = range.setEndPosition(range.endLineNumber, range.startColumn + model.presentation.label.length);
                this._editor.pushUndoStop();
                this._editor.executeEdits('colorpicker', textEdits);
            }
            if (model.presentation.additionalTextEdits) {
                textEdits = [...model.presentation.additionalTextEdits];
                this._editor.executeEdits('colorpicker', textEdits);
                context.hide();
            }
            this._editor.pushUndoStop();
            range = newRange;
        };
        const updateColorPresentations = (color) => {
            return getColorPresentations(editorModel, {
                range: range,
                color: {
                    red: color.rgba.r / 255,
                    green: color.rgba.g / 255,
                    blue: color.rgba.b / 255,
                    alpha: color.rgba.a
                }
            }, colorHover.provider, CancellationToken.None).then((colorPresentations) => {
                model.colorPresentations = colorPresentations || [];
            });
        };
        disposables.add(model.onColorFlushed((color) => {
            updateColorPresentations(color).then(updateEditorModel);
        }));
        disposables.add(model.onDidChangeColor(updateColorPresentations));
        return disposables;
    }
};
ColorHoverParticipant = __decorate([
    __param(1, IThemeService)
], ColorHoverParticipant);
export { ColorHoverParticipant };
