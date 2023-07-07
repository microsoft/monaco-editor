import { observable } from "mobx";
import { Page } from "../components/Page";
import {
	HistoryController,
	IHistoryModel,
	ILocation,
} from "../utils/ObservableHistory";
import React = require("react");

export class DocsPage extends React.Component implements IHistoryModel {
	private _lastIFrame: HTMLIFrameElement | null = null;

	private readonly setIFrame = (iframe: HTMLIFrameElement | null) => {
		if (iframe === this._lastIFrame) {
			return;
		}
		if (this._lastIFrame) {
			this._lastIFrame.contentWindow?.removeEventListener(
				"hashchange",
				this.onIFrameLoad
			);
			this._lastIFrame.removeEventListener("load", this.onIFrameLoad);
		}
		if (iframe) {
			iframe.addEventListener("load", this.onIFrameLoad);
		}
		this._lastIFrame = iframe;
	};

	private readonly onIFrameLoad = () => {
		this._lastIFrame!.contentWindow?.addEventListener("hashchange", () =>
			this.updateLocationFromIFrame()
		);
		this.updateLocationFromIFrame();
	};

	private updateLocationFromIFrame(): void {
		const match =
			this._lastIFrame?.contentWindow!.location.href.match(
				/typedoc\/(.*)/
			);
		if (match) {
			let hashValue = match[1];
			if (hashValue === "index.html") {
				hashValue = "";
			}
			this.location = { hashValue, searchParams: {} };
		}
	}

	@observable.ref
	location!: ILocation;
	historyId: number = 0;

	getTypedocUrl(): string {
		let hashValue = this.location?.hashValue ?? "";
		// make sure hashValue is a valid path
		if (
			!hashValue.match(/^[a-zA-Z0-9#\._\-\/]*$/) ||
			hashValue.indexOf("..") !== -1
		) {
			hashValue = "";
		}

		return `./typedoc/${hashValue}`;
	}

	updateLocation(newLocation: ILocation): void {
		this.location = newLocation;

		if (this._lastIFrame) {
			this._lastIFrame.src = this.getTypedocUrl();
		}
	}

	constructor(props: any) {
		super(props);

		new HistoryController((location) => {
			this.location = location;
			return this;
		});
	}

	// not reactive to prevent unnecessary reloads of the iframe
	render() {
		if (!localStorage.getItem("tsd-theme")) {
			// Set default theme to light, unfortunately there is no config option for this
			localStorage.setItem("tsd-theme", "light");
		}

		return (
			<Page>
				<iframe
					ref={this.setIFrame}
					className="full-iframe"
					frameBorder={0}
					src={this.getTypedocUrl()}
				/>
			</Page>
		);
	}
}
