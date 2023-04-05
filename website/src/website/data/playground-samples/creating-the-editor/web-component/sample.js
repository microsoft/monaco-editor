customElements.define(
	"code-view-monaco",
	class CodeViewMonaco extends HTMLElement {
		_monacoEditor;
		/** @type HTMLElement */
		_editor;

		constructor() {
			super();

			const shadowRoot = this.attachShadow({ mode: "open" });

			// Copy over editor styles
			const styles = document.querySelectorAll(
				"link[rel='stylesheet'][data-name^='vs/']"
			);
			for (const style of styles) {
				shadowRoot.appendChild(style.cloneNode(true));
			}

			const template = /** @type HTMLTemplateElement */ (
				document.getElementById("editor-template")
			);
			shadowRoot.appendChild(template.content.cloneNode(true));

			this._editor = shadowRoot.querySelector("#container");
			this._monacoEditor = monaco.editor.create(this._editor, {
				automaticLayout: true,
				language: "html",

				value: `<div>Hello World</div>`,
			});
		}
	}
);
