import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { loadMonaco } from "../../../monaco-loader";
import { Page } from "../../components/Page";
import { Select } from "../../components/Select";
import {
	ControlledMonacoDiffEditor,
	ControlledMonacoEditor,
} from "../../components/monaco/MonacoEditor";
import { ObservablePromise } from "../../utils/ObservablePromise";
import * as React from "react";
import { ref } from "../../utils/ref";
import { monacoEditorVersion } from "../../monacoEditorVersion";

export class Home extends React.Component {
	render() {
		return (
			<Page>
				<div className="container py-4">
					<div className="p-5 mb-4 bg-light rounded-3">
						<h1>Monaco - The Editor of the Web</h1>
						<div className="row">
							<div className="span12">
								<br />
								<p>
									The Monaco Editor is the code editor that
									powers{" "}
									<a href="https://github.com/microsoft/vscode">
										VS Code
									</a>
									. A good page describing the code editor's
									features is{" "}
									<a href="https://code.visualstudio.com/docs/editor/editingevolved">
										here
									</a>
									. It is licensed under the MIT License and
									supports Edge, Chrome, Firefox, Safari and
									Opera. The Monaco editor is not supported in
									mobile browsers or mobile web frameworks.
									Find more information at the{" "}
									<a href="https://github.com/microsoft/monaco-editor">
										Monaco Editor repo
									</a>
									.
								</p>
							</div>
						</div>
					</div>

					<div className="px-5 mb-0">
						<h3>Download v{monacoEditorVersion}</h3>
						<div className="row">
							<div className="span12">
								<br />
								<p>
									The latest released version is{" "}
									<strong>{monacoEditorVersion}</strong>.
								</p>
								<p>
									Download with this direct{" "}
									<a
										target="_blank"
										href={`https://registry.npmjs.org/monaco-editor/-/monaco-editor-${monacoEditorVersion}.tgz`}
									>
										download link
									</a>{" "}
									or{" "}
									<a href="https://www.npmjs.com/package/monaco-editor">
										from npm
									</a>
									:
								</p>
								<pre>
									<code>
										npm install monaco-editor@
										{monacoEditorVersion}
									</code>
								</pre>
							</div>
						</div>
					</div>

					<EditorDemo />

					<DiffEditorDemo />
				</div>

				<footer className="container">
					<hr />
					<p className="text-center">
						<a href="https://microsoft.com" title="Microsoft">
							<small>&copy; {process.env.YEAR} Microsoft</small>
						</a>
					</p>
				</footer>
			</Page>
		);
	}
}

interface Theme {
	id: string;
	name: string;
}

const themes: Theme[] = [
	{
		name: "Visual Studio",
		id: "vs",
	},
	{
		name: "Visual Studio Dark",
		id: "vs-dark",
	},
	{
		name: "High Contrast Dark",
		id: "hc-black",
	},
];

@observer
class EditorDemo extends React.Component {
	languages = new ObservablePromise(
		loadMonaco().then((m) => {
			const languages = m.languages.getLanguages();
			this.currentLanguage = languages.find(
				(l) => l.id === "typescript"
			)!;
			return languages;
		})
	);

	@observable.ref
	currentLanguage: monaco.languages.ILanguageExtensionPoint | undefined =
		undefined;

	@observable.ref
	currentTheme: Theme = themes[0];

	@computed get currentSample(): ObservablePromise<string | undefined> {
		return new ObservablePromise(
			this.currentLanguage
				? this.loadSample(this.currentLanguage.id)
				: Promise.resolve(undefined)
		);
	}

	async loadSample(name: string): Promise<string> {
		const result = (
			await import(`../../data/home-samples/sample.${name}.txt`)
		).default;
		return result;
	}

	render() {
		return (
			<div className="p-5 mb-4">
				<h2>Editor</h2>

				<div className="row g-4 py-5 row-cols-1 row-cols-lg-2">
					<div className="col d-flex align-items-start">
						<div className="icon-square text-bg-light d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3"></div>
						<div>
							<h2>IntelliSense, Validation</h2>
							<p>
								Get completions and errors directly in the
								browser for supported languages. Or write your
								own completion providers in JavaScript.
							</p>
						</div>
					</div>
					<div className="col d-flex align-items-start">
						<div className="icon-square text-bg-light d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3"></div>
						<div>
							<h2>Basic Syntax Colorization</h2>
							<p>
								Colorize code using our pre-built syntax
								highlighting, or configure your own custom
								colorization.
							</p>
						</div>
					</div>
				</div>

				<div className="mt-4 row row-cols-2">
					<div className="col">
						<label className="control-label">Language</label>
						<Select<monaco.languages.ILanguageExtensionPoint>
							values={this.languages.value || []}
							getLabel={(l) => l.id}
							value={ref(this, "currentLanguage")}
						/>
					</div>
					<div className="col">
						<label className="control-label">Theme</label>
						<Select<Theme>
							values={themes}
							getLabel={(l) => l.name}
							value={ref(this, "currentTheme")}
						/>
					</div>
				</div>

				<div className="mt-2 editor-container" style={{ height: 500 }}>
					<ControlledMonacoEditor
						value={this.currentSample.value || "loading..."}
						language={this.currentLanguage?.id}
						theme={this.currentTheme.id}
						onDidValueChange={() => {}}
					/>
				</div>
			</div>
		);
	}
}

class DiffEditorDemo extends React.Component {
	render() {
		return (
			<div className="p-5 mb-4">
				<h2>Diff Editor</h2>
				Side by side live comparison. Supports all languages out of the
				box.
				<div className="mt-2 editor-container" style={{ height: 500 }}>
					<ControlledMonacoDiffEditor
						originalValue={
							require("../../data/diff-sample/original.txt")
								.default
						}
						modifiedValue={
							require("../../data/diff-sample/modified.txt")
								.default
						}
						language="typescript"
					/>
				</div>
			</div>
		);
	}
}
