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
import './standalone-tokens.css';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { splitLines } from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { FontMeasurements } from '../../browser/config/fontMeasurements.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { DiffNavigator } from '../../browser/widget/diffNavigator.js';
import { ApplyUpdateResult, ConfigurationChangedEvent, EditorOptions } from '../../common/config/editorOptions.js';
import { BareFontInfo, FontInfo } from '../../common/config/fontInfo.js';
import { EditorType } from '../../common/editorCommon.js';
import { FindMatch, TextModelResolvedOptions } from '../../common/model.js';
import * as languages from '../../common/languages.js';
import { ILanguageConfigurationService } from '../../common/languages/languageConfigurationRegistry.js';
import { NullState, nullTokenize } from '../../common/languages/nullTokenize.js';
import { ILanguageService } from '../../common/languages/language.js';
import { IModelService } from '../../common/services/model.js';
import { createWebWorker as actualCreateWebWorker } from '../../browser/services/webWorker.js';
import * as standaloneEnums from '../../common/standalone/standaloneEnums.js';
import { Colorizer } from './colorizer.js';
import { createTextModel, StandaloneDiffEditor, StandaloneEditor } from './standaloneCodeEditor.js';
import { StandaloneKeybindingService, StandaloneServices } from './standaloneServices.js';
import { IStandaloneThemeService } from '../common/standaloneTheme.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { IMarkerService } from '../../../platform/markers/common/markers.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { EditorCommand } from '../../browser/editorExtensions.js';
import { MenuRegistry, MenuId } from '../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../common/languages/modesRegistry.js';
import { LineRangeMapping, RangeMapping } from '../../common/diff/linesDiffComputer.js';
import { LineRange } from '../../common/core/lineRange.js';
import { EditorZoom } from '../../common/config/editorZoom.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
/**
 * Create a new editor under `domElement`.
 * `domElement` should be empty (not contain other dom nodes).
 * The editor will read the size of `domElement`.
 */
export function create(domElement, options, override) {
    const instantiationService = StandaloneServices.initialize(override || {});
    return instantiationService.createInstance(StandaloneEditor, domElement, options);
}
/**
 * Emitted when an editor is created.
 * Creating a diff editor might cause this listener to be invoked with the two editors.
 * @event
 */
export function onDidCreateEditor(listener) {
    const codeEditorService = StandaloneServices.get(ICodeEditorService);
    return codeEditorService.onCodeEditorAdd((editor) => {
        listener(editor);
    });
}
/**
 * Emitted when an diff editor is created.
 * @event
 */
export function onDidCreateDiffEditor(listener) {
    const codeEditorService = StandaloneServices.get(ICodeEditorService);
    return codeEditorService.onDiffEditorAdd((editor) => {
        listener(editor);
    });
}
/**
 * Get all the created editors.
 */
export function getEditors() {
    const codeEditorService = StandaloneServices.get(ICodeEditorService);
    return codeEditorService.listCodeEditors();
}
/**
 * Get all the created diff editors.
 */
export function getDiffEditors() {
    const codeEditorService = StandaloneServices.get(ICodeEditorService);
    return codeEditorService.listDiffEditors();
}
/**
 * Create a new diff editor under `domElement`.
 * `domElement` should be empty (not contain other dom nodes).
 * The editor will read the size of `domElement`.
 */
export function createDiffEditor(domElement, options, override) {
    const instantiationService = StandaloneServices.initialize(override || {});
    return instantiationService.createInstance(StandaloneDiffEditor, domElement, options);
}
export function createDiffNavigator(diffEditor, opts) {
    const instantiationService = StandaloneServices.initialize({});
    return instantiationService.createInstance(DiffNavigator, diffEditor, opts);
}
/**
 * Add a command.
 */
export function addCommand(descriptor) {
    if ((typeof descriptor.id !== 'string') || (typeof descriptor.run !== 'function')) {
        throw new Error('Invalid command descriptor, `id` and `run` are required properties!');
    }
    return CommandsRegistry.registerCommand(descriptor.id, descriptor.run);
}
/**
 * Add an action to all editors.
 */
export function addEditorAction(descriptor) {
    if ((typeof descriptor.id !== 'string') || (typeof descriptor.label !== 'string') || (typeof descriptor.run !== 'function')) {
        throw new Error('Invalid action descriptor, `id`, `label` and `run` are required properties!');
    }
    const precondition = ContextKeyExpr.deserialize(descriptor.precondition);
    const run = (accessor, ...args) => {
        return EditorCommand.runEditorCommand(accessor, args, precondition, (accessor, editor, args) => Promise.resolve(descriptor.run(editor, ...args)));
    };
    const toDispose = new DisposableStore();
    // Register the command
    toDispose.add(CommandsRegistry.registerCommand(descriptor.id, run));
    // Register the context menu item
    if (descriptor.contextMenuGroupId) {
        const menuItem = {
            command: {
                id: descriptor.id,
                title: descriptor.label
            },
            when: precondition,
            group: descriptor.contextMenuGroupId,
            order: descriptor.contextMenuOrder || 0
        };
        toDispose.add(MenuRegistry.appendMenuItem(MenuId.EditorContext, menuItem));
    }
    // Register the keybindings
    if (Array.isArray(descriptor.keybindings)) {
        const keybindingService = StandaloneServices.get(IKeybindingService);
        if (!(keybindingService instanceof StandaloneKeybindingService)) {
            console.warn('Cannot add keybinding because the editor is configured with an unrecognized KeybindingService');
        }
        else {
            const keybindingsWhen = ContextKeyExpr.and(precondition, ContextKeyExpr.deserialize(descriptor.keybindingContext));
            toDispose.add(keybindingService.addDynamicKeybindings(descriptor.keybindings.map((keybinding) => {
                return {
                    keybinding,
                    command: descriptor.id,
                    when: keybindingsWhen
                };
            })));
        }
    }
    return toDispose;
}
/**
 * Add a keybinding rule.
 */
export function addKeybindingRule(rule) {
    return addKeybindingRules([rule]);
}
/**
 * Add keybinding rules.
 */
export function addKeybindingRules(rules) {
    const keybindingService = StandaloneServices.get(IKeybindingService);
    if (!(keybindingService instanceof StandaloneKeybindingService)) {
        console.warn('Cannot add keybinding because the editor is configured with an unrecognized KeybindingService');
        return Disposable.None;
    }
    return keybindingService.addDynamicKeybindings(rules.map((rule) => {
        return {
            keybinding: rule.keybinding,
            command: rule.command,
            commandArgs: rule.commandArgs,
            when: ContextKeyExpr.deserialize(rule.when),
        };
    }));
}
/**
 * Create a new editor model.
 * You can specify the language that should be set for this model or let the language be inferred from the `uri`.
 */
export function createModel(value, language, uri) {
    const languageService = StandaloneServices.get(ILanguageService);
    const languageId = languageService.getLanguageIdByMimeType(language) || language;
    return createTextModel(StandaloneServices.get(IModelService), languageService, value, languageId, uri);
}
/**
 * Change the language for a model.
 */
export function setModelLanguage(model, mimeTypeOrLanguageId) {
    const languageService = StandaloneServices.get(ILanguageService);
    const languageId = languageService.getLanguageIdByMimeType(mimeTypeOrLanguageId) || mimeTypeOrLanguageId || PLAINTEXT_LANGUAGE_ID;
    model.setLanguage(languageService.createById(languageId));
}
/**
 * Set the markers for a model.
 */
export function setModelMarkers(model, owner, markers) {
    if (model) {
        const markerService = StandaloneServices.get(IMarkerService);
        markerService.changeOne(owner, model.uri, markers);
    }
}
/**
 * Remove all markers of an owner.
 */
export function removeAllMarkers(owner) {
    const markerService = StandaloneServices.get(IMarkerService);
    markerService.changeAll(owner, []);
}
/**
 * Get markers for owner and/or resource
 *
 * @returns list of markers
 */
export function getModelMarkers(filter) {
    const markerService = StandaloneServices.get(IMarkerService);
    return markerService.read(filter);
}
/**
 * Emitted when markers change for a model.
 * @event
 */
export function onDidChangeMarkers(listener) {
    const markerService = StandaloneServices.get(IMarkerService);
    return markerService.onMarkerChanged(listener);
}
/**
 * Get the model that has `uri` if it exists.
 */
export function getModel(uri) {
    const modelService = StandaloneServices.get(IModelService);
    return modelService.getModel(uri);
}
/**
 * Get all the created models.
 */
export function getModels() {
    const modelService = StandaloneServices.get(IModelService);
    return modelService.getModels();
}
/**
 * Emitted when a model is created.
 * @event
 */
export function onDidCreateModel(listener) {
    const modelService = StandaloneServices.get(IModelService);
    return modelService.onModelAdded(listener);
}
/**
 * Emitted right before a model is disposed.
 * @event
 */
export function onWillDisposeModel(listener) {
    const modelService = StandaloneServices.get(IModelService);
    return modelService.onModelRemoved(listener);
}
/**
 * Emitted when a different language is set to a model.
 * @event
 */
export function onDidChangeModelLanguage(listener) {
    const modelService = StandaloneServices.get(IModelService);
    return modelService.onModelLanguageChanged((e) => {
        listener({
            model: e.model,
            oldLanguage: e.oldLanguageId
        });
    });
}
/**
 * Create a new web worker that has model syncing capabilities built in.
 * Specify an AMD module to load that will `create` an object that will be proxied.
 */
export function createWebWorker(opts) {
    return actualCreateWebWorker(StandaloneServices.get(IModelService), StandaloneServices.get(ILanguageConfigurationService), opts);
}
/**
 * Colorize the contents of `domNode` using attribute `data-lang`.
 */
export function colorizeElement(domNode, options) {
    const languageService = StandaloneServices.get(ILanguageService);
    const themeService = StandaloneServices.get(IStandaloneThemeService);
    themeService.registerEditorContainer(domNode);
    return Colorizer.colorizeElement(themeService, languageService, domNode, options);
}
/**
 * Colorize `text` using language `languageId`.
 */
export function colorize(text, languageId, options) {
    const languageService = StandaloneServices.get(ILanguageService);
    const themeService = StandaloneServices.get(IStandaloneThemeService);
    themeService.registerEditorContainer(document.body);
    return Colorizer.colorize(languageService, text, languageId, options);
}
/**
 * Colorize a line in a model.
 */
export function colorizeModelLine(model, lineNumber, tabSize = 4) {
    const themeService = StandaloneServices.get(IStandaloneThemeService);
    themeService.registerEditorContainer(document.body);
    return Colorizer.colorizeModelLine(model, lineNumber, tabSize);
}
/**
 * @internal
 */
function getSafeTokenizationSupport(language) {
    const tokenizationSupport = languages.TokenizationRegistry.get(language);
    if (tokenizationSupport) {
        return tokenizationSupport;
    }
    return {
        getInitialState: () => NullState,
        tokenize: (line, hasEOL, state) => nullTokenize(language, state)
    };
}
/**
 * Tokenize `text` using language `languageId`
 */
export function tokenize(text, languageId) {
    // Needed in order to get the mode registered for subsequent look-ups
    languages.TokenizationRegistry.getOrCreate(languageId);
    const tokenizationSupport = getSafeTokenizationSupport(languageId);
    const lines = splitLines(text);
    const result = [];
    let state = tokenizationSupport.getInitialState();
    for (let i = 0, len = lines.length; i < len; i++) {
        const line = lines[i];
        const tokenizationResult = tokenizationSupport.tokenize(line, true, state);
        result[i] = tokenizationResult.tokens;
        state = tokenizationResult.endState;
    }
    return result;
}
/**
 * Define a new theme or update an existing theme.
 */
export function defineTheme(themeName, themeData) {
    const standaloneThemeService = StandaloneServices.get(IStandaloneThemeService);
    standaloneThemeService.defineTheme(themeName, themeData);
}
/**
 * Switches to a theme.
 */
export function setTheme(themeName) {
    const standaloneThemeService = StandaloneServices.get(IStandaloneThemeService);
    standaloneThemeService.setTheme(themeName);
}
/**
 * Clears all cached font measurements and triggers re-measurement.
 */
export function remeasureFonts() {
    FontMeasurements.clearAllFontInfos();
}
/**
 * Register a command.
 */
export function registerCommand(id, handler) {
    return CommandsRegistry.registerCommand({ id, handler });
}
/**
 * Registers a handler that is called when a link is opened in any editor. The handler callback should return `true` if the link was handled and `false` otherwise.
 * The handler that was registered last will be called first when a link is opened.
 *
 * Returns a disposable that can unregister the opener again.
 */
export function registerLinkOpener(opener) {
    const openerService = StandaloneServices.get(IOpenerService);
    return openerService.registerOpener({
        open(resource) {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof resource === 'string') {
                    resource = URI.parse(resource);
                }
                return opener.open(resource);
            });
        }
    });
}
/**
 * @internal
 */
export function createMonacoEditorAPI() {
    return {
        // methods
        create: create,
        getEditors: getEditors,
        getDiffEditors: getDiffEditors,
        onDidCreateEditor: onDidCreateEditor,
        onDidCreateDiffEditor: onDidCreateDiffEditor,
        createDiffEditor: createDiffEditor,
        createDiffNavigator: createDiffNavigator,
        addCommand: addCommand,
        addEditorAction: addEditorAction,
        addKeybindingRule: addKeybindingRule,
        addKeybindingRules: addKeybindingRules,
        createModel: createModel,
        setModelLanguage: setModelLanguage,
        setModelMarkers: setModelMarkers,
        getModelMarkers: getModelMarkers,
        removeAllMarkers: removeAllMarkers,
        onDidChangeMarkers: onDidChangeMarkers,
        getModels: getModels,
        getModel: getModel,
        onDidCreateModel: onDidCreateModel,
        onWillDisposeModel: onWillDisposeModel,
        onDidChangeModelLanguage: onDidChangeModelLanguage,
        createWebWorker: createWebWorker,
        colorizeElement: colorizeElement,
        colorize: colorize,
        colorizeModelLine: colorizeModelLine,
        tokenize: tokenize,
        defineTheme: defineTheme,
        setTheme: setTheme,
        remeasureFonts: remeasureFonts,
        registerCommand: registerCommand,
        registerLinkOpener: registerLinkOpener,
        // enums
        AccessibilitySupport: standaloneEnums.AccessibilitySupport,
        ContentWidgetPositionPreference: standaloneEnums.ContentWidgetPositionPreference,
        CursorChangeReason: standaloneEnums.CursorChangeReason,
        DefaultEndOfLine: standaloneEnums.DefaultEndOfLine,
        EditorAutoIndentStrategy: standaloneEnums.EditorAutoIndentStrategy,
        EditorOption: standaloneEnums.EditorOption,
        EndOfLinePreference: standaloneEnums.EndOfLinePreference,
        EndOfLineSequence: standaloneEnums.EndOfLineSequence,
        MinimapPosition: standaloneEnums.MinimapPosition,
        MouseTargetType: standaloneEnums.MouseTargetType,
        OverlayWidgetPositionPreference: standaloneEnums.OverlayWidgetPositionPreference,
        OverviewRulerLane: standaloneEnums.OverviewRulerLane,
        RenderLineNumbersType: standaloneEnums.RenderLineNumbersType,
        RenderMinimap: standaloneEnums.RenderMinimap,
        ScrollbarVisibility: standaloneEnums.ScrollbarVisibility,
        ScrollType: standaloneEnums.ScrollType,
        TextEditorCursorBlinkingStyle: standaloneEnums.TextEditorCursorBlinkingStyle,
        TextEditorCursorStyle: standaloneEnums.TextEditorCursorStyle,
        TrackedRangeStickiness: standaloneEnums.TrackedRangeStickiness,
        WrappingIndent: standaloneEnums.WrappingIndent,
        InjectedTextCursorStops: standaloneEnums.InjectedTextCursorStops,
        PositionAffinity: standaloneEnums.PositionAffinity,
        // classes
        ConfigurationChangedEvent: ConfigurationChangedEvent,
        BareFontInfo: BareFontInfo,
        FontInfo: FontInfo,
        TextModelResolvedOptions: TextModelResolvedOptions,
        FindMatch: FindMatch,
        ApplyUpdateResult: ApplyUpdateResult,
        LineRange: LineRange,
        LineRangeMapping: LineRangeMapping,
        RangeMapping: RangeMapping,
        EditorZoom: EditorZoom,
        // vars
        EditorType: EditorType,
        EditorOptions: EditorOptions
    };
}
