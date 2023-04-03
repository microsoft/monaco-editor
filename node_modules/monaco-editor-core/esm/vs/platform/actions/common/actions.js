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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { SubmenuAction } from '../../../base/common/actions.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { MicrotaskEmitter } from '../../../base/common/event.js';
import { DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { LinkedList } from '../../../base/common/linkedList.js';
import { CommandsRegistry, ICommandService } from '../../commands/common/commands.js';
import { ContextKeyExpr, IContextKeyService } from '../../contextkey/common/contextkey.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { KeybindingsRegistry } from '../../keybinding/common/keybindingsRegistry.js';
export function isIMenuItem(item) {
    return item.command !== undefined;
}
export function isISubmenuItem(item) {
    return item.submenu !== undefined;
}
class MenuId {
    /**
     * Create a new `MenuId` with the unique identifier. Will throw if a menu
     * with the identifier already exists, use `MenuId.for(ident)` or a unique
     * identifier
     */
    constructor(identifier) {
        if (MenuId._instances.has(identifier)) {
            throw new TypeError(`MenuId with identifier '${identifier}' already exists. Use MenuId.for(ident) or a unique identifier`);
        }
        MenuId._instances.set(identifier, this);
        this.id = identifier;
    }
}
MenuId._instances = new Map();
MenuId.CommandPalette = new MenuId('CommandPalette');
MenuId.DebugBreakpointsContext = new MenuId('DebugBreakpointsContext');
MenuId.DebugCallStackContext = new MenuId('DebugCallStackContext');
MenuId.DebugConsoleContext = new MenuId('DebugConsoleContext');
MenuId.DebugVariablesContext = new MenuId('DebugVariablesContext');
MenuId.DebugWatchContext = new MenuId('DebugWatchContext');
MenuId.DebugToolBar = new MenuId('DebugToolBar');
MenuId.DebugToolBarStop = new MenuId('DebugToolBarStop');
MenuId.EditorContext = new MenuId('EditorContext');
MenuId.SimpleEditorContext = new MenuId('SimpleEditorContext');
MenuId.EditorContent = new MenuId('EditorContent');
MenuId.EditorLineNumberContext = new MenuId('EditorLineNumberContext');
MenuId.EditorContextCopy = new MenuId('EditorContextCopy');
MenuId.EditorContextPeek = new MenuId('EditorContextPeek');
MenuId.EditorContextShare = new MenuId('EditorContextShare');
MenuId.EditorTitle = new MenuId('EditorTitle');
MenuId.EditorTitleRun = new MenuId('EditorTitleRun');
MenuId.EditorTitleContext = new MenuId('EditorTitleContext');
MenuId.EditorTitleContextShare = new MenuId('EditorTitleContextShare');
MenuId.EmptyEditorGroup = new MenuId('EmptyEditorGroup');
MenuId.EmptyEditorGroupContext = new MenuId('EmptyEditorGroupContext');
MenuId.EditorTabsBarContext = new MenuId('EditorTabsBarContext');
MenuId.ExplorerContext = new MenuId('ExplorerContext');
MenuId.ExplorerContextShare = new MenuId('ExplorerContextShare');
MenuId.ExtensionContext = new MenuId('ExtensionContext');
MenuId.GlobalActivity = new MenuId('GlobalActivity');
MenuId.CommandCenter = new MenuId('CommandCenter');
MenuId.LayoutControlMenuSubmenu = new MenuId('LayoutControlMenuSubmenu');
MenuId.LayoutControlMenu = new MenuId('LayoutControlMenu');
MenuId.MenubarMainMenu = new MenuId('MenubarMainMenu');
MenuId.MenubarAppearanceMenu = new MenuId('MenubarAppearanceMenu');
MenuId.MenubarDebugMenu = new MenuId('MenubarDebugMenu');
MenuId.MenubarEditMenu = new MenuId('MenubarEditMenu');
MenuId.MenubarCopy = new MenuId('MenubarCopy');
MenuId.MenubarFileMenu = new MenuId('MenubarFileMenu');
MenuId.MenubarGoMenu = new MenuId('MenubarGoMenu');
MenuId.MenubarHelpMenu = new MenuId('MenubarHelpMenu');
MenuId.MenubarLayoutMenu = new MenuId('MenubarLayoutMenu');
MenuId.MenubarNewBreakpointMenu = new MenuId('MenubarNewBreakpointMenu');
MenuId.PanelAlignmentMenu = new MenuId('PanelAlignmentMenu');
MenuId.PanelPositionMenu = new MenuId('PanelPositionMenu');
MenuId.MenubarPreferencesMenu = new MenuId('MenubarPreferencesMenu');
MenuId.MenubarRecentMenu = new MenuId('MenubarRecentMenu');
MenuId.MenubarSelectionMenu = new MenuId('MenubarSelectionMenu');
MenuId.MenubarShare = new MenuId('MenubarShare');
MenuId.MenubarSwitchEditorMenu = new MenuId('MenubarSwitchEditorMenu');
MenuId.MenubarSwitchGroupMenu = new MenuId('MenubarSwitchGroupMenu');
MenuId.MenubarTerminalMenu = new MenuId('MenubarTerminalMenu');
MenuId.MenubarViewMenu = new MenuId('MenubarViewMenu');
MenuId.MenubarHomeMenu = new MenuId('MenubarHomeMenu');
MenuId.OpenEditorsContext = new MenuId('OpenEditorsContext');
MenuId.ProblemsPanelContext = new MenuId('ProblemsPanelContext');
MenuId.SCMChangeContext = new MenuId('SCMChangeContext');
MenuId.SCMResourceContext = new MenuId('SCMResourceContext');
MenuId.SCMResourceFolderContext = new MenuId('SCMResourceFolderContext');
MenuId.SCMResourceGroupContext = new MenuId('SCMResourceGroupContext');
MenuId.SCMSourceControl = new MenuId('SCMSourceControl');
MenuId.SCMTitle = new MenuId('SCMTitle');
MenuId.SearchContext = new MenuId('SearchContext');
MenuId.SearchActionMenu = new MenuId('SearchActionContext');
MenuId.StatusBarWindowIndicatorMenu = new MenuId('StatusBarWindowIndicatorMenu');
MenuId.StatusBarRemoteIndicatorMenu = new MenuId('StatusBarRemoteIndicatorMenu');
MenuId.StickyScrollContext = new MenuId('StickyScrollContext');
MenuId.TestItem = new MenuId('TestItem');
MenuId.TestItemGutter = new MenuId('TestItemGutter');
MenuId.TestPeekElement = new MenuId('TestPeekElement');
MenuId.TestPeekTitle = new MenuId('TestPeekTitle');
MenuId.TouchBarContext = new MenuId('TouchBarContext');
MenuId.TitleBarContext = new MenuId('TitleBarContext');
MenuId.TitleBarTitleContext = new MenuId('TitleBarTitleContext');
MenuId.TunnelContext = new MenuId('TunnelContext');
MenuId.TunnelPrivacy = new MenuId('TunnelPrivacy');
MenuId.TunnelProtocol = new MenuId('TunnelProtocol');
MenuId.TunnelPortInline = new MenuId('TunnelInline');
MenuId.TunnelTitle = new MenuId('TunnelTitle');
MenuId.TunnelLocalAddressInline = new MenuId('TunnelLocalAddressInline');
MenuId.TunnelOriginInline = new MenuId('TunnelOriginInline');
MenuId.ViewItemContext = new MenuId('ViewItemContext');
MenuId.ViewContainerTitle = new MenuId('ViewContainerTitle');
MenuId.ViewContainerTitleContext = new MenuId('ViewContainerTitleContext');
MenuId.ViewTitle = new MenuId('ViewTitle');
MenuId.ViewTitleContext = new MenuId('ViewTitleContext');
MenuId.CommentEditorActions = new MenuId('CommentEditorActions');
MenuId.CommentThreadTitle = new MenuId('CommentThreadTitle');
MenuId.CommentThreadActions = new MenuId('CommentThreadActions');
MenuId.CommentThreadAdditionalActions = new MenuId('CommentThreadAdditionalActions');
MenuId.CommentThreadTitleContext = new MenuId('CommentThreadTitleContext');
MenuId.CommentThreadCommentContext = new MenuId('CommentThreadCommentContext');
MenuId.CommentTitle = new MenuId('CommentTitle');
MenuId.CommentActions = new MenuId('CommentActions');
MenuId.InteractiveToolbar = new MenuId('InteractiveToolbar');
MenuId.InteractiveCellTitle = new MenuId('InteractiveCellTitle');
MenuId.InteractiveCellDelete = new MenuId('InteractiveCellDelete');
MenuId.InteractiveCellExecute = new MenuId('InteractiveCellExecute');
MenuId.InteractiveInputExecute = new MenuId('InteractiveInputExecute');
MenuId.NotebookToolbar = new MenuId('NotebookToolbar');
MenuId.NotebookCellTitle = new MenuId('NotebookCellTitle');
MenuId.NotebookCellDelete = new MenuId('NotebookCellDelete');
MenuId.NotebookCellInsert = new MenuId('NotebookCellInsert');
MenuId.NotebookCellBetween = new MenuId('NotebookCellBetween');
MenuId.NotebookCellListTop = new MenuId('NotebookCellTop');
MenuId.NotebookCellExecute = new MenuId('NotebookCellExecute');
MenuId.NotebookCellExecutePrimary = new MenuId('NotebookCellExecutePrimary');
MenuId.NotebookDiffCellInputTitle = new MenuId('NotebookDiffCellInputTitle');
MenuId.NotebookDiffCellMetadataTitle = new MenuId('NotebookDiffCellMetadataTitle');
MenuId.NotebookDiffCellOutputsTitle = new MenuId('NotebookDiffCellOutputsTitle');
MenuId.NotebookOutputToolbar = new MenuId('NotebookOutputToolbar');
MenuId.NotebookEditorLayoutConfigure = new MenuId('NotebookEditorLayoutConfigure');
MenuId.NotebookKernelSource = new MenuId('NotebookKernelSource');
MenuId.BulkEditTitle = new MenuId('BulkEditTitle');
MenuId.BulkEditContext = new MenuId('BulkEditContext');
MenuId.TimelineItemContext = new MenuId('TimelineItemContext');
MenuId.TimelineTitle = new MenuId('TimelineTitle');
MenuId.TimelineTitleContext = new MenuId('TimelineTitleContext');
MenuId.TimelineFilterSubMenu = new MenuId('TimelineFilterSubMenu');
MenuId.AccountsContext = new MenuId('AccountsContext');
MenuId.PanelTitle = new MenuId('PanelTitle');
MenuId.AuxiliaryBarTitle = new MenuId('AuxiliaryBarTitle');
MenuId.TerminalInstanceContext = new MenuId('TerminalInstanceContext');
MenuId.TerminalEditorInstanceContext = new MenuId('TerminalEditorInstanceContext');
MenuId.TerminalNewDropdownContext = new MenuId('TerminalNewDropdownContext');
MenuId.TerminalTabContext = new MenuId('TerminalTabContext');
MenuId.TerminalTabEmptyAreaContext = new MenuId('TerminalTabEmptyAreaContext');
MenuId.TerminalInlineTabContext = new MenuId('TerminalInlineTabContext');
MenuId.WebviewContext = new MenuId('WebviewContext');
MenuId.InlineCompletionsActions = new MenuId('InlineCompletionsActions');
MenuId.NewFile = new MenuId('NewFile');
MenuId.MergeInput1Toolbar = new MenuId('MergeToolbar1Toolbar');
MenuId.MergeInput2Toolbar = new MenuId('MergeToolbar2Toolbar');
MenuId.MergeBaseToolbar = new MenuId('MergeBaseToolbar');
MenuId.MergeInputResultToolbar = new MenuId('MergeToolbarResultToolbar');
MenuId.InlineSuggestionToolbar = new MenuId('InlineSuggestionToolbar');
MenuId.InteractiveSessionContext = new MenuId('InteractiveSessionContext');
MenuId.InteractiveSessionCodeBlock = new MenuId('InteractiveSessionCodeblock');
MenuId.InteractiveSessionTitle = new MenuId('InteractiveSessionTitle');
MenuId.InteractiveSessionExecute = new MenuId('InteractiveSessionExecute');
export { MenuId };
export const IMenuService = createDecorator('menuService');
class MenuRegistryChangeEvent {
    static for(id) {
        let value = this._all.get(id);
        if (!value) {
            value = new MenuRegistryChangeEvent(id);
            this._all.set(id, value);
        }
        return value;
    }
    static merge(events) {
        const ids = new Set();
        for (const item of events) {
            if (item instanceof MenuRegistryChangeEvent) {
                ids.add(item.id);
            }
        }
        return ids;
    }
    constructor(id) {
        this.id = id;
        this.has = candidate => candidate === id;
    }
}
MenuRegistryChangeEvent._all = new Map();
export const MenuRegistry = new class {
    constructor() {
        this._commands = new Map();
        this._menuItems = new Map();
        this._onDidChangeMenu = new MicrotaskEmitter({
            merge: MenuRegistryChangeEvent.merge
        });
        this.onDidChangeMenu = this._onDidChangeMenu.event;
    }
    addCommand(command) {
        this._commands.set(command.id, command);
        this._onDidChangeMenu.fire(MenuRegistryChangeEvent.for(MenuId.CommandPalette));
        return toDisposable(() => {
            if (this._commands.delete(command.id)) {
                this._onDidChangeMenu.fire(MenuRegistryChangeEvent.for(MenuId.CommandPalette));
            }
        });
    }
    getCommand(id) {
        return this._commands.get(id);
    }
    getCommands() {
        const map = new Map();
        this._commands.forEach((value, key) => map.set(key, value));
        return map;
    }
    appendMenuItem(id, item) {
        let list = this._menuItems.get(id);
        if (!list) {
            list = new LinkedList();
            this._menuItems.set(id, list);
        }
        const rm = list.push(item);
        this._onDidChangeMenu.fire(MenuRegistryChangeEvent.for(id));
        return toDisposable(rm);
    }
    appendMenuItems(items) {
        const result = new DisposableStore();
        for (const { id, item } of items) {
            result.add(this.appendMenuItem(id, item));
        }
        return result;
    }
    getMenuItems(id) {
        let result;
        if (this._menuItems.has(id)) {
            result = [...this._menuItems.get(id)];
        }
        else {
            result = [];
        }
        if (id === MenuId.CommandPalette) {
            // CommandPalette is special because it shows
            // all commands by default
            this._appendImplicitItems(result);
        }
        return result;
    }
    _appendImplicitItems(result) {
        const set = new Set();
        for (const item of result) {
            if (isIMenuItem(item)) {
                set.add(item.command.id);
                if (item.alt) {
                    set.add(item.alt.id);
                }
            }
        }
        this._commands.forEach((command, id) => {
            if (!set.has(id)) {
                result.push({ command });
            }
        });
    }
};
export class SubmenuItemAction extends SubmenuAction {
    constructor(item, hideActions, actions) {
        super(`submenuitem.${item.submenu.id}`, typeof item.title === 'string' ? item.title : item.title.value, actions, 'submenu');
        this.item = item;
        this.hideActions = hideActions;
    }
}
// implements IAction, does NOT extend Action, so that no one
// subscribes to events of Action or modified properties
let MenuItemAction = class MenuItemAction {
    static label(action, options) {
        return (options === null || options === void 0 ? void 0 : options.renderShortTitle) && action.shortTitle
            ? (typeof action.shortTitle === 'string' ? action.shortTitle : action.shortTitle.value)
            : (typeof action.title === 'string' ? action.title : action.title.value);
    }
    constructor(item, alt, options, hideActions, contextKeyService, _commandService) {
        var _a, _b;
        this.hideActions = hideActions;
        this._commandService = _commandService;
        this.id = item.id;
        this.label = MenuItemAction.label(item, options);
        this.tooltip = (_b = (typeof item.tooltip === 'string' ? item.tooltip : (_a = item.tooltip) === null || _a === void 0 ? void 0 : _a.value)) !== null && _b !== void 0 ? _b : '';
        this.enabled = !item.precondition || contextKeyService.contextMatchesRules(item.precondition);
        this.checked = undefined;
        let icon;
        if (item.toggled) {
            const toggled = (item.toggled.condition ? item.toggled : { condition: item.toggled });
            this.checked = contextKeyService.contextMatchesRules(toggled.condition);
            if (this.checked && toggled.tooltip) {
                this.tooltip = typeof toggled.tooltip === 'string' ? toggled.tooltip : toggled.tooltip.value;
            }
            if (this.checked && ThemeIcon.isThemeIcon(toggled.icon)) {
                icon = toggled.icon;
            }
            if (toggled.title) {
                this.label = typeof toggled.title === 'string' ? toggled.title : toggled.title.value;
            }
        }
        if (!icon) {
            icon = ThemeIcon.isThemeIcon(item.icon) ? item.icon : undefined;
        }
        this.item = item;
        this.alt = alt ? new MenuItemAction(alt, undefined, options, hideActions, contextKeyService, _commandService) : undefined;
        this._options = options;
        this.class = icon && ThemeIcon.asClassName(icon);
    }
    run(...args) {
        var _a, _b;
        let runArgs = [];
        if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.arg) {
            runArgs = [...runArgs, this._options.arg];
        }
        if ((_b = this._options) === null || _b === void 0 ? void 0 : _b.shouldForwardArgs) {
            runArgs = [...runArgs, ...args];
        }
        return this._commandService.executeCommand(this.id, ...runArgs);
    }
};
MenuItemAction = __decorate([
    __param(4, IContextKeyService),
    __param(5, ICommandService)
], MenuItemAction);
export { MenuItemAction };
export class Action2 {
    constructor(desc) {
        this.desc = desc;
    }
}
export function registerAction2(ctor) {
    const disposables = new DisposableStore();
    const action = new ctor();
    const _a = action.desc, { f1, menu, keybinding, description } = _a, command = __rest(_a, ["f1", "menu", "keybinding", "description"]);
    // command
    disposables.add(CommandsRegistry.registerCommand({
        id: command.id,
        handler: (accessor, ...args) => action.run(accessor, ...args),
        description: description,
    }));
    // menu
    if (Array.isArray(menu)) {
        for (const item of menu) {
            disposables.add(MenuRegistry.appendMenuItem(item.id, Object.assign({ command: Object.assign(Object.assign({}, command), { precondition: item.precondition === null ? undefined : command.precondition }) }, item)));
        }
    }
    else if (menu) {
        disposables.add(MenuRegistry.appendMenuItem(menu.id, Object.assign({ command: Object.assign(Object.assign({}, command), { precondition: menu.precondition === null ? undefined : command.precondition }) }, menu)));
    }
    if (f1) {
        disposables.add(MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command, when: command.precondition }));
        disposables.add(MenuRegistry.addCommand(command));
    }
    // keybinding
    if (Array.isArray(keybinding)) {
        for (const item of keybinding) {
            disposables.add(KeybindingsRegistry.registerKeybindingRule(Object.assign(Object.assign({}, item), { id: command.id, when: command.precondition ? ContextKeyExpr.and(command.precondition, item.when) : item.when })));
        }
    }
    else if (keybinding) {
        disposables.add(KeybindingsRegistry.registerKeybindingRule(Object.assign(Object.assign({}, keybinding), { id: command.id, when: command.precondition ? ContextKeyExpr.and(command.precondition, keybinding.when) : keybinding.when })));
    }
    return disposables;
}
//#endregion
