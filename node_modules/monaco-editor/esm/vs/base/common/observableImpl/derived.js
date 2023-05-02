/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { BugIndicatingError } from '../errors.js';
import { BaseObservable, _setDerived } from './base.js';
import { getLogger } from './logging.js';
export function derived(debugName, computeFn) {
    return new Derived(debugName, computeFn);
}
_setDerived(derived);
export class Derived extends BaseObservable {
    get debugName() {
        return typeof this._debugName === 'function' ? this._debugName() : this._debugName;
    }
    constructor(_debugName, computeFn) {
        var _a;
        super();
        this._debugName = _debugName;
        this.computeFn = computeFn;
        this.state = 0 /* DerivedState.initial */;
        this.value = undefined;
        this.updateCount = 0;
        this.dependencies = new Set();
        this.dependenciesToBeRemoved = new Set();
        (_a = getLogger()) === null || _a === void 0 ? void 0 : _a.handleDerivedCreated(this);
    }
    onLastObserverRemoved() {
        /**
         * We are not tracking changes anymore, thus we have to assume
         * that our cache is invalid.
         */
        this.state = 0 /* DerivedState.initial */;
        this.value = undefined;
        for (const d of this.dependencies) {
            d.removeObserver(this);
        }
        this.dependencies.clear();
    }
    get() {
        if (this.observers.size === 0) {
            // Without observers, we don't know when to clean up stuff.
            // Thus, we don't cache anything to prevent memory leaks.
            const result = this.computeFn(this);
            // Clear new dependencies
            this.onLastObserverRemoved();
            return result;
        }
        else {
            do {
                if (this.state === 1 /* DerivedState.dependenciesMightHaveChanged */) {
                    // We might not get a notification for a dependency that changed while it is updating,
                    // thus we also have to ask all our depedencies if they changed in this case.
                    this.state = 3 /* DerivedState.upToDate */;
                    for (const d of this.dependencies) {
                        /** might call {@link handleChange} indirectly, which could invalidate us */
                        d.reportChanges();
                        if (this.state === 2 /* DerivedState.stale */) {
                            // The other dependencies will refresh on demand, so early break
                            break;
                        }
                    }
                }
                this._recomputeIfNeeded();
                // In case recomputation changed one of our dependencies, we need to recompute again.
            } while (this.state !== 3 /* DerivedState.upToDate */);
            return this.value;
        }
    }
    _recomputeIfNeeded() {
        var _a;
        if (this.state === 3 /* DerivedState.upToDate */) {
            return;
        }
        const emptySet = this.dependenciesToBeRemoved;
        this.dependenciesToBeRemoved = this.dependencies;
        this.dependencies = emptySet;
        const hadValue = this.state !== 0 /* DerivedState.initial */;
        const oldValue = this.value;
        this.state = 3 /* DerivedState.upToDate */;
        try {
            /** might call {@link handleChange} indirectly, which could invalidate us */
            this.value = this.computeFn(this);
        }
        finally {
            // We don't want our observed observables to think that they are (not even temporarily) not being observed.
            // Thus, we only unsubscribe from observables that are definitely not read anymore.
            for (const o of this.dependenciesToBeRemoved) {
                o.removeObserver(this);
            }
            this.dependenciesToBeRemoved.clear();
        }
        const didChange = hadValue && oldValue !== this.value;
        (_a = getLogger()) === null || _a === void 0 ? void 0 : _a.handleDerivedRecomputed(this, {
            oldValue,
            newValue: this.value,
            change: undefined,
            didChange
        });
        if (didChange) {
            for (const r of this.observers) {
                r.handleChange(this, undefined);
            }
        }
    }
    toString() {
        return `LazyDerived<${this.debugName}>`;
    }
    // IObserver Implementation
    beginUpdate() {
        this.updateCount++;
        const propagateBeginUpdate = this.updateCount === 1;
        if (this.state === 3 /* DerivedState.upToDate */) {
            this.state = 1 /* DerivedState.dependenciesMightHaveChanged */;
            // If we propagate begin update, that will already signal a possible change.
            if (!propagateBeginUpdate) {
                for (const r of this.observers) {
                    r.handlePossibleChange(this);
                }
            }
        }
        if (propagateBeginUpdate) {
            for (const r of this.observers) {
                r.beginUpdate(this); // This signals a possible change
            }
        }
    }
    endUpdate() {
        this.updateCount--;
        if (this.updateCount === 0) {
            // End update could change the observer list.
            const observers = [...this.observers];
            for (const r of observers) {
                r.endUpdate(this);
            }
        }
        if (this.updateCount < 0) {
            throw new BugIndicatingError();
        }
    }
    handlePossibleChange(observable) {
        // In all other states, observers already know that we might have changed.
        if (this.state === 3 /* DerivedState.upToDate */ && this.dependencies.has(observable)) {
            this.state = 1 /* DerivedState.dependenciesMightHaveChanged */;
            for (const r of this.observers) {
                r.handlePossibleChange(this);
            }
        }
    }
    handleChange(observable, _change) {
        const isUpToDate = this.state === 3 /* DerivedState.upToDate */;
        if ((this.state === 1 /* DerivedState.dependenciesMightHaveChanged */ || isUpToDate) && this.dependencies.has(observable)) {
            this.state = 2 /* DerivedState.stale */;
            if (isUpToDate) {
                for (const r of this.observers) {
                    r.handlePossibleChange(this);
                }
            }
        }
    }
    // IReader Implementation
    readObservable(observable) {
        // Subscribe before getting the value to enable caching
        observable.addObserver(this);
        /** This might call {@link handleChange} indirectly, which could invalidate us */
        const value = observable.get();
        // Which is why we only add the observable to the dependencies now.
        this.dependencies.add(observable);
        this.dependenciesToBeRemoved.delete(observable);
        return value;
    }
}
