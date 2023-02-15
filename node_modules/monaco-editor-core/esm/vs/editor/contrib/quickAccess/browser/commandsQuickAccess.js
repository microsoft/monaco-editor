/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { stripIcons } from '../../../../base/common/iconLabels.js';
import { AbstractCommandsQuickAccessProvider } from '../../../../platform/quickinput/browser/commandsQuickAccess.js';
export class AbstractEditorCommandsQuickAccessProvider extends AbstractCommandsQuickAccessProvider {
    constructor(options, instantiationService, keybindingService, commandService, telemetryService, dialogService) {
        super(options, instantiationService, keybindingService, commandService, telemetryService, dialogService);
    }
    getCodeEditorCommandPicks() {
        const activeTextEditorControl = this.activeTextEditorControl;
        if (!activeTextEditorControl) {
            return [];
        }
        const editorCommandPicks = [];
        for (const editorAction of activeTextEditorControl.getSupportedActions()) {
            editorCommandPicks.push({
                commandId: editorAction.id,
                commandAlias: editorAction.alias,
                label: stripIcons(editorAction.label) || editorAction.id,
            });
        }
        return editorCommandPicks;
    }
}
