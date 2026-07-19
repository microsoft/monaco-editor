import { monacoEditorVersion } from "../../monacoEditorVersion";
import { getNpmVersionsSync } from "./getNpmVersionsSync";
import { Settings } from "./SettingsModel";

export class Source {
	public static useLatestDev(sourceLanguagesStr?: string): Source {
		// Assume the versions are already loaded
		const versions = getNpmVersionsSync(undefined);
		const version = versions.find((v) => v.indexOf("-dev-") !== -1);
		return new Source(version, undefined, sourceLanguagesStr);
	}

	public static useLatest(sourceLanguagesStr?: string): Source {
		return new Source(monacoEditorVersion, undefined, sourceLanguagesStr);
	}

	public static parse(
		sourceStr: string | undefined,
		sourceLanguagesStr: string | undefined
	): Source {
		if (sourceStr === "latest-dev") {
			return Source.useLatestDev(sourceLanguagesStr);
		}
		if (sourceStr === "latest") {
			return Source.useLatest(sourceLanguagesStr);
		}

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
		const sourceLangToStr = this.sourceLanguagesToString();
		return `${this.sourceToString()}${
			sourceLangToStr ? `;${sourceLangToStr}` : ""
		}`;
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
