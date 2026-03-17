import 'monaco-editor-core/esm/vs/editor/contrib/find/browser/findController';
import { FindWidget, SimpleButton } from 'monaco-editor-core/esm/vs/editor/contrib/find/browser/findWidget';
import { Toggle } from 'monaco-editor-core/esm/vs/base/browser/ui/toggle/toggle';

const tabIndexPatchKey = '__monacoFindWidgetTabIndexPatchApplied';
const toggleTabIndexPatchKey = '__monacoToggleTabIndexPatchApplied';
const simpleButtonTabIndexPatchKey = '__monacoSimpleButtonTabIndexPatchApplied';

if (!Toggle[toggleTabIndexPatchKey]) {
	const originalToggleEnable = Toggle.prototype.enable;
	const originalToggleDisable = Toggle.prototype.disable;

	Toggle.prototype.enable = function (...args) {
		originalToggleEnable.apply(this, args);
		this.domNode.tabIndex = this._opts?.notFocusable ? -1 : 0;
	};

	Toggle.prototype.disable = function (...args) {
		originalToggleDisable.apply(this, args);
		this.domNode.tabIndex = -1;
	};

	Toggle[toggleTabIndexPatchKey] = true;
}

if (!SimpleButton[simpleButtonTabIndexPatchKey]) {
	const originalSimpleButtonSetEnabled = SimpleButton.prototype.setEnabled;

	SimpleButton.prototype.setEnabled = function (enabled, ...args) {
		originalSimpleButtonSetEnabled.call(this, enabled, ...args);
		this.domNode.tabIndex = enabled ? 0 : -1;
	};

	SimpleButton[simpleButtonTabIndexPatchKey] = true;
}

if (!FindWidget[tabIndexPatchKey]) {
	const originalUpdateToggleSelectionFindButton = FindWidget.prototype._updateToggleSelectionFindButton;

	FindWidget.prototype._updateToggleSelectionFindButton = function (...args) {
		originalUpdateToggleSelectionFindButton.apply(this, args);

		if (this._toggleSelectionFind?.domNode) {
			this._toggleSelectionFind.domNode.tabIndex = this._toggleSelectionFind.enabled ? 0 : -1;
		}
	};

	FindWidget[tabIndexPatchKey] = true;
}
