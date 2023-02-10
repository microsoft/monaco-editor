/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMonacoSetup } from "./monaco-loader";

export type IMessage = {
	kind: "initialize";
	state: IPreviewState;
};

export interface IPlaygroundProject {
	js: string;
	css: string;
	html: string;
}

export interface IPreviewState extends IPlaygroundProject {
	monacoSetup: IMonacoSetup;
}
