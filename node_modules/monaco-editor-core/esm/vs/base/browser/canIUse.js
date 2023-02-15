/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as browser from './browser.js';
import * as platform from '../common/platform.js';
/**
 * Browser feature we can support in current platform, browser and environment.
 */
export const BrowserFeatures = {
    clipboard: {
        writeText: (platform.isNative
            || (document.queryCommandSupported && document.queryCommandSupported('copy'))
            || !!(navigator && navigator.clipboard && navigator.clipboard.writeText)),
        readText: (platform.isNative
            || !!(navigator && navigator.clipboard && navigator.clipboard.readText))
    },
    keyboard: (() => {
        if (platform.isNative || browser.isStandalone()) {
            return 0 /* KeyboardSupport.Always */;
        }
        if (navigator.keyboard || browser.isSafari) {
            return 1 /* KeyboardSupport.FullScreen */;
        }
        return 2 /* KeyboardSupport.None */;
    })(),
    // 'ontouchstart' in window always evaluates to true with typescript's modern typings. This causes `window` to be
    // `never` later in `window.navigator`. That's why we need the explicit `window as Window` cast
    touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    pointerEvents: window.PointerEvent && ('ontouchstart' in window || window.navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0)
};
