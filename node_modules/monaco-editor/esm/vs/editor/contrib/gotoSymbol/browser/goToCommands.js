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
var _a, _b, _c, _d, _e, _f, _g, _h;
import { isStandalone } from '../../../../base/browser/browser.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { createCancelablePromise, raceCancellation } from '../../../../base/common/async.js';
import { KeyChord } from '../../../../base/common/keyCodes.js';
import { isWeb } from '../../../../base/common/platform.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { EditorStateCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { isCodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction2 } from '../../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { EmbeddedCodeEditorWidget } from '../../../browser/widget/embeddedCodeEditorWidget.js';
import * as corePosition from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { isLocationLink } from '../../../common/languages.js';
import { ReferencesController } from './peek/referencesController.js';
import { ReferencesModel } from './referencesModel.js';
import { ISymbolNavigationService } from './symbolNavigation.js';
import { MessageController } from '../../message/browser/messageController.js';
import { PeekContext } from '../../peekView/browser/peekView.js';
import * as nls from '../../../../nls.js';
import { MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IEditorProgressService } from '../../../../platform/progress/common/progress.js';
import { getDeclarationsAtPosition, getDefinitionsAtPosition, getImplementationsAtPosition, getReferencesAtPosition, getTypeDefinitionsAtPosition } from './goToSymbol.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { Iterable } from '../../../../base/common/iterator.js';
MenuRegistry.appendMenuItem(MenuId.EditorContext, {
    submenu: MenuId.EditorContextPeek,
    title: nls.localize('peek.submenu', "Peek"),
    group: 'navigation',
    order: 100
});
export class SymbolNavigationAnchor {
    static is(thing) {
        if (!thing || typeof thing !== 'object') {
            return false;
        }
        if (thing instanceof SymbolNavigationAnchor) {
            return true;
        }
        if (corePosition.Position.isIPosition(thing.position) && thing.model) {
            return true;
        }
        return false;
    }
    constructor(model, position) {
        this.model = model;
        this.position = position;
    }
}
class SymbolNavigationAction extends EditorAction2 {
    static all() {
        return SymbolNavigationAction._allSymbolNavigationCommands.values();
    }
    static _patchConfig(opts) {
        const result = Object.assign(Object.assign({}, opts), { f1: true });
        // patch context menu when clause
        if (result.menu) {
            for (const item of Iterable.wrap(result.menu)) {
                if (item.id === MenuId.EditorContext || item.id === MenuId.EditorContextPeek) {
                    item.when = ContextKeyExpr.and(opts.precondition, item.when);
                }
            }
        }
        return result;
    }
    constructor(configuration, opts) {
        super(SymbolNavigationAction._patchConfig(opts));
        this.configuration = configuration;
        SymbolNavigationAction._allSymbolNavigationCommands.set(opts.id, this);
    }
    runEditorCommand(accessor, editor, arg, range) {
        if (!editor.hasModel()) {
            return Promise.resolve(undefined);
        }
        const notificationService = accessor.get(INotificationService);
        const editorService = accessor.get(ICodeEditorService);
        const progressService = accessor.get(IEditorProgressService);
        const symbolNavService = accessor.get(ISymbolNavigationService);
        const languageFeaturesService = accessor.get(ILanguageFeaturesService);
        const instaService = accessor.get(IInstantiationService);
        const model = editor.getModel();
        const position = editor.getPosition();
        const anchor = SymbolNavigationAnchor.is(arg) ? arg : new SymbolNavigationAnchor(model, position);
        const cts = new EditorStateCancellationTokenSource(editor, 1 /* CodeEditorStateFlag.Value */ | 4 /* CodeEditorStateFlag.Position */);
        const promise = raceCancellation(this._getLocationModel(languageFeaturesService, anchor.model, anchor.position, cts.token), cts.token).then((references) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!references || cts.token.isCancellationRequested) {
                return;
            }
            alert(references.ariaMessage);
            let altAction;
            if (references.referenceAt(model.uri, position)) {
                const altActionId = this._getAlternativeCommand(editor);
                if (!SymbolNavigationAction._activeAlternativeCommands.has(altActionId) && SymbolNavigationAction._allSymbolNavigationCommands.has(altActionId)) {
                    altAction = SymbolNavigationAction._allSymbolNavigationCommands.get(altActionId);
                }
            }
            const referenceCount = references.references.length;
            if (referenceCount === 0) {
                // no result -> show message
                if (!this.configuration.muteMessage) {
                    const info = model.getWordAtPosition(position);
                    (_a = MessageController.get(editor)) === null || _a === void 0 ? void 0 : _a.showMessage(this._getNoResultFoundMessage(info), position);
                }
            }
            else if (referenceCount === 1 && altAction) {
                // already at the only result, run alternative
                SymbolNavigationAction._activeAlternativeCommands.add(this.desc.id);
                instaService.invokeFunction((accessor) => altAction.runEditorCommand(accessor, editor, arg, range).finally(() => {
                    SymbolNavigationAction._activeAlternativeCommands.delete(this.desc.id);
                }));
            }
            else {
                // normal results handling
                return this._onResult(editorService, symbolNavService, editor, references, range);
            }
        }), (err) => {
            // report an error
            notificationService.error(err);
        }).finally(() => {
            cts.dispose();
        });
        progressService.showWhile(promise, 250);
        return promise;
    }
    _onResult(editorService, symbolNavService, editor, model, range) {
        return __awaiter(this, void 0, void 0, function* () {
            const gotoLocation = this._getGoToPreference(editor);
            if (!(editor instanceof EmbeddedCodeEditorWidget) && (this.configuration.openInPeek || (gotoLocation === 'peek' && model.references.length > 1))) {
                this._openInPeek(editor, model, range);
            }
            else {
                const next = model.firstReference();
                const peek = model.references.length > 1 && gotoLocation === 'gotoAndPeek';
                const targetEditor = yield this._openReference(editor, editorService, next, this.configuration.openToSide, !peek);
                if (peek && targetEditor) {
                    this._openInPeek(targetEditor, model, range);
                }
                else {
                    model.dispose();
                }
                // keep remaining locations around when using
                // 'goto'-mode
                if (gotoLocation === 'goto') {
                    symbolNavService.put(next);
                }
            }
        });
    }
    _openReference(editor, editorService, reference, sideBySide, highlight) {
        return __awaiter(this, void 0, void 0, function* () {
            // range is the target-selection-range when we have one
            // and the fallback is the 'full' range
            let range = undefined;
            if (isLocationLink(reference)) {
                range = reference.targetSelectionRange;
            }
            if (!range) {
                range = reference.range;
            }
            if (!range) {
                return undefined;
            }
            const targetEditor = yield editorService.openCodeEditor({
                resource: reference.uri,
                options: {
                    selection: Range.collapseToStart(range),
                    selectionRevealType: 3 /* TextEditorSelectionRevealType.NearTopIfOutsideViewport */,
                    selectionSource: "code.jump" /* TextEditorSelectionSource.JUMP */
                }
            }, editor, sideBySide);
            if (!targetEditor) {
                return undefined;
            }
            if (highlight) {
                const modelNow = targetEditor.getModel();
                const decorations = targetEditor.createDecorationsCollection([{ range, options: { description: 'symbol-navigate-action-highlight', className: 'symbolHighlight' } }]);
                setTimeout(() => {
                    if (targetEditor.getModel() === modelNow) {
                        decorations.clear();
                    }
                }, 350);
            }
            return targetEditor;
        });
    }
    _openInPeek(target, model, range) {
        const controller = ReferencesController.get(target);
        if (controller && target.hasModel()) {
            controller.toggleWidget(range !== null && range !== void 0 ? range : target.getSelection(), createCancelablePromise(_ => Promise.resolve(model)), this.configuration.openInPeek);
        }
        else {
            model.dispose();
        }
    }
}
SymbolNavigationAction._allSymbolNavigationCommands = new Map();
SymbolNavigationAction._activeAlternativeCommands = new Set();
export { SymbolNavigationAction };
//#region --- DEFINITION
export class DefinitionAction extends SymbolNavigationAction {
    _getLocationModel(languageFeaturesService, model, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ReferencesModel(yield getDefinitionsAtPosition(languageFeaturesService.definitionProvider, model, position, token), nls.localize('def.title', 'Definitions'));
        });
    }
    _getNoResultFoundMessage(info) {
        return info && info.word
            ? nls.localize('noResultWord', "No definition found for '{0}'", info.word)
            : nls.localize('generic.noResults', "No definition found");
    }
    _getAlternativeCommand(editor) {
        return editor.getOption(55 /* EditorOption.gotoLocation */).alternativeDefinitionCommand;
    }
    _getGoToPreference(editor) {
        return editor.getOption(55 /* EditorOption.gotoLocation */).multipleDefinitions;
    }
}
const goToDefinitionKb = isWeb && !isStandalone()
    ? 2048 /* KeyMod.CtrlCmd */ | 70 /* KeyCode.F12 */
    : 70 /* KeyCode.F12 */;
registerAction2((_a = class GoToDefinitionAction extends DefinitionAction {
        constructor() {
            super({
                openToSide: false,
                openInPeek: false,
                muteMessage: false
            }, {
                id: GoToDefinitionAction.id,
                title: {
                    value: nls.localize('actions.goToDecl.label', "Go to Definition"),
                    original: 'Go to Definition',
                    mnemonicTitle: nls.localize({ key: 'miGotoDefinition', comment: ['&& denotes a mnemonic'] }, "Go to &&Definition")
                },
                precondition: ContextKeyExpr.and(EditorContextKeys.hasDefinitionProvider, EditorContextKeys.isInWalkThroughSnippet.toNegated()),
                keybinding: {
                    when: EditorContextKeys.editorTextFocus,
                    primary: goToDefinitionKb,
                    weight: 100 /* KeybindingWeight.EditorContrib */
                },
                menu: [{
                        id: MenuId.EditorContext,
                        group: 'navigation',
                        order: 1.1
                    }, {
                        id: MenuId.MenubarGoMenu,
                        precondition: null,
                        group: '4_symbol_nav',
                        order: 2,
                    }]
            });
            CommandsRegistry.registerCommandAlias('editor.action.goToDeclaration', GoToDefinitionAction.id);
        }
    },
    _a.id = 'editor.action.revealDefinition',
    _a));
registerAction2((_b = class OpenDefinitionToSideAction extends DefinitionAction {
        constructor() {
            super({
                openToSide: true,
                openInPeek: false,
                muteMessage: false
            }, {
                id: OpenDefinitionToSideAction.id,
                title: {
                    value: nls.localize('actions.goToDeclToSide.label', "Open Definition to the Side"),
                    original: 'Open Definition to the Side'
                },
                precondition: ContextKeyExpr.and(EditorContextKeys.hasDefinitionProvider, EditorContextKeys.isInWalkThroughSnippet.toNegated()),
                keybinding: {
                    when: EditorContextKeys.editorTextFocus,
                    primary: KeyChord(2048 /* KeyMod.CtrlCmd */ | 41 /* KeyCode.KeyK */, goToDefinitionKb),
                    weight: 100 /* KeybindingWeight.EditorContrib */
                }
            });
            CommandsRegistry.registerCommandAlias('editor.action.openDeclarationToTheSide', OpenDefinitionToSideAction.id);
        }
    },
    _b.id = 'editor.action.revealDefinitionAside',
    _b));
registerAction2((_c = class PeekDefinitionAction extends DefinitionAction {
        constructor() {
            super({
                openToSide: false,
                openInPeek: true,
                muteMessage: false
            }, {
                id: PeekDefinitionAction.id,
                title: {
                    value: nls.localize('actions.previewDecl.label', "Peek Definition"),
                    original: 'Peek Definition'
                },
                precondition: ContextKeyExpr.and(EditorContextKeys.hasDefinitionProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInWalkThroughSnippet.toNegated()),
                keybinding: {
                    when: EditorContextKeys.editorTextFocus,
                    primary: 512 /* KeyMod.Alt */ | 70 /* KeyCode.F12 */,
                    linux: { primary: 2048 /* KeyMod.CtrlCmd */ | 1024 /* KeyMod.Shift */ | 68 /* KeyCode.F10 */ },
                    weight: 100 /* KeybindingWeight.EditorContrib */
                },
                menu: {
                    id: MenuId.EditorContextPeek,
                    group: 'peek',
                    order: 2
                }
            });
            CommandsRegistry.registerCommandAlias('editor.action.previewDeclaration', PeekDefinitionAction.id);
        }
    },
    _c.id = 'editor.action.peekDefinition',
    _c));
//#endregion
//#region --- DECLARATION
class DeclarationAction extends SymbolNavigationAction {
    _getLocationModel(languageFeaturesService, model, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ReferencesModel(yield getDeclarationsAtPosition(languageFeaturesService.declarationProvider, model, position, token), nls.localize('decl.title', 'Declarations'));
        });
    }
    _getNoResultFoundMessage(info) {
        return info && info.word
            ? nls.localize('decl.noResultWord', "No declaration found for '{0}'", info.word)
            : nls.localize('decl.generic.noResults', "No declaration found");
    }
    _getAlternativeCommand(editor) {
        return editor.getOption(55 /* EditorOption.gotoLocation */).alternativeDeclarationCommand;
    }
    _getGoToPreference(editor) {
        return editor.getOption(55 /* EditorOption.gotoLocation */).multipleDeclarations;
    }
}
registerAction2((_d = class GoToDeclarationAction extends DeclarationAction {
        constructor() {
            super({
                openToSide: false,
                openInPeek: false,
                muteMessage: false
            }, {
                id: GoToDeclarationAction.id,
                title: {
                    value: nls.localize('actions.goToDeclaration.label', "Go to Declaration"),
                    original: 'Go to Declaration',
                    mnemonicTitle: nls.localize({ key: 'miGotoDeclaration', comment: ['&& denotes a mnemonic'] }, "Go to &&Declaration")
                },
                precondition: ContextKeyExpr.and(EditorContextKeys.hasDeclarationProvider, EditorContextKeys.isInWalkThroughSnippet.toNegated()),
                menu: [{
                        id: MenuId.EditorContext,
                        group: 'navigation',
                        order: 1.3
                    }, {
                        id: MenuId.MenubarGoMenu,
                        precondition: null,
                        group: '4_symbol_nav',
                        order: 3,
                    }],
            });
        }
        _getNoResultFoundMessage(info) {
            return info && info.word
                ? nls.localize('decl.noResultWord', "No declaration found for '{0}'", info.word)
                : nls.localize('decl.generic.noResults', "No declaration found");
        }
    },
    _d.id = 'editor.action.revealDeclaration',
    _d));
registerAction2(class PeekDeclarationAction extends DeclarationAction {
    constructor() {
        super({
            openToSide: false,
            openInPeek: true,
            muteMessage: false
        }, {
            id: 'editor.action.peekDeclaration',
            title: {
                value: nls.localize('actions.peekDecl.label', "Peek Declaration"),
                original: 'Peek Declaration'
            },
            precondition: ContextKeyExpr.and(EditorContextKeys.hasDeclarationProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInWalkThroughSnippet.toNegated()),
            menu: {
                id: MenuId.EditorContextPeek,
                group: 'peek',
                order: 3
            }
        });
    }
});
//#endregion
//#region --- TYPE DEFINITION
class TypeDefinitionAction extends SymbolNavigationAction {
    _getLocationModel(languageFeaturesService, model, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ReferencesModel(yield getTypeDefinitionsAtPosition(languageFeaturesService.typeDefinitionProvider, model, position, token), nls.localize('typedef.title', 'Type Definitions'));
        });
    }
    _getNoResultFoundMessage(info) {
        return info && info.word
            ? nls.localize('goToTypeDefinition.noResultWord', "No type definition found for '{0}'", info.word)
            : nls.localize('goToTypeDefinition.generic.noResults', "No type definition found");
    }
    _getAlternativeCommand(editor) {
        return editor.getOption(55 /* EditorOption.gotoLocation */).alternativeTypeDefinitionCommand;
    }
    _getGoToPreference(editor) {
        return editor.getOption(55 /* EditorOption.gotoLocation */).multipleTypeDefinitions;
    }
}
registerAction2((_e = class GoToTypeDefinitionAction extends TypeDefinitionAction {
        constructor() {
            super({
                openToSide: false,
                openInPeek: false,
                muteMessage: false
            }, {
                id: GoToTypeDefinitionAction.ID,
                title: {
                    value: nls.localize('actions.goToTypeDefinition.label', "Go to Type Definition"),
                    original: 'Go to Type Definition',
                    mnemonicTitle: nls.localize({ key: 'miGotoTypeDefinition', comment: ['&& denotes a mnemonic'] }, "Go to &&Type Definition")
                },
                precondition: ContextKeyExpr.and(EditorContextKeys.hasTypeDefinitionProvider, EditorContextKeys.isInWalkThroughSnippet.toNegated()),
                keybinding: {
                    when: EditorContextKeys.editorTextFocus,
                    primary: 0,
                    weight: 100 /* KeybindingWeight.EditorContrib */
                },
                menu: [{
                        id: MenuId.EditorContext,
                        group: 'navigation',
                        order: 1.4
                    }, {
                        id: MenuId.MenubarGoMenu,
                        precondition: null,
                        group: '4_symbol_nav',
                        order: 3,
                    }]
            });
        }
    },
    _e.ID = 'editor.action.goToTypeDefinition',
    _e));
registerAction2((_f = class PeekTypeDefinitionAction extends TypeDefinitionAction {
        constructor() {
            super({
                openToSide: false,
                openInPeek: true,
                muteMessage: false
            }, {
                id: PeekTypeDefinitionAction.ID,
                title: {
                    value: nls.localize('actions.peekTypeDefinition.label', "Peek Type Definition"),
                    original: 'Peek Type Definition'
                },
                precondition: ContextKeyExpr.and(EditorContextKeys.hasTypeDefinitionProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInWalkThroughSnippet.toNegated()),
                menu: {
                    id: MenuId.EditorContextPeek,
                    group: 'peek',
                    order: 4
                }
            });
        }
    },
    _f.ID = 'editor.action.peekTypeDefinition',
    _f));
//#endregion
//#region --- IMPLEMENTATION
class ImplementationAction extends SymbolNavigationAction {
    _getLocationModel(languageFeaturesService, model, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ReferencesModel(yield getImplementationsAtPosition(languageFeaturesService.implementationProvider, model, position, token), nls.localize('impl.title', 'Implementations'));
        });
    }
    _getNoResultFoundMessage(info) {
        return info && info.word
            ? nls.localize('goToImplementation.noResultWord', "No implementation found for '{0}'", info.word)
            : nls.localize('goToImplementation.generic.noResults', "No implementation found");
    }
    _getAlternativeCommand(editor) {
        return editor.getOption(55 /* EditorOption.gotoLocation */).alternativeImplementationCommand;
    }
    _getGoToPreference(editor) {
        return editor.getOption(55 /* EditorOption.gotoLocation */).multipleImplementations;
    }
}
registerAction2((_g = class GoToImplementationAction extends ImplementationAction {
        constructor() {
            super({
                openToSide: false,
                openInPeek: false,
                muteMessage: false
            }, {
                id: GoToImplementationAction.ID,
                title: {
                    value: nls.localize('actions.goToImplementation.label', "Go to Implementations"),
                    original: 'Go to Implementations',
                    mnemonicTitle: nls.localize({ key: 'miGotoImplementation', comment: ['&& denotes a mnemonic'] }, "Go to &&Implementations")
                },
                precondition: ContextKeyExpr.and(EditorContextKeys.hasImplementationProvider, EditorContextKeys.isInWalkThroughSnippet.toNegated()),
                keybinding: {
                    when: EditorContextKeys.editorTextFocus,
                    primary: 2048 /* KeyMod.CtrlCmd */ | 70 /* KeyCode.F12 */,
                    weight: 100 /* KeybindingWeight.EditorContrib */
                },
                menu: [{
                        id: MenuId.EditorContext,
                        group: 'navigation',
                        order: 1.45
                    }, {
                        id: MenuId.MenubarGoMenu,
                        precondition: null,
                        group: '4_symbol_nav',
                        order: 4,
                    }]
            });
        }
    },
    _g.ID = 'editor.action.goToImplementation',
    _g));
registerAction2((_h = class PeekImplementationAction extends ImplementationAction {
        constructor() {
            super({
                openToSide: false,
                openInPeek: true,
                muteMessage: false
            }, {
                id: PeekImplementationAction.ID,
                title: {
                    value: nls.localize('actions.peekImplementation.label', "Peek Implementations"),
                    original: 'Peek Implementations'
                },
                precondition: ContextKeyExpr.and(EditorContextKeys.hasImplementationProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInWalkThroughSnippet.toNegated()),
                keybinding: {
                    when: EditorContextKeys.editorTextFocus,
                    primary: 2048 /* KeyMod.CtrlCmd */ | 1024 /* KeyMod.Shift */ | 70 /* KeyCode.F12 */,
                    weight: 100 /* KeybindingWeight.EditorContrib */
                },
                menu: {
                    id: MenuId.EditorContextPeek,
                    group: 'peek',
                    order: 5
                }
            });
        }
    },
    _h.ID = 'editor.action.peekImplementation',
    _h));
//#endregion
//#region --- REFERENCES
class ReferencesAction extends SymbolNavigationAction {
    _getNoResultFoundMessage(info) {
        return info
            ? nls.localize('references.no', "No references found for '{0}'", info.word)
            : nls.localize('references.noGeneric', "No references found");
    }
    _getAlternativeCommand(editor) {
        return editor.getOption(55 /* EditorOption.gotoLocation */).alternativeReferenceCommand;
    }
    _getGoToPreference(editor) {
        return editor.getOption(55 /* EditorOption.gotoLocation */).multipleReferences;
    }
}
registerAction2(class GoToReferencesAction extends ReferencesAction {
    constructor() {
        super({
            openToSide: false,
            openInPeek: false,
            muteMessage: false
        }, {
            id: 'editor.action.goToReferences',
            title: {
                value: nls.localize('goToReferences.label', "Go to References"),
                original: 'Go to References',
                mnemonicTitle: nls.localize({ key: 'miGotoReference', comment: ['&& denotes a mnemonic'] }, "Go to &&References")
            },
            precondition: ContextKeyExpr.and(EditorContextKeys.hasReferenceProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInWalkThroughSnippet.toNegated()),
            keybinding: {
                when: EditorContextKeys.editorTextFocus,
                primary: 1024 /* KeyMod.Shift */ | 70 /* KeyCode.F12 */,
                weight: 100 /* KeybindingWeight.EditorContrib */
            },
            menu: [{
                    id: MenuId.EditorContext,
                    group: 'navigation',
                    order: 1.45
                }, {
                    id: MenuId.MenubarGoMenu,
                    precondition: null,
                    group: '4_symbol_nav',
                    order: 5,
                }]
        });
    }
    _getLocationModel(languageFeaturesService, model, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ReferencesModel(yield getReferencesAtPosition(languageFeaturesService.referenceProvider, model, position, true, token), nls.localize('ref.title', 'References'));
        });
    }
});
registerAction2(class PeekReferencesAction extends ReferencesAction {
    constructor() {
        super({
            openToSide: false,
            openInPeek: true,
            muteMessage: false
        }, {
            id: 'editor.action.referenceSearch.trigger',
            title: {
                value: nls.localize('references.action.label', "Peek References"),
                original: 'Peek References'
            },
            precondition: ContextKeyExpr.and(EditorContextKeys.hasReferenceProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInWalkThroughSnippet.toNegated()),
            menu: {
                id: MenuId.EditorContextPeek,
                group: 'peek',
                order: 6
            }
        });
    }
    _getLocationModel(languageFeaturesService, model, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ReferencesModel(yield getReferencesAtPosition(languageFeaturesService.referenceProvider, model, position, false, token), nls.localize('ref.title', 'References'));
        });
    }
});
//#endregion
//#region --- GENERIC goto symbols command
class GenericGoToLocationAction extends SymbolNavigationAction {
    constructor(config, _references, _gotoMultipleBehaviour) {
        super(config, {
            id: 'editor.action.goToLocation',
            title: {
                value: nls.localize('label.generic', "Go to Any Symbol"),
                original: 'Go to Any Symbol'
            },
            precondition: ContextKeyExpr.and(PeekContext.notInPeekEditor, EditorContextKeys.isInWalkThroughSnippet.toNegated()),
        });
        this._references = _references;
        this._gotoMultipleBehaviour = _gotoMultipleBehaviour;
    }
    _getLocationModel(languageFeaturesService, _model, _position, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ReferencesModel(this._references, nls.localize('generic.title', 'Locations'));
        });
    }
    _getNoResultFoundMessage(info) {
        return info && nls.localize('generic.noResult', "No results for '{0}'", info.word) || '';
    }
    _getGoToPreference(editor) {
        var _a;
        return (_a = this._gotoMultipleBehaviour) !== null && _a !== void 0 ? _a : editor.getOption(55 /* EditorOption.gotoLocation */).multipleReferences;
    }
    _getAlternativeCommand() { return ''; }
}
CommandsRegistry.registerCommand({
    id: 'editor.action.goToLocations',
    description: {
        description: 'Go to locations from a position in a file',
        args: [
            { name: 'uri', description: 'The text document in which to start', constraint: URI },
            { name: 'position', description: 'The position at which to start', constraint: corePosition.Position.isIPosition },
            { name: 'locations', description: 'An array of locations.', constraint: Array },
            { name: 'multiple', description: 'Define what to do when having multiple results, either `peek`, `gotoAndPeek`, or `goto' },
            { name: 'noResultsMessage', description: 'Human readable message that shows when locations is empty.' },
        ]
    },
    handler: (accessor, resource, position, references, multiple, noResultsMessage, openInPeek) => __awaiter(void 0, void 0, void 0, function* () {
        assertType(URI.isUri(resource));
        assertType(corePosition.Position.isIPosition(position));
        assertType(Array.isArray(references));
        assertType(typeof multiple === 'undefined' || typeof multiple === 'string');
        assertType(typeof openInPeek === 'undefined' || typeof openInPeek === 'boolean');
        const editorService = accessor.get(ICodeEditorService);
        const editor = yield editorService.openCodeEditor({ resource }, editorService.getFocusedCodeEditor());
        if (isCodeEditor(editor)) {
            editor.setPosition(position);
            editor.revealPositionInCenterIfOutsideViewport(position, 0 /* ScrollType.Smooth */);
            return editor.invokeWithinContext(accessor => {
                const command = new class extends GenericGoToLocationAction {
                    _getNoResultFoundMessage(info) {
                        return noResultsMessage || super._getNoResultFoundMessage(info);
                    }
                }({
                    muteMessage: !Boolean(noResultsMessage),
                    openInPeek: Boolean(openInPeek),
                    openToSide: false
                }, references, multiple);
                accessor.get(IInstantiationService).invokeFunction(command.run.bind(command), editor);
            });
        }
    })
});
CommandsRegistry.registerCommand({
    id: 'editor.action.peekLocations',
    description: {
        description: 'Peek locations from a position in a file',
        args: [
            { name: 'uri', description: 'The text document in which to start', constraint: URI },
            { name: 'position', description: 'The position at which to start', constraint: corePosition.Position.isIPosition },
            { name: 'locations', description: 'An array of locations.', constraint: Array },
            { name: 'multiple', description: 'Define what to do when having multiple results, either `peek`, `gotoAndPeek`, or `goto' },
        ]
    },
    handler: (accessor, resource, position, references, multiple) => __awaiter(void 0, void 0, void 0, function* () {
        accessor.get(ICommandService).executeCommand('editor.action.goToLocations', resource, position, references, multiple, undefined, true);
    })
});
//#endregion
//#region --- REFERENCE search special commands
CommandsRegistry.registerCommand({
    id: 'editor.action.findReferences',
    handler: (accessor, resource, position) => {
        assertType(URI.isUri(resource));
        assertType(corePosition.Position.isIPosition(position));
        const languageFeaturesService = accessor.get(ILanguageFeaturesService);
        const codeEditorService = accessor.get(ICodeEditorService);
        return codeEditorService.openCodeEditor({ resource }, codeEditorService.getFocusedCodeEditor()).then(control => {
            if (!isCodeEditor(control) || !control.hasModel()) {
                return undefined;
            }
            const controller = ReferencesController.get(control);
            if (!controller) {
                return undefined;
            }
            const references = createCancelablePromise(token => getReferencesAtPosition(languageFeaturesService.referenceProvider, control.getModel(), corePosition.Position.lift(position), false, token).then(references => new ReferencesModel(references, nls.localize('ref.title', 'References'))));
            const range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
            return Promise.resolve(controller.toggleWidget(range, references, false));
        });
    }
});
// use NEW command
CommandsRegistry.registerCommandAlias('editor.action.showReferences', 'editor.action.peekLocations');
//#endregion
