/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { assertFn, checkAdjacentItems } from '../../../base/common/assert.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { OffsetRange, SequenceDiff } from './algorithms/diffAlgorithm.js';
import { DynamicProgrammingDiffing } from './algorithms/dynamicProgrammingDiffing.js';
import { optimizeSequenceDiffs, smoothenSequenceDiffs } from './algorithms/joinSequenceDiffs.js';
import { MyersDiffAlgorithm } from './algorithms/myersDiffAlgorithm.js';
import { LineRange, LineRangeMapping, RangeMapping } from './linesDiffComputer.js';
export class StandardLinesDiffComputer {
    constructor() {
        this.dynamicProgrammingDiffing = new DynamicProgrammingDiffing();
        this.myersDiffingAlgorithm = new MyersDiffAlgorithm();
    }
    computeDiff(originalLines, modifiedLines, options) {
        const perfectHashes = new Map();
        function getOrCreateHash(text) {
            let hash = perfectHashes.get(text);
            if (hash === undefined) {
                hash = perfectHashes.size;
                perfectHashes.set(text, hash);
            }
            return hash;
        }
        const srcDocLines = originalLines.map((l) => getOrCreateHash(l.trim()));
        const tgtDocLines = modifiedLines.map((l) => getOrCreateHash(l.trim()));
        const sequence1 = new LineSequence(srcDocLines, originalLines);
        const sequence2 = new LineSequence(tgtDocLines, modifiedLines);
        let lineAlignments = (() => {
            if (sequence1.length + sequence2.length < 1500) {
                // Use the improved algorithm for small files
                return this.dynamicProgrammingDiffing.compute(sequence1, sequence2, (offset1, offset2) => originalLines[offset1] === modifiedLines[offset2]
                    ? modifiedLines[offset2].length === 0
                        ? 0.1
                        : 1 + Math.log(1 + modifiedLines[offset2].length)
                    : 0.99);
            }
            return this.myersDiffingAlgorithm.compute(sequence1, sequence2);
        })();
        lineAlignments = optimizeSequenceDiffs(sequence1, sequence2, lineAlignments);
        const alignments = [];
        const scanForWhitespaceChanges = (equalLinesCount) => {
            for (let i = 0; i < equalLinesCount; i++) {
                const seq1Offset = seq1LastStart + i;
                const seq2Offset = seq2LastStart + i;
                if (originalLines[seq1Offset] !== modifiedLines[seq2Offset]) {
                    // This is because of whitespace changes, diff these lines
                    const characterDiffs = this.refineDiff(originalLines, modifiedLines, new SequenceDiff(new OffsetRange(seq1Offset, seq1Offset + 1), new OffsetRange(seq2Offset, seq2Offset + 1)));
                    for (const a of characterDiffs) {
                        alignments.push(a);
                    }
                }
            }
        };
        let seq1LastStart = 0;
        let seq2LastStart = 0;
        for (const diff of lineAlignments) {
            assertFn(() => diff.seq1Range.start - seq1LastStart === diff.seq2Range.start - seq2LastStart);
            const equalLinesCount = diff.seq1Range.start - seq1LastStart;
            scanForWhitespaceChanges(equalLinesCount);
            seq1LastStart = diff.seq1Range.endExclusive;
            seq2LastStart = diff.seq2Range.endExclusive;
            const characterDiffs = this.refineDiff(originalLines, modifiedLines, diff);
            for (const a of characterDiffs) {
                alignments.push(a);
            }
        }
        scanForWhitespaceChanges(originalLines.length - seq1LastStart);
        const changes = lineRangeMappingFromRangeMappings(alignments);
        return {
            quitEarly: false,
            changes: changes,
        };
    }
    refineDiff(originalLines, modifiedLines, diff) {
        const sourceSlice = new Slice(originalLines, diff.seq1Range);
        const targetSlice = new Slice(modifiedLines, diff.seq2Range);
        const originalDiffs = sourceSlice.length + targetSlice.length < 500
            ? this.dynamicProgrammingDiffing.compute(sourceSlice, targetSlice)
            : this.myersDiffingAlgorithm.compute(sourceSlice, targetSlice);
        let diffs = optimizeSequenceDiffs(sourceSlice, targetSlice, originalDiffs);
        diffs = smoothenSequenceDiffs(sourceSlice, targetSlice, diffs);
        const result = diffs.map((d) => new RangeMapping(sourceSlice.translateRange(d.seq1Range).delta(diff.seq1Range.start), targetSlice.translateRange(d.seq2Range).delta(diff.seq2Range.start)));
        return result;
    }
}
export function lineRangeMappingFromRangeMappings(alignments) {
    const changes = [];
    for (const g of group(alignments, (a1, a2) => (a2.originalRange.startLineNumber - (a1.originalRange.endLineNumber - (a1.originalRange.endColumn > 1 ? 0 : 1)) <= 1)
        || (a2.modifiedRange.startLineNumber - (a1.modifiedRange.endLineNumber - (a1.modifiedRange.endColumn > 1 ? 0 : 1)) <= 1))) {
        const first = g[0];
        const last = g[g.length - 1];
        changes.push(new LineRangeMapping(new LineRange(first.originalRange.startLineNumber, last.originalRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)), new LineRange(first.modifiedRange.startLineNumber, last.modifiedRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)), g));
    }
    assertFn(() => {
        return checkAdjacentItems(changes, (m1, m2) => m2.originalRange.startLineNumber - m1.originalRange.endLineNumberExclusive === m2.modifiedRange.startLineNumber - m1.modifiedRange.endLineNumberExclusive &&
            // There has to be an unchanged line in between (otherwise both diffs should have been joined)
            m1.originalRange.endLineNumberExclusive < m2.originalRange.startLineNumber &&
            m1.modifiedRange.endLineNumberExclusive < m2.modifiedRange.startLineNumber);
    });
    return changes;
}
function* group(items, shouldBeGrouped) {
    let currentGroup;
    let last;
    for (const item of items) {
        if (last !== undefined && shouldBeGrouped(last, item)) {
            currentGroup.push(item);
        }
        else {
            if (currentGroup) {
                yield currentGroup;
            }
            currentGroup = [item];
        }
        last = item;
    }
    if (currentGroup) {
        yield currentGroup;
    }
}
export class LineSequence {
    constructor(trimmedHash, lines) {
        this.trimmedHash = trimmedHash;
        this.lines = lines;
    }
    getElement(offset) {
        return this.trimmedHash[offset];
    }
    get length() {
        return this.trimmedHash.length;
    }
    getBoundaryScore(length) {
        const indentationBefore = length === 0 ? 0 : getIndentation(this.lines[length - 1]);
        const indentationAfter = length === this.lines.length ? 0 : getIndentation(this.lines[length]);
        return 1000 - (indentationBefore + indentationAfter);
    }
}
function getIndentation(str) {
    let i = 0;
    while (i < str.length && (str.charCodeAt(i) === 32 /* CharCode.Space */ || str.charCodeAt(i) === 9 /* CharCode.Tab */)) {
        i++;
    }
    return i;
}
class Slice {
    constructor(lines, lineRange) {
        this.lines = lines;
        this.lineRange = lineRange;
        let chars = 0;
        this.firstCharOnLineOffsets = new Int32Array(lineRange.length);
        for (let i = lineRange.start; i < lineRange.endExclusive; i++) {
            const line = lines[i];
            chars += line.length;
            this.firstCharOnLineOffsets[i - lineRange.start] = chars + 1;
            chars++;
        }
        this.elements = new Int32Array(chars);
        let offset = 0;
        for (let i = lineRange.start; i < lineRange.endExclusive; i++) {
            const line = lines[i];
            for (let i = 0; i < line.length; i++) {
                this.elements[offset + i] = line.charCodeAt(i);
            }
            offset += line.length;
            if (i < lines.length - 1) {
                this.elements[offset] = '\n'.charCodeAt(0);
                offset += 1;
            }
        }
    }
    getElement(offset) {
        return this.elements[offset];
    }
    get length() {
        return this.elements.length;
    }
    getBoundaryScore(length) {
        //   a   b   c   ,           d   e   f
        // 11  0   0   12  15  6   13  0   0   11
        const prevCategory = getCategory(length > 0 ? this.elements[length - 1] : -1);
        const nextCategory = getCategory(length < this.elements.length ? this.elements[length] : -1);
        if (prevCategory === 6 /* CharBoundaryCategory.LineBreakCR */ && nextCategory === 7 /* CharBoundaryCategory.LineBreakLF */) {
            // don't break between \r and \n
            return 0;
        }
        let score = 0;
        if (prevCategory !== nextCategory) {
            score += 10;
            if (nextCategory === 1 /* CharBoundaryCategory.WordUpper */) {
                score += 1;
            }
        }
        score += getCategoryBoundaryScore(prevCategory);
        score += getCategoryBoundaryScore(nextCategory);
        return score;
    }
    translateOffset(offset) {
        // find smallest i, so that lineBreakOffsets[i] > offset using binary search
        let i = 0;
        let j = this.firstCharOnLineOffsets.length;
        while (i < j) {
            const k = Math.floor((i + j) / 2);
            if (this.firstCharOnLineOffsets[k] > offset) {
                j = k;
            }
            else {
                i = k + 1;
            }
        }
        const offsetOfPrevLineBreak = i === 0 ? 0 : this.firstCharOnLineOffsets[i - 1];
        return new Position(i + 1, offset - offsetOfPrevLineBreak + 1);
    }
    translateRange(range) {
        return Range.fromPositions(this.translateOffset(range.start), this.translateOffset(range.endExclusive));
    }
}
const score = {
    [0 /* CharBoundaryCategory.WordLower */]: 0,
    [1 /* CharBoundaryCategory.WordUpper */]: 0,
    [2 /* CharBoundaryCategory.WordNumber */]: 0,
    [3 /* CharBoundaryCategory.End */]: 10,
    [4 /* CharBoundaryCategory.Other */]: 2,
    [5 /* CharBoundaryCategory.Space */]: 3,
    [6 /* CharBoundaryCategory.LineBreakCR */]: 10,
    [7 /* CharBoundaryCategory.LineBreakLF */]: 10,
};
function getCategoryBoundaryScore(category) {
    return score[category];
}
function getCategory(charCode) {
    if (charCode === 10 /* CharCode.LineFeed */) {
        return 7 /* CharBoundaryCategory.LineBreakLF */;
    }
    else if (charCode === 13 /* CharCode.CarriageReturn */) {
        return 6 /* CharBoundaryCategory.LineBreakCR */;
    }
    else if (isSpace(charCode)) {
        return 5 /* CharBoundaryCategory.Space */;
    }
    else if (charCode >= 97 /* CharCode.a */ && charCode <= 122 /* CharCode.z */) {
        return 0 /* CharBoundaryCategory.WordLower */;
    }
    else if (charCode >= 65 /* CharCode.A */ && charCode <= 90 /* CharCode.Z */) {
        return 1 /* CharBoundaryCategory.WordUpper */;
    }
    else if (charCode >= 48 /* CharCode.Digit0 */ && charCode <= 57 /* CharCode.Digit9 */) {
        return 2 /* CharBoundaryCategory.WordNumber */;
    }
    else if (charCode === -1) {
        return 3 /* CharBoundaryCategory.End */;
    }
    else {
        return 4 /* CharBoundaryCategory.Other */;
    }
}
function isSpace(charCode) {
    return charCode === 32 /* CharCode.Space */ || charCode === 9 /* CharCode.Tab */;
}
