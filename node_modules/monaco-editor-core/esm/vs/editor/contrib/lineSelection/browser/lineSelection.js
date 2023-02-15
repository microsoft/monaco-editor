/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { EditorAction, registerEditorAction } from '../../../browser/editorExtensions.js';
import { CursorMoveCommands } from '../../../common/cursor/cursorMoveCommands.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import * as nls from '../../../../nls.js';
export class ExpandLineSelectionAction extends EditorAction {
    constructor() {
        super({
            id: 'expandLineSelection',
            label: nls.localize('expandLineSelection', "Expand Line Selection"),
            alias: 'Expand Line Selection',
            precondition: undefined,
            kbOpts: {
                weight: 0 /* KeybindingWeight.EditorCore */,
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* KeyMod.CtrlCmd */ | 42 /* KeyCode.KeyL */
            },
        });
    }
    run(_accessor, editor, args) {
        args = args || {};
        if (!editor.hasModel()) {
            return;
        }
        const viewModel = editor._getViewModel();
        viewModel.model.pushStackElement();
        viewModel.setCursorStates(args.source, 3 /* CursorChangeReason.Explicit */, CursorMoveCommands.expandLineSelection(viewModel, viewModel.getCursorStates()));
        viewModel.revealPrimaryCursor(args.source, true);
    }
}
registerEditorAction(ExpandLineSelectionAction);
