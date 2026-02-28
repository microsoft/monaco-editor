/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { action, computed, observable, toJS } from "mobx";
import {
	getMonacoSetup,
	IMonacoSetup,
	prodMonacoSetup,
} from "../../../monaco-loader";

export class SettingsModel {
	private readonly settingsKey = "settings";

	@observable
	private _settings: Readonly<Settings>;

	get settings(): Readonly<Settings> {
		return this._settings;
	}

	@computed.struct
	get monacoSetup(): IMonacoSetup {
		return toLoaderConfig(this.settings);
	}

	get previewFullScreen() {
		return this._settings.previewFullScreen;
	}

	set previewFullScreen(value: boolean) {
		this.setSettings({ ...this._settings, previewFullScreen: value });
	}

	get autoReload() {
		return this._settings.autoReload ?? true;
	}

	set autoReload(value: boolean) {
		this.setSettings({ ...this._settings, autoReload: value });
	}

	constructor() {
		const settingsStr = "";
		try {
			localStorage.getItem(this.settingsKey);
		} catch (e) {
			console.error("Failed to load settings from localStorage", e);
		}
		if (settingsStr) {
			this._settings = JSON.parse(settingsStr);
		} else {
			this._settings = getDefaultSettings();
		}
	}

	@action
	setSettings(settings: Settings): void {
		const settingsJson = JSON.stringify(toJS(settings));
		this._settings = JSON.parse(settingsJson);
		try {
			localStorage.setItem(this.settingsKey, settingsJson);
		} catch (e) {
			console.error("Failed to save settings to localStorage", e);
		}
	}
}

export type Stability = "dev" | "min";
export const StabilityValues: Stability[] = ["dev", "min"];

export interface Settings {
	monacoSource: "latest" | "npm" | "independent" | "custom";
	latestStability: Stability;
	npmStability: Stability;
	npmVersion: string;

	coreSource: "latest" | "url";
	latestCoreStability: Stability;
	coreUrl: string;

	languagesSource: "latest" | "source" | "url";
	latestLanguagesStability: Stability;
	languagesUrl: string;

	customConfig: JsonString<IMonacoSetup>;

	previewFullScreen: boolean;
	autoReload: boolean | undefined;

	language?: string;
}

export type JsonString<T> = string;

export function toLoaderConfig(settings: Settings): IMonacoSetup {
	switch (settings.monacoSource) {
		case "latest":
			return {
				...getMonacoSetup(
					`node_modules/monaco-editor/${settings.latestStability}/vs`,
					settings.language
				),
				monacoTypesUrl: "node_modules/monaco-editor/monaco.d.ts",
			};
		case "npm":
			const url = `https://cdn.jsdelivr.net/npm/monaco-editor@${settings.npmVersion}`;
			return {
				...getMonacoSetup(
					`${url}/${settings.npmStability}/vs`,
					settings.language
				),
				monacoTypesUrl: `${url}/monaco.d.ts`,
			};
		case "custom":
			try {
				return JSON.parse(settings.customConfig);
			} catch (e) {
				console.error(e);
				return prodMonacoSetup;
			}
		case "independent":
			const root = trimEnd(
				new URL(".", window.location.href).toString(),
				"/"
			);
			let coreUrl: string;

			switch (settings.coreSource) {
				case "latest":
					coreUrl = `${root}/node_modules/monaco-editor-core/${settings.latestCoreStability}/vs`;
					break;
				case "url":
					coreUrl = settings.coreUrl;
					break;
			}

			if (coreUrl.endsWith('?esm')) {
				return {
					esmUrl: coreUrl,
					monacoTypesUrl: undefined,
				}
			}

			let languagesUrl: string;
			switch (settings.languagesSource) {
				case "latest":
					languagesUrl = `${root}/out/languages/bundled/amd-${settings.latestLanguagesStability}/vs`;
					break;
				case "source":
					languagesUrl = `${root}/out/languages/amd-tsc`;
					break;
				case "url":
					languagesUrl = settings.languagesUrl;
					break;
			}

			const setup = { ...getMonacoSetup(coreUrl, settings.language) };
			if (
				!setup.monacoTypesUrl &&
				setup.loaderConfigPaths["vs"] &&
				setup.loaderConfigPaths["vs"].endsWith("/out/vs")
			) {
				setup.monacoTypesUrl = setup.loaderConfigPaths["vs"].replace(
					"/out/vs",
					() => "/src/vs/monaco.d.ts"
				);
			}

			Object.assign(setup.loaderConfigPaths, {
				"vs/language": `${languagesUrl}/language`,
				"vs/basic-language": `${languagesUrl}/basic-language`,
			});

			return setup;
	}
}

export function getDefaultSettings(): Settings {
	const defaultSettings: Settings = {
		monacoSource: "latest",
		latestStability: "dev",
		npmStability: "dev",
		npmVersion: "0.33.0",

		coreSource: "latest",
		latestCoreStability: "dev",
		coreUrl: "http://localhost:5001/out/vs",

		languagesSource: "latest",
		latestLanguagesStability: "dev",
		languagesUrl: "http://localhost:5002/out/languages/amd-tsc",
		customConfig: JSON.stringify({
			loaderUrl: "",
			codiconUrl: "",
			loaderPathsConfig: "",
		}),
		previewFullScreen: false,
		autoReload: true,
		language: undefined,
	};
	return defaultSettings;
}

function trimEnd(str: string, end: string): string {
	if (str.endsWith(end)) {
		return str.slice(0, str.length - end.length);
	}
	return str;
}
