/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { registerEditorContribution } from '../../../browser/editorExtensions.js';
import { ToggleStickyScroll } from './stickyScrollActions.js';
import { StickyScrollController } from './stickyScrollController.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
registerEditorContribution(StickyScrollController.ID, StickyScrollController, 1 /* EditorContributionInstantiation.AfterFirstRender */);
registerAction2(ToggleStickyScroll);
