import { applyEdits } from './utils.js';
export class GhostText {
    constructor(lineNumber, parts) {
        this.lineNumber = lineNumber;
        this.parts = parts;
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
    get lineCount() {
        return 1 + this.parts.reduce((r, p) => r + p.lines.length - 1, 0);
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
    constructor(lineNumber, columnRange, newLines, additionalReservedLineCount = 0) {
        this.lineNumber = lineNumber;
        this.columnRange = columnRange;
        this.newLines = newLines;
        this.additionalReservedLineCount = additionalReservedLineCount;
        this.parts = [
            new GhostTextPart(this.columnRange.endColumnExclusive, this.newLines, false),
        ];
    }
    renderForScreenReader(_lineText) {
        return this.newLines.join('\n');
    }
    get lineCount() {
        return this.newLines.length;
    }
    isEmpty() {
        return this.parts.every(p => p.lines.length === 0);
    }
}
