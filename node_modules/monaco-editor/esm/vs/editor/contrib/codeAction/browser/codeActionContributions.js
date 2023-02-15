/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { registerEditorAction, registerEditorCommand, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { editorConfigurationBaseNode } from '../../../common/config/editorConfigurationSchema.js';
import { AutoFixAction, CodeActionCommand, CodeActionController, FixAllAction, OrganizeImportsAction, QuickFixAction, RefactorAction, RefactorPreview, SourceAction } from './codeActionCommands.js';
import * as nls from '../../../../nls.js';
import { Extensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
registerEditorContribution(CodeActionController.ID, CodeActionController, 3 /* EditorContributionInstantiation.Eventually */);
registerEditorAction(QuickFixAction);
registerEditorAction(RefactorAction);
registerEditorAction(RefactorPreview);
registerEditorAction(SourceAction);
registerEditorAction(OrganizeImportsAction);
registerEditorAction(AutoFixAction);
registerEditorAction(FixAllAction);
registerEditorCommand(new CodeActionCommand());
Registry.as(Extensions.Configuration).registerConfiguration(Object.assign(Object.assign({}, editorConfigurationBaseNode), { properties: {
        'editor.codeActionWidget.showHeaders': {
            type: 'boolean',
            scope: 5 /* ConfigurationScope.LANGUAGE_OVERRIDABLE */,
            description: nls.localize('showCodeActionHeaders', "Enable/disable showing group headers in the Code Action menu."),
            default: true,
        },
    } }));
