/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { derived, observableSignal, observableSignalFromEvent, observableValue, transaction, waitForState } from '../../../../base/common/observable.js';
import { autorunWithStore2 } from '../../../../base/common/observableImpl/autorun.js';
import { isDefined } from '../../../../base/common/types.js';
import { LineRange } from '../../../common/core/lineRange.js';
import { Range } from '../../../common/core/range.js';
import { LineRangeMapping, MovedText, RangeMapping, SimpleLineRangeMapping } from '../../../common/diff/linesDiffComputer.js';
import { lineRangeMappingFromRangeMappings } from '../../../common/diff/standardLinesDiffComputer.js';
import { TextEditInfo } from '../../../common/model/bracketPairsTextModelPart/bracketPairsTree/beforeEditPositionMapper.js';
import { combineTextEditInfos } from '../../../common/model/bracketPairsTextModelPart/bracketPairsTree/combineTextEditInfos.js';
import { lengthAdd, lengthDiffNonNegative, lengthGetLineCount, lengthOfRange, lengthToPosition, lengthZero, positionToLength } from '../../../common/model/bracketPairsTextModelPart/bracketPairsTree/length.js';
export class DiffEditorViewModel extends Disposable {
    constructor(model, _options, documentDiffProvider) {
        super();
        this.model = model;
        this._options = _options;
        this._isDiffUpToDate = observableValue('isDiffUpToDate', false);
        this.isDiffUpToDate = this._isDiffUpToDate;
        this._diff = observableValue('diff', undefined);
        this.diff = this._diff;
        this._unchangedRegions = observableValue('unchangedRegion', { regions: [], originalDecorationIds: [], modifiedDecorationIds: [] });
        this.unchangedRegions = derived('unchangedRegions', r => {
            if (this._options.collapseUnchangedRegions.read(r)) {
                return this._unchangedRegions.read(r).regions;
            }
            else {
                // Reset state
                transaction(tx => {
                    for (const r of this._unchangedRegions.get().regions) {
                        r.setState(0, 0, tx);
                    }
                });
                return [];
            }
        });
        this.syncedMovedTexts = observableValue('syncedMovedText', undefined);
        const contentChangedSignal = observableSignal('contentChangedSignal');
        const debouncer = this._register(new RunOnceScheduler(() => contentChangedSignal.trigger(undefined), 200));
        this._register(model.modified.onDidChangeContent((e) => {
            const diff = this._diff.get();
            if (!diff) {
                return;
            }
            const textEdits = TextEditInfo.fromModelContentChanges(e.changes);
            const result = applyModifiedEdits(this._lastDiff, textEdits, model.original, model.modified);
            if (result) {
                this._lastDiff = result;
                this._diff.set(DiffState.fromDiffResult(this._lastDiff), undefined);
                const currentSyncedMovedText = this.syncedMovedTexts.get();
                this.syncedMovedTexts.set(currentSyncedMovedText ? this._lastDiff.moves.find(m => m.lineRangeMapping.modifiedRange.intersect(currentSyncedMovedText.lineRangeMapping.modifiedRange)) : undefined, undefined);
            }
            debouncer.schedule();
        }));
        this._register(model.original.onDidChangeContent((e) => {
            const diff = this._diff.get();
            if (!diff) {
                return;
            }
            const textEdits = TextEditInfo.fromModelContentChanges(e.changes);
            const result = applyOriginalEdits(this._lastDiff, textEdits, model.original, model.modified);
            if (result) {
                this._lastDiff = result;
                this._diff.set(DiffState.fromDiffResult(this._lastDiff), undefined);
                const currentSyncedMovedText = this.syncedMovedTexts.get();
                this.syncedMovedTexts.set(currentSyncedMovedText ? this._lastDiff.moves.find(m => m.lineRangeMapping.modifiedRange.intersect(currentSyncedMovedText.lineRangeMapping.modifiedRange)) : undefined, undefined);
            }
            debouncer.schedule();
        }));
        const documentDiffProviderOptionChanged = observableSignalFromEvent('documentDiffProviderOptionChanged', documentDiffProvider.onDidChange);
        this._register(autorunWithStore2('compute diff', (reader, store) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            debouncer.cancel();
            contentChangedSignal.read(reader);
            documentDiffProviderOptionChanged.read(reader);
            this._isDiffUpToDate.set(false, undefined);
            let originalTextEditInfos = [];
            store.add(model.original.onDidChangeContent((e) => {
                const edits = TextEditInfo.fromModelContentChanges(e.changes);
                originalTextEditInfos = combineTextEditInfos(originalTextEditInfos, edits);
            }));
            let modifiedTextEditInfos = [];
            store.add(model.modified.onDidChangeContent((e) => {
                const edits = TextEditInfo.fromModelContentChanges(e.changes);
                modifiedTextEditInfos = combineTextEditInfos(modifiedTextEditInfos, edits);
            }));
            let result = yield documentDiffProvider.computeDiff(model.original, model.modified, {
                ignoreTrimWhitespace: this._options.ignoreTrimWhitespace.read(reader),
                maxComputationTimeMs: this._options.maxComputationTimeMs.read(reader),
                computeMoves: this._options.showMoves.read(reader),
            });
            result = (_a = applyOriginalEdits(result, originalTextEditInfos, model.original, model.modified)) !== null && _a !== void 0 ? _a : result;
            result = (_b = applyModifiedEdits(result, modifiedTextEditInfos, model.original, model.modified)) !== null && _b !== void 0 ? _b : result;
            const newUnchangedRegions = UnchangedRegion.fromDiffs(result.changes, model.original.getLineCount(), model.modified.getLineCount());
            // Transfer state from cur state
            const lastUnchangedRegions = this._unchangedRegions.get();
            const lastUnchangedRegionsOrigRanges = lastUnchangedRegions.originalDecorationIds
                .map(id => model.original.getDecorationRange(id))
                .filter(r => !!r)
                .map(r => LineRange.fromRange(r));
            const lastUnchangedRegionsModRanges = lastUnchangedRegions.modifiedDecorationIds
                .map(id => model.modified.getDecorationRange(id))
                .filter(r => !!r)
                .map(r => LineRange.fromRange(r));
            const originalDecorationIds = model.original.deltaDecorations(lastUnchangedRegions.originalDecorationIds, newUnchangedRegions.map(r => ({ range: r.originalRange.toInclusiveRange(), options: { description: 'unchanged' } })));
            const modifiedDecorationIds = model.modified.deltaDecorations(lastUnchangedRegions.modifiedDecorationIds, newUnchangedRegions.map(r => ({ range: r.modifiedRange.toInclusiveRange(), options: { description: 'unchanged' } })));
            transaction(tx => {
                for (const r of newUnchangedRegions) {
                    for (let i = 0; i < lastUnchangedRegions.regions.length; i++) {
                        if (r.originalRange.intersectsStrict(lastUnchangedRegionsOrigRanges[i])
                            && r.modifiedRange.intersectsStrict(lastUnchangedRegionsModRanges[i])) {
                            r.setHiddenModifiedRange(lastUnchangedRegions.regions[i].getHiddenModifiedRange(undefined), tx);
                            break;
                        }
                    }
                }
                this._lastDiff = result;
                this._diff.set(DiffState.fromDiffResult(result), tx);
                this._isDiffUpToDate.set(true, tx);
                const currentSyncedMovedText = this.syncedMovedTexts.get();
                this.syncedMovedTexts.set(currentSyncedMovedText ? this._lastDiff.moves.find(m => m.lineRangeMapping.modifiedRange.intersect(currentSyncedMovedText.lineRangeMapping.modifiedRange)) : undefined, tx);
                this._unchangedRegions.set({
                    regions: newUnchangedRegions,
                    originalDecorationIds,
                    modifiedDecorationIds
                }, tx);
            });
        })));
    }
    ensureModifiedLineIsVisible(lineNumber, tx) {
        var _a;
        if (((_a = this.diff.get()) === null || _a === void 0 ? void 0 : _a.mappings.length) === 0) {
            return;
        }
        const unchangedRegions = this._unchangedRegions.get().regions;
        for (const r of unchangedRegions) {
            if (r.getHiddenModifiedRange(undefined).contains(lineNumber)) {
                r.showAll(tx); // TODO only unhide what is needed
                return;
            }
        }
    }
    ensureOriginalLineIsVisible(lineNumber, tx) {
        var _a;
        if (((_a = this.diff.get()) === null || _a === void 0 ? void 0 : _a.mappings.length) === 0) {
            return;
        }
        const unchangedRegions = this._unchangedRegions.get().regions;
        for (const r of unchangedRegions) {
            if (r.getHiddenOriginalRange(undefined).contains(lineNumber)) {
                r.showAll(tx); // TODO only unhide what is needed
                return;
            }
        }
    }
    waitForDiff() {
        return __awaiter(this, void 0, void 0, function* () {
            yield waitForState(this.isDiffUpToDate, s => s);
        });
    }
    serializeState() {
        const regions = this._unchangedRegions.get();
        return {
            collapsedRegions: regions.regions.map(r => ({ range: r.getHiddenModifiedRange(undefined).serialize() }))
        };
    }
    restoreSerializedState(state) {
        const ranges = state.collapsedRegions.map(r => LineRange.deserialize(r.range));
        const regions = this._unchangedRegions.get();
        transaction(tx => {
            for (const r of regions.regions) {
                for (const range of ranges) {
                    if (r.modifiedRange.intersect(range)) {
                        r.setHiddenModifiedRange(range, tx);
                        break;
                    }
                }
            }
        });
    }
}
export class DiffState {
    static fromDiffResult(result) {
        return new DiffState(result.changes.map(c => new DiffMapping(c)), result.moves || [], result.identical, result.quitEarly);
    }
    constructor(mappings, movedTexts, identical, quitEarly) {
        this.mappings = mappings;
        this.movedTexts = movedTexts;
        this.identical = identical;
        this.quitEarly = quitEarly;
    }
}
export class DiffMapping {
    constructor(lineRangeMapping) {
        this.lineRangeMapping = lineRangeMapping;
        /*
        readonly movedTo: MovedText | undefined,
        readonly movedFrom: MovedText | undefined,

        if (movedTo) {
            assertFn(() =>
                movedTo.lineRangeMapping.modifiedRange.equals(lineRangeMapping.modifiedRange)
                && lineRangeMapping.originalRange.isEmpty
                && !movedFrom
            );
        } else if (movedFrom) {
            assertFn(() =>
                movedFrom.lineRangeMapping.originalRange.equals(lineRangeMapping.originalRange)
                && lineRangeMapping.modifiedRange.isEmpty
                && !movedTo
            );
        }
        */
    }
}
export class UnchangedRegion {
    static fromDiffs(changes, originalLineCount, modifiedLineCount) {
        const inversedMappings = LineRangeMapping.inverse(changes, originalLineCount, modifiedLineCount);
        const result = [];
        const minHiddenLineCount = 3;
        const minContext = 3;
        for (const mapping of inversedMappings) {
            let origStart = mapping.originalRange.startLineNumber;
            let modStart = mapping.modifiedRange.startLineNumber;
            let length = mapping.originalRange.length;
            if (origStart === 1 && modStart === 1 && length > minContext + minHiddenLineCount) {
                if (length < originalLineCount) {
                    length -= minContext;
                }
                result.push(new UnchangedRegion(origStart, modStart, length, 0, 0));
            }
            else if (origStart + length === originalLineCount + 1 && modStart + length === modifiedLineCount + 1 && length > minContext + minHiddenLineCount) {
                origStart += minContext;
                modStart += minContext;
                length -= minContext;
                result.push(new UnchangedRegion(origStart, modStart, length, 0, 0));
            }
            else if (length > minContext * 2 + minHiddenLineCount) {
                origStart += minContext;
                modStart += minContext;
                length -= minContext * 2;
                result.push(new UnchangedRegion(origStart, modStart, length, 0, 0));
            }
        }
        return result;
    }
    get originalRange() {
        return LineRange.ofLength(this.originalLineNumber, this.lineCount);
    }
    get modifiedRange() {
        return LineRange.ofLength(this.modifiedLineNumber, this.lineCount);
    }
    constructor(originalLineNumber, modifiedLineNumber, lineCount, visibleLineCountTop, visibleLineCountBottom) {
        this.originalLineNumber = originalLineNumber;
        this.modifiedLineNumber = modifiedLineNumber;
        this.lineCount = lineCount;
        this._visibleLineCountTop = observableValue('visibleLineCountTop', 0);
        this.visibleLineCountTop = this._visibleLineCountTop;
        this._visibleLineCountBottom = observableValue('visibleLineCountBottom', 0);
        this.visibleLineCountBottom = this._visibleLineCountBottom;
        this._shouldHideControls = derived('isVisible', reader => this.visibleLineCountTop.read(reader) + this.visibleLineCountBottom.read(reader) === this.lineCount && !this.isDragged.read(reader));
        this.isDragged = observableValue('isDragged', false);
        this._visibleLineCountTop.set(visibleLineCountTop, undefined);
        this._visibleLineCountBottom.set(visibleLineCountBottom, undefined);
    }
    shouldHideControls(reader) {
        return this._shouldHideControls.read(reader);
    }
    getHiddenOriginalRange(reader) {
        return LineRange.ofLength(this.originalLineNumber + this._visibleLineCountTop.read(reader), this.lineCount - this._visibleLineCountTop.read(reader) - this._visibleLineCountBottom.read(reader));
    }
    getHiddenModifiedRange(reader) {
        return LineRange.ofLength(this.modifiedLineNumber + this._visibleLineCountTop.read(reader), this.lineCount - this._visibleLineCountTop.read(reader) - this._visibleLineCountBottom.read(reader));
    }
    setHiddenModifiedRange(range, tx) {
        const visibleLineCountTop = range.startLineNumber - this.modifiedLineNumber;
        const visibleLineCountBottom = (this.modifiedLineNumber + this.lineCount) - range.endLineNumberExclusive;
        this.setState(visibleLineCountTop, visibleLineCountBottom, tx);
    }
    getMaxVisibleLineCountTop() {
        return this.lineCount - this._visibleLineCountBottom.get();
    }
    getMaxVisibleLineCountBottom() {
        return this.lineCount - this._visibleLineCountTop.get();
    }
    showMoreAbove(count = 10, tx) {
        const maxVisibleLineCountTop = this.getMaxVisibleLineCountTop();
        this._visibleLineCountTop.set(Math.min(this._visibleLineCountTop.get() + count, maxVisibleLineCountTop), tx);
    }
    showMoreBelow(count = 10, tx) {
        const maxVisibleLineCountBottom = this.lineCount - this._visibleLineCountTop.get();
        this._visibleLineCountBottom.set(Math.min(this._visibleLineCountBottom.get() + count, maxVisibleLineCountBottom), tx);
    }
    showAll(tx) {
        this._visibleLineCountBottom.set(this.lineCount - this._visibleLineCountTop.get(), tx);
    }
    setState(visibleLineCountTop, visibleLineCountBottom, tx) {
        visibleLineCountTop = Math.max(Math.min(visibleLineCountTop, this.lineCount), 0);
        visibleLineCountBottom = Math.max(Math.min(visibleLineCountBottom, this.lineCount - visibleLineCountTop), 0);
        this._visibleLineCountTop.set(visibleLineCountTop, tx);
        this._visibleLineCountBottom.set(visibleLineCountBottom, tx);
    }
}
function applyOriginalEdits(diff, textEdits, originalTextModel, modifiedTextModel) {
    if (textEdits.length === 0) {
        return diff;
    }
    const diff2 = flip(diff);
    const diff3 = applyModifiedEdits(diff2, textEdits, modifiedTextModel, originalTextModel);
    if (!diff3) {
        return undefined;
    }
    return flip(diff3);
}
function flip(diff) {
    return {
        changes: diff.changes.map(c => c.flip()),
        moves: diff.moves.map(m => m.flip()),
        identical: diff.identical,
        quitEarly: diff.quitEarly,
    };
}
function applyModifiedEdits(diff, textEdits, originalTextModel, modifiedTextModel) {
    if (textEdits.length === 0) {
        return diff;
    }
    if (diff.changes.some(c => !c.innerChanges) || diff.moves.length > 0) {
        // TODO support these cases
        return undefined;
    }
    const changes = applyModifiedEditsToLineRangeMappings(diff.changes, textEdits, originalTextModel, modifiedTextModel);
    const moves = diff.moves.map(m => {
        const newModifiedRange = applyEditToLineRange(m.lineRangeMapping.modifiedRange, textEdits);
        return newModifiedRange ? new MovedText(new SimpleLineRangeMapping(m.lineRangeMapping.originalRange, newModifiedRange), applyModifiedEditsToLineRangeMappings(m.changes, textEdits, originalTextModel, modifiedTextModel)) : undefined;
    }).filter(isDefined);
    return {
        identical: false,
        quitEarly: false,
        changes,
        moves,
    };
}
function applyEditToLineRange(range, textEdits) {
    let rangeStartLineNumber = range.startLineNumber;
    let rangeEndLineNumberEx = range.endLineNumberExclusive;
    for (let i = textEdits.length - 1; i >= 0; i--) {
        const textEdit = textEdits[i];
        const textEditStartLineNumber = lengthGetLineCount(textEdit.startOffset) + 1;
        const textEditEndLineNumber = lengthGetLineCount(textEdit.endOffset) + 1;
        const newLengthLineCount = lengthGetLineCount(textEdit.newLength);
        const delta = newLengthLineCount - (textEditEndLineNumber - textEditStartLineNumber);
        if (textEditEndLineNumber < rangeStartLineNumber) {
            // the text edit is before us
            rangeStartLineNumber += delta;
            rangeEndLineNumberEx += delta;
        }
        else if (textEditStartLineNumber > rangeEndLineNumberEx) {
            // the text edit is after us
            // NOOP
        }
        else if (textEditStartLineNumber < rangeStartLineNumber && rangeEndLineNumberEx < textEditEndLineNumber) {
            // the range is fully contained in the text edit
            return undefined;
        }
        else if (textEditStartLineNumber < rangeStartLineNumber && textEditEndLineNumber <= rangeEndLineNumberEx) {
            // the text edit ends inside our range
            rangeStartLineNumber = textEditEndLineNumber + 1;
            rangeStartLineNumber += delta;
            rangeEndLineNumberEx += delta;
        }
        else if (rangeStartLineNumber <= textEditStartLineNumber && textEditEndLineNumber < rangeStartLineNumber) {
            // the text edit starts inside our range
            rangeEndLineNumberEx = textEditStartLineNumber;
        }
        else {
            rangeEndLineNumberEx += delta;
        }
    }
    return new LineRange(rangeStartLineNumber, rangeEndLineNumberEx);
}
function applyModifiedEditsToLineRangeMappings(changes, textEdits, originalTextModel, modifiedTextModel) {
    const diffTextEdits = changes.flatMap(c => c.innerChanges.map(c => new TextEditInfo(positionToLength(c.originalRange.getStartPosition()), positionToLength(c.originalRange.getEndPosition()), lengthOfRange(c.modifiedRange).toLength())));
    const combined = combineTextEditInfos(diffTextEdits, textEdits);
    let lastOriginalEndOffset = lengthZero;
    let lastModifiedEndOffset = lengthZero;
    const rangeMappings = combined.map(c => {
        const modifiedStartOffset = lengthAdd(lastModifiedEndOffset, lengthDiffNonNegative(lastOriginalEndOffset, c.startOffset));
        lastOriginalEndOffset = c.endOffset;
        lastModifiedEndOffset = lengthAdd(modifiedStartOffset, c.newLength);
        return new RangeMapping(Range.fromPositions(lengthToPosition(c.startOffset), lengthToPosition(c.endOffset)), Range.fromPositions(lengthToPosition(modifiedStartOffset), lengthToPosition(lastModifiedEndOffset)));
    });
    const newChanges = lineRangeMappingFromRangeMappings(rangeMappings, originalTextModel.getLinesContent(), modifiedTextModel.getLinesContent());
    return newChanges;
}
