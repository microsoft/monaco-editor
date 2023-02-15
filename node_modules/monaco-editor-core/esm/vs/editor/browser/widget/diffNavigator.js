/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as assert from '../../../base/common/assert.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import * as objects from '../../../base/common/objects.js';
import { Range } from '../../common/core/range.js';
import { AudioCue, IAudioCueService } from '../../../platform/audioCues/browser/audioCueService.js';
import { ICodeEditorService } from '../services/codeEditorService.js';
import { IAccessibilityService } from '../../../platform/accessibility/common/accessibility.js';
const defaultOptions = {
    followsCaret: true,
    ignoreCharChanges: true,
    alwaysRevealFirst: true,
    findResultLoop: true
};
/**
 * Create a new diff navigator for the provided diff editor.
 */
let DiffNavigator = class DiffNavigator extends Disposable {
    constructor(editor, options = {}, _audioCueService, _codeEditorService, _accessibilityService) {
        super();
        this._audioCueService = _audioCueService;
        this._codeEditorService = _codeEditorService;
        this._accessibilityService = _accessibilityService;
        this._onDidUpdate = this._register(new Emitter());
        this._editor = editor;
        this._options = objects.mixin(options, defaultOptions, false);
        this.disposed = false;
        this.nextIdx = -1;
        this.ranges = [];
        this.ignoreSelectionChange = false;
        this.revealFirst = Boolean(this._options.alwaysRevealFirst);
        // hook up to diff editor for diff, disposal, and caret move
        this._register(this._editor.onDidDispose(() => this.dispose()));
        this._register(this._editor.onDidUpdateDiff(() => this._onDiffUpdated()));
        if (this._options.followsCaret) {
            this._register(this._editor.getModifiedEditor().onDidChangeCursorPosition((e) => {
                if (this.ignoreSelectionChange) {
                    return;
                }
                this._updateAccessibilityState(e.position.lineNumber);
                this.nextIdx = -1;
            }));
        }
        if (this._options.alwaysRevealFirst) {
            this._register(this._editor.getModifiedEditor().onDidChangeModel((e) => {
                this.revealFirst = true;
            }));
        }
        // init things
        this._init();
    }
    _init() {
        const changes = this._editor.getLineChanges();
        if (!changes) {
            return;
        }
    }
    _onDiffUpdated() {
        this._init();
        this._compute(this._editor.getLineChanges());
        if (this.revealFirst) {
            // Only reveal first on first non-null changes
            if (this._editor.getLineChanges() !== null) {
                this.revealFirst = false;
                this.nextIdx = -1;
                this.next(1 /* ScrollType.Immediate */);
            }
        }
    }
    _compute(lineChanges) {
        // new ranges
        this.ranges = [];
        if (lineChanges) {
            // create ranges from changes
            lineChanges.forEach((lineChange) => {
                if (!this._options.ignoreCharChanges && lineChange.charChanges) {
                    lineChange.charChanges.forEach((charChange) => {
                        this.ranges.push({
                            rhs: true,
                            range: new Range(charChange.modifiedStartLineNumber, charChange.modifiedStartColumn, charChange.modifiedEndLineNumber, charChange.modifiedEndColumn)
                        });
                    });
                }
                else {
                    if (lineChange.modifiedEndLineNumber === 0) {
                        // a deletion
                        this.ranges.push({
                            rhs: true,
                            range: new Range(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedStartLineNumber + 1, 1)
                        });
                    }
                    else {
                        // an insertion or modification
                        this.ranges.push({
                            rhs: true,
                            range: new Range(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber + 1, 1)
                        });
                    }
                }
            });
        }
        // sort
        this.ranges.sort((left, right) => Range.compareRangesUsingStarts(left.range, right.range));
        this._onDidUpdate.fire(this);
    }
    _initIdx(fwd) {
        let found = false;
        const position = this._editor.getPosition();
        if (!position) {
            this.nextIdx = 0;
            return;
        }
        for (let i = 0, len = this.ranges.length; i < len && !found; i++) {
            const range = this.ranges[i].range;
            if (position.isBeforeOrEqual(range.getStartPosition())) {
                this.nextIdx = i + (fwd ? 0 : -1);
                found = true;
            }
        }
        if (!found) {
            // after the last change
            this.nextIdx = fwd ? 0 : this.ranges.length - 1;
        }
        if (this.nextIdx < 0) {
            this.nextIdx = this.ranges.length - 1;
        }
    }
    _move(fwd, scrollType) {
        assert.ok(!this.disposed, 'Illegal State - diff navigator has been disposed');
        if (!this.canNavigate()) {
            return;
        }
        if (this.nextIdx === -1) {
            this._initIdx(fwd);
        }
        else if (fwd) {
            this.nextIdx += 1;
            if (this.nextIdx >= this.ranges.length) {
                this.nextIdx = 0;
            }
        }
        else {
            this.nextIdx -= 1;
            if (this.nextIdx < 0) {
                this.nextIdx = this.ranges.length - 1;
            }
        }
        const info = this.ranges[this.nextIdx];
        this.ignoreSelectionChange = true;
        try {
            const pos = info.range.getStartPosition();
            this._editor.setPosition(pos);
            this._editor.revealRangeInCenter(info.range, scrollType);
            this._updateAccessibilityState(pos.lineNumber, true);
        }
        finally {
            this.ignoreSelectionChange = false;
        }
    }
    _updateAccessibilityState(lineNumber, jumpToChange) {
        var _a;
        const modifiedEditor = (_a = this._editor.getModel()) === null || _a === void 0 ? void 0 : _a.modified;
        if (!modifiedEditor) {
            return;
        }
        const insertedOrModified = modifiedEditor.getLineDecorations(lineNumber).find(l => l.options.className === 'line-insert');
        if (insertedOrModified) {
            this._audioCueService.playAudioCue(AudioCue.diffLineModified, true);
        }
        else if (jumpToChange) {
            // The modified editor does not include deleted lines, but when
            // we are moved to the area where lines were deleted, play this cue
            this._audioCueService.playAudioCue(AudioCue.diffLineDeleted, true);
        }
        else {
            return;
        }
        const codeEditor = this._codeEditorService.getActiveCodeEditor();
        if (jumpToChange && codeEditor && insertedOrModified && this._accessibilityService.isScreenReaderOptimized()) {
            codeEditor.setSelection({ startLineNumber: lineNumber, startColumn: 0, endLineNumber: lineNumber, endColumn: Number.MAX_VALUE });
            codeEditor.writeScreenReaderContent('diff-navigation');
        }
    }
    canNavigate() {
        return this.ranges && this.ranges.length > 0;
    }
    next(scrollType = 0 /* ScrollType.Smooth */) {
        if (!this.canNavigateNext()) {
            return;
        }
        this._move(true, scrollType);
    }
    previous(scrollType = 0 /* ScrollType.Smooth */) {
        if (!this.canNavigatePrevious()) {
            return;
        }
        this._move(false, scrollType);
    }
    canNavigateNext() {
        return this.canNavigateLoop() || this.nextIdx < this.ranges.length - 1;
    }
    canNavigatePrevious() {
        return this.canNavigateLoop() || this.nextIdx !== 0;
    }
    canNavigateLoop() {
        return Boolean(this._options.findResultLoop);
    }
    dispose() {
        super.dispose();
        this.ranges = [];
        this.disposed = true;
    }
};
DiffNavigator = __decorate([
    __param(2, IAudioCueService),
    __param(3, ICodeEditorService),
    __param(4, IAccessibilityService)
], DiffNavigator);
export { DiffNavigator };
