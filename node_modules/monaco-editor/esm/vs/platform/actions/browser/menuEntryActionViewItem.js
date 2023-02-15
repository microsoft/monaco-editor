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
import { $, addDisposableListener, append, asCSSUrl, EventType, ModifierKeyEmitter, prepend } from '../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { ActionViewItem, BaseActionViewItem, SelectActionViewItem } from '../../../base/browser/ui/actionbar/actionViewItems.js';
import { DropdownMenuActionViewItem } from '../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { ActionRunner, Separator, SubmenuAction } from '../../../base/common/actions.js';
import { UILabelProvider } from '../../../base/common/keybindingLabels.js';
import { combinedDisposable, MutableDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { isLinux, isWindows, OS } from '../../../base/common/platform.js';
import './menuEntryActionViewItem.css';
import { localize } from '../../../nls.js';
import { IMenuService, MenuItemAction, SubmenuItemAction } from '../common/actions.js';
import { isICommandActionToggleInfo } from '../../action/common/action.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../contextview/browser/contextView.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { INotificationService } from '../../notification/common/notification.js';
import { IStorageService } from '../../storage/common/storage.js';
import { IThemeService } from '../../theme/common/themeService.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { isDark } from '../../theme/common/theme.js';
import { assertType } from '../../../base/common/types.js';
import { asCssVariable, selectBorder } from '../../theme/common/colorRegistry.js';
import { defaultSelectBoxStyles } from '../../theme/browser/defaultStyles.js';
export function createAndFillInContextMenuActions(menu, options, target, primaryGroup) {
    const groups = menu.getActions(options);
    const modifierKeyEmitter = ModifierKeyEmitter.getInstance();
    const useAlternativeActions = modifierKeyEmitter.keyStatus.altKey || ((isWindows || isLinux) && modifierKeyEmitter.keyStatus.shiftKey);
    fillInActions(groups, target, useAlternativeActions, primaryGroup ? actionGroup => actionGroup === primaryGroup : actionGroup => actionGroup === 'navigation');
}
export function createAndFillInActionBarActions(menu, options, target, primaryGroup, shouldInlineSubmenu, useSeparatorsInPrimaryActions) {
    const groups = menu.getActions(options);
    const isPrimaryAction = typeof primaryGroup === 'string' ? (actionGroup) => actionGroup === primaryGroup : primaryGroup;
    // Action bars handle alternative actions on their own so the alternative actions should be ignored
    fillInActions(groups, target, false, isPrimaryAction, shouldInlineSubmenu, useSeparatorsInPrimaryActions);
}
function fillInActions(groups, target, useAlternativeActions, isPrimaryAction = actionGroup => actionGroup === 'navigation', shouldInlineSubmenu = () => false, useSeparatorsInPrimaryActions = false) {
    let primaryBucket;
    let secondaryBucket;
    if (Array.isArray(target)) {
        primaryBucket = target;
        secondaryBucket = target;
    }
    else {
        primaryBucket = target.primary;
        secondaryBucket = target.secondary;
    }
    const submenuInfo = new Set();
    for (const [group, actions] of groups) {
        let target;
        if (isPrimaryAction(group)) {
            target = primaryBucket;
            if (target.length > 0 && useSeparatorsInPrimaryActions) {
                target.push(new Separator());
            }
        }
        else {
            target = secondaryBucket;
            if (target.length > 0) {
                target.push(new Separator());
            }
        }
        for (let action of actions) {
            if (useAlternativeActions) {
                action = action instanceof MenuItemAction && action.alt ? action.alt : action;
            }
            const newLen = target.push(action);
            // keep submenu info for later inlining
            if (action instanceof SubmenuAction) {
                submenuInfo.add({ group, action, index: newLen - 1 });
            }
        }
    }
    // ask the outside if submenu should be inlined or not. only ask when
    // there would be enough space
    for (const { group, action, index } of submenuInfo) {
        const target = isPrimaryAction(group) ? primaryBucket : secondaryBucket;
        // inlining submenus with length 0 or 1 is easy,
        // larger submenus need to be checked with the overall limit
        const submenuActions = action.actions;
        if (submenuActions.length <= 1 && shouldInlineSubmenu(action, group, target.length)) {
            target.splice(index, 1, ...submenuActions);
        }
    }
}
let MenuEntryActionViewItem = class MenuEntryActionViewItem extends ActionViewItem {
    constructor(action, options, _keybindingService, _notificationService, _contextKeyService, _themeService, _contextMenuService) {
        super(undefined, action, { icon: !!(action.class || action.item.icon), label: !action.class && !action.item.icon, draggable: options === null || options === void 0 ? void 0 : options.draggable, keybinding: options === null || options === void 0 ? void 0 : options.keybinding, hoverDelegate: options === null || options === void 0 ? void 0 : options.hoverDelegate });
        this._keybindingService = _keybindingService;
        this._notificationService = _notificationService;
        this._contextKeyService = _contextKeyService;
        this._themeService = _themeService;
        this._contextMenuService = _contextMenuService;
        this._wantsAltCommand = false;
        this._itemClassDispose = this._register(new MutableDisposable());
        this._altKey = ModifierKeyEmitter.getInstance();
    }
    get _menuItemAction() {
        return this._action;
    }
    get _commandAction() {
        return this._wantsAltCommand && this._menuItemAction.alt || this._menuItemAction;
    }
    onClick(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            try {
                yield this.actionRunner.run(this._commandAction, this._context);
            }
            catch (err) {
                this._notificationService.error(err);
            }
        });
    }
    render(container) {
        super.render(container);
        container.classList.add('menu-entry');
        this._updateItemClass(this._menuItemAction.item);
        let mouseOver = false;
        let alternativeKeyDown = this._altKey.keyStatus.altKey || ((isWindows || isLinux) && this._altKey.keyStatus.shiftKey);
        const updateAltState = () => {
            var _a;
            const wantsAltCommand = mouseOver && alternativeKeyDown && !!((_a = this._commandAction.alt) === null || _a === void 0 ? void 0 : _a.enabled);
            if (wantsAltCommand !== this._wantsAltCommand) {
                this._wantsAltCommand = wantsAltCommand;
                this.updateLabel();
                this.updateTooltip();
                this.updateClass();
            }
        };
        if (this._menuItemAction.alt) {
            this._register(this._altKey.event(value => {
                alternativeKeyDown = value.altKey || ((isWindows || isLinux) && value.shiftKey);
                updateAltState();
            }));
        }
        this._register(addDisposableListener(container, 'mouseleave', _ => {
            mouseOver = false;
            updateAltState();
        }));
        this._register(addDisposableListener(container, 'mouseenter', _ => {
            mouseOver = true;
            updateAltState();
        }));
    }
    updateLabel() {
        if (this.options.label && this.label) {
            this.label.textContent = this._commandAction.label;
        }
    }
    getTooltip() {
        var _a;
        const keybinding = this._keybindingService.lookupKeybinding(this._commandAction.id, this._contextKeyService);
        const keybindingLabel = keybinding && keybinding.getLabel();
        const tooltip = this._commandAction.tooltip || this._commandAction.label;
        let title = keybindingLabel
            ? localize('titleAndKb', "{0} ({1})", tooltip, keybindingLabel)
            : tooltip;
        if (!this._wantsAltCommand && ((_a = this._menuItemAction.alt) === null || _a === void 0 ? void 0 : _a.enabled)) {
            const altTooltip = this._menuItemAction.alt.tooltip || this._menuItemAction.alt.label;
            const altKeybinding = this._keybindingService.lookupKeybinding(this._menuItemAction.alt.id, this._contextKeyService);
            const altKeybindingLabel = altKeybinding && altKeybinding.getLabel();
            const altTitleSection = altKeybindingLabel
                ? localize('titleAndKb', "{0} ({1})", altTooltip, altKeybindingLabel)
                : altTooltip;
            title = localize('titleAndKbAndAlt', "{0}\n[{1}] {2}", title, UILabelProvider.modifierLabels[OS].altKey, altTitleSection);
        }
        return title;
    }
    updateClass() {
        if (this.options.icon) {
            if (this._commandAction !== this._menuItemAction) {
                if (this._menuItemAction.alt) {
                    this._updateItemClass(this._menuItemAction.alt.item);
                }
            }
            else {
                this._updateItemClass(this._menuItemAction.item);
            }
        }
    }
    _updateItemClass(item) {
        this._itemClassDispose.value = undefined;
        const { element, label } = this;
        if (!element || !label) {
            return;
        }
        const icon = this._commandAction.checked && isICommandActionToggleInfo(item.toggled) && item.toggled.icon ? item.toggled.icon : item.icon;
        if (!icon) {
            return;
        }
        if (ThemeIcon.isThemeIcon(icon)) {
            // theme icons
            const iconClasses = ThemeIcon.asClassNameArray(icon);
            label.classList.add(...iconClasses);
            this._itemClassDispose.value = toDisposable(() => {
                label.classList.remove(...iconClasses);
            });
        }
        else {
            // icon path/url
            label.style.backgroundImage = (isDark(this._themeService.getColorTheme().type)
                ? asCSSUrl(icon.dark)
                : asCSSUrl(icon.light));
            label.classList.add('icon');
            this._itemClassDispose.value = combinedDisposable(toDisposable(() => {
                label.style.backgroundImage = '';
                label.classList.remove('icon');
            }), this._themeService.onDidColorThemeChange(() => {
                // refresh when the theme changes in case we go between dark <-> light
                this.updateClass();
            }));
        }
    }
};
MenuEntryActionViewItem = __decorate([
    __param(2, IKeybindingService),
    __param(3, INotificationService),
    __param(4, IContextKeyService),
    __param(5, IThemeService),
    __param(6, IContextMenuService)
], MenuEntryActionViewItem);
export { MenuEntryActionViewItem };
let SubmenuEntryActionViewItem = class SubmenuEntryActionViewItem extends DropdownMenuActionViewItem {
    constructor(action, options, _contextMenuService, _themeService) {
        var _a, _b;
        const dropdownOptions = Object.assign({}, options !== null && options !== void 0 ? options : Object.create(null), {
            menuAsChild: (_a = options === null || options === void 0 ? void 0 : options.menuAsChild) !== null && _a !== void 0 ? _a : false,
            classNames: (_b = options === null || options === void 0 ? void 0 : options.classNames) !== null && _b !== void 0 ? _b : (ThemeIcon.isThemeIcon(action.item.icon) ? ThemeIcon.asClassName(action.item.icon) : undefined),
        });
        super(action, { getActions: () => action.actions }, _contextMenuService, dropdownOptions);
        this._contextMenuService = _contextMenuService;
        this._themeService = _themeService;
    }
    render(container) {
        super.render(container);
        assertType(this.element);
        container.classList.add('menu-entry');
        const action = this._action;
        const { icon } = action.item;
        if (icon && !ThemeIcon.isThemeIcon(icon)) {
            this.element.classList.add('icon');
            const setBackgroundImage = () => {
                if (this.element) {
                    this.element.style.backgroundImage = (isDark(this._themeService.getColorTheme().type)
                        ? asCSSUrl(icon.dark)
                        : asCSSUrl(icon.light));
                }
            };
            setBackgroundImage();
            this._register(this._themeService.onDidColorThemeChange(() => {
                // refresh when the theme changes in case we go between dark <-> light
                setBackgroundImage();
            }));
        }
    }
};
SubmenuEntryActionViewItem = __decorate([
    __param(2, IContextMenuService),
    __param(3, IThemeService)
], SubmenuEntryActionViewItem);
export { SubmenuEntryActionViewItem };
let DropdownWithDefaultActionViewItem = class DropdownWithDefaultActionViewItem extends BaseActionViewItem {
    constructor(submenuAction, options, _keybindingService, _notificationService, _contextMenuService, _menuService, _instaService, _storageService) {
        var _a, _b, _c;
        super(null, submenuAction);
        this._keybindingService = _keybindingService;
        this._notificationService = _notificationService;
        this._contextMenuService = _contextMenuService;
        this._menuService = _menuService;
        this._instaService = _instaService;
        this._storageService = _storageService;
        this._container = null;
        this._options = options;
        this._storageKey = `${submenuAction.item.submenu.id}_lastActionId`;
        // determine default action
        let defaultAction;
        const defaultActionId = _storageService.get(this._storageKey, 1 /* StorageScope.WORKSPACE */);
        if (defaultActionId) {
            defaultAction = submenuAction.actions.find(a => defaultActionId === a.id);
        }
        if (!defaultAction) {
            defaultAction = submenuAction.actions[0];
        }
        this._defaultAction = this._instaService.createInstance(MenuEntryActionViewItem, defaultAction, { keybinding: this._getDefaultActionKeybindingLabel(defaultAction) });
        const dropdownOptions = Object.assign({}, options !== null && options !== void 0 ? options : Object.create(null), {
            menuAsChild: (_a = options === null || options === void 0 ? void 0 : options.menuAsChild) !== null && _a !== void 0 ? _a : true,
            classNames: (_b = options === null || options === void 0 ? void 0 : options.classNames) !== null && _b !== void 0 ? _b : ['codicon', 'codicon-chevron-down'],
            actionRunner: (_c = options === null || options === void 0 ? void 0 : options.actionRunner) !== null && _c !== void 0 ? _c : new ActionRunner()
        });
        this._dropdown = new DropdownMenuActionViewItem(submenuAction, submenuAction.actions, this._contextMenuService, dropdownOptions);
        this._dropdown.actionRunner.onDidRun((e) => {
            if (e.action instanceof MenuItemAction) {
                this.update(e.action);
            }
        });
    }
    update(lastAction) {
        this._storageService.store(this._storageKey, lastAction.id, 1 /* StorageScope.WORKSPACE */, 0 /* StorageTarget.USER */);
        this._defaultAction.dispose();
        this._defaultAction = this._instaService.createInstance(MenuEntryActionViewItem, lastAction, { keybinding: this._getDefaultActionKeybindingLabel(lastAction) });
        this._defaultAction.actionRunner = new class extends ActionRunner {
            runAction(action, context) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield action.run(undefined);
                });
            }
        }();
        if (this._container) {
            this._defaultAction.render(prepend(this._container, $('.action-container')));
        }
    }
    _getDefaultActionKeybindingLabel(defaultAction) {
        var _a;
        let defaultActionKeybinding;
        if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.renderKeybindingWithDefaultActionLabel) {
            const kb = this._keybindingService.lookupKeybinding(defaultAction.id);
            if (kb) {
                defaultActionKeybinding = `(${kb.getLabel()})`;
            }
        }
        return defaultActionKeybinding;
    }
    setActionContext(newContext) {
        super.setActionContext(newContext);
        this._defaultAction.setActionContext(newContext);
        this._dropdown.setActionContext(newContext);
    }
    render(container) {
        this._container = container;
        super.render(this._container);
        this._container.classList.add('monaco-dropdown-with-default');
        const primaryContainer = $('.action-container');
        this._defaultAction.render(append(this._container, primaryContainer));
        this._register(addDisposableListener(primaryContainer, EventType.KEY_DOWN, (e) => {
            const event = new StandardKeyboardEvent(e);
            if (event.equals(17 /* KeyCode.RightArrow */)) {
                this._defaultAction.element.tabIndex = -1;
                this._dropdown.focus();
                event.stopPropagation();
            }
        }));
        const dropdownContainer = $('.dropdown-action-container');
        this._dropdown.render(append(this._container, dropdownContainer));
        this._register(addDisposableListener(dropdownContainer, EventType.KEY_DOWN, (e) => {
            var _a;
            const event = new StandardKeyboardEvent(e);
            if (event.equals(15 /* KeyCode.LeftArrow */)) {
                this._defaultAction.element.tabIndex = 0;
                this._dropdown.setFocusable(false);
                (_a = this._defaultAction.element) === null || _a === void 0 ? void 0 : _a.focus();
                event.stopPropagation();
            }
        }));
    }
    focus(fromRight) {
        if (fromRight) {
            this._dropdown.focus();
        }
        else {
            this._defaultAction.element.tabIndex = 0;
            this._defaultAction.element.focus();
        }
    }
    blur() {
        this._defaultAction.element.tabIndex = -1;
        this._dropdown.blur();
        this._container.blur();
    }
    setFocusable(focusable) {
        if (focusable) {
            this._defaultAction.element.tabIndex = 0;
        }
        else {
            this._defaultAction.element.tabIndex = -1;
            this._dropdown.setFocusable(false);
        }
    }
    dispose() {
        this._defaultAction.dispose();
        this._dropdown.dispose();
        super.dispose();
    }
};
DropdownWithDefaultActionViewItem = __decorate([
    __param(2, IKeybindingService),
    __param(3, INotificationService),
    __param(4, IContextMenuService),
    __param(5, IMenuService),
    __param(6, IInstantiationService),
    __param(7, IStorageService)
], DropdownWithDefaultActionViewItem);
export { DropdownWithDefaultActionViewItem };
let SubmenuEntrySelectActionViewItem = class SubmenuEntrySelectActionViewItem extends SelectActionViewItem {
    constructor(action, contextViewService) {
        super(null, action, action.actions.map(a => ({
            text: a.id === Separator.ID ? '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500' : a.label,
            isDisabled: !a.enabled,
        })), 0, contextViewService, defaultSelectBoxStyles, { ariaLabel: action.tooltip, optionsAsChildren: true });
        this.select(Math.max(0, action.actions.findIndex(a => a.checked)));
    }
    render(container) {
        super.render(container);
        container.style.borderColor = asCssVariable(selectBorder);
    }
    runAction(option, index) {
        const action = this.action.actions[index];
        if (action) {
            this.actionRunner.run(action);
        }
    }
};
SubmenuEntrySelectActionViewItem = __decorate([
    __param(1, IContextViewService)
], SubmenuEntrySelectActionViewItem);
/**
 * Creates action view items for menu actions or submenu actions.
 */
export function createActionViewItem(instaService, action, options) {
    if (action instanceof MenuItemAction) {
        return instaService.createInstance(MenuEntryActionViewItem, action, options);
    }
    else if (action instanceof SubmenuItemAction) {
        if (action.item.isSelection) {
            return instaService.createInstance(SubmenuEntrySelectActionViewItem, action);
        }
        else {
            if (action.item.rememberDefaultAction) {
                return instaService.createInstance(DropdownWithDefaultActionViewItem, action, options);
            }
            else {
                return instaService.createInstance(SubmenuEntryActionViewItem, action, options);
            }
        }
    }
    else {
        return undefined;
    }
}
