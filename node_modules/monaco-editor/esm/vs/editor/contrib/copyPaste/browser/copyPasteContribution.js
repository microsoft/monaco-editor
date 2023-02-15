/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { registerEditorContribution } from '../../../browser/editorExtensions.js';
import { editorConfigurationBaseNode } from '../../../common/config/editorConfigurationSchema.js';
import { CopyPasteController } from './copyPasteController.js';
import * as nls from '../../../../nls.js';
import { Extensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
registerEditorContribution(CopyPasteController.ID, CopyPasteController, 0 /* EditorContributionInstantiation.Eager */); // eager because it listens to events on the container dom node of the editor
Registry.as(Extensions.Configuration).registerConfiguration(Object.assign(Object.assign({}, editorConfigurationBaseNode), { properties: {
        'editor.experimental.pasteActions.enabled': {
            type: 'boolean',
            scope: 5 /* ConfigurationScope.LANGUAGE_OVERRIDABLE */,
            description: nls.localize('pasteActions', "Enable/disable running edits from extensions on paste."),
            default: false,
        },
    } }));
