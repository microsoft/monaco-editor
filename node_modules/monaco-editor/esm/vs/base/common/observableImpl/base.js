/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { getLogger } from './logging.js';
let _derived;
/**
 * @internal
 * This is to allow splitting files.
*/
export function _setDerived(derived) {
    _derived = derived;
}
export class ConvenientObservable {
    get TChange() { return null; }
    reportChanges() {
        this.get();
    }
    /** @sealed */
    read(reader) {
        if (reader) {
            return reader.readObservable(this);
        }
        else {
            return this.get();
        }
    }
    /** @sealed */
    map(fn) {
        return _derived(() => {
            const name = getFunctionName(fn);
            return name !== undefined ? name : `${this.debugName} (mapped)`;
        }, (reader) => fn(this.read(reader), reader));
    }
}
export class BaseObservable extends ConvenientObservable {
    constructor() {
        super(...arguments);
        this.observers = new Set();
    }
    addObserver(observer) {
        const len = this.observers.size;
        this.observers.add(observer);
        if (len === 0) {
            this.onFirstObserverAdded();
        }
    }
    removeObserver(observer) {
        const deleted = this.observers.delete(observer);
        if (deleted && this.observers.size === 0) {
            this.onLastObserverRemoved();
        }
    }
    onFirstObserverAdded() { }
    onLastObserverRemoved() { }
}
export function transaction(fn, getDebugName) {
    var _a, _b;
    const tx = new TransactionImpl(fn, getDebugName);
    try {
        (_a = getLogger()) === null || _a === void 0 ? void 0 : _a.handleBeginTransaction(tx);
        fn(tx);
    }
    finally {
        tx.finish();
        (_b = getLogger()) === null || _b === void 0 ? void 0 : _b.handleEndTransaction();
    }
}
export function subtransaction(tx, fn, getDebugName) {
    if (!tx) {
        transaction(fn, getDebugName);
    }
    else {
        fn(tx);
    }
}
export class TransactionImpl {
    constructor(fn, _getDebugName) {
        this.fn = fn;
        this._getDebugName = _getDebugName;
        this.updatingObservers = [];
    }
    getDebugName() {
        if (this._getDebugName) {
            return this._getDebugName();
        }
        return getFunctionName(this.fn);
    }
    updateObserver(observer, observable) {
        this.updatingObservers.push({ observer, observable });
        observer.beginUpdate(observable);
    }
    finish() {
        const updatingObservers = this.updatingObservers;
        // Prevent anyone from updating observers from now on.
        this.updatingObservers = null;
        for (const { observer, observable } of updatingObservers) {
            observer.endUpdate(observable);
        }
    }
}
export function getFunctionName(fn) {
    const fnSrc = fn.toString();
    // Pattern: /** @description ... */
    const regexp = /\/\*\*\s*@description\s*([^*]*)\*\//;
    const match = regexp.exec(fnSrc);
    const result = match ? match[1] : undefined;
    return result === null || result === void 0 ? void 0 : result.trim();
}
/**
 * Creates an observable value.
 * Observers get informed when the value changes.
 */
export function observableValue(name, initialValue) {
    return new ObservableValue(name, initialValue);
}
export class ObservableValue extends BaseObservable {
    constructor(debugName, initialValue) {
        super();
        this.debugName = debugName;
        this._value = initialValue;
    }
    get() {
        return this._value;
    }
    set(value, tx, change) {
        var _a;
        if (this._value === value) {
            return;
        }
        let _tx;
        if (!tx) {
            tx = _tx = new TransactionImpl(() => { }, () => `Setting ${this.debugName}`);
        }
        try {
            const oldValue = this._value;
            this._setValue(value);
            (_a = getLogger()) === null || _a === void 0 ? void 0 : _a.handleObservableChanged(this, { oldValue, newValue: value, change, didChange: true });
            for (const observer of this.observers) {
                tx.updateObserver(observer, this);
                observer.handleChange(this, change);
            }
        }
        finally {
            if (_tx) {
                _tx.finish();
            }
        }
    }
    toString() {
        return `${this.debugName}: ${this._value}`;
    }
    _setValue(newValue) {
        this._value = newValue;
    }
}
export function disposableObservableValue(name, initialValue) {
    return new DisposableObservableValue(name, initialValue);
}
export class DisposableObservableValue extends ObservableValue {
    _setValue(newValue) {
        if (this._value === newValue) {
            return;
        }
        if (this._value) {
            this._value.dispose();
        }
        this._value = newValue;
    }
    dispose() {
        var _a;
        (_a = this._value) === null || _a === void 0 ? void 0 : _a.dispose();
    }
}
