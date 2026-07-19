/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { autorun, observable } from "mobx";
import { Debouncer } from "./Debouncer";

export function debouncedComputed<T, TDerived>(
	debounceMs: number,
	getData: () => T,
	getDebouncedData: (value: T) => TDerived
): DebouncedComputed<TDerived> {
	return new DebouncedComputed(debounceMs, getData, getDebouncedData as any);
}

export class DebouncedComputed<T> {
	private readonly debouncer = new Debouncer(this.debounceMs);

	@observable
	private _value: T | undefined = undefined;
	public get value(): T | undefined {
		return this._value;
	}

	private readonly r = autorun(() => {
		const d = this.getData();
		this.debouncer.clear();

		this.debouncer.run(() => {
			this._value = this.getDebouncedData(d);
		});
	});

	constructor(
		private readonly debounceMs: number,
		private readonly getData: () => unknown,
		private readonly getDebouncedData: (data: unknown) => T
	) {}
}

export interface Disposable {
	dispose(): void;
}

export namespace Disposable {
	export function fn(): (() => void) & { track(d: Disposable): void } {
		const disposables: Disposable[] = [];
		const fn = () => {
			disposables.forEach((d) => d.dispose());
			disposables.length = 0;
		};
		fn.track = (d: Disposable) => {
			disposables.push(d);
		};
		return fn;
	}
}
