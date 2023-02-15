/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as browser from './browser.js';
import { EVENT_KEY_CODE_MAP, KeyCodeUtils } from '../common/keyCodes.js';
import { KeyCodeChord } from '../common/keybindings.js';
import * as platform from '../common/platform.js';
function extractKeyCode(e) {
    if (e.charCode) {
        // "keypress" events mostly
        const char = String.fromCharCode(e.charCode).toUpperCase();
        return KeyCodeUtils.fromString(char);
    }
    const keyCode = e.keyCode;
    // browser quirks
    if (keyCode === 3) {
        return 7 /* KeyCode.PauseBreak */;
    }
    else if (browser.isFirefox) {
        if (keyCode === 59) {
            return 80 /* KeyCode.Semicolon */;
        }
        else if (keyCode === 107) {
            return 81 /* KeyCode.Equal */;
        }
        else if (keyCode === 109) {
            return 83 /* KeyCode.Minus */;
        }
        else if (platform.isMacintosh && keyCode === 224) {
            return 57 /* KeyCode.Meta */;
        }
    }
    else if (browser.isWebKit) {
        if (keyCode === 91) {
            return 57 /* KeyCode.Meta */;
        }
        else if (platform.isMacintosh && keyCode === 93) {
            // the two meta keys in the Mac have different key codes (91 and 93)
            return 57 /* KeyCode.Meta */;
        }
        else if (!platform.isMacintosh && keyCode === 92) {
            return 57 /* KeyCode.Meta */;
        }
    }
    // cross browser keycodes:
    return EVENT_KEY_CODE_MAP[keyCode] || 0 /* KeyCode.Unknown */;
}
const ctrlKeyMod = (platform.isMacintosh ? 256 /* KeyMod.WinCtrl */ : 2048 /* KeyMod.CtrlCmd */);
const altKeyMod = 512 /* KeyMod.Alt */;
const shiftKeyMod = 1024 /* KeyMod.Shift */;
const metaKeyMod = (platform.isMacintosh ? 2048 /* KeyMod.CtrlCmd */ : 256 /* KeyMod.WinCtrl */);
export class StandardKeyboardEvent {
    constructor(source) {
        this._standardKeyboardEventBrand = true;
        const e = source;
        this.browserEvent = e;
        this.target = e.target;
        this.ctrlKey = e.ctrlKey;
        this.shiftKey = e.shiftKey;
        this.altKey = e.altKey;
        this.metaKey = e.metaKey;
        this.altGraphKey = e.getModifierState('AltGraph');
        this.keyCode = extractKeyCode(e);
        this.code = e.code;
        // console.info(e.type + ": keyCode: " + e.keyCode + ", which: " + e.which + ", charCode: " + e.charCode + ", detail: " + e.detail + " ====> " + this.keyCode + ' -- ' + KeyCode[this.keyCode]);
        this.ctrlKey = this.ctrlKey || this.keyCode === 5 /* KeyCode.Ctrl */;
        this.altKey = this.altKey || this.keyCode === 6 /* KeyCode.Alt */;
        this.shiftKey = this.shiftKey || this.keyCode === 4 /* KeyCode.Shift */;
        this.metaKey = this.metaKey || this.keyCode === 57 /* KeyCode.Meta */;
        this._asKeybinding = this._computeKeybinding();
        this._asKeyCodeChord = this._computeKeyCodeChord();
        // console.log(`code: ${e.code}, keyCode: ${e.keyCode}, key: ${e.key}`);
    }
    preventDefault() {
        if (this.browserEvent && this.browserEvent.preventDefault) {
            this.browserEvent.preventDefault();
        }
    }
    stopPropagation() {
        if (this.browserEvent && this.browserEvent.stopPropagation) {
            this.browserEvent.stopPropagation();
        }
    }
    toKeyCodeChord() {
        return this._asKeyCodeChord;
    }
    equals(other) {
        return this._asKeybinding === other;
    }
    _computeKeybinding() {
        let key = 0 /* KeyCode.Unknown */;
        if (this.keyCode !== 5 /* KeyCode.Ctrl */ && this.keyCode !== 4 /* KeyCode.Shift */ && this.keyCode !== 6 /* KeyCode.Alt */ && this.keyCode !== 57 /* KeyCode.Meta */) {
            key = this.keyCode;
        }
        let result = 0;
        if (this.ctrlKey) {
            result |= ctrlKeyMod;
        }
        if (this.altKey) {
            result |= altKeyMod;
        }
        if (this.shiftKey) {
            result |= shiftKeyMod;
        }
        if (this.metaKey) {
            result |= metaKeyMod;
        }
        result |= key;
        return result;
    }
    _computeKeyCodeChord() {
        let key = 0 /* KeyCode.Unknown */;
        if (this.keyCode !== 5 /* KeyCode.Ctrl */ && this.keyCode !== 4 /* KeyCode.Shift */ && this.keyCode !== 6 /* KeyCode.Alt */ && this.keyCode !== 57 /* KeyCode.Meta */) {
            key = this.keyCode;
        }
        return new KeyCodeChord(this.ctrlKey, this.shiftKey, this.altKey, this.metaKey, key);
    }
}
