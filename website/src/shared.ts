/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMonacoSetup } from "./monaco-loader";

export type IMessageToRunner =
	| {
			kind: "initialize";
			state: IPreviewState;
	  }
	| {
			kind: "update-css";
			css: string;
	  };

export type IMessageFromRunner =
	| {
			kind: "update-code-string";
			codeStringName: string;
			value: string;
	  }
	| {
			kind: "reload";
	  };

export interface IPlaygroundProject {
	js: string;
	css: string;
	html: string;
}

export interface IPreviewState extends IPlaygroundProject {
	reloadKey: number;
	monacoSetup: IMonacoSetup;
}
