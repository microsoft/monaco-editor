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
import * as browser from '../../../base/browser/browser.js';
import * as arrays from '../../../base/common/arrays.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import * as objects from '../../../base/common/objects.js';
import * as platform from '../../../base/common/platform.js';
import { ElementSizeObserver } from './elementSizeObserver.js';
import { FontMeasurements } from './fontMeasurements.js';
import { migrateOptions } from './migrateOptions.js';
import { TabFocus } from './tabFocus.js';
import { ComputeOptionsMemory, ConfigurationChangedEvent, editorOptionsRegistry } from '../../common/config/editorOptions.js';
import { EditorZoom } from '../../common/config/editorZoom.js';
import { BareFontInfo } from '../../common/config/fontInfo.js';
import { IAccessibilityService } from '../../../platform/accessibility/common/accessibility.js';
let EditorConfiguration = class EditorConfiguration extends Disposable {
    constructor(isSimpleWidget, options, container, _accessibilityService) {
        super();
        this._accessibilityService = _accessibilityService;
        this._onDidChange = this._register(new Emitter());
        this.onDidChange = this._onDidChange.event;
        this._onDidChangeFast = this._register(new Emitter());
        this.onDidChangeFast = this._onDidChangeFast.event;
        this._isDominatedByLongLines = false;
        this._viewLineCount = 1;
        this._lineNumbersDigitCount = 1;
        this._reservedHeight = 0;
        this._computeOptionsMemory = new ComputeOptionsMemory();
        this.isSimpleWidget = isSimpleWidget;
        this._containerObserver = this._register(new ElementSizeObserver(container, options.dimension));
        this._rawOptions = deepCloneAndMigrateOptions(options);
        this._validatedOptions = EditorOptionsUtil.validateOptions(this._rawOptions);
        this.options = this._computeOptions();
        if (this.options.get(10 /* EditorOption.automaticLayout */)) {
            this._containerObserver.startObserving();
        }
        this._register(EditorZoom.onDidChangeZoomLevel(() => this._recomputeOptions()));
        this._register(TabFocus.onDidChangeTabFocus(() => this._recomputeOptions()));
        this._register(this._containerObserver.onDidChange(() => this._recomputeOptions()));
        this._register(FontMeasurements.onDidChange(() => this._recomputeOptions()));
        this._register(browser.PixelRatio.onDidChange(() => this._recomputeOptions()));
        this._register(this._accessibilityService.onDidChangeScreenReaderOptimized(() => this._recomputeOptions()));
    }
    _recomputeOptions() {
        const newOptions = this._computeOptions();
        const changeEvent = EditorOptionsUtil.checkEquals(this.options, newOptions);
        if (changeEvent === null) {
            // nothing changed!
            return;
        }
        this.options = newOptions;
        this._onDidChangeFast.fire(changeEvent);
        this._onDidChange.fire(changeEvent);
    }
    _computeOptions() {
        const partialEnv = this._readEnvConfiguration();
        const bareFontInfo = BareFontInfo.createFromValidatedSettings(this._validatedOptions, partialEnv.pixelRatio, this.isSimpleWidget);
        const fontInfo = this._readFontInfo(bareFontInfo);
        const env = {
            memory: this._computeOptionsMemory,
            outerWidth: partialEnv.outerWidth,
            outerHeight: partialEnv.outerHeight - this._reservedHeight,
            fontInfo: fontInfo,
            extraEditorClassName: partialEnv.extraEditorClassName,
            isDominatedByLongLines: this._isDominatedByLongLines,
            viewLineCount: this._viewLineCount,
            lineNumbersDigitCount: this._lineNumbersDigitCount,
            emptySelectionClipboard: partialEnv.emptySelectionClipboard,
            pixelRatio: partialEnv.pixelRatio,
            tabFocusMode: TabFocus.getTabFocusMode(),
            accessibilitySupport: partialEnv.accessibilitySupport
        };
        return EditorOptionsUtil.computeOptions(this._validatedOptions, env);
    }
    _readEnvConfiguration() {
        return {
            extraEditorClassName: getExtraEditorClassName(),
            outerWidth: this._containerObserver.getWidth(),
            outerHeight: this._containerObserver.getHeight(),
            emptySelectionClipboard: browser.isWebKit || browser.isFirefox,
            pixelRatio: browser.PixelRatio.value,
            accessibilitySupport: (this._accessibilityService.isScreenReaderOptimized()
                ? 2 /* AccessibilitySupport.Enabled */
                : this._accessibilityService.getAccessibilitySupport())
        };
    }
    _readFontInfo(bareFontInfo) {
        return FontMeasurements.readFontInfo(bareFontInfo);
    }
    getRawOptions() {
        return this._rawOptions;
    }
    updateOptions(_newOptions) {
        const newOptions = deepCloneAndMigrateOptions(_newOptions);
        const didChange = EditorOptionsUtil.applyUpdate(this._rawOptions, newOptions);
        if (!didChange) {
            return;
        }
        this._validatedOptions = EditorOptionsUtil.validateOptions(this._rawOptions);
        this._recomputeOptions();
    }
    observeContainer(dimension) {
        this._containerObserver.observe(dimension);
    }
    setIsDominatedByLongLines(isDominatedByLongLines) {
        if (this._isDominatedByLongLines === isDominatedByLongLines) {
            return;
        }
        this._isDominatedByLongLines = isDominatedByLongLines;
        this._recomputeOptions();
    }
    setModelLineCount(modelLineCount) {
        const lineNumbersDigitCount = digitCount(modelLineCount);
        if (this._lineNumbersDigitCount === lineNumbersDigitCount) {
            return;
        }
        this._lineNumbersDigitCount = lineNumbersDigitCount;
        this._recomputeOptions();
    }
    setViewLineCount(viewLineCount) {
        if (this._viewLineCount === viewLineCount) {
            return;
        }
        this._viewLineCount = viewLineCount;
        this._recomputeOptions();
    }
    setReservedHeight(reservedHeight) {
        if (this._reservedHeight === reservedHeight) {
            return;
        }
        this._reservedHeight = reservedHeight;
        this._recomputeOptions();
    }
};
EditorConfiguration = __decorate([
    __param(3, IAccessibilityService)
], EditorConfiguration);
export { EditorConfiguration };
function digitCount(n) {
    let r = 0;
    while (n) {
        n = Math.floor(n / 10);
        r++;
    }
    return r ? r : 1;
}
function getExtraEditorClassName() {
    let extra = '';
    if (!browser.isSafari && !browser.isWebkitWebView) {
        // Use user-select: none in all browsers except Safari and native macOS WebView
        extra += 'no-user-select ';
    }
    if (browser.isSafari) {
        // See https://github.com/microsoft/vscode/issues/108822
        extra += 'no-minimap-shadow ';
        extra += 'enable-user-select ';
    }
    if (platform.isMacintosh) {
        extra += 'mac ';
    }
    return extra;
}
class ValidatedEditorOptions {
    constructor() {
        this._values = [];
    }
    _read(option) {
        return this._values[option];
    }
    get(id) {
        return this._values[id];
    }
    _write(option, value) {
        this._values[option] = value;
    }
}
export class ComputedEditorOptions {
    constructor() {
        this._values = [];
    }
    _read(id) {
        if (id >= this._values.length) {
            throw new Error('Cannot read uninitialized value');
        }
        return this._values[id];
    }
    get(id) {
        return this._read(id);
    }
    _write(id, value) {
        this._values[id] = value;
    }
}
class EditorOptionsUtil {
    static validateOptions(options) {
        const result = new ValidatedEditorOptions();
        for (const editorOption of editorOptionsRegistry) {
            const value = (editorOption.name === '_never_' ? undefined : options[editorOption.name]);
            result._write(editorOption.id, editorOption.validate(value));
        }
        return result;
    }
    static computeOptions(options, env) {
        const result = new ComputedEditorOptions();
        for (const editorOption of editorOptionsRegistry) {
            result._write(editorOption.id, editorOption.compute(env, result, options._read(editorOption.id)));
        }
        return result;
    }
    static _deepEquals(a, b) {
        if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) {
            return a === b;
        }
        if (Array.isArray(a) || Array.isArray(b)) {
            return (Array.isArray(a) && Array.isArray(b) ? arrays.equals(a, b) : false);
        }
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }
        for (const key in a) {
            if (!EditorOptionsUtil._deepEquals(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }
    static checkEquals(a, b) {
        const result = [];
        let somethingChanged = false;
        for (const editorOption of editorOptionsRegistry) {
            const changed = !EditorOptionsUtil._deepEquals(a._read(editorOption.id), b._read(editorOption.id));
            result[editorOption.id] = changed;
            if (changed) {
                somethingChanged = true;
            }
        }
        return (somethingChanged ? new ConfigurationChangedEvent(result) : null);
    }
    /**
     * Returns true if something changed.
     * Modifies `options`.
    */
    static applyUpdate(options, update) {
        let changed = false;
        for (const editorOption of editorOptionsRegistry) {
            if (update.hasOwnProperty(editorOption.name)) {
                const result = editorOption.applyUpdate(options[editorOption.name], update[editorOption.name]);
                options[editorOption.name] = result.newValue;
                changed = changed || result.didChange;
            }
        }
        return changed;
    }
}
function deepCloneAndMigrateOptions(_options) {
    const options = objects.deepClone(_options);
    migrateOptions(options);
    return options;
}
