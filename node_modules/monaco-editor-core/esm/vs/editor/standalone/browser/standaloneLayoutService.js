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
import * as dom from '../../../base/browser/dom.js';
import { Event } from '../../../base/common/event.js';
import { ILayoutService } from '../../../platform/layout/browser/layoutService.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { registerSingleton } from '../../../platform/instantiation/common/extensions.js';
let StandaloneLayoutService = class StandaloneLayoutService {
    get dimension() {
        if (!this._dimension) {
            this._dimension = dom.getClientArea(window.document.body);
        }
        return this._dimension;
    }
    get hasContainer() {
        return false;
    }
    get container() {
        // On a page, multiple editors can be created. Therefore, there are multiple containers, not
        // just a single one. Please use `ICodeEditorService` to get the current focused code editor
        // and use its container if necessary. You can also instantiate `EditorScopedLayoutService`
        // which implements `ILayoutService` but is not a part of the service collection because
        // it is code editor instance specific.
        throw new Error(`ILayoutService.container is not available in the standalone editor!`);
    }
    focus() {
        var _a;
        (_a = this._codeEditorService.getFocusedCodeEditor()) === null || _a === void 0 ? void 0 : _a.focus();
    }
    constructor(_codeEditorService) {
        this._codeEditorService = _codeEditorService;
        this.onDidLayout = Event.None;
        this.offset = { top: 0, quickPickTop: 0 };
    }
};
StandaloneLayoutService = __decorate([
    __param(0, ICodeEditorService)
], StandaloneLayoutService);
export let EditorScopedLayoutService = class EditorScopedLayoutService extends StandaloneLayoutService {
    get hasContainer() {
        return false;
    }
    get container() {
        return this._container;
    }
    constructor(_container, codeEditorService) {
        super(codeEditorService);
        this._container = _container;
    }
};
EditorScopedLayoutService = __decorate([
    __param(1, ICodeEditorService)
], EditorScopedLayoutService);
registerSingleton(ILayoutService, StandaloneLayoutService, 1 /* InstantiationType.Delayed */);
