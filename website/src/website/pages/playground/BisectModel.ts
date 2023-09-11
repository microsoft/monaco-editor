import { action, ObservableMap } from "mobx";
import {
	getNpmVersions,
	getNpmVersionsSync,
	getVsCodeCommitId,
} from "./getNpmVersionsSync";
import { PlaygroundModel } from "./PlaygroundModel";
import { findLastIndex } from "./utils";

export class BisectModel {
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
