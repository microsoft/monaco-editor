/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { action, observable } from "mobx";

export function ref<T, TProp extends keyof T>(
	obj: T,
	prop: TProp
): IReference<T[TProp]> {
	return {
		get: () => obj[prop],
		set: (value) => (obj[prop] = value),
	};
}

export interface IReference<T, TSet = T> {
	set(value: TSet): void;
	get(): T;
}

export class ObservableReference<T> implements IReference<T> {
	@observable
	private value: T;

	constructor(value: T) {
		this.value = value;
	}

	@action
	set(value: T): void {
		this.value = value;
	}

	get(): T {
		return this.value;
	}
}
