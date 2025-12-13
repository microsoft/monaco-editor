/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function getLoadedMonaco(): typeof monaco {
	if (!monaco) {
		throw new Error("monaco is not loaded yet");
	}
	return monaco;
}

export function getMonaco(): typeof monaco | undefined {
	return (window as any).monaco;
}

export type IAMDMonacoSetup = {
	loaderUrl: string;
	loaderConfigPaths: Record<string, string>;
	codiconUrl: string;
	monacoTypesUrl: string | undefined;
	language?: string;
};

export type IESMMonacoSetup = {
	esmUrl: string;
	monacoTypesUrl: string | undefined;
};

export type IMonacoSetup = IAMDMonacoSetup | IESMMonacoSetup;

let loading = false;
let resolve: (value: typeof monaco) => void;
let reject: (error: unknown) => void;
let loadMonacoPromise = new Promise<typeof monaco>((res, rej) => {
	resolve = res;
	reject = rej;
});

export async function waitForLoadedMonaco(): Promise<typeof monaco> {
	return loadMonacoPromise;
}

export async function loadMonaco(
	setup: IMonacoSetup = prodMonacoSetup
): Promise<typeof monaco> {
	if (!loading) {
		loading = true;
		_loadMonaco(setup).then(resolve, reject);
	}
	return loadMonacoPromise;
}

async function _loadMonaco(setup: IMonacoSetup): Promise<typeof monaco> {
	const global = self as any;

	if ('esmUrl' in setup) {
		return await import(/* webpackIgnore: true */setup.esmUrl); // CodeQL [SM01507] This is safe because the runner (that allows for dynamic paths) runs in an isolated iframe. The hosting website uses a static path configuration. // CodeQL [SM03712] This is safe because the runner (that allows for dynamic paths) runs in an isolated iframe. The hosting website uses a static path configuration.
	}

	if (!(global as any).require) {
		await loadScript(setup.loaderUrl);
	}

	global.AMD = true;
	global.getCodiconPath = () => {
		return setup.codiconUrl;
	};

	/** @type {any} */
	const req = global.require as any;

	// Configure language if specified
	const config: any = { paths: setup.loaderConfigPaths };
	if (setup.language) {
		config["vs/nls"] = {
			availableLanguages: {
				"*": setup.language,
			},
		};
	}

	req.config(config);

	return new Promise((res) => {
		// First load editor.main. If it inlines the plugins, we don't want to try to load them from the server.
		req(["vs/editor/editor.main"], () => {
			if ((setup as any).onlyCore) {
				res(monaco);
				return;
			}
			req(
				[
					"vs/basic-languages/monaco.contribution",
					"vs/language/css/monaco.contribution",
					"vs/language/html/monaco.contribution",
					"vs/language/json/monaco.contribution",
					"vs/language/typescript/monaco.contribution",
				],
				() => {
					res(monaco);
				}
			);
		});
	});
}

function loadScript(path: string): Promise<void> {
	return new Promise((res) => {
		const script = document.createElement("script");
		script.onload = () => res();
		script.async = true;
		script.type = "text/javascript";
		script.src = path; // CodeQL [SM01507] This is safe because the runner (that allows for dynamic paths) runs in an isolated iframe. The hosting website uses a static path configuration. // CodeQL [SM03712] This is safe because the runner (that allows for dynamic paths) runs in an isolated iframe. The hosting website uses a static path configuration.
		document.head.appendChild(script);
	});
}

export const prodMonacoSetup = getMonacoSetup(
	"node_modules/monaco-editor/min/vs"
);

export function getMonacoSetup(
	corePath: string,
	language?: string
): IAMDMonacoSetup {
	const loaderConfigPaths = {
		vs: `${corePath}`,
	};

	return {
		loaderUrl: `${corePath}/loader.js`,
		loaderConfigPaths,
		codiconUrl: `${corePath}/base/browser/ui/codicons/codicon/codicon.ttf`,
		monacoTypesUrl: undefined,
		language,
	};
}
