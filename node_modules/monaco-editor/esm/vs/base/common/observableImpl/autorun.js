/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { getLogger } from './logging.js';
export function autorun(debugName, fn) {
    return new AutorunObserver(debugName, fn, undefined);
}
export class AutorunObserver {
    constructor(debugName, runFn, _handleChange) {
        var _a;
        this.debugName = debugName;
        this.runFn = runFn;
        this._handleChange = _handleChange;
        this.needsToRun = true;
        this.updateCount = 0;
        this.disposed = false;
        /**
         * The actual dependencies.
        */
        this._dependencies = new Set();
        /**
         * Dependencies that have to be removed when {@link runFn} ran through.
        */
        this.staleDependencies = new Set();
        (_a = getLogger()) === null || _a === void 0 ? void 0 : _a.handleAutorunCreated(this);
        this.runIfNeeded();
    }
    subscribeTo(observable) {
        // In case the run action disposes the autorun
        if (this.disposed) {
            return;
        }
        this._dependencies.add(observable);
        if (!this.staleDependencies.delete(observable)) {
            observable.addObserver(this);
        }
    }
    handleChange(observable, change) {
        const shouldReact = this._handleChange ? this._handleChange({
            changedObservable: observable,
            change,
            didChange: o => o === observable,
        }) : true;
        this.needsToRun = this.needsToRun || shouldReact;
        if (this.updateCount === 0) {
            this.runIfNeeded();
        }
    }
    beginUpdate() {
        this.updateCount++;
    }
    endUpdate() {
        this.updateCount--;
        if (this.updateCount === 0) {
            this.runIfNeeded();
        }
    }
    runIfNeeded() {
        var _a;
        if (!this.needsToRun) {
            return;
        }
        // Assert: this.staleDependencies is an empty set.
        const emptySet = this.staleDependencies;
        this.staleDependencies = this._dependencies;
        this._dependencies = emptySet;
        this.needsToRun = false;
        (_a = getLogger()) === null || _a === void 0 ? void 0 : _a.handleAutorunTriggered(this);
        try {
            this.runFn(this);
        }
        finally {
            // We don't want our observed observables to think that they are (not even temporarily) not being observed.
            // Thus, we only unsubscribe from observables that are definitely not read anymore.
            for (const o of this.staleDependencies) {
                o.removeObserver(this);
            }
            this.staleDependencies.clear();
        }
    }
    dispose() {
        this.disposed = true;
        for (const o of this._dependencies) {
            o.removeObserver(this);
        }
        this._dependencies.clear();
    }
    toString() {
        return `Autorun<${this.debugName}>`;
    }
}
(function (autorun) {
    autorun.Observer = AutorunObserver;
})(autorun || (autorun = {}));
