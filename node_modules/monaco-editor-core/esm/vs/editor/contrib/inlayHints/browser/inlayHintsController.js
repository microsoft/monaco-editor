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
import { ModifierKeyEmitter } from '../../../../base/browser/dom.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { LRUCache } from '../../../../base/common/map.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { DynamicCssRules } from '../../../browser/editorDom.js';
import { StableEditorScrollState } from '../../../browser/stableEditorScroll.js';
import { EDITOR_FONT_DEFAULTS } from '../../../common/config/editorOptions.js';
import { EditOperation } from '../../../common/core/editOperation.js';
import { Range } from '../../../common/core/range.js';
import * as languages from '../../../common/languages.js';
import { InjectedTextCursorStops } from '../../../common/model.js';
import { ModelDecorationInjectedTextOptions } from '../../../common/model/textModel.js';
import { ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ITextModelService } from '../../../common/services/resolverService.js';
import { ClickLinkGesture } from '../../gotoSymbol/browser/link/clickLinkGesture.js';
import { InlayHintAnchor, InlayHintsFragments } from './inlayHints.js';
import { goToDefinitionWithLocation, showGoToContextMenu } from './inlayHintsLocations.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import * as colors from '../../../../platform/theme/common/colorRegistry.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
// --- hint caching service (per session)
class InlayHintsCache {
    constructor() {
        this._entries = new LRUCache(50);
    }
    get(model) {
        const key = InlayHintsCache._key(model);
        return this._entries.get(key);
    }
    set(model, value) {
        const key = InlayHintsCache._key(model);
        this._entries.set(key, value);
    }
    static _key(model) {
        return `${model.uri.toString()}/${model.getVersionId()}`;
    }
}
const IInlayHintsCache = createDecorator('IInlayHintsCache');
registerSingleton(IInlayHintsCache, InlayHintsCache, 1 /* InstantiationType.Delayed */);
// --- rendered label
export class RenderedInlayHintLabelPart {
    constructor(item, index) {
        this.item = item;
        this.index = index;
    }
    get part() {
        const label = this.item.hint.label;
        if (typeof label === 'string') {
            return { label };
        }
        else {
            return label[this.index];
        }
    }
}
class ActiveInlayHintInfo {
    constructor(part, hasTriggerModifier) {
        this.part = part;
        this.hasTriggerModifier = hasTriggerModifier;
    }
}
// --- controller
let InlayHintsController = class InlayHintsController {
    static get(editor) {
        var _a;
        return (_a = editor.getContribution(InlayHintsController.ID)) !== null && _a !== void 0 ? _a : undefined;
    }
    constructor(_editor, _languageFeaturesService, _featureDebounce, _inlayHintsCache, _commandService, _notificationService, _instaService) {
        this._editor = _editor;
        this._languageFeaturesService = _languageFeaturesService;
        this._inlayHintsCache = _inlayHintsCache;
        this._commandService = _commandService;
        this._notificationService = _notificationService;
        this._instaService = _instaService;
        this._disposables = new DisposableStore();
        this._sessionDisposables = new DisposableStore();
        this._decorationsMetadata = new Map();
        this._ruleFactory = new DynamicCssRules(this._editor);
        this._activeRenderMode = 0 /* RenderMode.Normal */;
        this._debounceInfo = _featureDebounce.for(_languageFeaturesService.inlayHintsProvider, 'InlayHint', { min: 25 });
        this._disposables.add(_languageFeaturesService.inlayHintsProvider.onDidChange(() => this._update()));
        this._disposables.add(_editor.onDidChangeModel(() => this._update()));
        this._disposables.add(_editor.onDidChangeModelLanguage(() => this._update()));
        this._disposables.add(_editor.onDidChangeConfiguration(e => {
            if (e.hasChanged(135 /* EditorOption.inlayHints */)) {
                this._update();
            }
        }));
        this._update();
    }
    dispose() {
        this._sessionDisposables.dispose();
        this._removeAllDecorations();
        this._disposables.dispose();
    }
    _update() {
        this._sessionDisposables.clear();
        this._removeAllDecorations();
        const options = this._editor.getOption(135 /* EditorOption.inlayHints */);
        if (options.enabled === 'off') {
            return;
        }
        const model = this._editor.getModel();
        if (!model || !this._languageFeaturesService.inlayHintsProvider.has(model)) {
            return;
        }
        // iff possible, quickly update from cache
        const cached = this._inlayHintsCache.get(model);
        if (cached) {
            this._updateHintsDecorators([model.getFullModelRange()], cached);
        }
        this._sessionDisposables.add(toDisposable(() => {
            // cache items when switching files etc
            if (!model.isDisposed()) {
                this._cacheHintsForFastRestore(model);
            }
        }));
        let cts;
        const watchedProviders = new Set();
        const scheduler = new RunOnceScheduler(() => __awaiter(this, void 0, void 0, function* () {
            const t1 = Date.now();
            cts === null || cts === void 0 ? void 0 : cts.dispose(true);
            cts = new CancellationTokenSource();
            const listener = model.onWillDispose(() => cts === null || cts === void 0 ? void 0 : cts.cancel());
            try {
                const myToken = cts.token;
                const inlayHints = yield InlayHintsFragments.create(this._languageFeaturesService.inlayHintsProvider, model, this._getHintsRanges(), myToken);
                scheduler.delay = this._debounceInfo.update(model, Date.now() - t1);
                if (myToken.isCancellationRequested) {
                    inlayHints.dispose();
                    return;
                }
                // listen to provider changes
                for (const provider of inlayHints.provider) {
                    if (typeof provider.onDidChangeInlayHints === 'function' && !watchedProviders.has(provider)) {
                        watchedProviders.add(provider);
                        this._sessionDisposables.add(provider.onDidChangeInlayHints(() => {
                            if (!scheduler.isScheduled()) { // ignore event when request is already scheduled
                                scheduler.schedule();
                            }
                        }));
                    }
                }
                this._sessionDisposables.add(inlayHints);
                this._updateHintsDecorators(inlayHints.ranges, inlayHints.items);
                this._cacheHintsForFastRestore(model);
            }
            catch (err) {
                onUnexpectedError(err);
            }
            finally {
                cts.dispose();
                listener.dispose();
            }
        }), this._debounceInfo.get(model));
        this._sessionDisposables.add(scheduler);
        this._sessionDisposables.add(toDisposable(() => cts === null || cts === void 0 ? void 0 : cts.dispose(true)));
        scheduler.schedule(0);
        this._sessionDisposables.add(this._editor.onDidScrollChange((e) => {
            // update when scroll position changes
            // uses scrollTopChanged has weak heuristic to differenatiate between scrolling due to
            // typing or due to "actual" scrolling
            if (e.scrollTopChanged || !scheduler.isScheduled()) {
                scheduler.schedule();
            }
        }));
        this._sessionDisposables.add(this._editor.onDidChangeModelContent((e) => {
            // update less aggressive when typing
            const delay = Math.max(scheduler.delay, 1250);
            scheduler.schedule(delay);
        }));
        if (options.enabled === 'on') {
            // different "on" modes: always
            this._activeRenderMode = 0 /* RenderMode.Normal */;
        }
        else {
            // different "on" modes: offUnlessPressed, or onUnlessPressed
            let defaultMode;
            let altMode;
            if (options.enabled === 'onUnlessPressed') {
                defaultMode = 0 /* RenderMode.Normal */;
                altMode = 1 /* RenderMode.Invisible */;
            }
            else {
                defaultMode = 1 /* RenderMode.Invisible */;
                altMode = 0 /* RenderMode.Normal */;
            }
            this._activeRenderMode = defaultMode;
            this._sessionDisposables.add(ModifierKeyEmitter.getInstance().event(e => {
                if (!this._editor.hasModel()) {
                    return;
                }
                const newRenderMode = e.altKey && e.ctrlKey && !(e.shiftKey || e.metaKey) ? altMode : defaultMode;
                if (newRenderMode !== this._activeRenderMode) {
                    this._activeRenderMode = newRenderMode;
                    const model = this._editor.getModel();
                    const copies = this._copyInlayHintsWithCurrentAnchor(model);
                    this._updateHintsDecorators([model.getFullModelRange()], copies);
                    scheduler.schedule(0);
                }
            }));
        }
        // mouse gestures
        this._sessionDisposables.add(this._installDblClickGesture(() => scheduler.schedule(0)));
        this._sessionDisposables.add(this._installLinkGesture());
        this._sessionDisposables.add(this._installContextMenu());
    }
    _installLinkGesture() {
        const store = new DisposableStore();
        const gesture = store.add(new ClickLinkGesture(this._editor));
        // let removeHighlight = () => { };
        const sessionStore = new DisposableStore();
        store.add(sessionStore);
        store.add(gesture.onMouseMoveOrRelevantKeyDown(e => {
            const [mouseEvent] = e;
            const labelPart = this._getInlayHintLabelPart(mouseEvent);
            const model = this._editor.getModel();
            if (!labelPart || !model) {
                sessionStore.clear();
                return;
            }
            // resolve the item
            const cts = new CancellationTokenSource();
            sessionStore.add(toDisposable(() => cts.dispose(true)));
            labelPart.item.resolve(cts.token);
            // render link => when the modifier is pressed and when there is a command or location
            this._activeInlayHintPart = labelPart.part.command || labelPart.part.location
                ? new ActiveInlayHintInfo(labelPart, mouseEvent.hasTriggerModifier)
                : undefined;
            const lineNumber = model.validatePosition(labelPart.item.hint.position).lineNumber;
            const range = new Range(lineNumber, 1, lineNumber, model.getLineMaxColumn(lineNumber));
            const lineHints = this._getInlineHintsForRange(range);
            this._updateHintsDecorators([range], lineHints);
            sessionStore.add(toDisposable(() => {
                this._activeInlayHintPart = undefined;
                this._updateHintsDecorators([range], lineHints);
            }));
        }));
        store.add(gesture.onCancel(() => sessionStore.clear()));
        store.add(gesture.onExecute((e) => __awaiter(this, void 0, void 0, function* () {
            const label = this._getInlayHintLabelPart(e);
            if (label) {
                const part = label.part;
                if (part.location) {
                    // location -> execute go to def
                    this._instaService.invokeFunction(goToDefinitionWithLocation, e, this._editor, part.location);
                }
                else if (languages.Command.is(part.command)) {
                    // command -> execute it
                    yield this._invokeCommand(part.command, label.item);
                }
            }
        })));
        return store;
    }
    _getInlineHintsForRange(range) {
        const lineHints = new Set();
        for (const data of this._decorationsMetadata.values()) {
            if (range.containsRange(data.item.anchor.range)) {
                lineHints.add(data.item);
            }
        }
        return Array.from(lineHints);
    }
    _installDblClickGesture(updateInlayHints) {
        return this._editor.onMouseUp((e) => __awaiter(this, void 0, void 0, function* () {
            if (e.event.detail !== 2) {
                return;
            }
            const part = this._getInlayHintLabelPart(e);
            if (!part) {
                return;
            }
            e.event.preventDefault();
            yield part.item.resolve(CancellationToken.None);
            if (isNonEmptyArray(part.item.hint.textEdits)) {
                const edits = part.item.hint.textEdits.map(edit => EditOperation.replace(Range.lift(edit.range), edit.text));
                this._editor.executeEdits('inlayHint.default', edits);
                updateInlayHints();
            }
        }));
    }
    _installContextMenu() {
        return this._editor.onContextMenu((e) => __awaiter(this, void 0, void 0, function* () {
            if (!(e.event.target instanceof HTMLElement)) {
                return;
            }
            const part = this._getInlayHintLabelPart(e);
            if (part) {
                yield this._instaService.invokeFunction(showGoToContextMenu, this._editor, e.event.target, part);
            }
        }));
    }
    _getInlayHintLabelPart(e) {
        var _a;
        if (e.target.type !== 6 /* MouseTargetType.CONTENT_TEXT */) {
            return undefined;
        }
        const options = (_a = e.target.detail.injectedText) === null || _a === void 0 ? void 0 : _a.options;
        if (options instanceof ModelDecorationInjectedTextOptions && (options === null || options === void 0 ? void 0 : options.attachedData) instanceof RenderedInlayHintLabelPart) {
            return options.attachedData;
        }
        return undefined;
    }
    _invokeCommand(command, item) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._commandService.executeCommand(command.id, ...((_a = command.arguments) !== null && _a !== void 0 ? _a : []));
            }
            catch (err) {
                this._notificationService.notify({
                    severity: Severity.Error,
                    source: item.provider.displayName,
                    message: err
                });
            }
        });
    }
    _cacheHintsForFastRestore(model) {
        const hints = this._copyInlayHintsWithCurrentAnchor(model);
        this._inlayHintsCache.set(model, hints);
    }
    // return inlay hints but with an anchor that reflects "updates"
    // that happened after receiving them, e.g adding new lines before a hint
    _copyInlayHintsWithCurrentAnchor(model) {
        const items = new Map();
        for (const [id, obj] of this._decorationsMetadata) {
            if (items.has(obj.item)) {
                // an inlay item can be rendered as multiple decorations
                // but they will all uses the same range
                continue;
            }
            const range = model.getDecorationRange(id);
            if (range) {
                // update range with whatever the editor has tweaked it to
                const anchor = new InlayHintAnchor(range, obj.item.anchor.direction);
                const copy = obj.item.with({ anchor });
                items.set(obj.item, copy);
            }
        }
        return Array.from(items.values());
    }
    _getHintsRanges() {
        const extra = 30;
        const model = this._editor.getModel();
        const visibleRanges = this._editor.getVisibleRangesPlusViewportAboveBelow();
        const result = [];
        for (const range of visibleRanges.sort(Range.compareRangesUsingStarts)) {
            const extendedRange = model.validateRange(new Range(range.startLineNumber - extra, range.startColumn, range.endLineNumber + extra, range.endColumn));
            if (result.length === 0 || !Range.areIntersectingOrTouching(result[result.length - 1], extendedRange)) {
                result.push(extendedRange);
            }
            else {
                result[result.length - 1] = Range.plusRange(result[result.length - 1], extendedRange);
            }
        }
        return result;
    }
    _updateHintsDecorators(ranges, items) {
        var _a, _b;
        // utils to collect/create injected text decorations
        const newDecorationsData = [];
        const addInjectedText = (item, ref, content, cursorStops, attachedData) => {
            const opts = {
                content,
                inlineClassNameAffectsLetterSpacing: true,
                inlineClassName: ref.className,
                cursorStops,
                attachedData
            };
            newDecorationsData.push({
                item,
                classNameRef: ref,
                decoration: {
                    range: item.anchor.range,
                    options: {
                        // className: "rangeHighlight", // DEBUG highlight to see to what range a hint is attached
                        description: 'InlayHint',
                        showIfCollapsed: item.anchor.range.isEmpty(),
                        collapseOnReplaceEdit: !item.anchor.range.isEmpty(),
                        stickiness: 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */,
                        [item.anchor.direction]: this._activeRenderMode === 0 /* RenderMode.Normal */ ? opts : undefined
                    }
                }
            });
        };
        const addInjectedWhitespace = (item, isLast) => {
            const marginRule = this._ruleFactory.createClassNameRef({
                width: `${(fontSize / 3) | 0}px`,
                display: 'inline-block'
            });
            addInjectedText(item, marginRule, '\u200a', isLast ? InjectedTextCursorStops.Right : InjectedTextCursorStops.None);
        };
        //
        const { fontSize, fontFamily, padding, isUniform } = this._getLayoutInfo();
        const fontFamilyVar = '--code-editorInlayHintsFontFamily';
        this._editor.getContainerDomNode().style.setProperty(fontFamilyVar, fontFamily);
        for (const item of items) {
            // whitespace leading the actual label
            if (item.hint.paddingLeft) {
                addInjectedWhitespace(item, false);
            }
            // the label with its parts
            const parts = typeof item.hint.label === 'string'
                ? [{ label: item.hint.label }]
                : item.hint.label;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const isFirst = i === 0;
                const isLast = i === parts.length - 1;
                const cssProperties = {
                    fontSize: `${fontSize}px`,
                    fontFamily: `var(${fontFamilyVar}), ${EDITOR_FONT_DEFAULTS.fontFamily}`,
                    verticalAlign: isUniform ? 'baseline' : 'middle',
                };
                if (isNonEmptyArray(item.hint.textEdits)) {
                    cssProperties.cursor = 'default';
                }
                this._fillInColors(cssProperties, item.hint);
                if ((part.command || part.location) && ((_a = this._activeInlayHintPart) === null || _a === void 0 ? void 0 : _a.part.item) === item && this._activeInlayHintPart.part.index === i) {
                    // active link!
                    cssProperties.textDecoration = 'underline';
                    if (this._activeInlayHintPart.hasTriggerModifier) {
                        cssProperties.color = themeColorFromId(colors.editorActiveLinkForeground);
                        cssProperties.cursor = 'pointer';
                    }
                }
                if (padding) {
                    if (isFirst && isLast) {
                        // only element
                        cssProperties.padding = `1px ${Math.max(1, fontSize / 4) | 0}px`;
                        cssProperties.borderRadius = `${(fontSize / 4) | 0}px`;
                    }
                    else if (isFirst) {
                        // first element
                        cssProperties.padding = `1px 0 1px ${Math.max(1, fontSize / 4) | 0}px`;
                        cssProperties.borderRadius = `${(fontSize / 4) | 0}px 0 0 ${(fontSize / 4) | 0}px`;
                    }
                    else if (isLast) {
                        // last element
                        cssProperties.padding = `1px ${Math.max(1, fontSize / 4) | 0}px 1px 0`;
                        cssProperties.borderRadius = `0 ${(fontSize / 4) | 0}px ${(fontSize / 4) | 0}px 0`;
                    }
                    else {
                        cssProperties.padding = `1px 0 1px 0`;
                    }
                }
                addInjectedText(item, this._ruleFactory.createClassNameRef(cssProperties), fixSpace(part.label), isLast && !item.hint.paddingRight ? InjectedTextCursorStops.Right : InjectedTextCursorStops.None, new RenderedInlayHintLabelPart(item, i));
            }
            // whitespace trailing the actual label
            if (item.hint.paddingRight) {
                addInjectedWhitespace(item, true);
            }
            if (newDecorationsData.length > InlayHintsController._MAX_DECORATORS) {
                break;
            }
        }
        // collect all decoration ids that are affected by the ranges
        // and only update those decorations
        const decorationIdsToReplace = [];
        for (const range of ranges) {
            for (const { id } of (_b = this._editor.getDecorationsInRange(range)) !== null && _b !== void 0 ? _b : []) {
                const metadata = this._decorationsMetadata.get(id);
                if (metadata) {
                    decorationIdsToReplace.push(id);
                    metadata.classNameRef.dispose();
                    this._decorationsMetadata.delete(id);
                }
            }
        }
        const scrollState = StableEditorScrollState.capture(this._editor);
        this._editor.changeDecorations(accessor => {
            const newDecorationIds = accessor.deltaDecorations(decorationIdsToReplace, newDecorationsData.map(d => d.decoration));
            for (let i = 0; i < newDecorationIds.length; i++) {
                const data = newDecorationsData[i];
                this._decorationsMetadata.set(newDecorationIds[i], data);
            }
        });
        scrollState.restore(this._editor);
    }
    _fillInColors(props, hint) {
        if (hint.kind === languages.InlayHintKind.Parameter) {
            props.backgroundColor = themeColorFromId(colors.editorInlayHintParameterBackground);
            props.color = themeColorFromId(colors.editorInlayHintParameterForeground);
        }
        else if (hint.kind === languages.InlayHintKind.Type) {
            props.backgroundColor = themeColorFromId(colors.editorInlayHintTypeBackground);
            props.color = themeColorFromId(colors.editorInlayHintTypeForeground);
        }
        else {
            props.backgroundColor = themeColorFromId(colors.editorInlayHintBackground);
            props.color = themeColorFromId(colors.editorInlayHintForeground);
        }
    }
    _getLayoutInfo() {
        const options = this._editor.getOption(135 /* EditorOption.inlayHints */);
        const padding = options.padding;
        const editorFontSize = this._editor.getOption(50 /* EditorOption.fontSize */);
        const editorFontFamily = this._editor.getOption(47 /* EditorOption.fontFamily */);
        let fontSize = options.fontSize;
        if (!fontSize || fontSize < 5 || fontSize > editorFontSize) {
            fontSize = editorFontSize;
        }
        const fontFamily = options.fontFamily || editorFontFamily;
        const isUniform = !padding
            && fontFamily === editorFontFamily
            && fontSize === editorFontSize;
        return { fontSize, fontFamily, padding, isUniform };
    }
    _removeAllDecorations() {
        this._editor.removeDecorations(Array.from(this._decorationsMetadata.keys()));
        for (const obj of this._decorationsMetadata.values()) {
            obj.classNameRef.dispose();
        }
        this._decorationsMetadata.clear();
    }
};
InlayHintsController.ID = 'editor.contrib.InlayHints';
InlayHintsController._MAX_DECORATORS = 1500;
InlayHintsController = __decorate([
    __param(1, ILanguageFeaturesService),
    __param(2, ILanguageFeatureDebounceService),
    __param(3, IInlayHintsCache),
    __param(4, ICommandService),
    __param(5, INotificationService),
    __param(6, IInstantiationService)
], InlayHintsController);
export { InlayHintsController };
// Prevents the view from potentially visible whitespace
function fixSpace(str) {
    const noBreakWhitespace = '\xa0';
    return str.replace(/[ \t]/g, noBreakWhitespace);
}
CommandsRegistry.registerCommand('_executeInlayHintProvider', (accessor, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    const [uri, range] = args;
    assertType(URI.isUri(uri));
    assertType(Range.isIRange(range));
    const { inlayHintsProvider } = accessor.get(ILanguageFeaturesService);
    const ref = yield accessor.get(ITextModelService).createModelReference(uri);
    try {
        const model = yield InlayHintsFragments.create(inlayHintsProvider, ref.object.textEditorModel, [Range.lift(range)], CancellationToken.None);
        const result = model.items.map(i => i.hint);
        setTimeout(() => model.dispose(), 0); // dispose after sending to ext host
        return result;
    }
    finally {
        ref.dispose();
    }
}));
