/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { applyEdits } from './utils.js';
export class GhostText {
    constructor(lineNumber, parts, additionalReservedLineCount = 0) {
        this.lineNumber = lineNumber;
        this.parts = parts;
        this.additionalReservedLineCount = additionalReservedLineCount;
    }
    renderForScreenReader(lineText) {
        if (this.parts.length === 0) {
            return '';
        }
        const lastPart = this.parts[this.parts.length - 1];
        const cappedLineText = lineText.substr(0, lastPart.column - 1);
        const text = applyEdits(cappedLineText, this.parts.map(p => ({
            range: { startLineNumber: 1, endLineNumber: 1, startColumn: p.column, endColumn: p.column },
            text: p.lines.join('\n')
        })));
        return text.substring(this.parts[0].column - 1);
    }
    isEmpty() {
        return this.parts.every(p => p.lines.length === 0);
    }
}
export class GhostTextPart {
    constructor(column, lines, 
    /**
     * Indicates if this part is a preview of an inline suggestion when a suggestion is previewed.
    */
    preview) {
        this.column = column;
        this.lines = lines;
        this.preview = preview;
    }
}
export class GhostTextReplacement {
    constructor(lineNumber, columnStart, length, newLines, additionalReservedLineCount = 0) {
        this.lineNumber = lineNumber;
        this.columnStart = columnStart;
        this.length = length;
        this.newLines = newLines;
        this.additionalReservedLineCount = additionalReservedLineCount;
        this.parts = [
            new GhostTextPart(this.columnStart + this.length, this.newLines, false),
        ];
    }
    renderForScreenReader(_lineText) {
        return this.newLines.join('\n');
    }
}
export class BaseGhostTextWidgetModel extends Disposable {
    constructor(editor) {
        super();
        this.editor = editor;
        this._expanded = undefined;
        this.onDidChangeEmitter = new Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this._register(editor.onDidChangeConfiguration((e) => {
            if (e.hasChanged(112 /* EditorOption.suggest */) && this._expanded === undefined) {
                this.onDidChangeEmitter.fire();
            }
        }));
    }
    setExpanded(expanded) {
        this._expanded = true;
        this.onDidChangeEmitter.fire();
    }
}
