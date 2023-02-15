/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { TabFocus } from '../../../browser/config/tabFocus.js';
import { EditorAction, registerEditorAction } from '../../../browser/editorExtensions.js';
import * as nls from '../../../../nls.js';
class ToggleTabFocusModeAction extends EditorAction {
    constructor() {
        super({
            id: ToggleTabFocusModeAction.ID,
            label: nls.localize({ key: 'toggle.tabMovesFocus', comment: ['Turn on/off use of tab key for moving focus around VS Code'] }, "Toggle Tab Key Moves Focus"),
            alias: 'Toggle Tab Key Moves Focus',
            precondition: undefined,
            kbOpts: {
                kbExpr: null,
                primary: 2048 /* KeyMod.CtrlCmd */ | 43 /* KeyCode.KeyM */,
                mac: { primary: 256 /* KeyMod.WinCtrl */ | 1024 /* KeyMod.Shift */ | 43 /* KeyCode.KeyM */ },
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const oldValue = TabFocus.getTabFocusMode();
        const newValue = !oldValue;
        TabFocus.setTabFocusMode(newValue);
        if (newValue) {
            alert(nls.localize('toggle.tabMovesFocus.on', "Pressing Tab will now move focus to the next focusable element"));
        }
        else {
            alert(nls.localize('toggle.tabMovesFocus.off', "Pressing Tab will now insert the tab character"));
        }
    }
}
ToggleTabFocusModeAction.ID = 'editor.action.toggleTabFocusMode';
export { ToggleTabFocusModeAction };
registerEditorAction(ToggleTabFocusModeAction);
