/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { loadMonaco } from "../monaco-loader";
import { IMessage, IPreviewState } from "../shared";
import "./style.scss";

window.addEventListener("message", (event) => {
	const isInSandbox = window.origin === "null";
	if (!isInSandbox) {
		// To prevent someone from using this html file to run arbitrary code in non-sandboxed context
		console.error("not in sandbox");
		return;
	}
	const e = event.data as IMessage | { kind: undefined };
	if (e.kind === "initialize") {
		initialize(e.state);
	}
});

let monacoPromise: Promise<any> | undefined = undefined;

async function initialize(state: IPreviewState) {
	if (monacoPromise) {
		throw new Error("already initialized");
	}

	const loadingContainerDiv = document.createElement("div");
	loadingContainerDiv.className = "loader-container";
	const loadingDiv = document.createElement("div");
	loadingDiv.className = "loader";
	loadingContainerDiv.appendChild(loadingDiv);
	document.body.appendChild(loadingContainerDiv);

	monacoPromise = loadMonaco(state.monacoSetup);
	await monacoPromise;

	loadingContainerDiv.remove();

	const style = document.createElement("style");
	style.innerHTML = state.css;
	document.body.appendChild(style);

	document.body.innerHTML += state.html;

	try {
		eval(state.js);
	} catch (err) {
		const pre = document.createElement("pre");
		pre.appendChild(
			document.createTextNode(`${err}: ${(err as any).state}`)
		);
		document.body.insertBefore(pre, document.body.firstChild);
	}
}
