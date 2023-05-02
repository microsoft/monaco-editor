/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { PixelRatio } from '../../../../base/browser/browser.js';
import * as dom from '../../../../base/browser/dom.js';
import { GlobalPointerMoveMonitor } from '../../../../base/browser/globalPointerMoveMonitor.js';
import { Widget } from '../../../../base/browser/ui/widget.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Color, HSVA, RGBA } from '../../../../base/common/color.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import './colorPicker.css';
import { localize } from '../../../../nls.js';
import { editorHoverBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
const $ = dom.$;
export class ColorPickerHeader extends Disposable {
    constructor(container, model, themeService, showingStandaloneColorPicker = false) {
        super();
        this.model = model;
        this.showingStandaloneColorPicker = showingStandaloneColorPicker;
        this._closeButton = null;
        this._domNode = $('.colorpicker-header');
        dom.append(container, this._domNode);
        this._pickedColorNode = dom.append(this._domNode, $('.picked-color'));
        const tooltip = localize('clickToToggleColorOptions', "Click to toggle color options (rgb/hsl/hex)");
        this._pickedColorNode.setAttribute('title', tooltip);
        this._originalColorNode = dom.append(this._domNode, $('.original-color'));
        this._originalColorNode.style.backgroundColor = Color.Format.CSS.format(this.model.originalColor) || '';
        this.backgroundColor = themeService.getColorTheme().getColor(editorHoverBackground) || Color.white;
        this._register(themeService.onDidColorThemeChange(theme => {
            this.backgroundColor = theme.getColor(editorHoverBackground) || Color.white;
        }));
        this._register(dom.addDisposableListener(this._pickedColorNode, dom.EventType.CLICK, () => this.model.selectNextColorPresentation()));
        this._register(dom.addDisposableListener(this._originalColorNode, dom.EventType.CLICK, () => {
            this.model.color = this.model.originalColor;
            this.model.flushColor();
        }));
        this._register(model.onDidChangeColor(this.onDidChangeColor, this));
        this._register(model.onDidChangePresentation(this.onDidChangePresentation, this));
        this._pickedColorNode.style.backgroundColor = Color.Format.CSS.format(model.color) || '';
        this._pickedColorNode.classList.toggle('light', model.color.rgba.a < 0.5 ? this.backgroundColor.isLighter() : model.color.isLighter());
        this.onDidChangeColor(this.model.color);
        // When the color picker widget is a standalone color picker widget, then add a close button
        if (this.showingStandaloneColorPicker) {
            this._domNode.classList.add('standalone-colorpicker');
            this._closeButton = this._register(new CloseButton(this._domNode));
        }
    }
    get closeButton() {
        return this._closeButton;
    }
    get pickedColorNode() {
        return this._pickedColorNode;
    }
    get originalColorNode() {
        return this._originalColorNode;
    }
    onDidChangeColor(color) {
        this._pickedColorNode.style.backgroundColor = Color.Format.CSS.format(color) || '';
        this._pickedColorNode.classList.toggle('light', color.rgba.a < 0.5 ? this.backgroundColor.isLighter() : color.isLighter());
        this.onDidChangePresentation();
    }
    onDidChangePresentation() {
        this._pickedColorNode.textContent = this.model.presentation ? this.model.presentation.label : '';
        this._pickedColorNode.prepend($('.codicon.codicon-color-mode'));
    }
}
class CloseButton extends Disposable {
    constructor(container) {
        super();
        this._onClicked = this._register(new Emitter());
        this.onClicked = this._onClicked.event;
        this._button = document.createElement('div');
        this._button.classList.add('close-button');
        dom.append(container, this._button);
        const innerDiv = document.createElement('div');
        innerDiv.classList.add('close-button-inner-div');
        dom.append(this._button, innerDiv);
        const closeButton = dom.append(innerDiv, $('.button' + ThemeIcon.asCSSSelector(registerIcon('color-picker-close', Codicon.close, localize('closeIcon', 'Icon to close the color picker')))));
        closeButton.classList.add('close-icon');
        this._button.onclick = () => {
            this._onClicked.fire();
        };
    }
}
export class ColorPickerBody extends Disposable {
    constructor(container, model, pixelRatio, isStandaloneColorPicker = false) {
        super();
        this.model = model;
        this.pixelRatio = pixelRatio;
        this._insertButton = null;
        this._domNode = $('.colorpicker-body');
        dom.append(container, this._domNode);
        this._saturationBox = new SaturationBox(this._domNode, this.model, this.pixelRatio);
        this._register(this._saturationBox);
        this._register(this._saturationBox.onDidChange(this.onDidSaturationValueChange, this));
        this._register(this._saturationBox.onColorFlushed(this.flushColor, this));
        this._opacityStrip = new OpacityStrip(this._domNode, this.model, isStandaloneColorPicker);
        this._register(this._opacityStrip);
        this._register(this._opacityStrip.onDidChange(this.onDidOpacityChange, this));
        this._register(this._opacityStrip.onColorFlushed(this.flushColor, this));
        this._hueStrip = new HueStrip(this._domNode, this.model, isStandaloneColorPicker);
        this._register(this._hueStrip);
        this._register(this._hueStrip.onDidChange(this.onDidHueChange, this));
        this._register(this._hueStrip.onColorFlushed(this.flushColor, this));
        if (isStandaloneColorPicker) {
            this._insertButton = this._register(new InsertButton(this._domNode));
            this._domNode.classList.add('standalone-colorpicker');
        }
    }
    flushColor() {
        this.model.flushColor();
    }
    onDidSaturationValueChange({ s, v }) {
        const hsva = this.model.color.hsva;
        this.model.color = new Color(new HSVA(hsva.h, s, v, hsva.a));
    }
    onDidOpacityChange(a) {
        const hsva = this.model.color.hsva;
        this.model.color = new Color(new HSVA(hsva.h, hsva.s, hsva.v, a));
    }
    onDidHueChange(value) {
        const hsva = this.model.color.hsva;
        const h = (1 - value) * 360;
        this.model.color = new Color(new HSVA(h === 360 ? 0 : h, hsva.s, hsva.v, hsva.a));
    }
    get domNode() {
        return this._domNode;
    }
    get saturationBox() {
        return this._saturationBox;
    }
    get enterButton() {
        return this._insertButton;
    }
    layout() {
        this._saturationBox.layout();
        this._opacityStrip.layout();
        this._hueStrip.layout();
    }
}
class SaturationBox extends Disposable {
    constructor(container, model, pixelRatio) {
        super();
        this.model = model;
        this.pixelRatio = pixelRatio;
        this._onDidChange = new Emitter();
        this.onDidChange = this._onDidChange.event;
        this._onColorFlushed = new Emitter();
        this.onColorFlushed = this._onColorFlushed.event;
        this._domNode = $('.saturation-wrap');
        dom.append(container, this._domNode);
        // Create canvas, draw selected color
        this._canvas = document.createElement('canvas');
        this._canvas.className = 'saturation-box';
        dom.append(this._domNode, this._canvas);
        // Add selection circle
        this.selection = $('.saturation-selection');
        dom.append(this._domNode, this.selection);
        this.layout();
        this._register(dom.addDisposableListener(this._domNode, dom.EventType.POINTER_DOWN, e => this.onPointerDown(e)));
        this._register(this.model.onDidChangeColor(this.onDidChangeColor, this));
        this.monitor = null;
    }
    get domNode() {
        return this._domNode;
    }
    onPointerDown(e) {
        if (!e.target || !(e.target instanceof Element)) {
            return;
        }
        this.monitor = this._register(new GlobalPointerMoveMonitor());
        const origin = dom.getDomNodePagePosition(this._domNode);
        if (e.target !== this.selection) {
            this.onDidChangePosition(e.offsetX, e.offsetY);
        }
        this.monitor.startMonitoring(e.target, e.pointerId, e.buttons, event => this.onDidChangePosition(event.pageX - origin.left, event.pageY - origin.top), () => null);
        const pointerUpListener = dom.addDisposableListener(document, dom.EventType.POINTER_UP, () => {
            this._onColorFlushed.fire();
            pointerUpListener.dispose();
            if (this.monitor) {
                this.monitor.stopMonitoring(true);
                this.monitor = null;
            }
        }, true);
    }
    onDidChangePosition(left, top) {
        const s = Math.max(0, Math.min(1, left / this.width));
        const v = Math.max(0, Math.min(1, 1 - (top / this.height)));
        this.paintSelection(s, v);
        this._onDidChange.fire({ s, v });
    }
    layout() {
        this.width = this._domNode.offsetWidth;
        this.height = this._domNode.offsetHeight;
        this._canvas.width = this.width * this.pixelRatio;
        this._canvas.height = this.height * this.pixelRatio;
        this.paint();
        const hsva = this.model.color.hsva;
        this.paintSelection(hsva.s, hsva.v);
    }
    paint() {
        const hsva = this.model.color.hsva;
        const saturatedColor = new Color(new HSVA(hsva.h, 1, 1, 1));
        const ctx = this._canvas.getContext('2d');
        const whiteGradient = ctx.createLinearGradient(0, 0, this._canvas.width, 0);
        whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        whiteGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        const blackGradient = ctx.createLinearGradient(0, 0, 0, this._canvas.height);
        blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        ctx.rect(0, 0, this._canvas.width, this._canvas.height);
        ctx.fillStyle = Color.Format.CSS.format(saturatedColor);
        ctx.fill();
        ctx.fillStyle = whiteGradient;
        ctx.fill();
        ctx.fillStyle = blackGradient;
        ctx.fill();
    }
    paintSelection(s, v) {
        this.selection.style.left = `${s * this.width}px`;
        this.selection.style.top = `${this.height - v * this.height}px`;
    }
    onDidChangeColor() {
        if (this.monitor && this.monitor.isMonitoring()) {
            return;
        }
        this.paint();
    }
}
class Strip extends Disposable {
    constructor(container, model, showingStandaloneColorPicker = false) {
        super();
        this.model = model;
        this._onDidChange = new Emitter();
        this.onDidChange = this._onDidChange.event;
        this._onColorFlushed = new Emitter();
        this.onColorFlushed = this._onColorFlushed.event;
        if (showingStandaloneColorPicker) {
            this.domNode = dom.append(container, $('.standalone-strip'));
            this.overlay = dom.append(this.domNode, $('.standalone-overlay'));
        }
        else {
            this.domNode = dom.append(container, $('.strip'));
            this.overlay = dom.append(this.domNode, $('.overlay'));
        }
        this.slider = dom.append(this.domNode, $('.slider'));
        this.slider.style.top = `0px`;
        this._register(dom.addDisposableListener(this.domNode, dom.EventType.POINTER_DOWN, e => this.onPointerDown(e)));
        this.layout();
    }
    layout() {
        this.height = this.domNode.offsetHeight - this.slider.offsetHeight;
        const value = this.getValue(this.model.color);
        this.updateSliderPosition(value);
    }
    onPointerDown(e) {
        if (!e.target || !(e.target instanceof Element)) {
            return;
        }
        const monitor = this._register(new GlobalPointerMoveMonitor());
        const origin = dom.getDomNodePagePosition(this.domNode);
        this.domNode.classList.add('grabbing');
        if (e.target !== this.slider) {
            this.onDidChangeTop(e.offsetY);
        }
        monitor.startMonitoring(e.target, e.pointerId, e.buttons, event => this.onDidChangeTop(event.pageY - origin.top), () => null);
        const pointerUpListener = dom.addDisposableListener(document, dom.EventType.POINTER_UP, () => {
            this._onColorFlushed.fire();
            pointerUpListener.dispose();
            monitor.stopMonitoring(true);
            this.domNode.classList.remove('grabbing');
        }, true);
    }
    onDidChangeTop(top) {
        const value = Math.max(0, Math.min(1, 1 - (top / this.height)));
        this.updateSliderPosition(value);
        this._onDidChange.fire(value);
    }
    updateSliderPosition(value) {
        this.slider.style.top = `${(1 - value) * this.height}px`;
    }
}
class OpacityStrip extends Strip {
    constructor(container, model, showingStandaloneColorPicker = false) {
        super(container, model, showingStandaloneColorPicker);
        this.domNode.classList.add('opacity-strip');
        this._register(model.onDidChangeColor(this.onDidChangeColor, this));
        this.onDidChangeColor(this.model.color);
    }
    onDidChangeColor(color) {
        const { r, g, b } = color.rgba;
        const opaque = new Color(new RGBA(r, g, b, 1));
        const transparent = new Color(new RGBA(r, g, b, 0));
        this.overlay.style.background = `linear-gradient(to bottom, ${opaque} 0%, ${transparent} 100%)`;
    }
    getValue(color) {
        return color.hsva.a;
    }
}
class HueStrip extends Strip {
    constructor(container, model, showingStandaloneColorPicker = false) {
        super(container, model, showingStandaloneColorPicker);
        this.domNode.classList.add('hue-strip');
    }
    getValue(color) {
        return 1 - (color.hsva.h / 360);
    }
}
export class InsertButton extends Disposable {
    constructor(container) {
        super();
        this._onClicked = this._register(new Emitter());
        this.onClicked = this._onClicked.event;
        this._button = dom.append(container, document.createElement('button'));
        this._button.classList.add('insert-button');
        this._button.textContent = 'Insert';
        this._button.onclick = e => {
            this._onClicked.fire();
        };
    }
    get button() {
        return this._button;
    }
}
export class ColorPickerWidget extends Widget {
    constructor(container, model, pixelRatio, themeService, standaloneColorPicker = false) {
        super();
        this.model = model;
        this.pixelRatio = pixelRatio;
        this._register(PixelRatio.onDidChange(() => this.layout()));
        const element = $('.colorpicker-widget');
        container.appendChild(element);
        this.header = this._register(new ColorPickerHeader(element, this.model, themeService, standaloneColorPicker));
        this.body = this._register(new ColorPickerBody(element, this.model, this.pixelRatio, standaloneColorPicker));
    }
    layout() {
        this.body.layout();
    }
}
