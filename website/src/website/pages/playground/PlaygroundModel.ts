/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	action,
	autorun,
	computed,
	observable,
	ObservableMap,
	reaction,
	runInAction,
} from "mobx";
import {
	IMonacoSetup,
	loadMonaco,
	waitForLoadedMonaco,
} from "../../../monaco-loader";
import { IPlaygroundProject, IPreviewState } from "../../../shared";
import { monacoEditorVersion } from "../../monacoEditorVersion";
import { Debouncer } from "../../utils/Debouncer";
import { LzmaCompressor } from "../../utils/lzmaCompressor";
import {
	HistoryController,
	IHistoryModel,
	ILocation,
} from "../../utils/ObservableHistory";
import { ObservablePromise } from "../../utils/ObservablePromise";
import { debouncedComputed, Disposable } from "../../utils/utils";
import {
	getNpmVersions,
	getNpmVersionsSync,
	getVsCodeCommitId,
} from "./getNpmVersionsSync";
import { getPlaygroundExamples, PlaygroundExample } from "./playgroundExamples";
import {
	getDefaultSettings,
	JsonString,
	Settings,
	SettingsModel,
	toLoaderConfig,
} from "./SettingsModel";

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

	public readonly serializer = new StateUrlSerializer(this);

	public reload(): void {
		this.reloadKey++;
	}

	private readonly _previewHandlers = new Set<IPreviewHandler>();

	private _wasEverNonFullScreen = false;
	public get wasEverNonFullScreen() {
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
		const sourceOverride = this.serializer.sourceOverride;
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
			key: this.reloadKey,
		};
	}

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
					this.setState(p);
				});
			});
		}
	}

	private readonly debouncer = new Debouncer(700);

	@observable
	public isDirty = false;

	constructor() {
		let lastState = this.state;

		this.dispose.track({
			dispose: reaction(
				() => ({ state: this.state }),
				({ state }) => {
					if (!this.settings.autoReload) {
						if (
							JSON.stringify(state.monacoSetup) ===
								JSON.stringify(lastState.monacoSetup) &&
							state.key === lastState.key
						) {
							this.isDirty = true;
							return;
						}
					}
					const action = () => {
						this.isDirty = false;
						lastState = state;
						for (const handler of this._previewHandlers) {
							handler.handlePreview(state);
						}
					};

					if (state.key !== lastState.key) {
						action(); // sync update
					} else {
						this.debouncer.run(action);
					}
				},
				{ name: "update preview" }
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

	public setPreviewHandler(handler: IPreviewHandler): monaco.IDisposable {
		this._previewHandlers.add(handler);
		handler.handlePreview(this.state);
		return {
			dispose: () => {
				this._previewHandlers.delete(handler);
			},
		};
	}

	public readonly bisectModel = new BisectModel(this);
}

export interface IPreviewHandler {
	handlePreview(state: IPreviewState): void;
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

function projectEquals(
	project1: IPlaygroundProject,
	project2: IPlaygroundProject
): boolean {
	return (
		normalizeLineEnding(project1.css) ===
			normalizeLineEnding(project2.css) &&
		normalizeLineEnding(project1.html) ===
			normalizeLineEnding(project2.html) &&
		normalizeLineEnding(project1.js) === normalizeLineEnding(project2.js)
	);
}

function normalizeLineEnding(str: string): string {
	return str.replace(/\r\n/g, "\n");
}

class StateUrlSerializer implements IHistoryModel {
	public readonly dispose = Disposable.fn();

	private readonly compressor = new LzmaCompressor<IPlaygroundProject>();

	private cachedState:
		| { state: IPlaygroundProject; hash: string }
		| undefined = undefined;

	private readonly computedHashValue = debouncedComputed(
		500,
		() => ({
			state: this.model.playgroundProject,
			selectedExampleProject: this.model.selectedExampleProject,
		}),
		({ state, selectedExampleProject }) => {
			if (
				selectedExampleProject &&
				projectEquals(state, selectedExampleProject.project)
			) {
				return "example-" + selectedExampleProject.example.id;
			}
			if (
				this.cachedState &&
				projectEquals(this.cachedState.state, state)
			) {
				return this.cachedState.hash;
			}
			return this.compressor.encodeData(state);
		}
	);

	private get sourceFromSettings(): Source | undefined {
		const settings = this.model.settings.settings;
		if (settings.monacoSource === "npm") {
			return new Source(settings.npmVersion, undefined, undefined);
		} else if (
			settings.monacoSource === "independent" &&
			((settings.coreSource === "url" &&
				(settings.languagesSource === "latest" ||
					settings.languagesSource === "url")) ||
				(settings.coreSource === "latest" &&
					settings.languagesSource === "url"))
		) {
			return new Source(
				undefined,
				settings.coreSource === "url" ? settings.coreUrl : undefined,
				settings.languagesSource === "latest"
					? undefined
					: settings.languagesUrl
			);
		} else if (settings.monacoSource === "latest") {
			return new Source(monacoEditorVersion, undefined, undefined);
		}
		return undefined;
	}

	@observable
	private _sourceOverride: Source | undefined;

	get sourceOverride(): Source | undefined {
		return this._sourceOverride;
	}

	@action
	disableSourceOverride(): void {
		this._sourceOverride = undefined;
		this.historyId++;
	}

	@action
	saveSourceOverride(): void {
		if (this._sourceOverride) {
			this.model.settings.setSettings({
				...this.model.settings.settings,
				...this._sourceOverride.toPartialSettings(),
			});
			this.historyId++;
			this._sourceOverride = undefined;
		}
	}

	/**
	 * This is used to control replace/push state.
	 * Replace is used if the history id does not change.
	 */
	@observable historyId: number = 0;

	get location(): ILocation {
		const source = this._sourceOverride || this.sourceFromSettings;
		return {
			hashValue: this.computedHashValue.value || this.cachedState?.hash,
			searchParams: {
				source: source?.sourceToString(),
				sourceLanguages: source?.sourceLanguagesToString(),
			},
		};
	}

	@action
	updateLocation(currentLocation: ILocation): void {
		const hashValue = currentLocation.hashValue;
		const sourceStr = currentLocation.searchParams.source;
		const sourceLanguages = currentLocation.searchParams.sourceLanguages;
		const source =
			sourceStr || sourceLanguages
				? Source.parse(sourceStr, sourceLanguages)
				: undefined;

		if (this.sourceFromSettings?.equals(source)) {
			this._sourceOverride = undefined;
		} else {
			this._sourceOverride = source;
		}

		function findExample(hashValue: string): PlaygroundExample | undefined {
			if (hashValue.startsWith("example-")) {
				hashValue = hashValue.substring("example-".length);
			}
			return getPlaygroundExamples()
				.flatMap((e) => e.examples)
				.find((e) => e.id === hashValue);
		}

		let example: PlaygroundExample | undefined;

		if (!hashValue) {
			this.model.selectedExample = getPlaygroundExamples()[0].examples[0];
		} else if ((example = findExample(hashValue))) {
			this.model.selectedExample = example;
		} else {
			let p: IPlaygroundProject | undefined = undefined;
			if (this.cachedState?.hash === hashValue) {
				p = this.cachedState.state;
			}
			if (!p) {
				try {
					p =
						this.compressor.decodeData<IPlaygroundProject>(
							hashValue
						);
				} catch (e) {
					console.log("Could not deserialize from hash value", e);
				}
			}
			if (p) {
				this.cachedState = { state: p, hash: hashValue };
				this.model.setState(p);
			}
		}
	}

	private readonly historyController = this.dispose.track(
		new HistoryController((initialLocation) => {
			this.updateLocation(initialLocation);
			return this;
		})
	);

	constructor(private readonly model: PlaygroundModel) {}
}

class BisectModel {
	private readonly map = new ObservableMap<string, boolean>();

	constructor(private readonly model: PlaygroundModel) {}

	public getState(version: string): boolean | undefined {
		return this.map.get(version);
	}

	public get isActive() {
		return [...this.map.values()].some((e) => e !== undefined);
	}

	public reset(): void {
		this.map.clear();
	}

	public async toggleState(version: string, state: boolean): Promise<void> {
		const currentState = this.getState(version);
		await this.setState(
			version,
			currentState === state ? undefined : state
		);
	}

	@action
	public async setState(
		version: string,
		state: boolean | undefined
	): Promise<void> {
		if (state === undefined) {
			this.map.delete(version);
		} else {
			this.map.set(version, state);
		}

		const nextVersion = await this.getNextVersion();
		if (!nextVersion) {
			return;
		}
		this.model.settings.setSettings({
			...this.model.settings.settings,
			npmVersion: nextVersion,
		});
	}

	private get versions() {
		return getNpmVersionsSync(undefined);
	}

	private get indexOfLastBadVersion() {
		return findLastIndex(this.versions, (v) => this.map.get(v) === false);
	}
	private get indexOfFirstGoodVersion() {
		return this.versions.findIndex((v) => this.map.get(v) === true);
	}

	public get steps() {
		const indexOfFirstGoodVersion = this.indexOfFirstGoodVersion;
		const indexOfLastBadVersion = this.indexOfLastBadVersion;

		if (indexOfFirstGoodVersion === -1 && indexOfLastBadVersion === -1) {
			return -1;
		}
		if (indexOfFirstGoodVersion === -1) {
			return Math.ceil(
				Math.log2(this.versions.length - indexOfLastBadVersion)
			);
		} else if (indexOfLastBadVersion === -1) {
			return Math.ceil(Math.log2(indexOfFirstGoodVersion + 1));
		} else {
			return Math.ceil(
				Math.log2(indexOfFirstGoodVersion - indexOfLastBadVersion)
			);
		}
	}

	public get isFinished() {
		if (
			this.indexOfFirstGoodVersion !== -1 &&
			this.indexOfLastBadVersion + 1 === this.indexOfFirstGoodVersion
		) {
			return true;
		}
		return false;
	}

	public async openGithub() {
		const versions = await getNpmVersions();
		const indexOfFirstGoodVersion =
			this.indexOfFirstGoodVersion === -1
				? versions.length - 1
				: this.indexOfFirstGoodVersion;
		const indexOfLastBadVersion =
			this.indexOfLastBadVersion === -1 ? 0 : this.indexOfLastBadVersion;
		const goodCommitId = await getVsCodeCommitId(
			versions[indexOfFirstGoodVersion]
		);
		const badCommitId = await getVsCodeCommitId(
			versions[indexOfLastBadVersion]
		);
		window.open(
			`https://github.com/microsoft/vscode/compare/${goodCommitId}...${badCommitId}`,
			"_blank"
		);
	}

	private async getNextVersion(): Promise<string | undefined> {
		const versions = await getNpmVersions();

		const indexOfFirstGoodVersion = this.indexOfFirstGoodVersion;
		const indexOfLastBadVersion = this.indexOfLastBadVersion;

		if (
			indexOfFirstGoodVersion !== -1 &&
			indexOfLastBadVersion + 1 === indexOfFirstGoodVersion
		) {
			// Finished
			return;
		}

		if (indexOfLastBadVersion === -1 && indexOfFirstGoodVersion === -1) {
			return versions[0];
		}
		if (indexOfLastBadVersion === -1) {
			// try first (newest) version that hasn't been tested
			const indexOfFirstUntestedVersion = versions.findIndex(
				(v) => this.map.get(v) === undefined
			);
			if (indexOfFirstUntestedVersion === -1) {
				return undefined;
			}
			return versions[indexOfFirstUntestedVersion];
		}

		if (indexOfFirstGoodVersion === -1) {
			/*// exponential back off, might be good for recent regressions, but ruins step counter
			const candidate = Math.min(
				indexOfLastBadVersion * 2 + 1,
				versions.length - 1
			);*/
			const candidate = Math.floor(
				(indexOfLastBadVersion + versions.length) / 2
			);
			return versions[candidate];
		}

		return versions[
			Math.floor((indexOfLastBadVersion + indexOfFirstGoodVersion) / 2)
		];
	}
}

function findLastIndex<T>(
	array: T[],
	predicate: (value: T) => boolean
): number {
	for (let i = array.length - 1; i >= 0; i--) {
		if (predicate(array[i])) {
			return i;
		}
	}
	return -1;
}

class Source {
	public static parse(
		sourceStr: string | undefined,
		sourceLanguagesStr: string | undefined
	): Source {
		if (sourceStr && sourceStr.startsWith("v")) {
			return new Source(
				sourceStr.substring(1),
				undefined,
				sourceLanguagesStr
			);
		}
		return new Source(undefined, sourceStr, sourceLanguagesStr);
	}

	public equals(other: Source | undefined): boolean {
		if (!other) {
			return false;
		}
		return other.toString() === this.toString();
	}

	constructor(
		public readonly version: string | undefined,
		public readonly url: string | undefined,
		public readonly sourceLanguagesStr: string | undefined
	) {
		if (
			version === undefined &&
			url === undefined &&
			sourceLanguagesStr === undefined
		) {
			throw new Error("one parameter must be defined");
		}
	}

	sourceToString(): string | undefined {
		if (this.url) {
			return this.url;
		}
		if (this.version) {
			return `v${this.version}`;
		}
		return undefined;
	}

	sourceLanguagesToString(): string | undefined {
		return this.sourceLanguagesStr;
	}

	toString() {
		return `${this.sourceToString()};${this.sourceLanguagesToString()}`;
	}

	public toPartialSettings(): Partial<Settings> {
		const languagesSettings: Partial<Settings> = {
			languagesSource:
				this.sourceLanguagesStr === undefined ? "latest" : "url",
			languagesUrl: this.sourceLanguagesStr,
		};

		if (this.version) {
			return {
				monacoSource: "npm",
				npmVersion: this.version,
			};
		} else if (this.url) {
			return {
				monacoSource: "independent",
				coreSource: "url",
				coreUrl: this.url,
				...languagesSettings,
			};
		} else {
			return {
				monacoSource: "independent",
				coreSource: "latest",
				...languagesSettings,
			};
		}
	}
}
