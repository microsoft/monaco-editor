/**
 * Uses a LRU cache to make a given parametrized function cached.
 * Caches just the last value.
 * The key must be JSON serializable.
*/
export class LRUCachedFunction {
    constructor(fn) {
        this.fn = fn;
        this.lastCache = undefined;
        this.lastArgKey = undefined;
    }
    get(arg) {
        const key = JSON.stringify(arg);
        if (this.lastArgKey !== key) {
            this.lastArgKey = key;
            this.lastCache = this.fn(arg);
        }
        return this.lastCache;
    }
}
/**
 * Uses an unbounded cache (referential equality) to memoize the results of the given function.
*/
export class CachedFunction {
    get cachedValues() {
        return this._map;
    }
    constructor(fn) {
        this.fn = fn;
        this._map = new Map();
    }
    get(arg) {
        if (this._map.has(arg)) {
            return this._map.get(arg);
        }
        const value = this.fn(arg);
        this._map.set(arg, value);
        return value;
    }
}
