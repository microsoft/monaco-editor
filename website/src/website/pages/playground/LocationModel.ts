import { action, observable } from "mobx";
import { IPlaygroundProject } from "../../../shared";
import { monacoEditorVersion } from "../../monacoEditorVersion";
import { LzmaCompressor } from "../../utils/lzmaCompressor";
import {
	HistoryController,
	IHistoryModel,
	ILocation,
} from "../../utils/ObservableHistory";
import { debouncedComputed, Disposable } from "../../utils/utils";
import { getPlaygroundExamples, PlaygroundExample } from "./playgroundExamples";
import { Source } from "./Source";
import { PlaygroundModel } from "./PlaygroundModel";
import { projectEquals } from "./utils";

export class LocationModel implements IHistoryModel {
	public readonly dispose = Disposable.fn();

	private readonly compressor = new LzmaCompressor<IPlaygroundProject>();

	private cachedState:
		| { state: IPlaygroundProject; hash: string }
		| undefined = undefined;

	@observable private _sourceOverride: Source | undefined;
	get sourceOverride(): Source | undefined {
		return this._sourceOverride;
	}

	@observable private _compareWith: Source | undefined;
	get compareWith(): Source | undefined {
		return this._compareWith;
	}

	/**
	 * This is used to control replace/push state.
	 * Replace is used if the history id does not change.
	 */
	@observable historyId: number = 0;

	constructor(
		private readonly model: PlaygroundModel,
		createHistoryController = true
	) {
		if (createHistoryController) {
			this.dispose.track(
				new HistoryController((initialLocation) => {
					this.updateLocation(initialLocation);
					return this;
				})
			);
		}
	}

	get location(): ILocation {
		const source = this._sourceOverride || this.sourceFromSettings;
		return {
			hashValue: this.computedHashValue.value || this.cachedState?.hash,
			searchParams: {
				source: source?.sourceToString(),
				sourceLanguages: source?.sourceLanguagesToString(),
				compareWith: this._compareWith?.sourceToString(),
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

		const compareWithStr = currentLocation.searchParams.compareWith;
		const compareWith = compareWithStr
			? Source.parse(compareWithStr, undefined)
			: undefined;
		this._compareWith = compareWith;

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

	@action
	exitCompare(): void {
		this._compareWith = undefined;
		this.historyId++;
	}

	@action
	disableSourceOverride(): void {
		this._sourceOverride = undefined;
		this.historyId++;
	}

	@action
	compareWithLatestDev(): void {
		this._compareWith = Source.useLatestDev();
		this.historyId++;
	}

	@action
	saveCompareWith(): void {
		if (this._compareWith) {
			this.model.settings.setSettings({
				...this.model.settings.settings,
				...this._compareWith.toPartialSettings(),
			});
			this.historyId++;
			this._compareWith = undefined;
			this._sourceOverride = undefined;
		}
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
}
