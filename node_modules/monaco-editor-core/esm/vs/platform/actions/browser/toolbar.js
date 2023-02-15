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
import { addDisposableListener } from '../../../base/browser/dom.js';
import { ToolBar } from '../../../base/browser/ui/toolbar/toolbar.js';
import { Separator, toAction } from '../../../base/common/actions.js';
import { coalesceInPlace } from '../../../base/common/arrays.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { localize } from '../../../nls.js';
import { IMenuService, MenuItemAction, SubmenuItemAction } from '../common/actions.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { IContextMenuService } from '../../contextview/browser/contextView.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
/**
 * The `WorkbenchToolBar` does
 * - support hiding of menu items
 * - lookup keybindings for each actions automatically
 * - send `workbenchActionExecuted`-events for each action
 *
 * See {@link MenuWorkbenchToolBar} for a toolbar that is backed by a menu.
 */
let WorkbenchToolBar = class WorkbenchToolBar extends ToolBar {
    constructor(container, _options, _menuService, _contextKeyService, _contextMenuService, keybindingService, telemetryService) {
        super(container, _contextMenuService, Object.assign(Object.assign({ 
            // defaults
            getKeyBinding: (action) => { var _a; return (_a = keybindingService.lookupKeybinding(action.id)) !== null && _a !== void 0 ? _a : undefined; } }, _options), { 
            // mandatory (overide options)
            allowContextMenu: true }));
        this._options = _options;
        this._menuService = _menuService;
        this._contextKeyService = _contextKeyService;
        this._contextMenuService = _contextMenuService;
        this._sessionDisposables = this._store.add(new DisposableStore());
        // telemetry logic
        if (_options === null || _options === void 0 ? void 0 : _options.telemetrySource) {
            this._store.add(this.actionBar.onDidRun(e => telemetryService.publicLog2('workbenchActionExecuted', { id: e.action.id, from: _options.telemetrySource })));
        }
    }
    setActions(_primary, _secondary = [], menuIds) {
        var _a, _b, _c;
        this._sessionDisposables.clear();
        const primary = _primary.slice();
        const secondary = _secondary.slice();
        const toggleActions = [];
        let toggleActionsCheckedCount = 0;
        const extraSecondary = [];
        let someAreHidden = false;
        // unless disabled, move all hidden items to secondary group or ignore them
        if (((_a = this._options) === null || _a === void 0 ? void 0 : _a.hiddenItemStrategy) !== -1 /* HiddenItemStrategy.NoHide */) {
            for (let i = 0; i < primary.length; i++) {
                const action = primary[i];
                if (!(action instanceof MenuItemAction) && !(action instanceof SubmenuItemAction)) {
                    // console.warn(`Action ${action.id}/${action.label} is not a MenuItemAction`);
                    continue;
                }
                if (!action.hideActions) {
                    continue;
                }
                // collect all toggle actions
                toggleActions.push(action.hideActions.toggle);
                if (action.hideActions.toggle.checked) {
                    toggleActionsCheckedCount++;
                }
                // hidden items move into overflow or ignore
                if (action.hideActions.isHidden) {
                    someAreHidden = true;
                    primary[i] = undefined;
                    if (((_b = this._options) === null || _b === void 0 ? void 0 : _b.hiddenItemStrategy) !== 0 /* HiddenItemStrategy.Ignore */) {
                        extraSecondary[i] = action;
                    }
                }
            }
        }
        // count for max
        if (((_c = this._options) === null || _c === void 0 ? void 0 : _c.maxNumberOfItems) !== undefined) {
            let count = 0;
            for (let i = 0; i < primary.length; i++) {
                const action = primary[i];
                if (!action) {
                    continue;
                }
                if (++count >= this._options.maxNumberOfItems) {
                    primary[i] = undefined;
                    extraSecondary[i] = action;
                }
            }
        }
        coalesceInPlace(primary);
        coalesceInPlace(extraSecondary);
        super.setActions(primary, Separator.join(extraSecondary, secondary));
        // add context menu for toggle actions
        if (toggleActions.length > 0) {
            this._sessionDisposables.add(addDisposableListener(this.getElement(), 'contextmenu', e => {
                var _a, _b, _c, _d;
                const action = this.getItemAction(e.target);
                if (!(action)) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                let noHide = false;
                // last item cannot be hidden when using ignore strategy
                if (toggleActionsCheckedCount === 1 && ((_a = this._options) === null || _a === void 0 ? void 0 : _a.hiddenItemStrategy) === 0 /* HiddenItemStrategy.Ignore */) {
                    noHide = true;
                    for (let i = 0; i < toggleActions.length; i++) {
                        if (toggleActions[i].checked) {
                            toggleActions[i] = toAction({
                                id: action.id,
                                label: action.label,
                                checked: true,
                                enabled: false,
                                run() { }
                            });
                            break; // there is only one
                        }
                    }
                }
                // add "hide foo" actions
                let hideAction;
                if (!noHide && (action instanceof MenuItemAction || action instanceof SubmenuItemAction)) {
                    if (!action.hideActions) {
                        // no context menu for MenuItemAction instances that support no hiding
                        // those are fake actions and need to be cleaned up
                        return;
                    }
                    hideAction = action.hideActions.hide;
                }
                else {
                    hideAction = toAction({
                        id: 'label',
                        label: localize('hide', "Hide"),
                        enabled: false,
                        run() { }
                    });
                }
                const actions = Separator.join([hideAction], toggleActions);
                // add "Reset Menu" action
                if (((_b = this._options) === null || _b === void 0 ? void 0 : _b.resetMenu) && !menuIds) {
                    menuIds = [this._options.resetMenu];
                }
                if (someAreHidden && menuIds) {
                    actions.push(new Separator());
                    actions.push(toAction({
                        id: 'resetThisMenu',
                        label: localize('resetThisMenu', "Reset Menu"),
                        run: () => this._menuService.resetHiddenStates(menuIds)
                    }));
                }
                this._contextMenuService.showContextMenu({
                    getAnchor: () => e,
                    getActions: () => actions,
                    // add context menu actions (iff appicable)
                    menuId: (_c = this._options) === null || _c === void 0 ? void 0 : _c.contextMenu,
                    menuActionOptions: Object.assign({ renderShortTitle: true }, (_d = this._options) === null || _d === void 0 ? void 0 : _d.menuOptions),
                    contextKeyService: this._contextKeyService,
                });
            }));
        }
    }
};
WorkbenchToolBar = __decorate([
    __param(2, IMenuService),
    __param(3, IContextKeyService),
    __param(4, IContextMenuService),
    __param(5, IKeybindingService),
    __param(6, ITelemetryService)
], WorkbenchToolBar);
export { WorkbenchToolBar };
