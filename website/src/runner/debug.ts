/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { loadMonaco } from "../monaco-loader";
import { IPreviewState } from "../shared";
import { LzmaCompressor } from "../website/utils/lzmaCompressor";
import "./style.scss";

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

	const js = state.js;

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

async function main() {
	const compressor = new LzmaCompressor<IPreviewState>();
	const stateStr = new URLSearchParams(window.location.search).get("state");
	const state = compressor.decodeData<IPreviewState>(stateStr!);

	const previousStateStr = localStorage.getItem("stateStr");
	if (previousStateStr === stateStr) {
		initialize(state);
	} else {
		// If it does not, show the load button
		const loadButton = document.createElement("button");
		loadButton.style.position = "absolute";
		loadButton.style.top = "50%";
		loadButton.style.left = "50%";
		loadButton.style.transform = "translate(-50%, -50%)";
		loadButton.innerText = "Load";
		loadButton.style.padding = "10px 20px";
		loadButton.onclick = () => {
			loadButton.remove();
			localStorage.setItem("stateStr", stateStr!);
			initialize(state);
		};
		document.body.appendChild(loadButton);
	}
}
main();
