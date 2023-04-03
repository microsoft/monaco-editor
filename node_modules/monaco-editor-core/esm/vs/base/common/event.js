import { onUnexpectedError } from './errors.js';
import { once as onceFn } from './functional.js';
import { combinedDisposable, Disposable, DisposableStore, SafeDisposable, toDisposable } from './lifecycle.js';
import { LinkedList } from './linkedList.js';
import { StopWatch } from './stopwatch.js';
// -----------------------------------------------------------------------------------------------------------------------
// Uncomment the next line to print warnings whenever an emitter with listeners is disposed. That is a sign of code smell.
// -----------------------------------------------------------------------------------------------------------------------
const _enableDisposeWithListenerWarning = false;
// _enableDisposeWithListenerWarning = Boolean("TRUE"); // causes a linter warning so that it cannot be pushed
// -----------------------------------------------------------------------------------------------------------------------
// Uncomment the next line to print warnings whenever a snapshotted event is used repeatedly without cleanup.
// See https://github.com/microsoft/vscode/issues/142851
// -----------------------------------------------------------------------------------------------------------------------
const _enableSnapshotPotentialLeakWarning = false;
export var Event;
(function (Event) {
    Event.None = () => Disposable.None;
    function _addLeakageTraceLogic(options) {
        if (_enableSnapshotPotentialLeakWarning) {
            const { onDidAddListener: origListenerDidAdd } = options;
            const stack = Stacktrace.create();
            let count = 0;
            options.onDidAddListener = () => {
                if (++count === 2) {
                    console.warn('snapshotted emitter LIKELY used public and SHOULD HAVE BEEN created with DisposableStore. snapshotted here');
                    stack.print();
                }
                origListenerDidAdd === null || origListenerDidAdd === void 0 ? void 0 : origListenerDidAdd();
            };
        }
    }
    /**
     * Given an event, returns another event which debounces calls and defers the listeners to a later task via a shared
     * `setTimeout`. The event is converted into a signal (`Event<void>`) to avoid additional object creation as a
     * result of merging events and to try prevent race conditions that could arise when using related deferred and
     * non-deferred events.
     *
     * This is useful for deferring non-critical work (eg. general UI updates) to ensure it does not block critical work
     * (eg. latency of keypress to text rendered).
     *
     * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
     * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
     * returned event causes this utility to leak a listener on the original event.
     *
     * @param event The event source for the new event.
     * @param disposable A disposable store to add the new EventEmitter to.
     */
    function defer(event, disposable) {
        return debounce(event, () => void 0, 0, undefined, true, undefined, disposable);
    }
    Event.defer = defer;
    /**
     * Given an event, returns another event which only fires once.
     *
     * @param event The event source for the new event.
     */
    function once(event) {
        return (listener, thisArgs = null, disposables) => {
            // we need this, in case the event fires during the listener call
            let didFire = false;
            let result = undefined;
            result = event(e => {
                if (didFire) {
                    return;
                }
                else if (result) {
                    result.dispose();
                }
                else {
                    didFire = true;
                }
                return listener.call(thisArgs, e);
            }, null, disposables);
            if (didFire) {
                result.dispose();
            }
            return result;
        };
    }
    Event.once = once;
    /**
     * Maps an event of one type into an event of another type using a mapping function, similar to how
     * `Array.prototype.map` works.
     *
     * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
     * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
     * returned event causes this utility to leak a listener on the original event.
     *
     * @param event The event source for the new event.
     * @param map The mapping function.
     * @param disposable A disposable store to add the new EventEmitter to.
     */
    function map(event, map, disposable) {
        return snapshot((listener, thisArgs = null, disposables) => event(i => listener.call(thisArgs, map(i)), null, disposables), disposable);
    }
    Event.map = map;
    /**
     * Wraps an event in another event that performs some function on the event object before firing.
     *
     * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
     * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
     * returned event causes this utility to leak a listener on the original event.
     *
     * @param event The event source for the new event.
     * @param each The function to perform on the event object.
     * @param disposable A disposable store to add the new EventEmitter to.
     */
    function forEach(event, each, disposable) {
        return snapshot((listener, thisArgs = null, disposables) => event(i => { each(i); listener.call(thisArgs, i); }, null, disposables), disposable);
    }
    Event.forEach = forEach;
    function filter(event, filter, disposable) {
        return snapshot((listener, thisArgs = null, disposables) => event(e => filter(e) && listener.call(thisArgs, e), null, disposables), disposable);
    }
    Event.filter = filter;
    /**
     * Given an event, returns the same event but typed as `Event<void>`.
     */
    function signal(event) {
        return event;
    }
    Event.signal = signal;
    function any(...events) {
        return (listener, thisArgs = null, disposables) => combinedDisposable(...events.map(event => event(e => listener.call(thisArgs, e), null, disposables)));
    }
    Event.any = any;
    /**
     * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
     * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
     * returned event causes this utility to leak a listener on the original event.
     */
    function reduce(event, merge, initial, disposable) {
        let output = initial;
        return map(event, e => {
            output = merge(output, e);
            return output;
        }, disposable);
    }
    Event.reduce = reduce;
    function snapshot(event, disposable) {
        let listener;
        const options = {
            onWillAddFirstListener() {
                listener = event(emitter.fire, emitter);
            },
            onDidRemoveLastListener() {
                listener === null || listener === void 0 ? void 0 : listener.dispose();
            }
        };
        if (!disposable) {
            _addLeakageTraceLogic(options);
        }
        const emitter = new Emitter(options);
        disposable === null || disposable === void 0 ? void 0 : disposable.add(emitter);
        return emitter.event;
    }
    function debounce(event, merge, delay = 100, leading = false, flushOnListenerRemove = false, leakWarningThreshold, disposable) {
        let subscription;
        let output = undefined;
        let handle = undefined;
        let numDebouncedCalls = 0;
        let doFire;
        const options = {
            leakWarningThreshold,
            onWillAddFirstListener() {
                subscription = event(cur => {
                    numDebouncedCalls++;
                    output = merge(output, cur);
                    if (leading && !handle) {
                        emitter.fire(output);
                        output = undefined;
                    }
                    doFire = () => {
                        const _output = output;
                        output = undefined;
                        handle = undefined;
                        if (!leading || numDebouncedCalls > 1) {
                            emitter.fire(_output);
                        }
                        numDebouncedCalls = 0;
                    };
                    if (typeof delay === 'number') {
                        clearTimeout(handle);
                        handle = setTimeout(doFire, delay);
                    }
                    else {
                        if (handle === undefined) {
                            handle = 0;
                            queueMicrotask(doFire);
                        }
                    }
                });
            },
            onWillRemoveListener() {
                if (flushOnListenerRemove && numDebouncedCalls > 0) {
                    doFire === null || doFire === void 0 ? void 0 : doFire();
                }
            },
            onDidRemoveLastListener() {
                doFire = undefined;
                subscription.dispose();
            }
        };
        if (!disposable) {
            _addLeakageTraceLogic(options);
        }
        const emitter = new Emitter(options);
        disposable === null || disposable === void 0 ? void 0 : disposable.add(emitter);
        return emitter.event;
    }
    Event.debounce = debounce;
    /**
     * Debounces an event, firing after some delay (default=0) with an array of all event original objects.
     *
     * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
     * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
     * returned event causes this utility to leak a listener on the original event.
     */
    function accumulate(event, delay = 0, disposable) {
        return Event.debounce(event, (last, e) => {
            if (!last) {
                return [e];
            }
            last.push(e);
            return last;
        }, delay, undefined, true, undefined, disposable);
    }
    Event.accumulate = accumulate;
    /**
     * Filters an event such that some condition is _not_ met more than once in a row, effectively ensuring duplicate
     * event objects from different sources do not fire the same event object.
     *
     * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
     * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
     * returned event causes this utility to leak a listener on the original event.
     *
     * @param event The event source for the new event.
     * @param equals The equality condition.
     * @param disposable A disposable store to add the new EventEmitter to.
     *
     * @example
     * ```
     * // Fire only one time when a single window is opened or focused
     * Event.latch(Event.any(onDidOpenWindow, onDidFocusWindow))
     * ```
     */
    function latch(event, equals = (a, b) => a === b, disposable) {
        let firstCall = true;
        let cache;
        return filter(event, value => {
            const shouldEmit = firstCall || !equals(value, cache);
            firstCall = false;
            cache = value;
            return shouldEmit;
        }, disposable);
    }
    Event.latch = latch;
    /**
     * Splits an event whose parameter is a union type into 2 separate events for each type in the union.
     *
     * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
     * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
     * returned event causes this utility to leak a listener on the original event.
     *
     * @example
     * ```
     * const event = new EventEmitter<number | undefined>().event;
     * const [numberEvent, undefinedEvent] = Event.split(event, isUndefined);
     * ```
     *
     * @param event The event source for the new event.
     * @param isT A function that determines what event is of the first type.
     * @param disposable A disposable store to add the new EventEmitter to.
     */
    function split(event, isT, disposable) {
        return [
            Event.filter(event, isT, disposable),
            Event.filter(event, e => !isT(e), disposable),
        ];
    }
    Event.split = split;
    /**
     * Buffers an event until it has a listener attached.
     *
     * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
     * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
     * returned event causes this utility to leak a listener on the original event.
     *
     * @param event The event source for the new event.
     * @param flushAfterTimeout Determines whether to flush the buffer after a timeout immediately or after a
     * `setTimeout` when the first event listener is added.
     * @param _buffer Internal: A source event array used for tests.
     *
     * @example
     * ```
     * // Start accumulating events, when the first listener is attached, flush
     * // the event after a timeout such that multiple listeners attached before
     * // the timeout would receive the event
     * this.onInstallExtension = Event.buffer(service.onInstallExtension, true);
     * ```
     */
    function buffer(event, flushAfterTimeout = false, _buffer = []) {
        let buffer = _buffer.slice();
        let listener = event(e => {
            if (buffer) {
                buffer.push(e);
            }
            else {
                emitter.fire(e);
            }
        });
        const flush = () => {
            buffer === null || buffer === void 0 ? void 0 : buffer.forEach(e => emitter.fire(e));
            buffer = null;
        };
        const emitter = new Emitter({
            onWillAddFirstListener() {
                if (!listener) {
                    listener = event(e => emitter.fire(e));
                }
            },
            onDidAddFirstListener() {
                if (buffer) {
                    if (flushAfterTimeout) {
                        setTimeout(flush);
                    }
                    else {
                        flush();
                    }
                }
            },
            onDidRemoveLastListener() {
                if (listener) {
                    listener.dispose();
                }
                listener = null;
            }
        });
        return emitter.event;
    }
    Event.buffer = buffer;
    class ChainableEvent {
        constructor(event) {
            this.event = event;
            this.disposables = new DisposableStore();
        }
        /** @see {@link Event.map} */
        map(fn) {
            return new ChainableEvent(map(this.event, fn, this.disposables));
        }
        /** @see {@link Event.forEach} */
        forEach(fn) {
            return new ChainableEvent(forEach(this.event, fn, this.disposables));
        }
        filter(fn) {
            return new ChainableEvent(filter(this.event, fn, this.disposables));
        }
        /** @see {@link Event.reduce} */
        reduce(merge, initial) {
            return new ChainableEvent(reduce(this.event, merge, initial, this.disposables));
        }
        /** @see {@link Event.reduce} */
        latch() {
            return new ChainableEvent(latch(this.event, undefined, this.disposables));
        }
        debounce(merge, delay = 100, leading = false, flushOnListenerRemove = false, leakWarningThreshold) {
            return new ChainableEvent(debounce(this.event, merge, delay, leading, flushOnListenerRemove, leakWarningThreshold, this.disposables));
        }
        /**
         * Attach a listener to the event.
         */
        on(listener, thisArgs, disposables) {
            return this.event(listener, thisArgs, disposables);
        }
        /** @see {@link Event.once} */
        once(listener, thisArgs, disposables) {
            return once(this.event)(listener, thisArgs, disposables);
        }
        dispose() {
            this.disposables.dispose();
        }
    }
    /**
     * Wraps the event in an {@link IChainableEvent}, allowing a more functional programming style.
     *
     * @example
     * ```
     * // Normal
     * const onEnterPressNormal = Event.filter(
     *   Event.map(onKeyPress.event, e => new StandardKeyboardEvent(e)),
     *   e.keyCode === KeyCode.Enter
     * ).event;
     *
     * // Using chain
     * const onEnterPressChain = Event.chain(onKeyPress.event)
     *   .map(e => new StandardKeyboardEvent(e))
     *   .filter(e => e.keyCode === KeyCode.Enter)
     *   .event;
     * ```
     */
    function chain(event) {
        return new ChainableEvent(event);
    }
    Event.chain = chain;
    /**
     * Creates an {@link Event} from a node event emitter.
     */
    function fromNodeEventEmitter(emitter, eventName, map = id => id) {
        const fn = (...args) => result.fire(map(...args));
        const onFirstListenerAdd = () => emitter.on(eventName, fn);
        const onLastListenerRemove = () => emitter.removeListener(eventName, fn);
        const result = new Emitter({ onWillAddFirstListener: onFirstListenerAdd, onDidRemoveLastListener: onLastListenerRemove });
        return result.event;
    }
    Event.fromNodeEventEmitter = fromNodeEventEmitter;
    /**
     * Creates an {@link Event} from a DOM event emitter.
     */
    function fromDOMEventEmitter(emitter, eventName, map = id => id) {
        const fn = (...args) => result.fire(map(...args));
        const onFirstListenerAdd = () => emitter.addEventListener(eventName, fn);
        const onLastListenerRemove = () => emitter.removeEventListener(eventName, fn);
        const result = new Emitter({ onWillAddFirstListener: onFirstListenerAdd, onDidRemoveLastListener: onLastListenerRemove });
        return result.event;
    }
    Event.fromDOMEventEmitter = fromDOMEventEmitter;
    /**
     * Creates a promise out of an event, using the {@link Event.once} helper.
     */
    function toPromise(event) {
        return new Promise(resolve => once(event)(resolve));
    }
    Event.toPromise = toPromise;
    /**
     * Adds a listener to an event and calls the listener immediately with undefined as the event object.
     *
     * @example
     * ```
     * // Initialize the UI and update it when dataChangeEvent fires
     * runAndSubscribe(dataChangeEvent, () => this._updateUI());
     * ```
     */
    function runAndSubscribe(event, handler) {
        handler(undefined);
        return event(e => handler(e));
    }
    Event.runAndSubscribe = runAndSubscribe;
    /**
     * Adds a listener to an event and calls the listener immediately with undefined as the event object. A new
     * {@link DisposableStore} is passed to the listener which is disposed when the returned disposable is disposed.
     */
    function runAndSubscribeWithStore(event, handler) {
        let store = null;
        function run(e) {
            store === null || store === void 0 ? void 0 : store.dispose();
            store = new DisposableStore();
            handler(e, store);
        }
        run(undefined);
        const disposable = event(e => run(e));
        return toDisposable(() => {
            disposable.dispose();
            store === null || store === void 0 ? void 0 : store.dispose();
        });
    }
    Event.runAndSubscribeWithStore = runAndSubscribeWithStore;
    class EmitterObserver {
        constructor(obs, store) {
            this.obs = obs;
            this._counter = 0;
            this._hasChanged = false;
            const options = {
                onWillAddFirstListener: () => {
                    obs.addObserver(this);
                },
                onDidRemoveLastListener: () => {
                    obs.removeObserver(this);
                }
            };
            if (!store) {
                _addLeakageTraceLogic(options);
            }
            this.emitter = new Emitter(options);
            if (store) {
                store.add(this.emitter);
            }
        }
        beginUpdate(_observable) {
            // console.assert(_observable === this.obs);
            this._counter++;
        }
        handleChange(_observable, _change) {
            this._hasChanged = true;
        }
        endUpdate(_observable) {
            if (--this._counter === 0) {
                if (this._hasChanged) {
                    this._hasChanged = false;
                    this.emitter.fire(this.obs.get());
                }
            }
        }
    }
    function fromObservable(obs, store) {
        const observer = new EmitterObserver(obs, store);
        return observer.emitter.event;
    }
    Event.fromObservable = fromObservable;
})(Event || (Event = {}));
class EventProfiling {
    constructor(name) {
        this.listenerCount = 0;
        this.invocationCount = 0;
        this.elapsedOverall = 0;
        this.durations = [];
        this.name = `${name}_${EventProfiling._idPool++}`;
        EventProfiling.all.add(this);
    }
    start(listenerCount) {
        this._stopWatch = new StopWatch(true);
        this.listenerCount = listenerCount;
    }
    stop() {
        if (this._stopWatch) {
            const elapsed = this._stopWatch.elapsed();
            this.durations.push(elapsed);
            this.elapsedOverall += elapsed;
            this.invocationCount += 1;
            this._stopWatch = undefined;
        }
    }
}
EventProfiling.all = new Set();
EventProfiling._idPool = 0;
export { EventProfiling };
let _globalLeakWarningThreshold = -1;
class LeakageMonitor {
    constructor(threshold, name = Math.random().toString(18).slice(2, 5)) {
        this.threshold = threshold;
        this.name = name;
        this._warnCountdown = 0;
    }
    dispose() {
        var _a;
        (_a = this._stacks) === null || _a === void 0 ? void 0 : _a.clear();
    }
    check(stack, listenerCount) {
        const threshold = this.threshold;
        if (threshold <= 0 || listenerCount < threshold) {
            return undefined;
        }
        if (!this._stacks) {
            this._stacks = new Map();
        }
        const count = (this._stacks.get(stack.value) || 0);
        this._stacks.set(stack.value, count + 1);
        this._warnCountdown -= 1;
        if (this._warnCountdown <= 0) {
            // only warn on first exceed and then every time the limit
            // is exceeded by 50% again
            this._warnCountdown = threshold * 0.5;
            // find most frequent listener and print warning
            let topStack;
            let topCount = 0;
            for (const [stack, count] of this._stacks) {
                if (!topStack || topCount < count) {
                    topStack = stack;
                    topCount = count;
                }
            }
            console.warn(`[${this.name}] potential listener LEAK detected, having ${listenerCount} listeners already. MOST frequent listener (${topCount}):`);
            console.warn(topStack);
        }
        return () => {
            const count = (this._stacks.get(stack.value) || 0);
            this._stacks.set(stack.value, count - 1);
        };
    }
}
class Stacktrace {
    static create() {
        var _a;
        return new Stacktrace((_a = new Error().stack) !== null && _a !== void 0 ? _a : '');
    }
    constructor(value) {
        this.value = value;
    }
    print() {
        console.warn(this.value.split('\n').slice(2).join('\n'));
    }
}
class Listener {
    constructor(callback, callbackThis, stack) {
        this.callback = callback;
        this.callbackThis = callbackThis;
        this.stack = stack;
        this.subscription = new SafeDisposable();
    }
    invoke(e) {
        this.callback.call(this.callbackThis, e);
    }
}
/**
 * The Emitter can be used to expose an Event to the public
 * to fire it from the insides.
 * Sample:
    class Document {

        private readonly _onDidChange = new Emitter<(value:string)=>any>();

        public onDidChange = this._onDidChange.event;

        // getter-style
        // get onDidChange(): Event<(value:string)=>any> {
        // 	return this._onDidChange.event;
        // }

        private _doIt() {
            //...
            this._onDidChange.fire(value);
        }
    }
 */
export class Emitter {
    constructor(options) {
        var _a, _b, _c, _d, _e;
        this._disposed = false;
        this._options = options;
        this._leakageMon = _globalLeakWarningThreshold > 0 || ((_a = this._options) === null || _a === void 0 ? void 0 : _a.leakWarningThreshold) ? new LeakageMonitor((_c = (_b = this._options) === null || _b === void 0 ? void 0 : _b.leakWarningThreshold) !== null && _c !== void 0 ? _c : _globalLeakWarningThreshold) : undefined;
        this._perfMon = ((_d = this._options) === null || _d === void 0 ? void 0 : _d._profName) ? new EventProfiling(this._options._profName) : undefined;
        this._deliveryQueue = (_e = this._options) === null || _e === void 0 ? void 0 : _e.deliveryQueue;
    }
    dispose() {
        var _a, _b, _c, _d;
        if (!this._disposed) {
            this._disposed = true;
            // It is bad to have listeners at the time of disposing an emitter, it is worst to have listeners keep the emitter
            // alive via the reference that's embedded in their disposables. Therefore we loop over all remaining listeners and
            // unset their subscriptions/disposables. Looping and blaming remaining listeners is done on next tick because the
            // the following programming pattern is very popular:
            //
            // const someModel = this._disposables.add(new ModelObject()); // (1) create and register model
            // this._disposables.add(someModel.onDidChange(() => { ... }); // (2) subscribe and register model-event listener
            // ...later...
            // this._disposables.dispose(); disposes (1) then (2): don't warn after (1) but after the "overall dispose" is done
            if (this._listeners) {
                if (_enableDisposeWithListenerWarning) {
                    const listeners = Array.from(this._listeners);
                    queueMicrotask(() => {
                        var _a;
                        for (const listener of listeners) {
                            if (listener.subscription.isset()) {
                                listener.subscription.unset();
                                (_a = listener.stack) === null || _a === void 0 ? void 0 : _a.print();
                            }
                        }
                    });
                }
                this._listeners.clear();
            }
            (_a = this._deliveryQueue) === null || _a === void 0 ? void 0 : _a.clear(this);
            (_c = (_b = this._options) === null || _b === void 0 ? void 0 : _b.onDidRemoveLastListener) === null || _c === void 0 ? void 0 : _c.call(_b);
            (_d = this._leakageMon) === null || _d === void 0 ? void 0 : _d.dispose();
        }
    }
    /**
     * For the public to allow to subscribe
     * to events from this Emitter
     */
    get event() {
        if (!this._event) {
            this._event = (callback, thisArgs, disposables) => {
                var _a, _b, _c;
                if (!this._listeners) {
                    this._listeners = new LinkedList();
                }
                if (this._leakageMon && this._listeners.size > this._leakageMon.threshold * 3) {
                    console.warn(`[${this._leakageMon.name}] REFUSES to accept new listeners because it exceeded its threshold by far`);
                    return Disposable.None;
                }
                const firstListener = this._listeners.isEmpty();
                if (firstListener && ((_a = this._options) === null || _a === void 0 ? void 0 : _a.onWillAddFirstListener)) {
                    this._options.onWillAddFirstListener(this);
                }
                let removeMonitor;
                let stack;
                if (this._leakageMon && this._listeners.size >= Math.ceil(this._leakageMon.threshold * 0.2)) {
                    // check and record this emitter for potential leakage
                    stack = Stacktrace.create();
                    removeMonitor = this._leakageMon.check(stack, this._listeners.size + 1);
                }
                if (_enableDisposeWithListenerWarning) {
                    stack = stack !== null && stack !== void 0 ? stack : Stacktrace.create();
                }
                const listener = new Listener(callback, thisArgs, stack);
                const removeListener = this._listeners.push(listener);
                if (firstListener && ((_b = this._options) === null || _b === void 0 ? void 0 : _b.onDidAddFirstListener)) {
                    this._options.onDidAddFirstListener(this);
                }
                if ((_c = this._options) === null || _c === void 0 ? void 0 : _c.onDidAddListener) {
                    this._options.onDidAddListener(this, callback, thisArgs);
                }
                const result = listener.subscription.set(() => {
                    var _a, _b;
                    removeMonitor === null || removeMonitor === void 0 ? void 0 : removeMonitor();
                    if (!this._disposed) {
                        (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.onWillRemoveListener) === null || _b === void 0 ? void 0 : _b.call(_a, this);
                        removeListener();
                        if (this._options && this._options.onDidRemoveLastListener) {
                            const hasListeners = (this._listeners && !this._listeners.isEmpty());
                            if (!hasListeners) {
                                this._options.onDidRemoveLastListener(this);
                            }
                        }
                    }
                });
                if (disposables instanceof DisposableStore) {
                    disposables.add(result);
                }
                else if (Array.isArray(disposables)) {
                    disposables.push(result);
                }
                return result;
            };
        }
        return this._event;
    }
    /**
     * To be kept private to fire an event to
     * subscribers
     */
    fire(event) {
        var _a, _b, _c;
        if (this._listeners) {
            // put all [listener,event]-pairs into delivery queue
            // then emit all event. an inner/nested event might be
            // the driver of this
            if (!this._deliveryQueue) {
                this._deliveryQueue = new PrivateEventDeliveryQueue((_a = this._options) === null || _a === void 0 ? void 0 : _a.onListenerError);
            }
            for (const listener of this._listeners) {
                this._deliveryQueue.push(this, listener, event);
            }
            // start/stop performance insight collection
            (_b = this._perfMon) === null || _b === void 0 ? void 0 : _b.start(this._deliveryQueue.size);
            this._deliveryQueue.deliver();
            (_c = this._perfMon) === null || _c === void 0 ? void 0 : _c.stop();
        }
    }
    hasListeners() {
        if (!this._listeners) {
            return false;
        }
        return !this._listeners.isEmpty();
    }
}
export class EventDeliveryQueue {
    constructor(_onListenerError = onUnexpectedError) {
        this._onListenerError = _onListenerError;
        this._queue = new LinkedList();
    }
    get size() {
        return this._queue.size;
    }
    push(emitter, listener, event) {
        this._queue.push(new EventDeliveryQueueElement(emitter, listener, event));
    }
    clear(emitter) {
        const newQueue = new LinkedList();
        for (const element of this._queue) {
            if (element.emitter !== emitter) {
                newQueue.push(element);
            }
        }
        this._queue = newQueue;
    }
    deliver() {
        while (this._queue.size > 0) {
            const element = this._queue.shift();
            try {
                element.listener.invoke(element.event);
            }
            catch (e) {
                this._onListenerError(e);
            }
        }
    }
}
/**
 * An `EventDeliveryQueue` that is guaranteed to be used by a single `Emitter`.
 */
class PrivateEventDeliveryQueue extends EventDeliveryQueue {
    clear(emitter) {
        // Here we can just clear the entire linked list because
        // all elements are guaranteed to belong to this emitter
        this._queue.clear();
    }
}
class EventDeliveryQueueElement {
    constructor(emitter, listener, event) {
        this.emitter = emitter;
        this.listener = listener;
        this.event = event;
    }
}
export class PauseableEmitter extends Emitter {
    constructor(options) {
        super(options);
        this._isPaused = 0;
        this._eventQueue = new LinkedList();
        this._mergeFn = options === null || options === void 0 ? void 0 : options.merge;
    }
    pause() {
        this._isPaused++;
    }
    resume() {
        if (this._isPaused !== 0 && --this._isPaused === 0) {
            if (this._mergeFn) {
                // use the merge function to create a single composite
                // event. make a copy in case firing pauses this emitter
                if (this._eventQueue.size > 0) {
                    const events = Array.from(this._eventQueue);
                    this._eventQueue.clear();
                    super.fire(this._mergeFn(events));
                }
            }
            else {
                // no merging, fire each event individually and test
                // that this emitter isn't paused halfway through
                while (!this._isPaused && this._eventQueue.size !== 0) {
                    super.fire(this._eventQueue.shift());
                }
            }
        }
    }
    fire(event) {
        if (this._listeners) {
            if (this._isPaused !== 0) {
                this._eventQueue.push(event);
            }
            else {
                super.fire(event);
            }
        }
    }
}
export class DebounceEmitter extends PauseableEmitter {
    constructor(options) {
        var _a;
        super(options);
        this._delay = (_a = options.delay) !== null && _a !== void 0 ? _a : 100;
    }
    fire(event) {
        if (!this._handle) {
            this.pause();
            this._handle = setTimeout(() => {
                this._handle = undefined;
                this.resume();
            }, this._delay);
        }
        super.fire(event);
    }
}
/**
 * An emitter which queue all events and then process them at the
 * end of the event loop.
 */
export class MicrotaskEmitter extends Emitter {
    constructor(options) {
        super(options);
        this._queuedEvents = [];
        this._mergeFn = options === null || options === void 0 ? void 0 : options.merge;
    }
    fire(event) {
        if (!this.hasListeners()) {
            return;
        }
        this._queuedEvents.push(event);
        if (this._queuedEvents.length === 1) {
            queueMicrotask(() => {
                if (this._mergeFn) {
                    super.fire(this._mergeFn(this._queuedEvents));
                }
                else {
                    this._queuedEvents.forEach(e => super.fire(e));
                }
                this._queuedEvents = [];
            });
        }
    }
}
export class EventMultiplexer {
    constructor() {
        this.hasListeners = false;
        this.events = [];
        this.emitter = new Emitter({
            onWillAddFirstListener: () => this.onFirstListenerAdd(),
            onDidRemoveLastListener: () => this.onLastListenerRemove()
        });
    }
    get event() {
        return this.emitter.event;
    }
    add(event) {
        const e = { event: event, listener: null };
        this.events.push(e);
        if (this.hasListeners) {
            this.hook(e);
        }
        const dispose = () => {
            if (this.hasListeners) {
                this.unhook(e);
            }
            const idx = this.events.indexOf(e);
            this.events.splice(idx, 1);
        };
        return toDisposable(onceFn(dispose));
    }
    onFirstListenerAdd() {
        this.hasListeners = true;
        this.events.forEach(e => this.hook(e));
    }
    onLastListenerRemove() {
        this.hasListeners = false;
        this.events.forEach(e => this.unhook(e));
    }
    hook(e) {
        e.listener = e.event(r => this.emitter.fire(r));
    }
    unhook(e) {
        if (e.listener) {
            e.listener.dispose();
        }
        e.listener = null;
    }
    dispose() {
        this.emitter.dispose();
    }
}
/**
 * The EventBufferer is useful in situations in which you want
 * to delay firing your events during some code.
 * You can wrap that code and be sure that the event will not
 * be fired during that wrap.
 *
 * ```
 * const emitter: Emitter;
 * const delayer = new EventDelayer();
 * const delayedEvent = delayer.wrapEvent(emitter.event);
 *
 * delayedEvent(console.log);
 *
 * delayer.bufferEvents(() => {
 *   emitter.fire(); // event will not be fired yet
 * });
 *
 * // event will only be fired at this point
 * ```
 */
export class EventBufferer {
    constructor() {
        this.buffers = [];
    }
    wrapEvent(event) {
        return (listener, thisArgs, disposables) => {
            return event(i => {
                const buffer = this.buffers[this.buffers.length - 1];
                if (buffer) {
                    buffer.push(() => listener.call(thisArgs, i));
                }
                else {
                    listener.call(thisArgs, i);
                }
            }, undefined, disposables);
        };
    }
    bufferEvents(fn) {
        const buffer = [];
        this.buffers.push(buffer);
        const r = fn();
        this.buffers.pop();
        buffer.forEach(flush => flush());
        return r;
    }
}
/**
 * A Relay is an event forwarder which functions as a replugabble event pipe.
 * Once created, you can connect an input event to it and it will simply forward
 * events from that input event through its own `event` property. The `input`
 * can be changed at any point in time.
 */
export class Relay {
    constructor() {
        this.listening = false;
        this.inputEvent = Event.None;
        this.inputEventListener = Disposable.None;
        this.emitter = new Emitter({
            onDidAddFirstListener: () => {
                this.listening = true;
                this.inputEventListener = this.inputEvent(this.emitter.fire, this.emitter);
            },
            onDidRemoveLastListener: () => {
                this.listening = false;
                this.inputEventListener.dispose();
            }
        });
        this.event = this.emitter.event;
    }
    set input(event) {
        this.inputEvent = event;
        if (this.listening) {
            this.inputEventListener.dispose();
            this.inputEventListener = event(this.emitter.fire, this.emitter);
        }
    }
    dispose() {
        this.inputEventListener.dispose();
        this.emitter.dispose();
    }
}
