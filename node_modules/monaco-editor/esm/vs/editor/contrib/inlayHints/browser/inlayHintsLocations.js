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
import * as dom from '../../../../base/browser/dom.js';
import { Action, Separator } from '../../../../base/common/actions.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { Range } from '../../../common/core/range.js';
import { ITextModelService } from '../../../common/services/resolverService.js';
import { DefinitionAction, SymbolNavigationAction, SymbolNavigationAnchor } from '../../gotoSymbol/browser/goToCommands.js';
import { PeekContext } from '../../peekView/browser/peekView.js';
import { isIMenuItem, MenuId, MenuItemAction, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
export function showGoToContextMenu(accessor, editor, anchor, part) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const resolverService = accessor.get(ITextModelService);
        const contextMenuService = accessor.get(IContextMenuService);
        const commandService = accessor.get(ICommandService);
        const instaService = accessor.get(IInstantiationService);
        const notificationService = accessor.get(INotificationService);
        yield part.item.resolve(CancellationToken.None);
        if (!part.part.location) {
            return;
        }
        const location = part.part.location;
        const menuActions = [];
        // from all registered (not active) context menu actions select those
        // that are a symbol navigation actions
        const filter = new Set(MenuRegistry.getMenuItems(MenuId.EditorContext)
            .map(item => isIMenuItem(item) ? item.command.id : generateUuid()));
        for (const delegate of SymbolNavigationAction.all()) {
            if (filter.has(delegate.desc.id)) {
                menuActions.push(new Action(delegate.desc.id, MenuItemAction.label(delegate.desc, { renderShortTitle: true }), undefined, true, () => __awaiter(this, void 0, void 0, function* () {
                    const ref = yield resolverService.createModelReference(location.uri);
                    try {
                        const symbolAnchor = new SymbolNavigationAnchor(ref.object.textEditorModel, Range.getStartPosition(location.range));
                        const range = part.item.anchor.range;
                        yield instaService.invokeFunction(delegate.runEditorCommand.bind(delegate), editor, symbolAnchor, range);
                    }
                    finally {
                        ref.dispose();
                    }
                })));
            }
        }
        if (part.part.command) {
            const { command } = part.part;
            menuActions.push(new Separator());
            menuActions.push(new Action(command.id, command.title, undefined, true, () => __awaiter(this, void 0, void 0, function* () {
                var _b;
                try {
                    yield commandService.executeCommand(command.id, ...((_b = command.arguments) !== null && _b !== void 0 ? _b : []));
                }
                catch (err) {
                    notificationService.notify({
                        severity: Severity.Error,
                        source: part.item.provider.displayName,
                        message: err
                    });
                }
            })));
        }
        // show context menu
        const useShadowDOM = editor.getOption(122 /* EditorOption.useShadowDOM */);
        contextMenuService.showContextMenu({
            domForShadowRoot: useShadowDOM ? (_a = editor.getDomNode()) !== null && _a !== void 0 ? _a : undefined : undefined,
            getAnchor: () => {
                const box = dom.getDomNodePagePosition(anchor);
                return { x: box.left, y: box.top + box.height + 8 };
            },
            getActions: () => menuActions,
            onHide: () => {
                editor.focus();
            },
            autoSelectFirstItem: true,
        });
    });
}
export function goToDefinitionWithLocation(accessor, event, editor, location) {
    return __awaiter(this, void 0, void 0, function* () {
        const resolverService = accessor.get(ITextModelService);
        const ref = yield resolverService.createModelReference(location.uri);
        yield editor.invokeWithinContext((accessor) => __awaiter(this, void 0, void 0, function* () {
            const openToSide = event.hasSideBySideModifier;
            const contextKeyService = accessor.get(IContextKeyService);
            const isInPeek = PeekContext.inPeekEditor.getValue(contextKeyService);
            const canPeek = !openToSide && editor.getOption(84 /* EditorOption.definitionLinkOpensInPeek */) && !isInPeek;
            const action = new DefinitionAction({ openToSide, openInPeek: canPeek, muteMessage: true }, { title: { value: '', original: '' }, id: '', precondition: undefined });
            return action.run(accessor, new SymbolNavigationAnchor(ref.object.textEditorModel, Range.getStartPosition(location.range)), Range.lift(location.range));
        }));
        ref.dispose();
    });
}
