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
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../common/accessibility.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { ILayoutService } from '../../layout/browser/layoutService.js';
let AccessibilityService = class AccessibilityService extends Disposable {
    constructor(_contextKeyService, _layoutService, _configurationService) {
        super();
        this._contextKeyService = _contextKeyService;
        this._layoutService = _layoutService;
        this._configurationService = _configurationService;
        this._accessibilitySupport = 0 /* AccessibilitySupport.Unknown */;
        this._onDidChangeScreenReaderOptimized = new Emitter();
        this._onDidChangeReducedMotion = new Emitter();
        this._accessibilityModeEnabledContext = CONTEXT_ACCESSIBILITY_MODE_ENABLED.bindTo(this._contextKeyService);
        const updateContextKey = () => this._accessibilityModeEnabledContext.set(this.isScreenReaderOptimized());
        this._register(this._configurationService.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('editor.accessibilitySupport')) {
                updateContextKey();
                this._onDidChangeScreenReaderOptimized.fire();
            }
            if (e.affectsConfiguration('workbench.reduceMotion')) {
                this._configMotionReduced = this._configurationService.getValue('workbench.reduceMotion');
                this._onDidChangeReducedMotion.fire();
            }
        }));
        updateContextKey();
        this._register(this.onDidChangeScreenReaderOptimized(() => updateContextKey()));
        const reduceMotionMatcher = window.matchMedia(`(prefers-reduced-motion: reduce)`);
        this._systemMotionReduced = reduceMotionMatcher.matches;
        this._configMotionReduced = this._configurationService.getValue('workbench.reduceMotion');
        this.initReducedMotionListeners(reduceMotionMatcher);
    }
    initReducedMotionListeners(reduceMotionMatcher) {
        if (!this._layoutService.hasContainer) {
            // we can't use `ILayoutService.container` because the application
            // doesn't have a single container
            return;
        }
        this._register(addDisposableListener(reduceMotionMatcher, 'change', () => {
            this._systemMotionReduced = reduceMotionMatcher.matches;
            if (this._configMotionReduced === 'auto') {
                this._onDidChangeReducedMotion.fire();
            }
        }));
        const updateRootClasses = () => {
            const reduce = this.isMotionReduced();
            this._layoutService.container.classList.toggle('reduce-motion', reduce);
            this._layoutService.container.classList.toggle('enable-motion', !reduce);
        };
        updateRootClasses();
        this._register(this.onDidChangeReducedMotion(() => updateRootClasses()));
    }
    get onDidChangeScreenReaderOptimized() {
        return this._onDidChangeScreenReaderOptimized.event;
    }
    isScreenReaderOptimized() {
        const config = this._configurationService.getValue('editor.accessibilitySupport');
        return config === 'on' || (config === 'auto' && this._accessibilitySupport === 2 /* AccessibilitySupport.Enabled */);
    }
    get onDidChangeReducedMotion() {
        return this._onDidChangeReducedMotion.event;
    }
    isMotionReduced() {
        const config = this._configMotionReduced;
        return config === 'on' || (config === 'auto' && this._systemMotionReduced);
    }
    getAccessibilitySupport() {
        return this._accessibilitySupport;
    }
};
AccessibilityService = __decorate([
    __param(0, IContextKeyService),
    __param(1, ILayoutService),
    __param(2, IConfigurationService)
], AccessibilityService);
export { AccessibilityService };
