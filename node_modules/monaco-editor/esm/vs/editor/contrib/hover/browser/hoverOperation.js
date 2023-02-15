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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { createCancelableAsyncIterable, RunOnceScheduler } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
export class HoverResult {
    constructor(value, isComplete, hasLoadingMessage) {
        this.value = value;
        this.isComplete = isComplete;
        this.hasLoadingMessage = hasLoadingMessage;
    }
}
/**
 * Computing the hover is very fine tuned.
 *
 * Suppose the hover delay is 300ms (the default). Then, when resting the mouse at an anchor:
 * - at 150ms, the async computation is triggered (i.e. semantic hover)
 *   - if async results already come in, they are not rendered yet.
 * - at 300ms, the sync computation is triggered (i.e. decorations, markers)
 *   - if there are sync or async results, they are rendered.
 * - at 900ms, if the async computation hasn't finished, a "Loading..." result is added.
 */
export class HoverOperation extends Disposable {
    constructor(_editor, _computer) {
        super();
        this._editor = _editor;
        this._computer = _computer;
        this._onResult = this._register(new Emitter());
        this.onResult = this._onResult.event;
        this._firstWaitScheduler = this._register(new RunOnceScheduler(() => this._triggerAsyncComputation(), 0));
        this._secondWaitScheduler = this._register(new RunOnceScheduler(() => this._triggerSyncComputation(), 0));
        this._loadingMessageScheduler = this._register(new RunOnceScheduler(() => this._triggerLoadingMessage(), 0));
        this._state = 0 /* HoverOperationState.Idle */;
        this._asyncIterable = null;
        this._asyncIterableDone = false;
        this._result = [];
    }
    dispose() {
        if (this._asyncIterable) {
            this._asyncIterable.cancel();
            this._asyncIterable = null;
        }
        super.dispose();
    }
    get _hoverTime() {
        return this._editor.getOption(57 /* EditorOption.hover */).delay;
    }
    get _firstWaitTime() {
        return this._hoverTime / 2;
    }
    get _secondWaitTime() {
        return this._hoverTime - this._firstWaitTime;
    }
    get _loadingMessageTime() {
        return 3 * this._hoverTime;
    }
    _setState(state, fireResult = true) {
        this._state = state;
        if (fireResult) {
            this._fireResult();
        }
    }
    _triggerAsyncComputation() {
        this._setState(2 /* HoverOperationState.SecondWait */);
        this._secondWaitScheduler.schedule(this._secondWaitTime);
        if (this._computer.computeAsync) {
            this._asyncIterableDone = false;
            this._asyncIterable = createCancelableAsyncIterable(token => this._computer.computeAsync(token));
            (() => __awaiter(this, void 0, void 0, function* () {
                var _a, e_1, _b, _c;
                try {
                    try {
                        for (var _d = true, _e = __asyncValues(this._asyncIterable), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                            _c = _f.value;
                            _d = false;
                            try {
                                const item = _c;
                                if (item) {
                                    this._result.push(item);
                                    this._fireResult();
                                }
                            }
                            finally {
                                _d = true;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    this._asyncIterableDone = true;
                    if (this._state === 3 /* HoverOperationState.WaitingForAsync */ || this._state === 4 /* HoverOperationState.WaitingForAsyncShowingLoading */) {
                        this._setState(0 /* HoverOperationState.Idle */);
                    }
                }
                catch (e) {
                    onUnexpectedError(e);
                }
            }))();
        }
        else {
            this._asyncIterableDone = true;
        }
    }
    _triggerSyncComputation() {
        if (this._computer.computeSync) {
            this._result = this._result.concat(this._computer.computeSync());
        }
        this._setState(this._asyncIterableDone ? 0 /* HoverOperationState.Idle */ : 3 /* HoverOperationState.WaitingForAsync */);
    }
    _triggerLoadingMessage() {
        if (this._state === 3 /* HoverOperationState.WaitingForAsync */) {
            this._setState(4 /* HoverOperationState.WaitingForAsyncShowingLoading */);
        }
    }
    _fireResult() {
        if (this._state === 1 /* HoverOperationState.FirstWait */ || this._state === 2 /* HoverOperationState.SecondWait */) {
            // Do not send out results before the hover time
            return;
        }
        const isComplete = (this._state === 0 /* HoverOperationState.Idle */);
        const hasLoadingMessage = (this._state === 4 /* HoverOperationState.WaitingForAsyncShowingLoading */);
        this._onResult.fire(new HoverResult(this._result.slice(0), isComplete, hasLoadingMessage));
    }
    start(mode) {
        if (mode === 0 /* HoverStartMode.Delayed */) {
            if (this._state === 0 /* HoverOperationState.Idle */) {
                this._setState(1 /* HoverOperationState.FirstWait */);
                this._firstWaitScheduler.schedule(this._firstWaitTime);
                this._loadingMessageScheduler.schedule(this._loadingMessageTime);
            }
        }
        else {
            switch (this._state) {
                case 0 /* HoverOperationState.Idle */:
                    this._triggerAsyncComputation();
                    this._secondWaitScheduler.cancel();
                    this._triggerSyncComputation();
                    break;
                case 2 /* HoverOperationState.SecondWait */:
                    this._secondWaitScheduler.cancel();
                    this._triggerSyncComputation();
                    break;
            }
        }
    }
    cancel() {
        this._firstWaitScheduler.cancel();
        this._secondWaitScheduler.cancel();
        this._loadingMessageScheduler.cancel();
        if (this._asyncIterable) {
            this._asyncIterable.cancel();
            this._asyncIterable = null;
        }
        this._result = [];
        this._setState(0 /* HoverOperationState.Idle */, false);
    }
}
