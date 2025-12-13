/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { loadMonaco } from "../monaco-loader";
import { IMessageFromRunner, IMessageToRunner, IPreviewState } from "../shared";
import "./style.scss";

window.addEventListener("message", (event) => {
	/*const isInSandbox = window.origin === "null";
	if (!isInSandbox) {
		// To prevent someone from using this html file to run arbitrary code in non-sandboxed context
		console.error("not in sandbox");
		return;
	}*/
	const e = event.data as IMessageToRunner | { kind: undefined };
	if (e.kind === "initialize") {
		initialize(e.state);
	} else if (e.kind === "update-css") {
		const style = document.getElementById(
			"custom-style"
		) as HTMLStyleElement;
		style.innerHTML = e.css; // CodeQL [SM03712] This is safe because the runner runs in an isolated iframe.
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
	style.id = "custom-style";
	style.innerHTML = state.css; // CodeQL [SM03712] This is safe because the runner runs in an isolated iframe. This feature is essential to the functionality of the playground. // CodeQL [SM02688] This is safe because the runner runs in an isolated iframe. This feature is essential to the functionality of the playground.
	document.body.appendChild(style);

	document.body.innerHTML += state.html;

	const js = massageJs(state.js);

	try {
		eval(js); // CodeQL [SM01632] This is safe because the runner runs in an isolated iframe. This feature is essential to the functionality of the playground. // CodeQL [SM02688] This is safe because the runner runs in an isolated iframe. This feature is essential to the functionality of the playground.
	} catch (err) {
		const pre = document.createElement("pre");
		pre.appendChild(
			document.createTextNode(`${err}: ${(err as any).state}`)
		);
		document.body.insertBefore(pre, document.body.firstChild);
	}
}

function sendMessageToParent(message: IMessageFromRunner) {
	window.parent.postMessage(message, "*");
}

(globalThis as any).$sendMessageToParent = sendMessageToParent;

(globalThis as any).$bindModelToCodeStr = function bindModel(
	model: any,
	codeStringName: string
) {
	model.onDidChangeContent(() => {
		const value = model.getValue();
		sendMessageToParent({
			kind: "update-code-string",
			codeStringName,
			value,
		});
	});
};

function massageJs(js: string) {
	/*
	Alternate experimental syntax: // bind to code string: `editor.getModel()` -> codeString

	const bindToCodeStringRegexp = /\/\/ bind to code string: `(.*?)` -> (.*?)(\n|$)/g;
	js = js.replaceAll(bindToCodeStringRegexp, (match, p1, p2) => {
		return `globalThis.bindModelToCodeStr(${p1}, ${JSON.stringify(p2)})\n`;
	});
	*/

	const setFromRegexp = /\/*\Wset from `(.*?)`:\W*\//g;
	for (const m of js.matchAll(setFromRegexp)) {
		const p1 = m[1];
		const target = JSON.stringify("set from `" + p1 + "`");
		js += `\n try { globalThis.$bindModelToCodeStr(${p1}, ${target}); } catch (e) { console.error(e); }`;
	}
	return js;
}
