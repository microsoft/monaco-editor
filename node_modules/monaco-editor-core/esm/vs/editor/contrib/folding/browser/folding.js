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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createCancelablePromise, Delayer, RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { illegalArgument, onUnexpectedError } from '../../../../base/common/errors.js';
import { KeyChord } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { escapeRegExpCharacters } from '../../../../base/common/strings.js';
import * as types from '../../../../base/common/types.js';
import './folding.css';
import { StableEditorScrollState } from '../../../browser/stableEditorScroll.js';
import { EditorAction, registerEditorAction, registerEditorContribution, registerInstantiatedEditorAction } from '../../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { FoldingRangeKind } from '../../../common/languages.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { FoldingModel, getNextFoldLine, getParentFoldLine as getParentFoldLine, getPreviousFoldLine, setCollapseStateAtLevel, setCollapseStateForMatchingLines, setCollapseStateForRest, setCollapseStateForType, setCollapseStateLevelsDown, setCollapseStateLevelsUp, setCollapseStateUp, toggleCollapseState } from './foldingModel.js';
import { HiddenRangeModel } from './hiddenRangeModel.js';
import { IndentRangeProvider } from './indentRangeProvider.js';
import * as nls from '../../../../nls.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { FoldingDecorationProvider } from './foldingDecorations.js';
import { FoldingRegions } from './foldingRanges.js';
import { SyntaxRangeProvider } from './syntaxRangeProvider.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { Emitter } from '../../../../base/common/event.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { URI } from '../../../../base/common/uri.js';
import { IModelService } from '../../../common/services/model.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
const CONTEXT_FOLDING_ENABLED = new RawContextKey('foldingEnabled', false);
let FoldingController = class FoldingController extends Disposable {
    static get(editor) {
        return editor.getContribution(FoldingController.ID);
    }
    static getFoldingRangeProviders(languageFeaturesService, model) {
        var _a, _b;
        const foldingRangeProviders = languageFeaturesService.foldingRangeProvider.ordered(model);
        return (_b = ((_a = FoldingController._foldingRangeSelector) === null || _a === void 0 ? void 0 : _a.call(FoldingController, foldingRangeProviders, model))) !== null && _b !== void 0 ? _b : foldingRangeProviders;
    }
    constructor(editor, contextKeyService, languageConfigurationService, notificationService, languageFeatureDebounceService, languageFeaturesService) {
        super();
        this.contextKeyService = contextKeyService;
        this.languageConfigurationService = languageConfigurationService;
        this.languageFeaturesService = languageFeaturesService;
        this.localToDispose = this._register(new DisposableStore());
        this.editor = editor;
        this._foldingLimitReporter = new RangesLimitReporter(editor);
        const options = this.editor.getOptions();
        this._isEnabled = options.get(41 /* EditorOption.folding */);
        this._useFoldingProviders = options.get(42 /* EditorOption.foldingStrategy */) !== 'indentation';
        this._unfoldOnClickAfterEndOfLine = options.get(46 /* EditorOption.unfoldOnClickAfterEndOfLine */);
        this._restoringViewState = false;
        this._currentModelHasFoldedImports = false;
        this._foldingImportsByDefault = options.get(44 /* EditorOption.foldingImportsByDefault */);
        this.updateDebounceInfo = languageFeatureDebounceService.for(languageFeaturesService.foldingRangeProvider, 'Folding', { min: 200 });
        this.foldingModel = null;
        this.hiddenRangeModel = null;
        this.rangeProvider = null;
        this.foldingRegionPromise = null;
        this.foldingModelPromise = null;
        this.updateScheduler = null;
        this.cursorChangedScheduler = null;
        this.mouseDownInfo = null;
        this.foldingDecorationProvider = new FoldingDecorationProvider(editor);
        this.foldingDecorationProvider.showFoldingControls = options.get(105 /* EditorOption.showFoldingControls */);
        this.foldingDecorationProvider.showFoldingHighlights = options.get(43 /* EditorOption.foldingHighlight */);
        this.foldingEnabled = CONTEXT_FOLDING_ENABLED.bindTo(this.contextKeyService);
        this.foldingEnabled.set(this._isEnabled);
        this._register(this.editor.onDidChangeModel(() => this.onModelChanged()));
        this._register(this.editor.onDidChangeConfiguration((e) => {
            if (e.hasChanged(41 /* EditorOption.folding */)) {
                this._isEnabled = this.editor.getOptions().get(41 /* EditorOption.folding */);
                this.foldingEnabled.set(this._isEnabled);
                this.onModelChanged();
            }
            if (e.hasChanged(45 /* EditorOption.foldingMaximumRegions */)) {
                this.onModelChanged();
            }
            if (e.hasChanged(105 /* EditorOption.showFoldingControls */) || e.hasChanged(43 /* EditorOption.foldingHighlight */)) {
                const options = this.editor.getOptions();
                this.foldingDecorationProvider.showFoldingControls = options.get(105 /* EditorOption.showFoldingControls */);
                this.foldingDecorationProvider.showFoldingHighlights = options.get(43 /* EditorOption.foldingHighlight */);
                this.triggerFoldingModelChanged();
            }
            if (e.hasChanged(42 /* EditorOption.foldingStrategy */)) {
                this._useFoldingProviders = this.editor.getOptions().get(42 /* EditorOption.foldingStrategy */) !== 'indentation';
                this.onFoldingStrategyChanged();
            }
            if (e.hasChanged(46 /* EditorOption.unfoldOnClickAfterEndOfLine */)) {
                this._unfoldOnClickAfterEndOfLine = this.editor.getOptions().get(46 /* EditorOption.unfoldOnClickAfterEndOfLine */);
            }
            if (e.hasChanged(44 /* EditorOption.foldingImportsByDefault */)) {
                this._foldingImportsByDefault = this.editor.getOptions().get(44 /* EditorOption.foldingImportsByDefault */);
            }
        }));
        this.onModelChanged();
    }
    /**
     * Store view state.
     */
    saveViewState() {
        const model = this.editor.getModel();
        if (!model || !this._isEnabled || model.isTooLargeForTokenization()) {
            return {};
        }
        if (this.foldingModel) { // disposed ?
            const collapsedRegions = this.foldingModel.getMemento();
            const provider = this.rangeProvider ? this.rangeProvider.id : undefined;
            return { collapsedRegions, lineCount: model.getLineCount(), provider, foldedImports: this._currentModelHasFoldedImports };
        }
        return undefined;
    }
    /**
     * Restore view state.
     */
    restoreViewState(state) {
        const model = this.editor.getModel();
        if (!model || !this._isEnabled || model.isTooLargeForTokenization() || !this.hiddenRangeModel) {
            return;
        }
        if (!state) {
            return;
        }
        this._currentModelHasFoldedImports = !!state.foldedImports;
        if (state.collapsedRegions && state.collapsedRegions.length > 0 && this.foldingModel) {
            this._restoringViewState = true;
            try {
                this.foldingModel.applyMemento(state.collapsedRegions);
            }
            finally {
                this._restoringViewState = false;
            }
        }
    }
    onModelChanged() {
        this.localToDispose.clear();
        const model = this.editor.getModel();
        if (!this._isEnabled || !model || model.isTooLargeForTokenization()) {
            // huge files get no view model, so they cannot support hidden areas
            return;
        }
        this._currentModelHasFoldedImports = false;
        this.foldingModel = new FoldingModel(model, this.foldingDecorationProvider);
        this.localToDispose.add(this.foldingModel);
        this.hiddenRangeModel = new HiddenRangeModel(this.foldingModel);
        this.localToDispose.add(this.hiddenRangeModel);
        this.localToDispose.add(this.hiddenRangeModel.onDidChange(hr => this.onHiddenRangesChanges(hr)));
        this.updateScheduler = new Delayer(this.updateDebounceInfo.get(model));
        this.cursorChangedScheduler = new RunOnceScheduler(() => this.revealCursor(), 200);
        this.localToDispose.add(this.cursorChangedScheduler);
        this.localToDispose.add(this.languageFeaturesService.foldingRangeProvider.onDidChange(() => this.onFoldingStrategyChanged()));
        this.localToDispose.add(this.editor.onDidChangeModelLanguageConfiguration(() => this.onFoldingStrategyChanged())); // covers model language changes as well
        this.localToDispose.add(this.editor.onDidChangeModelContent(e => this.onDidChangeModelContent(e)));
        this.localToDispose.add(this.editor.onDidChangeCursorPosition(() => this.onCursorPositionChanged()));
        this.localToDispose.add(this.editor.onMouseDown(e => this.onEditorMouseDown(e)));
        this.localToDispose.add(this.editor.onMouseUp(e => this.onEditorMouseUp(e)));
        this.localToDispose.add({
            dispose: () => {
                var _a, _b;
                if (this.foldingRegionPromise) {
                    this.foldingRegionPromise.cancel();
                    this.foldingRegionPromise = null;
                }
                (_a = this.updateScheduler) === null || _a === void 0 ? void 0 : _a.cancel();
                this.updateScheduler = null;
                this.foldingModel = null;
                this.foldingModelPromise = null;
                this.hiddenRangeModel = null;
                this.cursorChangedScheduler = null;
                (_b = this.rangeProvider) === null || _b === void 0 ? void 0 : _b.dispose();
                this.rangeProvider = null;
            }
        });
        this.triggerFoldingModelChanged();
    }
    onFoldingStrategyChanged() {
        var _a;
        (_a = this.rangeProvider) === null || _a === void 0 ? void 0 : _a.dispose();
        this.rangeProvider = null;
        this.triggerFoldingModelChanged();
    }
    getRangeProvider(editorModel) {
        if (this.rangeProvider) {
            return this.rangeProvider;
        }
        const indentRangeProvider = new IndentRangeProvider(editorModel, this.languageConfigurationService, this._foldingLimitReporter);
        this.rangeProvider = indentRangeProvider; // fallback
        if (this._useFoldingProviders && this.foldingModel) {
            const selectedProviders = FoldingController.getFoldingRangeProviders(this.languageFeaturesService, editorModel);
            if (selectedProviders.length > 0) {
                this.rangeProvider = new SyntaxRangeProvider(editorModel, selectedProviders, () => this.triggerFoldingModelChanged(), this._foldingLimitReporter, indentRangeProvider);
            }
        }
        return this.rangeProvider;
    }
    getFoldingModel() {
        return this.foldingModelPromise;
    }
    onDidChangeModelContent(e) {
        var _a;
        (_a = this.hiddenRangeModel) === null || _a === void 0 ? void 0 : _a.notifyChangeModelContent(e);
        this.triggerFoldingModelChanged();
    }
    triggerFoldingModelChanged() {
        if (this.updateScheduler) {
            if (this.foldingRegionPromise) {
                this.foldingRegionPromise.cancel();
                this.foldingRegionPromise = null;
            }
            this.foldingModelPromise = this.updateScheduler.trigger(() => {
                const foldingModel = this.foldingModel;
                if (!foldingModel) { // null if editor has been disposed, or folding turned off
                    return null;
                }
                const sw = new StopWatch(true);
                const provider = this.getRangeProvider(foldingModel.textModel);
                const foldingRegionPromise = this.foldingRegionPromise = createCancelablePromise(token => provider.compute(token));
                return foldingRegionPromise.then(foldingRanges => {
                    if (foldingRanges && foldingRegionPromise === this.foldingRegionPromise) { // new request or cancelled in the meantime?
                        let scrollState;
                        if (this._foldingImportsByDefault && !this._currentModelHasFoldedImports) {
                            const hasChanges = foldingRanges.setCollapsedAllOfType(FoldingRangeKind.Imports.value, true);
                            if (hasChanges) {
                                scrollState = StableEditorScrollState.capture(this.editor);
                                this._currentModelHasFoldedImports = hasChanges;
                            }
                        }
                        // some cursors might have moved into hidden regions, make sure they are in expanded regions
                        const selections = this.editor.getSelections();
                        const selectionLineNumbers = selections ? selections.map(s => s.startLineNumber) : [];
                        foldingModel.update(foldingRanges, selectionLineNumbers);
                        scrollState === null || scrollState === void 0 ? void 0 : scrollState.restore(this.editor);
                        // update debounce info
                        const newValue = this.updateDebounceInfo.update(foldingModel.textModel, sw.elapsed());
                        if (this.updateScheduler) {
                            this.updateScheduler.defaultDelay = newValue;
                        }
                    }
                    return foldingModel;
                });
            }).then(undefined, (err) => {
                onUnexpectedError(err);
                return null;
            });
        }
    }
    onHiddenRangesChanges(hiddenRanges) {
        if (this.hiddenRangeModel && hiddenRanges.length && !this._restoringViewState) {
            const selections = this.editor.getSelections();
            if (selections) {
                if (this.hiddenRangeModel.adjustSelections(selections)) {
                    this.editor.setSelections(selections);
                }
            }
        }
        this.editor.setHiddenAreas(hiddenRanges, this);
    }
    onCursorPositionChanged() {
        if (this.hiddenRangeModel && this.hiddenRangeModel.hasRanges()) {
            this.cursorChangedScheduler.schedule();
        }
    }
    revealCursor() {
        const foldingModel = this.getFoldingModel();
        if (!foldingModel) {
            return;
        }
        foldingModel.then(foldingModel => {
            if (foldingModel) {
                const selections = this.editor.getSelections();
                if (selections && selections.length > 0) {
                    const toToggle = [];
                    for (const selection of selections) {
                        const lineNumber = selection.selectionStartLineNumber;
                        if (this.hiddenRangeModel && this.hiddenRangeModel.isHidden(lineNumber)) {
                            toToggle.push(...foldingModel.getAllRegionsAtLine(lineNumber, r => r.isCollapsed && lineNumber > r.startLineNumber));
                        }
                    }
                    if (toToggle.length) {
                        foldingModel.toggleCollapseState(toToggle);
                        this.reveal(selections[0].getPosition());
                    }
                }
            }
        }).then(undefined, onUnexpectedError);
    }
    onEditorMouseDown(e) {
        this.mouseDownInfo = null;
        if (!this.hiddenRangeModel || !e.target || !e.target.range) {
            return;
        }
        if (!e.event.leftButton && !e.event.middleButton) {
            return;
        }
        const range = e.target.range;
        let iconClicked = false;
        switch (e.target.type) {
            case 4 /* MouseTargetType.GUTTER_LINE_DECORATIONS */: {
                const data = e.target.detail;
                const offsetLeftInGutter = e.target.element.offsetLeft;
                const gutterOffsetX = data.offsetX - offsetLeftInGutter;
                // const gutterOffsetX = data.offsetX - data.glyphMarginWidth - data.lineNumbersWidth - data.glyphMarginLeft;
                // TODO@joao TODO@alex TODO@martin this is such that we don't collide with dirty diff
                if (gutterOffsetX < 5) { // the whitespace between the border and the real folding icon border is 5px
                    return;
                }
                iconClicked = true;
                break;
            }
            case 7 /* MouseTargetType.CONTENT_EMPTY */: {
                if (this._unfoldOnClickAfterEndOfLine && this.hiddenRangeModel.hasRanges()) {
                    const data = e.target.detail;
                    if (!data.isAfterLines) {
                        break;
                    }
                }
                return;
            }
            case 6 /* MouseTargetType.CONTENT_TEXT */: {
                if (this.hiddenRangeModel.hasRanges()) {
                    const model = this.editor.getModel();
                    if (model && range.startColumn === model.getLineMaxColumn(range.startLineNumber)) {
                        break;
                    }
                }
                return;
            }
            default:
                return;
        }
        this.mouseDownInfo = { lineNumber: range.startLineNumber, iconClicked };
    }
    onEditorMouseUp(e) {
        const foldingModel = this.foldingModel;
        if (!foldingModel || !this.mouseDownInfo || !e.target) {
            return;
        }
        const lineNumber = this.mouseDownInfo.lineNumber;
        const iconClicked = this.mouseDownInfo.iconClicked;
        const range = e.target.range;
        if (!range || range.startLineNumber !== lineNumber) {
            return;
        }
        if (iconClicked) {
            if (e.target.type !== 4 /* MouseTargetType.GUTTER_LINE_DECORATIONS */) {
                return;
            }
        }
        else {
            const model = this.editor.getModel();
            if (!model || range.startColumn !== model.getLineMaxColumn(lineNumber)) {
                return;
            }
        }
        const region = foldingModel.getRegionAtLine(lineNumber);
        if (region && region.startLineNumber === lineNumber) {
            const isCollapsed = region.isCollapsed;
            if (iconClicked || isCollapsed) {
                const surrounding = e.event.altKey;
                let toToggle = [];
                if (surrounding) {
                    const filter = (otherRegion) => !otherRegion.containedBy(region) && !region.containedBy(otherRegion);
                    const toMaybeToggle = foldingModel.getRegionsInside(null, filter);
                    for (const r of toMaybeToggle) {
                        if (r.isCollapsed) {
                            toToggle.push(r);
                        }
                    }
                    // if any surrounding regions are folded, unfold those. Otherwise, fold all surrounding
                    if (toToggle.length === 0) {
                        toToggle = toMaybeToggle;
                    }
                }
                else {
                    const recursive = e.event.middleButton || e.event.shiftKey;
                    if (recursive) {
                        for (const r of foldingModel.getRegionsInside(region)) {
                            if (r.isCollapsed === isCollapsed) {
                                toToggle.push(r);
                            }
                        }
                    }
                    // when recursive, first only collapse all children. If all are already folded or there are no children, also fold parent.
                    if (isCollapsed || !recursive || toToggle.length === 0) {
                        toToggle.push(region);
                    }
                }
                foldingModel.toggleCollapseState(toToggle);
                this.reveal({ lineNumber, column: 1 });
            }
        }
    }
    reveal(position) {
        this.editor.revealPositionInCenterIfOutsideViewport(position, 0 /* ScrollType.Smooth */);
    }
};
FoldingController.ID = 'editor.contrib.folding';
FoldingController = __decorate([
    __param(1, IContextKeyService),
    __param(2, ILanguageConfigurationService),
    __param(3, INotificationService),
    __param(4, ILanguageFeatureDebounceService),
    __param(5, ILanguageFeaturesService)
], FoldingController);
export { FoldingController };
export class RangesLimitReporter {
    constructor(editor) {
        this.editor = editor;
        this._onDidChange = new Emitter();
        this._computed = 0;
        this._limited = false;
    }
    get limit() {
        return this.editor.getOptions().get(45 /* EditorOption.foldingMaximumRegions */);
    }
    update(computed, limited) {
        if (computed !== this._computed || limited !== this._limited) {
            this._computed = computed;
            this._limited = limited;
            this._onDidChange.fire();
        }
    }
}
class FoldingAction extends EditorAction {
    runEditorCommand(accessor, editor, args) {
        const languageConfigurationService = accessor.get(ILanguageConfigurationService);
        const foldingController = FoldingController.get(editor);
        if (!foldingController) {
            return;
        }
        const foldingModelPromise = foldingController.getFoldingModel();
        if (foldingModelPromise) {
            this.reportTelemetry(accessor, editor);
            return foldingModelPromise.then(foldingModel => {
                if (foldingModel) {
                    this.invoke(foldingController, foldingModel, editor, args, languageConfigurationService);
                    const selection = editor.getSelection();
                    if (selection) {
                        foldingController.reveal(selection.getStartPosition());
                    }
                }
            });
        }
    }
    getSelectedLines(editor) {
        const selections = editor.getSelections();
        return selections ? selections.map(s => s.startLineNumber) : [];
    }
    getLineNumbers(args, editor) {
        if (args && args.selectionLines) {
            return args.selectionLines.map(l => l + 1); // to 0-bases line numbers
        }
        return this.getSelectedLines(editor);
    }
    run(_accessor, _editor) {
    }
}
function foldingArgumentsConstraint(args) {
    if (!types.isUndefined(args)) {
        if (!types.isObject(args)) {
            return false;
        }
        const foldingArgs = args;
        if (!types.isUndefined(foldingArgs.levels) && !types.isNumber(foldingArgs.levels)) {
            return false;
        }
        if (!types.isUndefined(foldingArgs.direction) && !types.isString(foldingArgs.direction)) {
            return false;
        }
        if (!types.isUndefined(foldingArgs.selectionLines) && (!Array.isArray(foldingArgs.selectionLines) || !foldingArgs.selectionLines.every(types.isNumber))) {
            return false;
        }
    }
    return true;
}
class UnfoldAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.unfold',
            label: nls.localize('unfoldAction.label', "Unfold"),
            alias: 'Unfold',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* KeyMod.CtrlCmd */ | 1024 /* KeyMod.Shift */ | 89 /* KeyCode.BracketRight */,
                mac: {
                    primary: 2048 /* KeyMod.CtrlCmd */ | 512 /* KeyMod.Alt */ | 89 /* KeyCode.BracketRight */
                },
                weight: 100 /* KeybindingWeight.EditorContrib */
            },
            description: {
                description: 'Unfold the content in the editor',
                args: [
                    {
                        name: 'Unfold editor argument',
                        description: `Property-value pairs that can be passed through this argument:
						* 'levels': Number of levels to unfold. If not set, defaults to 1.
						* 'direction': If 'up', unfold given number of levels up otherwise unfolds down.
						* 'selectionLines': Array of the start lines (0-based) of the editor selections to apply the unfold action to. If not set, the active selection(s) will be used.
						`,
                        constraint: foldingArgumentsConstraint,
                        schema: {
                            'type': 'object',
                            'properties': {
                                'levels': {
                                    'type': 'number',
                                    'default': 1
                                },
                                'direction': {
                                    'type': 'string',
                                    'enum': ['up', 'down'],
                                    'default': 'down'
                                },
                                'selectionLines': {
                                    'type': 'array',
                                    'items': {
                                        'type': 'number'
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        });
    }
    invoke(_foldingController, foldingModel, editor, args) {
        const levels = args && args.levels || 1;
        const lineNumbers = this.getLineNumbers(args, editor);
        if (args && args.direction === 'up') {
            setCollapseStateLevelsUp(foldingModel, false, levels, lineNumbers);
        }
        else {
            setCollapseStateLevelsDown(foldingModel, false, levels, lineNumbers);
        }
    }
}
class UnFoldRecursivelyAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.unfoldRecursively',
            label: nls.localize('unFoldRecursivelyAction.label', "Unfold Recursively"),
            alias: 'Unfold Recursively',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 89 /* KeyCode.BracketRight */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, editor, _args) {
        setCollapseStateLevelsDown(foldingModel, false, Number.MAX_VALUE, this.getSelectedLines(editor));
    }
}
class FoldAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.fold',
            label: nls.localize('foldAction.label', "Fold"),
            alias: 'Fold',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* KeyMod.CtrlCmd */ | 1024 /* KeyMod.Shift */ | 87 /* KeyCode.BracketLeft */,
                mac: {
                    primary: 2048 /* KeyMod.CtrlCmd */ | 512 /* KeyMod.Alt */ | 87 /* KeyCode.BracketLeft */
                },
                weight: 100 /* KeybindingWeight.EditorContrib */
            },
            description: {
                description: 'Fold the content in the editor',
                args: [
                    {
                        name: 'Fold editor argument',
                        description: `Property-value pairs that can be passed through this argument:
							* 'levels': Number of levels to fold.
							* 'direction': If 'up', folds given number of levels up otherwise folds down.
							* 'selectionLines': Array of the start lines (0-based) of the editor selections to apply the fold action to. If not set, the active selection(s) will be used.
							If no levels or direction is set, folds the region at the locations or if already collapsed, the first uncollapsed parent instead.
						`,
                        constraint: foldingArgumentsConstraint,
                        schema: {
                            'type': 'object',
                            'properties': {
                                'levels': {
                                    'type': 'number',
                                },
                                'direction': {
                                    'type': 'string',
                                    'enum': ['up', 'down'],
                                },
                                'selectionLines': {
                                    'type': 'array',
                                    'items': {
                                        'type': 'number'
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        });
    }
    invoke(_foldingController, foldingModel, editor, args) {
        const lineNumbers = this.getLineNumbers(args, editor);
        const levels = args && args.levels;
        const direction = args && args.direction;
        if (typeof levels !== 'number' && typeof direction !== 'string') {
            // fold the region at the location or if already collapsed, the first uncollapsed parent instead.
            setCollapseStateUp(foldingModel, true, lineNumbers);
        }
        else {
            if (direction === 'up') {
                setCollapseStateLevelsUp(foldingModel, true, levels || 1, lineNumbers);
            }
            else {
                setCollapseStateLevelsDown(foldingModel, true, levels || 1, lineNumbers);
            }
        }
    }
}
class ToggleFoldAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.toggleFold',
            label: nls.localize('toggleFoldAction.label', "Toggle Fold"),
            alias: 'Toggle Fold',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 42 /* KeyCode.KeyL */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, editor) {
        const selectedLines = this.getSelectedLines(editor);
        toggleCollapseState(foldingModel, 1, selectedLines);
    }
}
class FoldRecursivelyAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.foldRecursively',
            label: nls.localize('foldRecursivelyAction.label', "Fold Recursively"),
            alias: 'Fold Recursively',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 87 /* KeyCode.BracketLeft */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, editor) {
        const selectedLines = this.getSelectedLines(editor);
        setCollapseStateLevelsDown(foldingModel, true, Number.MAX_VALUE, selectedLines);
    }
}
class FoldAllBlockCommentsAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.foldAllBlockComments',
            label: nls.localize('foldAllBlockComments.label', "Fold All Block Comments"),
            alias: 'Fold All Block Comments',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 85 /* KeyCode.Slash */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, editor, args, languageConfigurationService) {
        if (foldingModel.regions.hasTypes()) {
            setCollapseStateForType(foldingModel, FoldingRangeKind.Comment.value, true);
        }
        else {
            const editorModel = editor.getModel();
            if (!editorModel) {
                return;
            }
            const comments = languageConfigurationService.getLanguageConfiguration(editorModel.getLanguageId()).comments;
            if (comments && comments.blockCommentStartToken) {
                const regExp = new RegExp('^\\s*' + escapeRegExpCharacters(comments.blockCommentStartToken));
                setCollapseStateForMatchingLines(foldingModel, regExp, true);
            }
        }
    }
}
class FoldAllRegionsAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.foldAllMarkerRegions',
            label: nls.localize('foldAllMarkerRegions.label', "Fold All Regions"),
            alias: 'Fold All Regions',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 29 /* KeyCode.Digit8 */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, editor, args, languageConfigurationService) {
        if (foldingModel.regions.hasTypes()) {
            setCollapseStateForType(foldingModel, FoldingRangeKind.Region.value, true);
        }
        else {
            const editorModel = editor.getModel();
            if (!editorModel) {
                return;
            }
            const foldingRules = languageConfigurationService.getLanguageConfiguration(editorModel.getLanguageId()).foldingRules;
            if (foldingRules && foldingRules.markers && foldingRules.markers.start) {
                const regExp = new RegExp(foldingRules.markers.start);
                setCollapseStateForMatchingLines(foldingModel, regExp, true);
            }
        }
    }
}
class UnfoldAllRegionsAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.unfoldAllMarkerRegions',
            label: nls.localize('unfoldAllMarkerRegions.label', "Unfold All Regions"),
            alias: 'Unfold All Regions',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 30 /* KeyCode.Digit9 */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, editor, args, languageConfigurationService) {
        if (foldingModel.regions.hasTypes()) {
            setCollapseStateForType(foldingModel, FoldingRangeKind.Region.value, false);
        }
        else {
            const editorModel = editor.getModel();
            if (!editorModel) {
                return;
            }
            const foldingRules = languageConfigurationService.getLanguageConfiguration(editorModel.getLanguageId()).foldingRules;
            if (foldingRules && foldingRules.markers && foldingRules.markers.start) {
                const regExp = new RegExp(foldingRules.markers.start);
                setCollapseStateForMatchingLines(foldingModel, regExp, false);
            }
        }
    }
}
class FoldAllRegionsExceptAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.foldAllExcept',
            label: nls.localize('foldAllExcept.label', "Fold All Regions Except Selected"),
            alias: 'Fold All Regions Except Selected',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 83 /* KeyCode.Minus */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, editor) {
        const selectedLines = this.getSelectedLines(editor);
        setCollapseStateForRest(foldingModel, true, selectedLines);
    }
}
class UnfoldAllRegionsExceptAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.unfoldAllExcept',
            label: nls.localize('unfoldAllExcept.label', "Unfold All Regions Except Selected"),
            alias: 'Unfold All Regions Except Selected',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 81 /* KeyCode.Equal */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, editor) {
        const selectedLines = this.getSelectedLines(editor);
        setCollapseStateForRest(foldingModel, false, selectedLines);
    }
}
class FoldAllAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.foldAll',
            label: nls.localize('foldAllAction.label', "Fold All"),
            alias: 'Fold All',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 21 /* KeyCode.Digit0 */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, _editor) {
        setCollapseStateLevelsDown(foldingModel, true);
    }
}
class UnfoldAllAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.unfoldAll',
            label: nls.localize('unfoldAllAction.label', "Unfold All"),
            alias: 'Unfold All',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 40 /* KeyCode.KeyJ */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, _editor) {
        setCollapseStateLevelsDown(foldingModel, false);
    }
}
class FoldLevelAction extends FoldingAction {
    getFoldingLevel() {
        return parseInt(this.id.substr(FoldLevelAction.ID_PREFIX.length));
    }
    invoke(_foldingController, foldingModel, editor) {
        setCollapseStateAtLevel(foldingModel, this.getFoldingLevel(), true, this.getSelectedLines(editor));
    }
}
FoldLevelAction.ID_PREFIX = 'editor.foldLevel';
FoldLevelAction.ID = (level) => FoldLevelAction.ID_PREFIX + level;
/** Action to go to the parent fold of current line */
class GotoParentFoldAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.gotoParentFold',
            label: nls.localize('gotoParentFold.label', "Go to Parent Fold"),
            alias: 'Go to Parent Fold',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, editor) {
        const selectedLines = this.getSelectedLines(editor);
        if (selectedLines.length > 0) {
            const startLineNumber = getParentFoldLine(selectedLines[0], foldingModel);
            if (startLineNumber !== null) {
                editor.setSelection({
                    startLineNumber: startLineNumber,
                    startColumn: 1,
                    endLineNumber: startLineNumber,
                    endColumn: 1
                });
            }
        }
    }
}
/** Action to go to the previous fold of current line */
class GotoPreviousFoldAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.gotoPreviousFold',
            label: nls.localize('gotoPreviousFold.label', "Go to Previous Folding Range"),
            alias: 'Go to Previous Folding Range',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, editor) {
        const selectedLines = this.getSelectedLines(editor);
        if (selectedLines.length > 0) {
            const startLineNumber = getPreviousFoldLine(selectedLines[0], foldingModel);
            if (startLineNumber !== null) {
                editor.setSelection({
                    startLineNumber: startLineNumber,
                    startColumn: 1,
                    endLineNumber: startLineNumber,
                    endColumn: 1
                });
            }
        }
    }
}
/** Action to go to the next fold of current line */
class GotoNextFoldAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.gotoNextFold',
            label: nls.localize('gotoNextFold.label', "Go to Next Folding Range"),
            alias: 'Go to Next Folding Range',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, editor) {
        const selectedLines = this.getSelectedLines(editor);
        if (selectedLines.length > 0) {
            const startLineNumber = getNextFoldLine(selectedLines[0], foldingModel);
            if (startLineNumber !== null) {
                editor.setSelection({
                    startLineNumber: startLineNumber,
                    startColumn: 1,
                    endLineNumber: startLineNumber,
                    endColumn: 1
                });
            }
        }
    }
}
class FoldRangeFromSelectionAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.createFoldingRangeFromSelection',
            label: nls.localize('createManualFoldRange.label', "Create Folding Range from Selection"),
            alias: 'Create Folding Range from Selection',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 82 /* KeyCode.Comma */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(_foldingController, foldingModel, editor) {
        var _a;
        const collapseRanges = [];
        const selections = editor.getSelections();
        if (selections) {
            for (const selection of selections) {
                let endLineNumber = selection.endLineNumber;
                if (selection.endColumn === 1) {
                    --endLineNumber;
                }
                if (endLineNumber > selection.startLineNumber) {
                    collapseRanges.push({
                        startLineNumber: selection.startLineNumber,
                        endLineNumber: endLineNumber,
                        type: undefined,
                        isCollapsed: true,
                        source: 1 /* FoldSource.userDefined */
                    });
                    editor.setSelection({
                        startLineNumber: selection.startLineNumber,
                        startColumn: 1,
                        endLineNumber: selection.startLineNumber,
                        endColumn: 1
                    });
                }
            }
            if (collapseRanges.length > 0) {
                collapseRanges.sort((a, b) => {
                    return a.startLineNumber - b.startLineNumber;
                });
                const newRanges = FoldingRegions.sanitizeAndMerge(foldingModel.regions, collapseRanges, (_a = editor.getModel()) === null || _a === void 0 ? void 0 : _a.getLineCount());
                foldingModel.updatePost(FoldingRegions.fromFoldRanges(newRanges));
            }
        }
    }
}
class RemoveFoldRangeFromSelectionAction extends FoldingAction {
    constructor() {
        super({
            id: 'editor.removeManualFoldingRanges',
            label: nls.localize('removeManualFoldingRanges.label', "Remove Manual Folding Ranges"),
            alias: 'Remove Manual Folding Ranges',
            precondition: CONTEXT_FOLDING_ENABLED,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | 84 /* KeyCode.Period */),
                weight: 100 /* KeybindingWeight.EditorContrib */
            }
        });
    }
    invoke(foldingController, foldingModel, editor) {
        const selections = editor.getSelections();
        if (selections) {
            const ranges = [];
            for (const selection of selections) {
                const { startLineNumber, endLineNumber } = selection;
                ranges.push(endLineNumber >= startLineNumber ? { startLineNumber, endLineNumber } : { endLineNumber, startLineNumber });
            }
            foldingModel.removeManualRanges(ranges);
            foldingController.triggerFoldingModelChanged();
        }
    }
}
registerEditorContribution(FoldingController.ID, FoldingController, 0 /* EditorContributionInstantiation.Eager */); // eager because it uses `saveViewState`/`restoreViewState`
registerEditorAction(UnfoldAction);
registerEditorAction(UnFoldRecursivelyAction);
registerEditorAction(FoldAction);
registerEditorAction(FoldRecursivelyAction);
registerEditorAction(FoldAllAction);
registerEditorAction(UnfoldAllAction);
registerEditorAction(FoldAllBlockCommentsAction);
registerEditorAction(FoldAllRegionsAction);
registerEditorAction(UnfoldAllRegionsAction);
registerEditorAction(FoldAllRegionsExceptAction);
registerEditorAction(UnfoldAllRegionsExceptAction);
registerEditorAction(ToggleFoldAction);
registerEditorAction(GotoParentFoldAction);
registerEditorAction(GotoPreviousFoldAction);
registerEditorAction(GotoNextFoldAction);
registerEditorAction(FoldRangeFromSelectionAction);
registerEditorAction(RemoveFoldRangeFromSelectionAction);
for (let i = 1; i <= 7; i++) {
    registerInstantiatedEditorAction(new FoldLevelAction({
        id: FoldLevelAction.ID(i),
        label: nls.localize('foldLevelAction.label', "Fold Level {0}", i),
        alias: `Fold Level ${i}`,
        precondition: CONTEXT_FOLDING_ENABLED,
        kbOpts: {
            kbExpr: EditorContextKeys.editorTextFocus,
            primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, 2048 /* KeyMod.CtrlCmd */ | (21 /* KeyCode.Digit0 */ + i)),
            weight: 100 /* KeybindingWeight.EditorContrib */
        }
    }));
}
CommandsRegistry.registerCommand('_executeFoldingRangeProvider', function (accessor, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [resource] = args;
        if (!(resource instanceof URI)) {
            throw illegalArgument();
        }
        const languageFeaturesService = accessor.get(ILanguageFeaturesService);
        const model = accessor.get(IModelService).getModel(resource);
        if (!model) {
            throw illegalArgument();
        }
        const configurationService = accessor.get(IConfigurationService);
        if (!configurationService.getValue('editor.folding', { resource })) {
            return [];
        }
        const languageConfigurationService = accessor.get(ILanguageConfigurationService);
        const strategy = configurationService.getValue('editor.foldingStrategy', { resource });
        const foldingLimitReporter = {
            get limit() {
                return configurationService.getValue('editor.foldingMaximumRegions', { resource });
            },
            update: (computed, limited) => { }
        };
        const indentRangeProvider = new IndentRangeProvider(model, languageConfigurationService, foldingLimitReporter);
        let rangeProvider = indentRangeProvider;
        if (strategy !== 'indentation') {
            const providers = FoldingController.getFoldingRangeProviders(languageFeaturesService, model);
            if (providers.length) {
                rangeProvider = new SyntaxRangeProvider(model, providers, () => { }, foldingLimitReporter, indentRangeProvider);
            }
        }
        const ranges = yield rangeProvider.compute(CancellationToken.None);
        const result = [];
        try {
            if (ranges) {
                for (let i = 0; i < ranges.length; i++) {
                    const type = ranges.getType(i);
                    result.push({ start: ranges.getStartLineNumber(i), end: ranges.getEndLineNumber(i), kind: type ? FoldingRangeKind.fromValue(type) : undefined });
                }
            }
            return result;
        }
        finally {
            rangeProvider.dispose();
        }
    });
});
