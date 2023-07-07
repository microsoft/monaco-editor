/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { EditorAction, registerEditorAction } from '../editorExtensions.js';
import { ICodeEditorService } from '../services/codeEditorService.js';
import { localize } from '../../../nls.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
class DiffReviewNext extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.diffReview.next',
            label: localize('editor.action.diffReview.next', "Go to Next Difference"),
            alias: 'Go to Next Difference',
            precondition: ContextKeyExpr.has('isInDiffEditor'),
            kbOpts: {
                kbExpr: null,
                primary: 65 /* KeyCode.F7 */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const diffEditor = findFocusedDiffEditor(accessor);
        diffEditor === null || diffEditor === void 0 ? void 0 : diffEditor.diffReviewNext();
    }
}
class DiffReviewPrev extends EditorAction {
    constructor() {
        super({
            id: 'editor.action.diffReview.prev',
            label: localize('editor.action.diffReview.prev', "Go to Previous Difference"),
            alias: 'Go to Previous Difference',
            precondition: ContextKeyExpr.has('isInDiffEditor'),
            kbOpts: {
                kbExpr: null,
                primary: 1024 /* KeyMod.Shift */ | 65 /* KeyCode.F7 */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    run(accessor, editor) {
        const diffEditor = findFocusedDiffEditor(accessor);
        diffEditor === null || diffEditor === void 0 ? void 0 : diffEditor.diffReviewPrev();
    }
}
function findFocusedDiffEditor(accessor) {
    var _a;
    const codeEditorService = accessor.get(ICodeEditorService);
    const diffEditors = codeEditorService.listDiffEditors();
    const activeCodeEditor = (_a = codeEditorService.getFocusedCodeEditor()) !== null && _a !== void 0 ? _a : codeEditorService.getActiveCodeEditor();
    if (!activeCodeEditor) {
        return null;
    }
    for (let i = 0, len = diffEditors.length; i < len; i++) {
        const diffEditor = diffEditors[i];
        if (diffEditor.getModifiedEditor().getId() === activeCodeEditor.getId() || diffEditor.getOriginalEditor().getId() === activeCodeEditor.getId()) {
            return diffEditor;
        }
    }
    return null;
}
registerEditorAction(DiffReviewNext);
registerEditorAction(DiffReviewPrev);
