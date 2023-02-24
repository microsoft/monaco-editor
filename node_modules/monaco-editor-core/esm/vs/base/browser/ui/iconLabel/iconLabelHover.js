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
import * as dom from '../../dom.js';
import { TimeoutTimer } from '../../../common/async.js';
import { CancellationTokenSource } from '../../../common/cancellation.js';
import { isMarkdownString } from '../../../common/htmlContent.js';
import { stripIcons } from '../../../common/iconLabels.js';
import { DisposableStore } from '../../../common/lifecycle.js';
import { isFunction, isString } from '../../../common/types.js';
import { localize } from '../../../../nls.js';
export function setupNativeHover(htmlElement, tooltip) {
    if (isString(tooltip)) {
        // Icons don't render in the native hover so we strip them out
        htmlElement.title = stripIcons(tooltip);
    }
    else if (tooltip === null || tooltip === void 0 ? void 0 : tooltip.markdownNotSupportedFallback) {
        htmlElement.title = tooltip.markdownNotSupportedFallback;
    }
    else {
        htmlElement.removeAttribute('title');
    }
}
class UpdatableHoverWidget {
    constructor(hoverDelegate, target, fadeInAnimation) {
        this.hoverDelegate = hoverDelegate;
        this.target = target;
        this.fadeInAnimation = fadeInAnimation;
    }
    update(content, focus, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this._cancellationTokenSource) {
                // there's an computation ongoing, cancel it
                this._cancellationTokenSource.dispose(true);
                this._cancellationTokenSource = undefined;
            }
            if (this.isDisposed) {
                return;
            }
            let resolvedContent;
            if (content === undefined || isString(content) || content instanceof HTMLElement) {
                resolvedContent = content;
            }
            else if (!isFunction(content.markdown)) {
                resolvedContent = (_a = content.markdown) !== null && _a !== void 0 ? _a : content.markdownNotSupportedFallback;
            }
            else {
                // compute the content, potentially long-running
                // show 'Loading' if no hover is up yet
                if (!this._hoverWidget) {
                    this.show(localize('iconLabel.loading', "Loading..."), focus);
                }
                // compute the content
                this._cancellationTokenSource = new CancellationTokenSource();
                const token = this._cancellationTokenSource.token;
                resolvedContent = yield content.markdown(token);
                if (resolvedContent === undefined) {
                    resolvedContent = content.markdownNotSupportedFallback;
                }
                if (this.isDisposed || token.isCancellationRequested) {
                    // either the widget has been closed in the meantime
                    // or there has been a new call to `update`
                    return;
                }
            }
            this.show(resolvedContent, focus, options);
        });
    }
    show(content, focus, options) {
        const oldHoverWidget = this._hoverWidget;
        if (this.hasContent(content)) {
            const hoverOptions = Object.assign({ content, target: this.target, showPointer: this.hoverDelegate.placement === 'element', hoverPosition: 2 /* HoverPosition.BELOW */, skipFadeInAnimation: !this.fadeInAnimation || !!oldHoverWidget }, options);
            this._hoverWidget = this.hoverDelegate.showHover(hoverOptions, focus);
        }
        oldHoverWidget === null || oldHoverWidget === void 0 ? void 0 : oldHoverWidget.dispose();
    }
    hasContent(content) {
        if (!content) {
            return false;
        }
        if (isMarkdownString(content)) {
            return !!content.value;
        }
        return true;
    }
    get isDisposed() {
        var _a;
        return (_a = this._hoverWidget) === null || _a === void 0 ? void 0 : _a.isDisposed;
    }
    dispose() {
        var _a, _b;
        (_a = this._hoverWidget) === null || _a === void 0 ? void 0 : _a.dispose();
        (_b = this._cancellationTokenSource) === null || _b === void 0 ? void 0 : _b.dispose(true);
        this._cancellationTokenSource = undefined;
    }
}
export function setupCustomHover(hoverDelegate, htmlElement, content, options) {
    let hoverPreparation;
    let hoverWidget;
    const hideHover = (disposeWidget, disposePreparation) => {
        var _a;
        const hadHover = hoverWidget !== undefined;
        if (disposeWidget) {
            hoverWidget === null || hoverWidget === void 0 ? void 0 : hoverWidget.dispose();
            hoverWidget = undefined;
        }
        if (disposePreparation) {
            hoverPreparation === null || hoverPreparation === void 0 ? void 0 : hoverPreparation.dispose();
            hoverPreparation = undefined;
        }
        if (hadHover) {
            (_a = hoverDelegate.onDidHideHover) === null || _a === void 0 ? void 0 : _a.call(hoverDelegate);
        }
    };
    const triggerShowHover = (delay, focus, target) => {
        return new TimeoutTimer(() => __awaiter(this, void 0, void 0, function* () {
            if (!hoverWidget || hoverWidget.isDisposed) {
                hoverWidget = new UpdatableHoverWidget(hoverDelegate, target || htmlElement, delay > 0);
                yield hoverWidget.update(content, focus, options);
            }
        }), delay);
    };
    const onMouseOver = () => {
        if (hoverPreparation) {
            return;
        }
        const toDispose = new DisposableStore();
        const onMouseLeave = (e) => hideHover(false, e.fromElement === htmlElement);
        toDispose.add(dom.addDisposableListener(htmlElement, dom.EventType.MOUSE_LEAVE, onMouseLeave, true));
        const onMouseDown = () => hideHover(true, true);
        toDispose.add(dom.addDisposableListener(htmlElement, dom.EventType.MOUSE_DOWN, onMouseDown, true));
        const target = {
            targetElements: [htmlElement],
            dispose: () => { }
        };
        if (hoverDelegate.placement === undefined || hoverDelegate.placement === 'mouse') {
            // track the mouse position
            const onMouseMove = (e) => {
                target.x = e.x + 10;
                if ((e.target instanceof HTMLElement) && e.target.classList.contains('action-label')) {
                    hideHover(true, true);
                }
            };
            toDispose.add(dom.addDisposableListener(htmlElement, dom.EventType.MOUSE_MOVE, onMouseMove, true));
        }
        toDispose.add(triggerShowHover(hoverDelegate.delay, false, target));
        hoverPreparation = toDispose;
    };
    const mouseOverDomEmitter = dom.addDisposableListener(htmlElement, dom.EventType.MOUSE_OVER, onMouseOver, true);
    const hover = {
        show: focus => {
            hideHover(false, true); // terminate a ongoing mouse over preparation
            triggerShowHover(0, focus); // show hover immediately
        },
        hide: () => {
            hideHover(true, true);
        },
        update: (newContent, hoverOptions) => __awaiter(this, void 0, void 0, function* () {
            content = newContent;
            yield (hoverWidget === null || hoverWidget === void 0 ? void 0 : hoverWidget.update(content, undefined, hoverOptions));
        }),
        dispose: () => {
            mouseOverDomEmitter.dispose();
            hideHover(true, true);
        }
    };
    return hover;
}
