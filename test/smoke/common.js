/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* keeping TS happy */
exports.__nothing = undefined;

/** @typedef {'chromium'|'firefox'|'webkit'} BrowserKind */
/** @typedef {'amd'|'webpack'|'esbuild'|'vite'|'parcel'} PackagerKind */
/** @typedef {{browser:BrowserKind; packager:PackagerKind; debugTests:boolean; port:number;}} TestInfo */
