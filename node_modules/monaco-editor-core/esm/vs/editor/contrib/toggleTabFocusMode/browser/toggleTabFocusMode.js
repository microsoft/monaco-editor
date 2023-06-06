/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { TabFocus } from '../../../browser/config/tabFocus.js';
import * as nls from '../../../../nls.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
export class ToggleTabFocusModeAction extends Action2 {
    constructor() {
        super({
            id: ToggleTabFocusModeAction.ID,
            title: { value: nls.localize({ key: 'toggle.tabMovesFocus', comment: ['Turn on/off use of tab key for moving focus around VS Code'] }, 'Toggle Tab Key Moves Focus'), original: 'Toggle Tab Key Moves Focus' },
            precondition: undefined,
            keybinding: {
                primary: 2048 /* KeyMod.CtrlCmd */ | 43 /* KeyCode.KeyM */,
                mac: { primary: 256 /* KeyMod.WinCtrl */ | 1024 /* KeyMod.Shift */ | 43 /* KeyCode.KeyM */ },
                weight: 100 /* KeybindingWeight.EditorContrib */
            },
            f1: true
        });
    }
    run(accessor) {
        const context = accessor.get(IContextKeyService).getContextKeyValue('focusedView') === 'terminal' ? "terminalFocus" /* TabFocusContext.Terminal */ : "editorFocus" /* TabFocusContext.Editor */;
        const oldValue = TabFocus.getTabFocusMode(context);
        const newValue = !oldValue;
        TabFocus.setTabFocusMode(newValue, context);
        if (newValue) {
            alert(nls.localize('toggle.tabMovesFocus.on', "Pressing Tab will now move focus to the next focusable element"));
        }
        else {
            alert(nls.localize('toggle.tabMovesFocus.off', "Pressing Tab will now insert the tab character"));
        }
    }
}
ToggleTabFocusModeAction.ID = 'editor.action.toggleTabFocusMode';
registerAction2(ToggleTabFocusModeAction);
