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
import * as DOM from '../../dom.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { ActionViewItem, BaseActionViewItem } from './actionViewItems.js';
import { ActionRunner, Separator } from '../../../common/actions.js';
import { Emitter } from '../../../common/event.js';
import { Disposable, DisposableMap, DisposableStore, dispose } from '../../../common/lifecycle.js';
import * as types from '../../../common/types.js';
import './actionbar.css';
export class ActionBar extends Disposable {
    constructor(container, options = {}) {
        var _a, _b, _c, _d, _e, _f;
        super();
        this._actionRunnerDisposables = this._register(new DisposableStore());
        this.viewItemDisposables = this._register(new DisposableMap());
        // Trigger Key Tracking
        this.triggerKeyDown = false;
        this.focusable = true;
        this._onDidBlur = this._register(new Emitter());
        this.onDidBlur = this._onDidBlur.event;
        this._onDidCancel = this._register(new Emitter({ onWillAddFirstListener: () => this.cancelHasListener = true }));
        this.onDidCancel = this._onDidCancel.event;
        this.cancelHasListener = false;
        this._onDidRun = this._register(new Emitter());
        this.onDidRun = this._onDidRun.event;
        this._onWillRun = this._register(new Emitter());
        this.onWillRun = this._onWillRun.event;
        this.options = options;
        this._context = (_a = options.context) !== null && _a !== void 0 ? _a : null;
        this._orientation = (_b = this.options.orientation) !== null && _b !== void 0 ? _b : 0 /* ActionsOrientation.HORIZONTAL */;
        this._triggerKeys = {
            keyDown: (_d = (_c = this.options.triggerKeys) === null || _c === void 0 ? void 0 : _c.keyDown) !== null && _d !== void 0 ? _d : false,
            keys: (_f = (_e = this.options.triggerKeys) === null || _e === void 0 ? void 0 : _e.keys) !== null && _f !== void 0 ? _f : [3 /* KeyCode.Enter */, 10 /* KeyCode.Space */]
        };
        if (this.options.actionRunner) {
            this._actionRunner = this.options.actionRunner;
        }
        else {
            this._actionRunner = new ActionRunner();
            this._actionRunnerDisposables.add(this._actionRunner);
        }
        this._actionRunnerDisposables.add(this._actionRunner.onDidRun(e => this._onDidRun.fire(e)));
        this._actionRunnerDisposables.add(this._actionRunner.onWillRun(e => this._onWillRun.fire(e)));
        this.viewItems = [];
        this.focusedItem = undefined;
        this.domNode = document.createElement('div');
        this.domNode.className = 'monaco-action-bar';
        if (options.animated !== false) {
            this.domNode.classList.add('animated');
        }
        let previousKeys;
        let nextKeys;
        switch (this._orientation) {
            case 0 /* ActionsOrientation.HORIZONTAL */:
                previousKeys = [15 /* KeyCode.LeftArrow */];
                nextKeys = [17 /* KeyCode.RightArrow */];
                break;
            case 1 /* ActionsOrientation.VERTICAL */:
                previousKeys = [16 /* KeyCode.UpArrow */];
                nextKeys = [18 /* KeyCode.DownArrow */];
                this.domNode.className += ' vertical';
                break;
        }
        this._register(DOM.addDisposableListener(this.domNode, DOM.EventType.KEY_DOWN, e => {
            const event = new StandardKeyboardEvent(e);
            let eventHandled = true;
            const focusedItem = typeof this.focusedItem === 'number' ? this.viewItems[this.focusedItem] : undefined;
            if (previousKeys && (event.equals(previousKeys[0]) || event.equals(previousKeys[1]))) {
                eventHandled = this.focusPrevious();
            }
            else if (nextKeys && (event.equals(nextKeys[0]) || event.equals(nextKeys[1]))) {
                eventHandled = this.focusNext();
            }
            else if (event.equals(9 /* KeyCode.Escape */) && this.cancelHasListener) {
                this._onDidCancel.fire();
            }
            else if (event.equals(14 /* KeyCode.Home */)) {
                eventHandled = this.focusFirst();
            }
            else if (event.equals(13 /* KeyCode.End */)) {
                eventHandled = this.focusLast();
            }
            else if (event.equals(2 /* KeyCode.Tab */) && focusedItem instanceof BaseActionViewItem && focusedItem.trapsArrowNavigation) {
                eventHandled = this.focusNext();
            }
            else if (this.isTriggerKeyEvent(event)) {
                // Staying out of the else branch even if not triggered
                if (this._triggerKeys.keyDown) {
                    this.doTrigger(event);
                }
                else {
                    this.triggerKeyDown = true;
                }
            }
            else {
                eventHandled = false;
            }
            if (eventHandled) {
                event.preventDefault();
                event.stopPropagation();
            }
        }));
        this._register(DOM.addDisposableListener(this.domNode, DOM.EventType.KEY_UP, e => {
            const event = new StandardKeyboardEvent(e);
            // Run action on Enter/Space
            if (this.isTriggerKeyEvent(event)) {
                if (!this._triggerKeys.keyDown && this.triggerKeyDown) {
                    this.triggerKeyDown = false;
                    this.doTrigger(event);
                }
                event.preventDefault();
                event.stopPropagation();
            }
            // Recompute focused item
            else if (event.equals(2 /* KeyCode.Tab */) || event.equals(1024 /* KeyMod.Shift */ | 2 /* KeyCode.Tab */)) {
                this.updateFocusedItem();
            }
        }));
        this.focusTracker = this._register(DOM.trackFocus(this.domNode));
        this._register(this.focusTracker.onDidBlur(() => {
            if (DOM.getActiveElement() === this.domNode || !DOM.isAncestor(DOM.getActiveElement(), this.domNode)) {
                this._onDidBlur.fire();
                this.focusedItem = undefined;
                this.previouslyFocusedItem = undefined;
                this.triggerKeyDown = false;
            }
        }));
        this._register(this.focusTracker.onDidFocus(() => this.updateFocusedItem()));
        this.actionsList = document.createElement('ul');
        this.actionsList.className = 'actions-container';
        this.actionsList.setAttribute('role', this.options.ariaRole || 'toolbar');
        if (this.options.ariaLabel) {
            this.actionsList.setAttribute('aria-label', this.options.ariaLabel);
        }
        this.domNode.appendChild(this.actionsList);
        container.appendChild(this.domNode);
    }
    refreshRole() {
        if (this.length() >= 2) {
            this.actionsList.setAttribute('role', this.options.ariaRole || 'toolbar');
        }
        else {
            this.actionsList.setAttribute('role', 'presentation');
        }
    }
    // Some action bars should not be focusable at times
    // When an action bar is not focusable make sure to make all the elements inside it not focusable
    // When an action bar is focusable again, make sure the first item can be focused
    setFocusable(focusable) {
        this.focusable = focusable;
        if (this.focusable) {
            const firstEnabled = this.viewItems.find(vi => vi instanceof BaseActionViewItem && vi.isEnabled());
            if (firstEnabled instanceof BaseActionViewItem) {
                firstEnabled.setFocusable(true);
            }
        }
        else {
            this.viewItems.forEach(vi => {
                if (vi instanceof BaseActionViewItem) {
                    vi.setFocusable(false);
                }
            });
        }
    }
    isTriggerKeyEvent(event) {
        let ret = false;
        this._triggerKeys.keys.forEach(keyCode => {
            ret = ret || event.equals(keyCode);
        });
        return ret;
    }
    updateFocusedItem() {
        for (let i = 0; i < this.actionsList.children.length; i++) {
            const elem = this.actionsList.children[i];
            if (DOM.isAncestor(DOM.getActiveElement(), elem)) {
                this.focusedItem = i;
                break;
            }
        }
    }
    get context() {
        return this._context;
    }
    set context(context) {
        this._context = context;
        this.viewItems.forEach(i => i.setActionContext(context));
    }
    get actionRunner() {
        return this._actionRunner;
    }
    set actionRunner(actionRunner) {
        this._actionRunner = actionRunner;
        // when setting a new `IActionRunner` make sure to dispose old listeners and
        // start to forward events from the new listener
        this._actionRunnerDisposables.clear();
        this._actionRunnerDisposables.add(this._actionRunner.onDidRun(e => this._onDidRun.fire(e)));
        this._actionRunnerDisposables.add(this._actionRunner.onWillRun(e => this._onWillRun.fire(e)));
        this.viewItems.forEach(item => item.actionRunner = actionRunner);
    }
    getContainer() {
        return this.domNode;
    }
    getAction(indexOrElement) {
        var _a;
        // by index
        if (typeof indexOrElement === 'number') {
            return (_a = this.viewItems[indexOrElement]) === null || _a === void 0 ? void 0 : _a.action;
        }
        // by element
        if (indexOrElement instanceof HTMLElement) {
            while (indexOrElement.parentElement !== this.actionsList) {
                if (!indexOrElement.parentElement) {
                    return undefined;
                }
                indexOrElement = indexOrElement.parentElement;
            }
            for (let i = 0; i < this.actionsList.childNodes.length; i++) {
                if (this.actionsList.childNodes[i] === indexOrElement) {
                    return this.viewItems[i].action;
                }
            }
        }
        return undefined;
    }
    push(arg, options = {}) {
        const actions = Array.isArray(arg) ? arg : [arg];
        let index = types.isNumber(options.index) ? options.index : null;
        actions.forEach((action) => {
            const actionViewItemElement = document.createElement('li');
            actionViewItemElement.className = 'action-item';
            actionViewItemElement.setAttribute('role', 'presentation');
            let item;
            const viewItemOptions = Object.assign({ hoverDelegate: this.options.hoverDelegate }, options);
            if (this.options.actionViewItemProvider) {
                item = this.options.actionViewItemProvider(action, viewItemOptions);
            }
            if (!item) {
                item = new ActionViewItem(this.context, action, viewItemOptions);
            }
            // Prevent native context menu on actions
            if (!this.options.allowContextMenu) {
                this.viewItemDisposables.set(item, DOM.addDisposableListener(actionViewItemElement, DOM.EventType.CONTEXT_MENU, (e) => {
                    DOM.EventHelper.stop(e, true);
                }));
            }
            item.actionRunner = this._actionRunner;
            item.setActionContext(this.context);
            item.render(actionViewItemElement);
            if (this.focusable && item instanceof BaseActionViewItem && this.viewItems.length === 0) {
                // We need to allow for the first enabled item to be focused on using tab navigation #106441
                item.setFocusable(true);
            }
            if (index === null || index < 0 || index >= this.actionsList.children.length) {
                this.actionsList.appendChild(actionViewItemElement);
                this.viewItems.push(item);
            }
            else {
                this.actionsList.insertBefore(actionViewItemElement, this.actionsList.children[index]);
                this.viewItems.splice(index, 0, item);
                index++;
            }
        });
        if (typeof this.focusedItem === 'number') {
            // After a clear actions might be re-added to simply toggle some actions. We should preserve focus #97128
            this.focus(this.focusedItem);
        }
        this.refreshRole();
    }
    clear() {
        if (this.isEmpty()) {
            return;
        }
        this.viewItems = dispose(this.viewItems);
        this.viewItemDisposables.clearAndDisposeAll();
        DOM.clearNode(this.actionsList);
        this.refreshRole();
    }
    length() {
        return this.viewItems.length;
    }
    isEmpty() {
        return this.viewItems.length === 0;
    }
    focus(arg) {
        let selectFirst = false;
        let index = undefined;
        if (arg === undefined) {
            selectFirst = true;
        }
        else if (typeof arg === 'number') {
            index = arg;
        }
        else if (typeof arg === 'boolean') {
            selectFirst = arg;
        }
        if (selectFirst && typeof this.focusedItem === 'undefined') {
            const firstEnabled = this.viewItems.findIndex(item => item.isEnabled());
            // Focus the first enabled item
            this.focusedItem = firstEnabled === -1 ? undefined : firstEnabled;
            this.updateFocus(undefined, undefined, true);
        }
        else {
            if (index !== undefined) {
                this.focusedItem = index;
            }
            this.updateFocus(undefined, undefined, true);
        }
    }
    focusFirst() {
        this.focusedItem = this.length() - 1;
        return this.focusNext(true);
    }
    focusLast() {
        this.focusedItem = 0;
        return this.focusPrevious(true);
    }
    focusNext(forceLoop) {
        if (typeof this.focusedItem === 'undefined') {
            this.focusedItem = this.viewItems.length - 1;
        }
        else if (this.viewItems.length <= 1) {
            return false;
        }
        const startIndex = this.focusedItem;
        let item;
        do {
            if (!forceLoop && this.options.preventLoopNavigation && this.focusedItem + 1 >= this.viewItems.length) {
                this.focusedItem = startIndex;
                return false;
            }
            this.focusedItem = (this.focusedItem + 1) % this.viewItems.length;
            item = this.viewItems[this.focusedItem];
        } while (this.focusedItem !== startIndex && ((this.options.focusOnlyEnabledItems && !item.isEnabled()) || item.action.id === Separator.ID));
        this.updateFocus();
        return true;
    }
    focusPrevious(forceLoop) {
        if (typeof this.focusedItem === 'undefined') {
            this.focusedItem = 0;
        }
        else if (this.viewItems.length <= 1) {
            return false;
        }
        const startIndex = this.focusedItem;
        let item;
        do {
            this.focusedItem = this.focusedItem - 1;
            if (this.focusedItem < 0) {
                if (!forceLoop && this.options.preventLoopNavigation) {
                    this.focusedItem = startIndex;
                    return false;
                }
                this.focusedItem = this.viewItems.length - 1;
            }
            item = this.viewItems[this.focusedItem];
        } while (this.focusedItem !== startIndex && ((this.options.focusOnlyEnabledItems && !item.isEnabled()) || item.action.id === Separator.ID));
        this.updateFocus(true);
        return true;
    }
    updateFocus(fromRight, preventScroll, forceFocus = false) {
        var _a;
        if (typeof this.focusedItem === 'undefined') {
            this.actionsList.focus({ preventScroll });
        }
        if (this.previouslyFocusedItem !== undefined && this.previouslyFocusedItem !== this.focusedItem) {
            (_a = this.viewItems[this.previouslyFocusedItem]) === null || _a === void 0 ? void 0 : _a.blur();
        }
        const actionViewItem = this.focusedItem !== undefined && this.viewItems[this.focusedItem];
        if (actionViewItem) {
            let focusItem = true;
            if (!types.isFunction(actionViewItem.focus)) {
                focusItem = false;
            }
            if (this.options.focusOnlyEnabledItems && types.isFunction(actionViewItem.isEnabled) && !actionViewItem.isEnabled()) {
                focusItem = false;
            }
            if (actionViewItem.action.id === Separator.ID) {
                focusItem = false;
            }
            if (!focusItem) {
                this.actionsList.focus({ preventScroll });
                this.previouslyFocusedItem = undefined;
            }
            else if (forceFocus || this.previouslyFocusedItem !== this.focusedItem) {
                actionViewItem.focus(fromRight);
                this.previouslyFocusedItem = this.focusedItem;
            }
        }
    }
    doTrigger(event) {
        if (typeof this.focusedItem === 'undefined') {
            return; //nothing to focus
        }
        // trigger action
        const actionViewItem = this.viewItems[this.focusedItem];
        if (actionViewItem instanceof BaseActionViewItem) {
            const context = (actionViewItem._context === null || actionViewItem._context === undefined) ? event : actionViewItem._context;
            this.run(actionViewItem._action, context);
        }
    }
    run(action, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._actionRunner.run(action, context);
        });
    }
    dispose() {
        this._context = undefined;
        this.viewItems = dispose(this.viewItems);
        this.getContainer().remove();
        super.dispose();
    }
}
