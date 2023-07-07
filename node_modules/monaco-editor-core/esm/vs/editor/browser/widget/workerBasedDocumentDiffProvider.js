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
import { StopWatch } from '../../../base/common/stopwatch.js';
import { LineRange } from '../../common/core/lineRange.js';
import { LineRangeMapping, RangeMapping } from '../../common/diff/linesDiffComputer.js';
import { IEditorWorkerService } from '../../common/services/editorWorker.js';
import { ITelemetryService } from '../../../platform/telemetry/common/telemetry.js';
export let WorkerBasedDocumentDiffProvider = class WorkerBasedDocumentDiffProvider {
    constructor(options, editorWorkerService, telemetryService) {
        this.editorWorkerService = editorWorkerService;
        this.telemetryService = telemetryService;
        this.onDidChangeEventEmitter = new Emitter();
        this.onDidChange = this.onDidChangeEventEmitter.event;
        this.diffAlgorithm = 'advanced';
        this.diffAlgorithmOnDidChangeSubscription = undefined;
        this.setOptions(options);
    }
    dispose() {
        var _a;
        (_a = this.diffAlgorithmOnDidChangeSubscription) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    computeDiff(original, modified, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.diffAlgorithm !== 'string') {
                return this.diffAlgorithm.computeDiff(original, modified, options);
            }
            // This significantly speeds up the case when the original file is empty
            if (original.getLineCount() === 1 && original.getLineMaxColumn(1) === 1) {
                return {
                    changes: [
                        new LineRangeMapping(new LineRange(1, 2), new LineRange(1, modified.getLineCount() + 1), [
                            new RangeMapping(original.getFullModelRange(), modified.getFullModelRange())
                        ])
                    ],
                    identical: false,
                    quitEarly: false,
                    moves: [],
                };
            }
            const uriKey = JSON.stringify([original.uri.toString(), modified.uri.toString()]);
            const context = JSON.stringify([original.id, modified.id, original.getAlternativeVersionId(), modified.getAlternativeVersionId(), JSON.stringify(options)]);
            const c = WorkerBasedDocumentDiffProvider.diffCache.get(uriKey);
            if (c && c.context === context) {
                return c.result;
            }
            const sw = StopWatch.create();
            const result = yield this.editorWorkerService.computeDiff(original.uri, modified.uri, options, this.diffAlgorithm);
            const timeMs = sw.elapsed();
            this.telemetryService.publicLog2('diffEditor.computeDiff', {
                timeMs,
                timedOut: (_a = result === null || result === void 0 ? void 0 : result.quitEarly) !== null && _a !== void 0 ? _a : true,
            });
            if (!result) {
                throw new Error('no diff result available');
            }
            // max 10 items in cache
            if (WorkerBasedDocumentDiffProvider.diffCache.size > 10) {
                WorkerBasedDocumentDiffProvider.diffCache.delete(WorkerBasedDocumentDiffProvider.diffCache.keys().next().value);
            }
            WorkerBasedDocumentDiffProvider.diffCache.set(uriKey, { result, context });
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
WorkerBasedDocumentDiffProvider.diffCache = new Map();
WorkerBasedDocumentDiffProvider = __decorate([
    __param(1, IEditorWorkerService),
    __param(2, ITelemetryService)
], WorkerBasedDocumentDiffProvider);
