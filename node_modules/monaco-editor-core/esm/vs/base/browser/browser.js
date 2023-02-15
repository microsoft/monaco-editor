/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../common/event.js';
import { Disposable, markAsSingleton } from '../common/lifecycle.js';
class WindowManager {
    constructor() {
        // --- Zoom Factor
        this._zoomFactor = 1;
    }
    getZoomFactor() {
        return this._zoomFactor;
    }
}
WindowManager.INSTANCE = new WindowManager();
/**
 * See https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#monitoring_screen_resolution_or_zoom_level_changes
 */
class DevicePixelRatioMonitor extends Disposable {
    constructor() {
        super();
        this._onDidChange = this._register(new Emitter());
        this.onDidChange = this._onDidChange.event;
        this._listener = () => this._handleChange(true);
        this._mediaQueryList = null;
        this._handleChange(false);
    }
    _handleChange(fireEvent) {
        var _a;
        (_a = this._mediaQueryList) === null || _a === void 0 ? void 0 : _a.removeEventListener('change', this._listener);
        this._mediaQueryList = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
        this._mediaQueryList.addEventListener('change', this._listener);
        if (fireEvent) {
            this._onDidChange.fire();
        }
    }
}
class PixelRatioImpl extends Disposable {
    get value() {
        return this._value;
    }
    constructor() {
        super();
        this._onDidChange = this._register(new Emitter());
        this.onDidChange = this._onDidChange.event;
        this._value = this._getPixelRatio();
        const dprMonitor = this._register(new DevicePixelRatioMonitor());
        this._register(dprMonitor.onDidChange(() => {
            this._value = this._getPixelRatio();
            this._onDidChange.fire(this._value);
        }));
    }
    _getPixelRatio() {
        const ctx = document.createElement('canvas').getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
        return dpr / bsr;
    }
}
class PixelRatioFacade {
    constructor() {
        this._pixelRatioMonitor = null;
    }
    _getOrCreatePixelRatioMonitor() {
        if (!this._pixelRatioMonitor) {
            this._pixelRatioMonitor = markAsSingleton(new PixelRatioImpl());
        }
        return this._pixelRatioMonitor;
    }
    /**
     * Get the current value.
     */
    get value() {
        return this._getOrCreatePixelRatioMonitor().value;
    }
    /**
     * Listen for changes.
     */
    get onDidChange() {
        return this._getOrCreatePixelRatioMonitor().onDidChange;
    }
}
export function addMatchMediaChangeListener(query, callback) {
    if (typeof query === 'string') {
        query = window.matchMedia(query);
    }
    query.addEventListener('change', callback);
}
/**
 * Returns the pixel ratio.
 *
 * This is useful for rendering <canvas> elements at native screen resolution or for being used as
 * a cache key when storing font measurements. Fonts might render differently depending on resolution
 * and any measurements need to be discarded for example when a window is moved from a monitor to another.
 */
export const PixelRatio = new PixelRatioFacade();
/** The zoom scale for an index, e.g. 1, 1.2, 1.4 */
export function getZoomFactor() {
    return WindowManager.INSTANCE.getZoomFactor();
}
const userAgent = navigator.userAgent;
export const isFirefox = (userAgent.indexOf('Firefox') >= 0);
export const isWebKit = (userAgent.indexOf('AppleWebKit') >= 0);
export const isChrome = (userAgent.indexOf('Chrome') >= 0);
export const isSafari = (!isChrome && (userAgent.indexOf('Safari') >= 0));
export const isWebkitWebView = (!isChrome && !isSafari && isWebKit);
export const isElectron = (userAgent.indexOf('Electron/') >= 0);
export const isAndroid = (userAgent.indexOf('Android') >= 0);
let standalone = false;
if (window.matchMedia) {
    const standaloneMatchMedia = window.matchMedia('(display-mode: standalone) or (display-mode: window-controls-overlay)');
    const fullScreenMatchMedia = window.matchMedia('(display-mode: fullscreen)');
    standalone = standaloneMatchMedia.matches;
    addMatchMediaChangeListener(standaloneMatchMedia, ({ matches }) => {
        // entering fullscreen would change standaloneMatchMedia.matches to false
        // if standalone is true (running as PWA) and entering fullscreen, skip this change
        if (standalone && fullScreenMatchMedia.matches) {
            return;
        }
        // otherwise update standalone (browser to PWA or PWA to browser)
        standalone = matches;
    });
}
export function isStandalone() {
    return standalone;
}
