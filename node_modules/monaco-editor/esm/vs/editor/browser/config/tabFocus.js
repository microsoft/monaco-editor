/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../../base/common/event.js';
class TabFocusImpl {
    constructor() {
        this._tabFocusTerminal = false;
        this._tabFocusEditor = false;
        this._onDidChangeTabFocus = new Emitter();
        this.onDidChangeTabFocus = this._onDidChangeTabFocus.event;
    }
    getTabFocusMode(context) {
        return context === "terminalFocus" /* TabFocusContext.Terminal */ ? this._tabFocusTerminal : this._tabFocusEditor;
    }
    setTabFocusMode(tabFocusMode, context) {
        if (context === "terminalFocus" /* TabFocusContext.Terminal */) {
            this._tabFocusTerminal = tabFocusMode;
        }
        else {
            this._tabFocusEditor = tabFocusMode;
        }
        this._onDidChangeTabFocus.fire();
    }
}
/**
 * Control what pressing Tab does.
 * If it is false, pressing Tab or Shift-Tab will be handled by the editor.
 * If it is true, pressing Tab or Shift-Tab will move the browser focus.
 * Defaults to false.
 */
export const TabFocus = new TabFocusImpl();
