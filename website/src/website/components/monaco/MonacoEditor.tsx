import * as React from "react";
import { getLoadedMonaco } from "../../../monaco-loader";
import { withLoadedMonaco } from "./MonacoLoader";

@withLoadedMonaco
export class ControlledMonacoEditor extends React.Component<{
	value: string;
	onDidValueChange?: (newValue: string) => void;

	language?: string;
	theme?: string;
}> {
	private readonly model = getLoadedMonaco().editor.createModel(
		this.props.value,
		this.props.language
	);

	private lastSubscription: monaco.IDisposable | undefined;

	componentDidMount(): void {
		this.componentDidUpdate({ value: "" });
	}

	componentDidUpdate(lastProps: this["props"]) {
		const newOnDidValueChange = this.props.onDidValueChange;
		if (newOnDidValueChange !== lastProps.onDidValueChange) {
			if (this.lastSubscription) {
				this.lastSubscription.dispose();
				this.lastSubscription = undefined;
			}
			if (newOnDidValueChange) {
				this.lastSubscription = this.model.onDidChangeContent((e) => {
					newOnDidValueChange(this.model.getValue());
				});
			}
		}

		if (this.props.value !== this.model.getValue()) {
			this.model.setValue(this.props.value);
		}
		if (this.model.getLanguageId() !== this.props.language) {
			getLoadedMonaco().editor.setModelLanguage(
				this.model,
				this.props.language || "plaintext"
			);
		}

		if (this.props.onDidValueChange) {
			this.model.setValue(this.props.value);
		}
	}

	render() {
		return (
			<MonacoEditor
				readOnly={!this.props.onDidValueChange}
				model={this.model}
				theme={this.props.theme}
			/>
		);
	}
}

@withLoadedMonaco
export class ControlledMonacoDiffEditor extends React.Component<{
	originalValue: string;
	modifiedValue: string;
	language?: string;
}> {
	private readonly originalModel = getLoadedMonaco().editor.createModel(
		this.props.originalValue,
		this.props.language
	);
	private readonly modifiedModel = getLoadedMonaco().editor.createModel(
		this.props.modifiedValue,
		this.props.language
	);

	componentDidUpdate() {
		if (this.props.originalValue !== this.originalModel.getValue()) {
			this.originalModel.setValue(this.props.originalValue);
		}
		if (this.originalModel.getLanguageId() !== this.props.language) {
			getLoadedMonaco().editor.setModelLanguage(
				this.originalModel,
				this.props.language || "plaintext"
			);
		}

		if (this.props.modifiedValue !== this.modifiedModel.getValue()) {
			this.modifiedModel.setValue(this.props.modifiedValue);
		}
		if (this.modifiedModel.getLanguageId() !== this.props.language) {
			getLoadedMonaco().editor.setModelLanguage(
				this.modifiedModel,
				this.props.language || "plaintext"
			);
		}
	}

	render() {
		return (
			<MonacoDiffEditor
				originalModel={this.originalModel}
				modifiedModel={this.modifiedModel}
			/>
		);
	}
}

export type MonacoEditorHeight =
	| { /* Fills the entire space. */ kind: "fill" }
	| {
			/* Use the content as height. */ kind: "dynamic";
			maxHeight?: number;
	  };

@withLoadedMonaco
export class MonacoEditor extends React.Component<
	{
		model: monaco.editor.ITextModel;
		onEditorLoaded?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
		height?: MonacoEditorHeight;
		theme?: string;
		readOnly?: boolean;
		className?: string;
	},
	{ contentHeight: number | undefined }
> {
	public editor: monaco.editor.IStandaloneCodeEditor | undefined;
	private get height() {
		if (this.state.contentHeight === undefined) {
			return undefined;
		}
		return Math.min(200, this.state.contentHeight);
	}
	private readonly divRef = React.createRef<HTMLDivElement>();
	private readonly resizeObserver = new ResizeObserver(() => {
		if (this.editor) {
			this.editor.layout();
		}
	});
	constructor(props: any) {
		super(props);
		this.state = { contentHeight: undefined };
	}
	render() {
		const heightInfo = this.props.height || { kind: "fill" };
		const height = heightInfo.kind === "fill" ? "100%" : this.height;
		return (
			<div
				style={{
					height,
					minHeight: 0,
					minWidth: 0,
				}}
				className={"monaco-editor-react " + this.props.className}
				ref={this.divRef}
			/>
		);
	}
	componentDidMount() {
		const div = this.divRef.current;
		if (!div) {
			throw new Error("unexpected");
		}
		this.resizeObserver.observe(div);
		this.editor = getLoadedMonaco().editor.create(div, {
			model: this.props.model,
			scrollBeyondLastLine: false,
			minimap: { enabled: false },
			automaticLayout: false,
			theme: this.props.theme,
			readOnly: this.props.readOnly,
		});
		this.editor.onDidContentSizeChange((e) => {
			this.setState({ contentHeight: e.contentHeight });
		});
		if (this.props.onEditorLoaded) {
			this.props.onEditorLoaded(this.editor);
		}
	}
	componentDidUpdate(oldProps: this["props"]) {
		if (oldProps.model !== this.props.model) {
			this.editor!.setModel(this.props.model);
		}
		if (oldProps.theme !== this.props.theme && this.props.theme) {
			getLoadedMonaco().editor.setTheme(this.props.theme);
		}
		if (oldProps.readOnly !== this.props.readOnly) {
			this.editor!.updateOptions({ readOnly: this.props.readOnly });
		}
	}
	componentWillUnmount() {
		if (!this.editor) {
			console.error("unexpected state");
		} else {
			this.editor.dispose();
		}
	}
}

@withLoadedMonaco
export class MonacoDiffEditor extends React.Component<
	{
		originalModel: monaco.editor.ITextModel;
		modifiedModel: monaco.editor.ITextModel;
		onEditorLoaded?: (editor: monaco.editor.IStandaloneDiffEditor) => void;
		/**
		 * Initial theme to be used for rendering.
		 * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'.
		 * You can create custom themes via `monaco.editor.defineTheme`.
		 * To switch a theme, use `monaco.editor.setTheme`
		 */
		theme?: string;
	},
	{ contentHeight: number | undefined }
> {
	public editor: monaco.editor.IStandaloneDiffEditor | undefined;

	private readonly divRef = React.createRef<HTMLDivElement>();
	private readonly resizeObserver = new ResizeObserver(() => {
		if (this.editor) {
			this.editor.layout();
		}
	});
	constructor(props: any) {
		super(props);
		this.state = { contentHeight: undefined };
	}
	render() {
		const height = "100%";
		return (
			<div
				style={{
					height,
					minHeight: 0,
					minWidth: 0,
				}}
				className="monaco-editor-react"
				ref={this.divRef}
			/>
		);
	}
	componentDidMount() {
		const div = this.divRef.current;
		if (!div) {
			throw new Error("unexpected");
		}
		this.resizeObserver.observe(div);
		this.editor = getLoadedMonaco().editor.createDiffEditor(div, {
			scrollBeyondLastLine: false,
			minimap: { enabled: false },
			automaticLayout: false,
			theme: this.props.theme,
			originalEditable: true,
		});
		this.editor.setModel({
			original: this.props.originalModel,
			modified: this.props.modifiedModel,
		});

		if (this.props.onEditorLoaded) {
			this.props.onEditorLoaded(this.editor);
		}
	}

	componentWillUnmount() {
		if (!this.editor) {
			console.error("unexpected state");
		} else {
			this.editor.dispose();
		}
	}
}
