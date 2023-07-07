/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { toDisposable } from '../lifecycle.js';
import { autorun } from './autorun.js';
import { BaseObservable, ConvenientObservable, getFunctionName, transaction } from './base.js';
import { getLogger } from './logging.js';
export function constObservable(value) {
    return new ConstObservable(value);
}
class ConstObservable extends ConvenientObservable {
    constructor(value) {
        super();
        this.value = value;
    }
    get debugName() {
        return this.toString();
    }
    get() {
        return this.value;
    }
    addObserver(observer) {
        // NO OP
    }
    removeObserver(observer) {
        // NO OP
    }
    toString() {
        return `Const: ${this.value}`;
    }
}
export function waitForState(observable, predicate) {
    return new Promise(resolve => {
        let didRun = false;
        let shouldDispose = false;
        const d = autorun('waitForState', reader => {
            const currentState = observable.read(reader);
            if (predicate(currentState)) {
                if (!didRun) {
                    shouldDispose = true;
                }
                else {
                    d.dispose();
                }
                resolve(currentState);
            }
        });
        didRun = true;
        if (shouldDispose) {
            d.dispose();
        }
    });
}
export function observableFromEvent(event, getValue) {
    return new FromEventObservable(event, getValue);
}
export class FromEventObservable extends BaseObservable {
    constructor(event, getValue) {
        super();
        this.event = event;
        this.getValue = getValue;
        this.hasValue = false;
        this.handleEvent = (args) => {
            var _a;
            const newValue = this.getValue(args);
            const didChange = !this.hasValue || this.value !== newValue;
            (_a = getLogger()) === null || _a === void 0 ? void 0 : _a.handleFromEventObservableTriggered(this, { oldValue: this.value, newValue, change: undefined, didChange });
            if (didChange) {
                this.value = newValue;
                if (this.hasValue) {
                    transaction((tx) => {
                        for (const o of this.observers) {
                            tx.updateObserver(o, this);
                            o.handleChange(this, undefined);
                        }
                    }, () => {
                        const name = this.getDebugName();
                        return 'Event fired' + (name ? `: ${name}` : '');
                    });
                }
                this.hasValue = true;
            }
        };
    }
    getDebugName() {
        return getFunctionName(this.getValue);
    }
    get debugName() {
        const name = this.getDebugName();
        return 'From Event' + (name ? `: ${name}` : '');
    }
    onFirstObserverAdded() {
        this.subscription = this.event(this.handleEvent);
    }
    onLastObserverRemoved() {
        this.subscription.dispose();
        this.subscription = undefined;
        this.hasValue = false;
        this.value = undefined;
    }
    get() {
        if (this.subscription) {
            if (!this.hasValue) {
                this.handleEvent(undefined);
            }
            return this.value;
        }
        else {
            // no cache, as there are no subscribers to keep it updated
            return this.getValue(undefined);
        }
    }
}
(function (observableFromEvent) {
    observableFromEvent.Observer = FromEventObservable;
})(observableFromEvent || (observableFromEvent = {}));
export function observableSignalFromEvent(debugName, event) {
    return new FromEventObservableSignal(debugName, event);
}
class FromEventObservableSignal extends BaseObservable {
    constructor(debugName, event) {
        super();
        this.debugName = debugName;
        this.event = event;
        this.handleEvent = () => {
            transaction((tx) => {
                for (const o of this.observers) {
                    tx.updateObserver(o, this);
                    o.handleChange(this, undefined);
                }
            }, () => this.debugName);
        };
    }
    onFirstObserverAdded() {
        this.subscription = this.event(this.handleEvent);
    }
    onLastObserverRemoved() {
        this.subscription.dispose();
        this.subscription = undefined;
    }
    get() {
        // NO OP
    }
}
/**
 * Creates a signal that can be triggered to invalidate observers.
 */
export function observableSignal(debugName) {
    return new ObservableSignal(debugName);
}
class ObservableSignal extends BaseObservable {
    constructor(debugName) {
        super();
        this.debugName = debugName;
    }
    trigger(tx, change) {
        if (!tx) {
            transaction(tx => {
                this.trigger(tx, change);
            }, () => `Trigger signal ${this.debugName}`);
            return;
        }
        for (const o of this.observers) {
            tx.updateObserver(o, this);
            o.handleChange(this, change);
        }
    }
    get() {
        // NO OP
    }
}
/**
 * This ensures the observable is being observed.
 * Observed observables (such as {@link derived}s) can maintain a cache, as they receive invalidation events.
 * Unobserved observables are forced to recompute their value from scratch every time they are read.
 *
 * @param observable the observable to keep alive
 * @param forceRecompute if true, the observable will be eagerly recomputed after it changed.
 * Use this if recomputing the observables causes side-effects.
*/
export function keepAlive(observable, forceRecompute) {
    const o = new KeepAliveObserver(forceRecompute !== null && forceRecompute !== void 0 ? forceRecompute : false);
    observable.addObserver(o);
    if (forceRecompute) {
        observable.reportChanges();
    }
    return toDisposable(() => {
        observable.removeObserver(o);
    });
}
class KeepAliveObserver {
    constructor(forceRecompute) {
        this.forceRecompute = forceRecompute;
        this.counter = 0;
    }
    beginUpdate(observable) {
        this.counter++;
    }
    endUpdate(observable) {
        this.counter--;
        if (this.counter === 0 && this.forceRecompute) {
            observable.reportChanges();
        }
    }
    handlePossibleChange(observable) {
        // NO OP
    }
    handleChange(observable, change) {
        // NO OP
    }
}
