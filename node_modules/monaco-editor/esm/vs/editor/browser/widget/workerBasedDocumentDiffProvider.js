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
import { Emitter } from '../../../base/common/event.js';
import { IEditorWorkerService } from '../../common/services/editorWorker.js';
let WorkerBasedDocumentDiffProvider = class WorkerBasedDocumentDiffProvider {
    constructor(options, editorWorkerService) {
        this.editorWorkerService = editorWorkerService;
        this.onDidChangeEventEmitter = new Emitter();
        this.onDidChange = this.onDidChangeEventEmitter.event;
        this.diffAlgorithm = 'smart';
        this.diffAlgorithmOnDidChangeSubscription = undefined;
        this.setOptions(options);
    }
    dispose() {
        var _a;
        (_a = this.diffAlgorithmOnDidChangeSubscription) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    computeDiff(original, modified, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.diffAlgorithm !== 'string') {
                return this.diffAlgorithm.computeDiff(original, modified, options);
            }
            const result = yield this.editorWorkerService.computeDiff(original.uri, modified.uri, options, this.diffAlgorithm);
            if (!result) {
                throw new Error('no diff result available');
            }
            return result;
        });
    }
    setOptions(newOptions) {
        var _a;
        let didChange = false;
        if (newOptions.diffAlgorithm) {
            if (this.diffAlgorithm !== newOptions.diffAlgorithm) {
                (_a = this.diffAlgorithmOnDidChangeSubscription) === null || _a === void 0 ? void 0 : _a.dispose();
                this.diffAlgorithmOnDidChangeSubscription = undefined;
                this.diffAlgorithm = newOptions.diffAlgorithm;
                if (typeof newOptions.diffAlgorithm !== 'string') {
                    this.diffAlgorithmOnDidChangeSubscription = newOptions.diffAlgorithm.onDidChange(() => this.onDidChangeEventEmitter.fire());
                }
                didChange = true;
            }
        }
        if (didChange) {
            this.onDidChangeEventEmitter.fire();
        }
    }
};
WorkerBasedDocumentDiffProvider = __decorate([
    __param(1, IEditorWorkerService)
], WorkerBasedDocumentDiffProvider);
export { WorkerBasedDocumentDiffProvider };
