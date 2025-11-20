import * as React from "react";
import { PlaygroundModel } from "./PlaygroundModel";
import { observer } from "mobx-react";
import { observable, reaction } from "mobx";
import {
	IMessageFromRunner,
	IMessageToRunner,
	IPreviewState,
} from "../../../shared";
import { Button } from "react-bootstrap";

const jsSrc = `
try {
	const baseUrl = ${JSON.stringify(document.baseURI.toString())};
	const base = document.createElement('base');
	base.href = baseUrl;
	document.head.appendChild(base);

	const scriptRuntime = document.createElement('script');
	scriptRuntime.src = './runtime.js';
	document.head.appendChild(scriptRuntime);

	const script = document.createElement('script');
	script.src = './playgroundRunner.js';
	document.head.appendChild(script);

	const link = document.createElement('link');
	link.href = './playgroundRunner.css';
	link.rel = 'stylesheet';
	document.head.appendChild(link);
} catch (e) {
 	console.error(e);
}
`;

@observer
export class Preview extends React.Component<{
	model: PlaygroundModel;
	getPreviewState: () => IPreviewState | undefined;
}> {
	private disposables: monaco.IDisposable[] = [];
	@observable private counter = 0;
	@observable.ref private currentState: IPreviewState | undefined;
	private iframe: HTMLIFrameElement | null = null;

	render() {
		return (
			<div className="preview">
				{this.currentState ? null : (
					<div
						style={{
							width: "100%",
							height: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<div>
							Load{" "}
							<Button
								type="button"
								className={
									"btn settings bi-arrow-clockwise btn-primary"
								}
								style={{
									fontSize: 20,
									padding: "0px 4px",
								}}
								onClick={() => this.props.model.reload()}
							/>
						</div>
					</div>
				)}
				<iframe
					className="full-iframe"
					key={this.counter}
					// sandbox="allow-scripts allow-modals"
					frameBorder={0}
					ref={this.handleIframe}
					src={`https://isolated-playground.github.io/?jsSrcBase64=${btoa(
						jsSrc
					)}`}
				/>
			</div>
		);
	}

	handleIframe = (iframe: HTMLIFrameElement | null) => {
		this.iframe = iframe;
		if (!iframe) {
			return;
		}
		iframe.addEventListener("load", () => {
			if (!this.currentState) {
				return;
			}

			const message: IMessageToRunner = {
				kind: "initialize",
				state: this.currentState,
			};
			iframe.contentWindow!.postMessage(message, {
				targetOrigin: "*",
			});
		});
		window.addEventListener("message", (e) => {
			if (e.source !== iframe.contentWindow) {
				return;
			}
			const data = e.data as IMessageFromRunner;
			if (data.kind === "update-code-string") {
				this.props.model.setCodeString(data.codeStringName, data.value);
			} else if (data.kind === "reload") {
				this.props.model.reload();
			}
		});
	};

	componentDidMount() {
		this.disposables.push({
			dispose: reaction(
				() => this.props.getPreviewState(),
				(state) => {
					if (state) {
						console.log("handlePreview", state);
						this.handlePreview(state);
					}
				},
				{ fireImmediately: true }
			),
		});
	}

	componentWillUnmount() {
		this.disposables.forEach((d) => d.dispose());
	}

	private handlePreview(state: IPreviewState): void {
		if (
			JSON.stringify({ ...state, css: "" }) ===
			JSON.stringify({ ...this.currentState, css: "" })
		) {
			// only css changed
			this.iframe?.contentWindow!.postMessage(
				{ kind: "update-css", css: state.css } as IMessageToRunner,
				{ targetOrigin: "*" }
			);
			this.currentState = state;
		} else {
			this.currentState = state;
			this.counter++;
		}
	}
}
