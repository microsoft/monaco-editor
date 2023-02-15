/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { registerEditorAction, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { HoverParticipantRegistry } from '../../hover/browser/hoverTypes.js';
import { AcceptInlineCompletion, AcceptNextWordOfInlineCompletion, ToggleAlwaysShowInlineSuggestionToolbar, GhostTextController, HideInlineCompletion, ShowNextInlineSuggestionAction, ShowPreviousInlineSuggestionAction, TriggerInlineSuggestionAction, UndoAcceptPart } from './ghostTextController.js';
import { InlineCompletionsHoverParticipant } from './ghostTextHoverParticipant.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
registerEditorContribution(GhostTextController.ID, GhostTextController, 3 /* EditorContributionInstantiation.Eventually */);
registerEditorAction(TriggerInlineSuggestionAction);
registerEditorAction(ShowNextInlineSuggestionAction);
registerEditorAction(ShowPreviousInlineSuggestionAction);
registerEditorAction(AcceptNextWordOfInlineCompletion);
registerEditorAction(AcceptInlineCompletion);
registerEditorAction(HideInlineCompletion);
registerEditorAction(UndoAcceptPart);
registerAction2(ToggleAlwaysShowInlineSuggestionToolbar);
HoverParticipantRegistry.register(InlineCompletionsHoverParticipant);
