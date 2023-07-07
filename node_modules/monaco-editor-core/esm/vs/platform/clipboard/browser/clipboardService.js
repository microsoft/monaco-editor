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
import { isSafari, isWebkitWebView } from '../../../base/browser/browser.js';
import { $, addDisposableListener } from '../../../base/browser/dom.js';
import { DeferredPromise } from '../../../base/common/async.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { ILayoutService } from '../../layout/browser/layoutService.js';
import { ILogService } from '../../log/common/log.js';
export let BrowserClipboardService = class BrowserClipboardService extends Disposable {
    constructor(layoutService, logService) {
        super();
        this.layoutService = layoutService;
        this.logService = logService;
        this.mapTextToType = new Map(); // unsupported in web (only in-memory)
        this.findText = ''; // unsupported in web (only in-memory)
        this.resources = []; // unsupported in web (only in-memory)
        if (isSafari || isWebkitWebView) {
            this.installWebKitWriteTextWorkaround();
        }
    }
    // In Safari, it has the following note:
    //
    // "The request to write to the clipboard must be triggered during a user gesture.
    // A call to clipboard.write or clipboard.writeText outside the scope of a user
    // gesture(such as "click" or "touch" event handlers) will result in the immediate
    // rejection of the promise returned by the API call."
    // From: https://webkit.org/blog/10855/async-clipboard-api/
    //
    // Since extensions run in a web worker, and handle gestures in an asynchronous way,
    // they are not classified by Safari as "in response to a user gesture" and will reject.
    //
    // This function sets up some handlers to work around that behavior.
    installWebKitWriteTextWorkaround() {
        const handler = () => {
            const currentWritePromise = new DeferredPromise();
            // Cancel the previous promise since we just created a new one in response to this new event
            if (this.webKitPendingClipboardWritePromise && !this.webKitPendingClipboardWritePromise.isSettled) {
                this.webKitPendingClipboardWritePromise.cancel();
            }
            this.webKitPendingClipboardWritePromise = currentWritePromise;
            // The ctor of ClipboardItem allows you to pass in a promise that will resolve to a string.
            // This allows us to pass in a Promise that will either be cancelled by another event or
            // resolved with the contents of the first call to this.writeText.
            // see https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem/ClipboardItem#parameters
            navigator.clipboard.write([new ClipboardItem({
                    'text/plain': currentWritePromise.p,
                })]).catch((err) => __awaiter(this, void 0, void 0, function* () {
                if (!(err instanceof Error) || err.name !== 'NotAllowedError' || !currentWritePromise.isRejected) {
                    this.logService.error(err);
                }
            }));
        };
        if (this.layoutService.hasContainer) {
            this._register(addDisposableListener(this.layoutService.container, 'click', handler));
            this._register(addDisposableListener(this.layoutService.container, 'keydown', handler));
        }
    }
    writeText(text, type) {
        return __awaiter(this, void 0, void 0, function* () {
            // With type: only in-memory is supported
            if (type) {
                this.mapTextToType.set(type, text);
                return;
            }
            if (this.webKitPendingClipboardWritePromise) {
                // For Safari, we complete this Promise which allows the call to `navigator.clipboard.write()`
                // above to resolve and successfully copy to the clipboard. If we let this continue, Safari
                // would throw an error because this call stack doesn't appear to originate from a user gesture.
                return this.webKitPendingClipboardWritePromise.complete(text);
            }
            // Guard access to navigator.clipboard with try/catch
            // as we have seen DOMExceptions in certain browsers
            // due to security policies.
            try {
                return yield navigator.clipboard.writeText(text);
            }
            catch (error) {
                console.error(error);
            }
            // Fallback to textarea and execCommand solution
            const activeElement = document.activeElement;
            const textArea = document.body.appendChild($('textarea', { 'aria-hidden': true }));
            textArea.style.height = '1px';
            textArea.style.width = '1px';
            textArea.style.position = 'absolute';
            textArea.value = text;
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            if (activeElement instanceof HTMLElement) {
                activeElement.focus();
            }
            document.body.removeChild(textArea);
            return;
        });
    }
    readText(type) {
        return __awaiter(this, void 0, void 0, function* () {
            // With type: only in-memory is supported
            if (type) {
                return this.mapTextToType.get(type) || '';
            }
            // Guard access to navigator.clipboard with try/catch
            // as we have seen DOMExceptions in certain browsers
            // due to security policies.
            try {
                return yield navigator.clipboard.readText();
            }
            catch (error) {
                console.error(error);
                return '';
            }
        });
    }
    readFindText() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findText;
        });
    }
    writeFindText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            this.findText = text;
        });
    }
    writeResources(resources) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources = resources;
        });
    }
    readResources() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.resources;
        });
    }
};
BrowserClipboardService = __decorate([
    __param(0, ILayoutService),
    __param(1, ILogService)
], BrowserClipboardService);
