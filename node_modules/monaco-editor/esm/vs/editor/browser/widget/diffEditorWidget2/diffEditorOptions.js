/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { derived, observableValue } from '../../../../base/common/observable.js';
import { clampedFloat, clampedInt, boolean as validateBooleanOption, stringSet as validateStringSetOption } from '../../../common/config/editorOptions.js';
export class DiffEditorOptions {
    get editorOptions() { return this._options; }
    constructor(options) {
        this.renderOverviewRuler = derived('renderOverviewRuler', reader => this._options.read(reader).renderOverviewRuler);
        this.renderSideBySide = derived('renderSideBySide', reader => this._options.read(reader).renderSideBySide);
        this.readOnly = derived('readOnly', reader => this._options.read(reader).readOnly);
        this.shouldRenderRevertArrows = derived('shouldRenderRevertArrows', (reader) => {
            if (!this._options.read(reader).renderMarginRevertIcon) {
                return false;
            }
            if (!this.renderSideBySide.read(reader)) {
                return false;
            }
            if (this.readOnly.read(reader)) {
                return false;
            }
            return true;
        });
        this.renderIndicators = derived('renderIndicators', reader => this._options.read(reader).renderIndicators);
        this.enableSplitViewResizing = derived('enableSplitViewResizing', reader => this._options.read(reader).enableSplitViewResizing);
        this.collapseUnchangedRegions = derived('hideUnchangedRegions', reader => this._options.read(reader).experimental.collapseUnchangedRegions);
        this.splitViewDefaultRatio = derived('splitViewDefaultRatio', reader => this._options.read(reader).splitViewDefaultRatio);
        this.ignoreTrimWhitespace = derived('ignoreTrimWhitespace', reader => this._options.read(reader).ignoreTrimWhitespace);
        this.maxComputationTimeMs = derived('maxComputationTime', reader => this._options.read(reader).maxComputationTime);
        this.showMoves = derived('showMoves', reader => {
            const o = this._options.read(reader);
            return o.experimental.showMoves && o.renderSideBySide;
        });
        this.isInEmbeddedEditor = derived('isInEmbeddedEditor', reader => this._options.read(reader).isInEmbeddedEditor);
        this.diffWordWrap = derived('diffWordWrap', reader => this._options.read(reader).diffWordWrap);
        this.originalEditable = derived('originalEditable', reader => this._options.read(reader).originalEditable);
        this.diffCodeLens = derived('diffCodeLens', reader => this._options.read(reader).diffCodeLens);
        this.accessibilityVerbose = derived('accessibilityVerbose', reader => this._options.read(reader).accessibilityVerbose);
        this.diffAlgorithm = derived('diffAlgorithm', reader => this._options.read(reader).diffAlgorithm);
        this.showEmptyDecorations = derived('showEmptyDecorations', reader => this._options.read(reader).experimental.showEmptyDecorations);
        const optionsCopy = Object.assign(Object.assign({}, options), validateDiffEditorOptions(options, diffEditorDefaultOptions));
        this._options = observableValue('options', optionsCopy);
    }
    updateOptions(changedOptions) {
        const newDiffEditorOptions = validateDiffEditorOptions(changedOptions, this._options.get());
        const newOptions = Object.assign(Object.assign(Object.assign({}, this._options.get()), changedOptions), newDiffEditorOptions);
        this._options.set(newOptions, undefined, { changedOptions: changedOptions });
    }
}
const diffEditorDefaultOptions = {
    enableSplitViewResizing: true,
    splitViewDefaultRatio: 0.5,
    renderSideBySide: true,
    renderMarginRevertIcon: true,
    maxComputationTime: 5000,
    maxFileSize: 50,
    ignoreTrimWhitespace: true,
    renderIndicators: true,
    originalEditable: false,
    diffCodeLens: false,
    renderOverviewRuler: true,
    diffWordWrap: 'inherit',
    diffAlgorithm: 'advanced',
    accessibilityVerbose: false,
    experimental: {
        collapseUnchangedRegions: false,
        showMoves: false,
        showEmptyDecorations: true,
    },
    isInEmbeddedEditor: false,
};
function validateDiffEditorOptions(options, defaults) {
    var _a, _b, _c;
    return {
        enableSplitViewResizing: validateBooleanOption(options.enableSplitViewResizing, defaults.enableSplitViewResizing),
        splitViewDefaultRatio: clampedFloat(options.splitViewDefaultRatio, 0.5, 0.1, 0.9),
        renderSideBySide: validateBooleanOption(options.renderSideBySide, defaults.renderSideBySide),
        renderMarginRevertIcon: validateBooleanOption(options.renderMarginRevertIcon, defaults.renderMarginRevertIcon),
        maxComputationTime: clampedInt(options.maxComputationTime, defaults.maxComputationTime, 0, 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */),
        maxFileSize: clampedInt(options.maxFileSize, defaults.maxFileSize, 0, 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */),
        ignoreTrimWhitespace: validateBooleanOption(options.ignoreTrimWhitespace, defaults.ignoreTrimWhitespace),
        renderIndicators: validateBooleanOption(options.renderIndicators, defaults.renderIndicators),
        originalEditable: validateBooleanOption(options.originalEditable, defaults.originalEditable),
        diffCodeLens: validateBooleanOption(options.diffCodeLens, defaults.diffCodeLens),
        renderOverviewRuler: validateBooleanOption(options.renderOverviewRuler, defaults.renderOverviewRuler),
        diffWordWrap: validateStringSetOption(options.diffWordWrap, defaults.diffWordWrap, ['off', 'on', 'inherit']),
        diffAlgorithm: validateStringSetOption(options.diffAlgorithm, defaults.diffAlgorithm, ['legacy', 'advanced'], { 'smart': 'legacy', 'experimental': 'advanced' }),
        accessibilityVerbose: validateBooleanOption(options.accessibilityVerbose, defaults.accessibilityVerbose),
        experimental: {
            collapseUnchangedRegions: validateBooleanOption((_a = options.experimental) === null || _a === void 0 ? void 0 : _a.collapseUnchangedRegions, defaults.experimental.collapseUnchangedRegions),
            showMoves: validateBooleanOption((_b = options.experimental) === null || _b === void 0 ? void 0 : _b.showMoves, defaults.experimental.showMoves),
            showEmptyDecorations: validateBooleanOption((_c = options.experimental) === null || _c === void 0 ? void 0 : _c.showEmptyDecorations, defaults.experimental.showEmptyDecorations),
        },
        isInEmbeddedEditor: validateBooleanOption(options.isInEmbeddedEditor, defaults.isInEmbeddedEditor),
    };
}
