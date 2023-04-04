import { getLogger } from './logging.js';
export class ConvenientObservable {
    get TChange() { return null; }
    /** @sealed */
    read(reader) {
        reader.subscribeTo(this);
        return this.get();
    }
}
export class BaseObservable extends ConvenientObservable {
    constructor() {
        super(...arguments);
        this.observers = new Set();
    }
    /** @sealed */
    addObserver(observer) {
        const len = this.observers.size;
        this.observers.add(observer);
        if (len === 0) {
            this.onFirstObserverAdded();
        }
    }
    /** @sealed */
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
export function getFunctionName(fn) {
    const fnSrc = fn.toString();
    // Pattern: /** @description ... */
    const regexp = /\/\*\*\s*@description\s*([^*]*)\*\//;
    const match = regexp.exec(fnSrc);
    const result = match ? match[1] : undefined;
    return result === null || result === void 0 ? void 0 : result.trim();
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
export function observableValue(name, initialValue) {
    return new ObservableValue(name, initialValue);
}
export class ObservableValue extends BaseObservable {
    constructor(debugName, initialValue) {
        super();
        this.debugName = debugName;
        this.value = initialValue;
    }
    get() {
        return this.value;
    }
    set(value, tx, change) {
        var _a;
        if (this.value === value) {
            return;
        }
        if (!tx) {
            transaction((tx) => {
                this.set(value, tx, change);
            }, () => `Setting ${this.debugName}`);
            return;
        }
        const oldValue = this.value;
        this.value = value;
        (_a = getLogger()) === null || _a === void 0 ? void 0 : _a.handleObservableChanged(this, { oldValue, newValue: value, change, didChange: true });
        for (const observer of this.observers) {
            tx.updateObserver(observer, this);
            observer.handleChange(this, change);
        }
    }
    toString() {
        return `${this.debugName}: ${this.value}`;
    }
}
