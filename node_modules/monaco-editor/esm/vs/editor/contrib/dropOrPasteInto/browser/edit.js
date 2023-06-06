/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ResourceTextEdit } from '../../../browser/services/bulkEditService.js';
export function createCombinedWorkspaceEdit(uri, ranges, edit) {
    var _a, _b;
    return {
        edits: [
            ...ranges.map(range => new ResourceTextEdit(uri, typeof edit.insertText === 'string'
                ? { range, text: edit.insertText, insertAsSnippet: false }
                : { range, text: edit.insertText.snippet, insertAsSnippet: true })),
            ...((_b = (_a = edit.additionalEdit) === null || _a === void 0 ? void 0 : _a.edits) !== null && _b !== void 0 ? _b : [])
        ]
    };
}
