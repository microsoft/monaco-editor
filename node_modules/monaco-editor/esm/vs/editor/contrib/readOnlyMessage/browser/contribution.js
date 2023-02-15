/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable } from '../../../../base/common/lifecycle.js';
import { registerEditorContribution } from '../../../browser/editorExtensions.js';
import { MessageController } from '../../message/browser/messageController.js';
import * as nls from '../../../../nls.js';
class ReadOnlyMessageController extends Disposable {
    constructor(editor) {
        super();
        this.editor = editor;
        this._register(this.editor.onDidAttemptReadOnlyEdit(() => this._onDidAttemptReadOnlyEdit()));
    }
    _onDidAttemptReadOnlyEdit() {
        const messageController = MessageController.get(this.editor);
        if (messageController && this.editor.hasModel()) {
            if (this.editor.isSimpleWidget) {
                messageController.showMessage(nls.localize('editor.simple.readonly', "Cannot edit in read-only input"), this.editor.getPosition());
            }
            else {
                messageController.showMessage(nls.localize('editor.readonly', "Cannot edit in read-only editor"), this.editor.getPosition());
            }
        }
    }
}
ReadOnlyMessageController.ID = 'editor.contrib.readOnlyMessageController';
export { ReadOnlyMessageController };
registerEditorContribution(ReadOnlyMessageController.ID, ReadOnlyMessageController, 2 /* EditorContributionInstantiation.BeforeFirstInteraction */);
