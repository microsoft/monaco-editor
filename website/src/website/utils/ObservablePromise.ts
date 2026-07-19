/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { observable } from "mobx";

export class ObservablePromise<T> {
	public readonly promise: Promise<T>;

	@observable.ref
	private _error: unknown;

	@observable.ref
	private _value: T | null;

	@observable.ref
	private _resolved: boolean;

	public get error(): unknown {
		return this._error;
	}

	public get value(): T | null {
		return this._value;
	}

	public get resolved(): boolean {
		return this._resolved;
	}

	constructor(promise: Promise<T>) {
		this.promise = promise;
		this._value = null;
		this._error = null;
		this._resolved = false;

		this.promise.then(
			(value: T) => {
				this._value = value;
				this._resolved = true;
			},
			(error: unknown) => {
				this._error = error;
				this._resolved = true;
			}
		);
	}
}
