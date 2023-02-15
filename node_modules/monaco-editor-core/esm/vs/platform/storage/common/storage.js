import { Emitter, PauseableEmitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { isUndefinedOrNull } from '../../../base/common/types.js';
import { InMemoryStorageDatabase, Storage, StorageHint } from '../../../base/parts/storage/common/storage.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
export const TARGET_KEY = '__$__targetStorageMarker';
export const IStorageService = createDecorator('storageService');
export var WillSaveStateReason;
(function (WillSaveStateReason) {
    /**
     * No specific reason to save state.
     */
    WillSaveStateReason[WillSaveStateReason["NONE"] = 0] = "NONE";
    /**
     * A hint that the workbench is about to shutdown.
     */
    WillSaveStateReason[WillSaveStateReason["SHUTDOWN"] = 1] = "SHUTDOWN";
})(WillSaveStateReason || (WillSaveStateReason = {}));
export function loadKeyTargets(storage) {
    const keysRaw = storage.get(TARGET_KEY);
    if (keysRaw) {
        try {
            return JSON.parse(keysRaw);
        }
        catch (error) {
            // Fail gracefully
        }
    }
    return Object.create(null);
}
class AbstractStorageService extends Disposable {
    constructor(options = { flushInterval: AbstractStorageService.DEFAULT_FLUSH_INTERVAL }) {
        super();
        this.options = options;
        this._onDidChangeValue = this._register(new PauseableEmitter());
        this.onDidChangeValue = this._onDidChangeValue.event;
        this._onDidChangeTarget = this._register(new PauseableEmitter());
        this._onWillSaveState = this._register(new Emitter());
        this.onWillSaveState = this._onWillSaveState.event;
        this._workspaceKeyTargets = undefined;
        this._profileKeyTargets = undefined;
        this._applicationKeyTargets = undefined;
    }
    emitDidChangeValue(scope, key) {
        // Specially handle `TARGET_KEY`
        if (key === TARGET_KEY) {
            // Clear our cached version which is now out of date
            switch (scope) {
                case -1 /* StorageScope.APPLICATION */:
                    this._applicationKeyTargets = undefined;
                    break;
                case 0 /* StorageScope.PROFILE */:
                    this._profileKeyTargets = undefined;
                    break;
                case 1 /* StorageScope.WORKSPACE */:
                    this._workspaceKeyTargets = undefined;
                    break;
            }
            // Emit as `didChangeTarget` event
            this._onDidChangeTarget.fire({ scope });
        }
        // Emit any other key to outside
        else {
            this._onDidChangeValue.fire({ scope, key, target: this.getKeyTargets(scope)[key] });
        }
    }
    get(key, scope, fallbackValue) {
        var _a;
        return (_a = this.getStorage(scope)) === null || _a === void 0 ? void 0 : _a.get(key, fallbackValue);
    }
    getBoolean(key, scope, fallbackValue) {
        var _a;
        return (_a = this.getStorage(scope)) === null || _a === void 0 ? void 0 : _a.getBoolean(key, fallbackValue);
    }
    getNumber(key, scope, fallbackValue) {
        var _a;
        return (_a = this.getStorage(scope)) === null || _a === void 0 ? void 0 : _a.getNumber(key, fallbackValue);
    }
    store(key, value, scope, target) {
        // We remove the key for undefined/null values
        if (isUndefinedOrNull(value)) {
            this.remove(key, scope);
            return;
        }
        // Update our datastructures but send events only after
        this.withPausedEmitters(() => {
            var _a;
            // Update key-target map
            this.updateKeyTarget(key, scope, target);
            // Store actual value
            (_a = this.getStorage(scope)) === null || _a === void 0 ? void 0 : _a.set(key, value);
        });
    }
    remove(key, scope) {
        // Update our datastructures but send events only after
        this.withPausedEmitters(() => {
            var _a;
            // Update key-target map
            this.updateKeyTarget(key, scope, undefined);
            // Remove actual key
            (_a = this.getStorage(scope)) === null || _a === void 0 ? void 0 : _a.delete(key);
        });
    }
    withPausedEmitters(fn) {
        // Pause emitters
        this._onDidChangeValue.pause();
        this._onDidChangeTarget.pause();
        try {
            fn();
        }
        finally {
            // Resume emitters
            this._onDidChangeValue.resume();
            this._onDidChangeTarget.resume();
        }
    }
    updateKeyTarget(key, scope, target) {
        var _a, _b;
        // Add
        const keyTargets = this.getKeyTargets(scope);
        if (typeof target === 'number') {
            if (keyTargets[key] !== target) {
                keyTargets[key] = target;
                (_a = this.getStorage(scope)) === null || _a === void 0 ? void 0 : _a.set(TARGET_KEY, JSON.stringify(keyTargets));
            }
        }
        // Remove
        else {
            if (typeof keyTargets[key] === 'number') {
                delete keyTargets[key];
                (_b = this.getStorage(scope)) === null || _b === void 0 ? void 0 : _b.set(TARGET_KEY, JSON.stringify(keyTargets));
            }
        }
    }
    get workspaceKeyTargets() {
        if (!this._workspaceKeyTargets) {
            this._workspaceKeyTargets = this.loadKeyTargets(1 /* StorageScope.WORKSPACE */);
        }
        return this._workspaceKeyTargets;
    }
    get profileKeyTargets() {
        if (!this._profileKeyTargets) {
            this._profileKeyTargets = this.loadKeyTargets(0 /* StorageScope.PROFILE */);
        }
        return this._profileKeyTargets;
    }
    get applicationKeyTargets() {
        if (!this._applicationKeyTargets) {
            this._applicationKeyTargets = this.loadKeyTargets(-1 /* StorageScope.APPLICATION */);
        }
        return this._applicationKeyTargets;
    }
    getKeyTargets(scope) {
        switch (scope) {
            case -1 /* StorageScope.APPLICATION */:
                return this.applicationKeyTargets;
            case 0 /* StorageScope.PROFILE */:
                return this.profileKeyTargets;
            default:
                return this.workspaceKeyTargets;
        }
    }
    loadKeyTargets(scope) {
        const storage = this.getStorage(scope);
        return storage ? loadKeyTargets(storage) : Object.create(null);
    }
}
AbstractStorageService.DEFAULT_FLUSH_INTERVAL = 60 * 1000; // every minute
export { AbstractStorageService };
export class InMemoryStorageService extends AbstractStorageService {
    constructor() {
        super();
        this.applicationStorage = this._register(new Storage(new InMemoryStorageDatabase(), { hint: StorageHint.STORAGE_IN_MEMORY }));
        this.profileStorage = this._register(new Storage(new InMemoryStorageDatabase(), { hint: StorageHint.STORAGE_IN_MEMORY }));
        this.workspaceStorage = this._register(new Storage(new InMemoryStorageDatabase(), { hint: StorageHint.STORAGE_IN_MEMORY }));
        this._register(this.workspaceStorage.onDidChangeStorage(key => this.emitDidChangeValue(1 /* StorageScope.WORKSPACE */, key)));
        this._register(this.profileStorage.onDidChangeStorage(key => this.emitDidChangeValue(0 /* StorageScope.PROFILE */, key)));
        this._register(this.applicationStorage.onDidChangeStorage(key => this.emitDidChangeValue(-1 /* StorageScope.APPLICATION */, key)));
    }
    getStorage(scope) {
        switch (scope) {
            case -1 /* StorageScope.APPLICATION */:
                return this.applicationStorage;
            case 0 /* StorageScope.PROFILE */:
                return this.profileStorage;
            default:
                return this.workspaceStorage;
        }
    }
}
