/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare interface NodeRequire {
	context<T = unknown>(
		path: string,
		includeSubfolders: boolean,
		regexp: RegExp
	): SyncContext<T>;
	context<T = unknown>(
		path: string,
		includeSubfolders: boolean,
		regexp: RegExp,
		mode: "lazy"
	): AsyncContext<T>;
}

interface AsyncContext<T> {
	keys(): string[];
	(key: string): Promise<T>;
}

interface SyncContext<T> {
	keys(): string[];
	(key: string): T;
}
