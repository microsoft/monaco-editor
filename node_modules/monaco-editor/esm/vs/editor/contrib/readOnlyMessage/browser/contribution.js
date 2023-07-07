/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { registerEditorContribution } from '../../../browser/editorExtensions.js';
import { MessageController } from '../../message/browser/messageController.js';
import * as nls from '../../../../nls.js';
export class ReadOnlyMessageController extends Disposable {
    constructor(editor) {
        super();
        this.editor = editor;
        this._register(this.editor.onDidAttemptReadOnlyEdit(() => this._onDidAttemptReadOnlyEdit()));
    }
    _onDidAttemptReadOnlyEdit() {
        const messageController = MessageController.get(this.editor);
        if (messageController && this.editor.hasModel()) {
            let message = this.editor.getOptions().get(89 /* EditorOption.readOnlyMessage */);
            if (!message) {
                if (this.editor.isSimpleWidget) {
                    message = new MarkdownString(nls.localize('editor.simple.readonly', "Cannot edit in read-only input"));
                }
                else {
                    message = new MarkdownString(nls.localize('editor.readonly', "Cannot edit in read-only editor"));
                }
            }
            messageController.showMessage(message, this.editor.getPosition());
        }
    }
}
ReadOnlyMessageController.ID = 'editor.contrib.readOnlyMessageController';
registerEditorContribution(ReadOnlyMessageController.ID, ReadOnlyMessageController, 2 /* EditorContributionInstantiation.BeforeFirstInteraction */);
