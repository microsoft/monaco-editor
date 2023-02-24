/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { $, addDisposableListener, EventType, getActiveElement, isAncestor, isHTMLElement } from '../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent.js';
import { Menu } from '../../../base/browser/ui/menu/menu.js';
import { ActionRunner } from '../../../base/common/actions.js';
import { isCancellationError } from '../../../base/common/errors.js';
import { combinedDisposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { defaultMenuStyles } from '../../theme/browser/defaultStyles.js';
export class ContextMenuHandler {
    constructor(contextViewService, telemetryService, notificationService, keybindingService) {
        this.contextViewService = contextViewService;
        this.telemetryService = telemetryService;
        this.notificationService = notificationService;
        this.keybindingService = keybindingService;
        this.focusToReturn = null;
        this.lastContainer = null;
        this.block = null;
        this.blockDisposable = null;
        this.options = { blockMouse: true };
    }
    configure(options) {
        this.options = options;
    }
    showContextMenu(delegate) {
        const actions = delegate.getActions();
        if (!actions.length) {
            return; // Don't render an empty context menu
        }
        this.focusToReturn = document.activeElement;
        let menu;
        const shadowRootElement = isHTMLElement(delegate.domForShadowRoot) ? delegate.domForShadowRoot : undefined;
        this.contextViewService.showContextView({
            getAnchor: () => delegate.getAnchor(),
            canRelayout: false,
            anchorAlignment: delegate.anchorAlignment,
            anchorAxisAlignment: delegate.anchorAxisAlignment,
            render: (container) => {
                var _a;
                this.lastContainer = container;
                const className = delegate.getMenuClassName ? delegate.getMenuClassName() : '';
                if (className) {
                    container.className += ' ' + className;
                }
                // Render invisible div to block mouse interaction in the rest of the UI
                if (this.options.blockMouse) {
                    this.block = container.appendChild($('.context-view-block'));
                    this.block.style.position = 'fixed';
                    this.block.style.cursor = 'initial';
                    this.block.style.left = '0';
                    this.block.style.top = '0';
                    this.block.style.width = '100%';
                    this.block.style.height = '100%';
                    this.block.style.zIndex = '-1';
                    (_a = this.blockDisposable) === null || _a === void 0 ? void 0 : _a.dispose();
                    this.blockDisposable = addDisposableListener(this.block, EventType.MOUSE_DOWN, e => e.stopPropagation());
                }
                const menuDisposables = new DisposableStore();
                const actionRunner = delegate.actionRunner || new ActionRunner();
                actionRunner.onWillRun(evt => this.onActionRun(evt, !delegate.skipTelemetry), this, menuDisposables);
                actionRunner.onDidRun(this.onDidActionRun, this, menuDisposables);
                menu = new Menu(container, actions, {
                    actionViewItemProvider: delegate.getActionViewItem,
                    context: delegate.getActionsContext ? delegate.getActionsContext() : null,
                    actionRunner,
                    getKeyBinding: delegate.getKeyBinding ? delegate.getKeyBinding : action => this.keybindingService.lookupKeybinding(action.id)
                }, defaultMenuStyles);
                menu.onDidCancel(() => this.contextViewService.hideContextView(true), null, menuDisposables);
                menu.onDidBlur(() => this.contextViewService.hideContextView(true), null, menuDisposables);
                menuDisposables.add(addDisposableListener(window, EventType.BLUR, () => this.contextViewService.hideContextView(true)));
                menuDisposables.add(addDisposableListener(window, EventType.MOUSE_DOWN, (e) => {
                    if (e.defaultPrevented) {
                        return;
                    }
                    const event = new StandardMouseEvent(e);
                    let element = event.target;
                    // Don't do anything as we are likely creating a context menu
                    if (event.rightButton) {
                        return;
                    }
                    while (element) {
                        if (element === container) {
                            return;
                        }
                        element = element.parentElement;
                    }
                    this.contextViewService.hideContextView(true);
                }));
                return combinedDisposable(menuDisposables, menu);
            },
            focus: () => {
                menu === null || menu === void 0 ? void 0 : menu.focus(!!delegate.autoSelectFirstItem);
            },
            onHide: (didCancel) => {
                var _a, _b, _c;
                (_a = delegate.onHide) === null || _a === void 0 ? void 0 : _a.call(delegate, !!didCancel);
                if (this.block) {
                    this.block.remove();
                    this.block = null;
                }
                (_b = this.blockDisposable) === null || _b === void 0 ? void 0 : _b.dispose();
                this.blockDisposable = null;
                if (!!this.lastContainer && (getActiveElement() === this.lastContainer || isAncestor(getActiveElement(), this.lastContainer))) {
                    (_c = this.focusToReturn) === null || _c === void 0 ? void 0 : _c.focus();
                }
                this.lastContainer = null;
            }
        }, shadowRootElement, !!shadowRootElement);
    }
    onActionRun(e, logTelemetry) {
        if (logTelemetry) {
            this.telemetryService.publicLog2('workbenchActionExecuted', { id: e.action.id, from: 'contextMenu' });
        }
        this.contextViewService.hideContextView(false);
    }
    onDidActionRun(e) {
        if (e.error && !isCancellationError(e.error)) {
            this.notificationService.error(e.error);
        }
    }
}
