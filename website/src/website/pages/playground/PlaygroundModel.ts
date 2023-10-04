/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	action,
	autorun,
	computed,
	observable,
	reaction,
	runInAction,
} from "mobx";
import {
	IMonacoSetup,
	loadMonaco,
	waitForLoadedMonaco,
} from "../../../monaco-loader";
import { IPlaygroundProject, IPreviewState } from "../../../shared";
import { Debouncer } from "../../utils/Debouncer";
import { ObservablePromise } from "../../utils/ObservablePromise";
import { Disposable } from "../../utils/utils";
import { PlaygroundExample } from "./playgroundExamples";
import {
	getDefaultSettings,
	JsonString,
	Settings,
	SettingsModel,
	toLoaderConfig,
} from "./SettingsModel";
import { BisectModel } from "./BisectModel";
import { LocationModel } from "./LocationModel";

export class PlaygroundModel {
	public readonly dispose = Disposable.fn();
	public readonly settings = new SettingsModel();

	@observable
	public html = "";

	@observable
	public js = "";

	@observable
	public css = "";

	@observable
	public reloadKey = 0;

	public readonly historyModel = new LocationModel(this);

	public reload(): void {
		this.reloadKey++;
	}

	public get previewShouldBeFullScreen(): boolean {
		return this.settings.previewFullScreen;
	}

	private _wasEverNonFullScreen = false;
	public get wasEverNonFullScreen(): boolean {
		if (this._wasEverNonFullScreen) {
			return true;
		}
		if (!this.settings.previewFullScreen) {
			this._wasEverNonFullScreen = true;
		}
		return this._wasEverNonFullScreen;
	}

	@computed.struct
	get monacoSetup(): IMonacoSetup {
		const sourceOverride = this.historyModel.sourceOverride;
		if (sourceOverride) {
			return toLoaderConfig({
				...getDefaultSettings(),
				...sourceOverride.toPartialSettings(),
			});
		}
		return this.settings.monacoSetup;
	}

	@computed
	public get playgroundProject(): IPlaygroundProject {
		const project: IPlaygroundProject = {
			html: this.html,
			js: this.js,
			css: this.css,
		};

		return project;
	}

	@computed
	public get state(): IPreviewState {
		return {
			...this.playgroundProject,
			monacoSetup: this.monacoSetup,
			reloadKey: this.reloadKey,
		};
	}

	@observable.ref
	private _previewState: IPreviewState | undefined = undefined;

	public readonly getPreviewState = (): IPreviewState | undefined => {
		return this._previewState;
	};

	public readonly getCompareWithPreviewState = ():
		| IPreviewState
		| undefined => {
		const previewState = this.getPreviewState();
		if (!previewState) {
			return undefined;
		}
		return {
			...previewState,
			monacoSetup: toLoaderConfig({
				...getDefaultSettings(),
				...this.historyModel.compareWith!.toPartialSettings(),
			}),
		};
	};

	@observable
	public settingsDialogModel: SettingsDialogModel | undefined = undefined;

	@observable.ref
	private _selectedExample: PlaygroundExample | undefined;

	@observable.ref
	public selectedExampleProject:
		| { example: PlaygroundExample; project: IPlaygroundProject }
		| undefined;

	public get selectedExample(): PlaygroundExample | undefined {
		return this._selectedExample;
	}

	public set selectedExample(value: PlaygroundExample | undefined) {
		this._selectedExample = value;
		this.selectedExampleProject = undefined;
		if (value) {
			value.load().then((p) => {
				runInAction("update example", () => {
					this.selectedExampleProject = {
						example: value,
						project: p,
					};
					this.reloadKey++;
					this.setState(p);
				});
			});
		}
	}

	private readonly debouncer = new Debouncer(700);

	@observable
	public isDirty = false;

	constructor() {
		let lastState: IPreviewState | undefined = undefined;

		this.dispose.track({
			dispose: reaction(
				() => ({ state: this.state }),
				() => {
					const state = this.state;
					if (!this.settings.autoReload) {
						if (
							(!lastState ||
								JSON.stringify(state.monacoSetup) ===
									JSON.stringify(lastState.monacoSetup)) &&
							state.reloadKey === (lastState?.reloadKey ?? 0)
						) {
							this.isDirty = true;
							return;
						}
					}
					const updatePreviewState = () => {
						this.isDirty = false;
						this._previewState = state;
						lastState = this._previewState;
					};

					if (state.reloadKey !== lastState?.reloadKey) {
						updatePreviewState();
					} else {
						this.debouncer.run(updatePreviewState);
					}
				},
				{ name: "update preview", fireImmediately: true }
			),
		});

		const observablePromise = new ObservablePromise(waitForLoadedMonaco());
		let disposable: Disposable | undefined = undefined;

		waitForLoadedMonaco().then((m) => {
			this.dispose.track(
				monaco.editor.addEditorAction({
					id: "reload",
					label: "Reload",
					run: (editor, ...args) => {
						this.reload();
					},
					keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
				})
			);

			const options =
				monaco.languages.typescript.javascriptDefaults.getCompilerOptions();
			monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
				{ noSemanticValidation: false }
			);
			monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
				...options,
				checkJs: true,
				strictNullChecks: false,
			});
		});

		this.dispose.track({
			dispose: autorun(
				async () => {
					const monaco = observablePromise.value;
					if (!monaco) {
						return;
					}
					const monacoTypesUrl = this.monacoSetup.monacoTypesUrl;
					this.reloadKey; // Allow reload to reload the d.ts file.

					let content = "";
					if (monacoTypesUrl) {
						content = await (await fetch(monacoTypesUrl)).text();
					}
					if (disposable) {
						disposable.dispose();
						disposable = undefined;
					}

					if (content) {
						disposable =
							monaco.languages.typescript.javascriptDefaults.addExtraLib(
								content,
								"ts:monaco.d.ts"
							);
					}
				},
				{ name: "update types" }
			),
		});
	}

	setCodeString(codeStringName: string, value: string) {
		function escapeRegexpChars(str: string) {
			return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
		}

		const regexp = new RegExp(
			"(\\b" +
				escapeRegexpChars(codeStringName) +
				":[^\\w`]*`)([^`\\\\\\n]|\\n|\\\\\\\\|\\\\\\`|\\\\\\$)*`"
		);
		const js = this.js;
		const str = value
			.replaceAll("\\", "\\\\")
			.replaceAll("$", "\\$$$$")
			.replaceAll("`", "\\`");
		const newJs = js.replace(regexp, "$1" + str + "`");
		const autoReload = this.settings.autoReload;
		this.settings.autoReload = false;
		this.js = newJs;
		this.settings.autoReload = autoReload;
	}

	public showSettingsDialog(): void {
		this.settingsDialogModel = new SettingsDialogModel(
			this.settings.settings
		);
	}

	public closeSettingsDialog(acceptChanges: boolean): void {
		if (!this.settingsDialogModel) {
			return;
		}
		if (acceptChanges) {
			this.settings.setSettings(this.settingsDialogModel.settings);
		}
		this.settingsDialogModel = undefined;
	}

	@action
	public setState(state: IPlaygroundProject) {
		this.html = state.html;
		this.js = state.js;
		this.css = state.css;
	}

	public readonly bisectModel = new BisectModel(this);

	@action
	compareWithLatestDev(): void {
		this.settings.previewFullScreen = true;
		this.historyModel.compareWithLatestDev();
	}
}

export class SettingsDialogModel {
	@observable settings: Settings;

	@computed get monacoSetupJsonString(): JsonString<IMonacoSetup> {
		if (this.settings.monacoSource === "custom") {
			return this.settings.customConfig;
		}

		return JSON.stringify(toLoaderConfig(this.settings), undefined, 4);
	}

	constructor(settings: Settings) {
		this.settings = Object.assign({}, settings);
	}
}
