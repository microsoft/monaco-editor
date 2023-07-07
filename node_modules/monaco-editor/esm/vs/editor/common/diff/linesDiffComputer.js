/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { LineRange } from '../core/lineRange.js';
export class LinesDiff {
    constructor(changes, 
    /**
     * Sorted by original line ranges.
     * The original line ranges and the modified line ranges must be disjoint (but can be touching).
     */
    moves, 
    /**
     * Indicates if the time out was reached.
     * In that case, the diffs might be an approximation and the user should be asked to rerun the diff with more time.
     */
    hitTimeout) {
        this.changes = changes;
        this.moves = moves;
        this.hitTimeout = hitTimeout;
    }
}
/**
 * Maps a line range in the original text model to a line range in the modified text model.
 */
export class LineRangeMapping {
    static inverse(mapping, originalLineCount, modifiedLineCount) {
        const result = [];
        let lastOriginalEndLineNumber = 1;
        let lastModifiedEndLineNumber = 1;
        for (const m of mapping) {
            const r = new LineRangeMapping(new LineRange(lastOriginalEndLineNumber, m.originalRange.startLineNumber), new LineRange(lastModifiedEndLineNumber, m.modifiedRange.startLineNumber), undefined);
            if (!r.modifiedRange.isEmpty) {
                result.push(r);
            }
            lastOriginalEndLineNumber = m.originalRange.endLineNumberExclusive;
            lastModifiedEndLineNumber = m.modifiedRange.endLineNumberExclusive;
        }
        const r = new LineRangeMapping(new LineRange(lastOriginalEndLineNumber, originalLineCount + 1), new LineRange(lastModifiedEndLineNumber, modifiedLineCount + 1), undefined);
        if (!r.modifiedRange.isEmpty) {
            result.push(r);
        }
        return result;
    }
    constructor(originalRange, modifiedRange, innerChanges) {
        this.originalRange = originalRange;
        this.modifiedRange = modifiedRange;
        this.innerChanges = innerChanges;
    }
    toString() {
        return `{${this.originalRange.toString()}->${this.modifiedRange.toString()}}`;
    }
    get changedLineCount() {
        return Math.max(this.originalRange.length, this.modifiedRange.length);
    }
    flip() {
        var _a;
        return new LineRangeMapping(this.modifiedRange, this.originalRange, (_a = this.innerChanges) === null || _a === void 0 ? void 0 : _a.map(c => c.flip()));
    }
}
/**
 * Maps a range in the original text model to a range in the modified text model.
 */
export class RangeMapping {
    constructor(originalRange, modifiedRange) {
        this.originalRange = originalRange;
        this.modifiedRange = modifiedRange;
    }
    toString() {
        return `{${this.originalRange.toString()}->${this.modifiedRange.toString()}}`;
    }
    flip() {
        return new RangeMapping(this.modifiedRange, this.originalRange);
    }
}
export class SimpleLineRangeMapping {
    constructor(originalRange, modifiedRange) {
        this.originalRange = originalRange;
        this.modifiedRange = modifiedRange;
    }
    toString() {
        return `{${this.originalRange.toString()}->${this.modifiedRange.toString()}}`;
    }
    flip() {
        return new SimpleLineRangeMapping(this.modifiedRange, this.originalRange);
    }
}
export class MovedText {
    constructor(lineRangeMapping, changes) {
        this.lineRangeMapping = lineRangeMapping;
        this.changes = changes;
    }
    flip() {
        return new MovedText(this.lineRangeMapping.flip(), this.changes.map(c => c.flip()));
    }
}
