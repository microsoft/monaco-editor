export interface IDisposable {
    dispose(): void;
}

export class Disposable implements IDisposable {
    static None = Object.freeze<IDisposable>({ dispose() { } });

    private _store = new DisposableStore();

    constructor() { }

    public dispose(): void {
        this._store.dispose();
    }

    protected _register<T extends IDisposable>(t: T): T {
        if ((t as any) === this) {
            throw new Error('Cannot register a disposable on itself!');
        }
        return this._store.add(t);
    }
}

export class DisposableStore implements IDisposable {
    static DISABLE_DISPOSED_WARNING = false;

    private _toDispose = new Set<IDisposable>();
    private _isDisposed = false;

    public dispose(): void {
        if (this._isDisposed) {
            return;
        }

        this._isDisposed = true;
        this.clear();
    }

    public clear(): void {
        if (this._toDispose.size === 0) {
            return;
        }

        try {
            for (const item of this._toDispose) {
                item.dispose();
            }
        } finally {
            this._toDispose.clear();
        }
    }

    public add<T extends IDisposable>(t: T): T {
        if (!t) {
            return t;
        }
        if ((t as any) === this) {
            throw new Error('Cannot register a disposable on itself!');
        }

        if (this._isDisposed) {
            if (!DisposableStore.DISABLE_DISPOSED_WARNING) {
                console.warn(
                    new Error(
                        'Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!'
                    ).stack
                );
            }
        } else {
            this._toDispose.add(t);
        }

        return t;
    }
}
