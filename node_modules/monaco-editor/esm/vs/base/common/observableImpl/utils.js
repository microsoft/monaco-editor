/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { BaseObservable, transaction, ConvenientObservable, getFunctionName } from './base.js';
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
