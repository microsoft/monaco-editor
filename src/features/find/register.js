import 'monaco-editor-core/esm/vs/editor/contrib/find/browser/findController';
import { FindWidget } from 'monaco-editor-core/esm/vs/editor/contrib/find/browser/findWidget';

const tabIndexPatchKey = '__monacoFindWidgetTabIndexPatchApplied';
const originalTabIndexKey = '__monacoFindWidgetOriginalTabIndex';

function setFindWidgetTabbableState(widget, visible) {
	const domNode = widget?._domNode;
	if (!domNode) {
		return;
	}

	const focusableElements = domNode.querySelectorAll('input, textarea, [tabindex], [role="button"], [role="checkbox"]');
	for (const element of focusableElements) {
		if (!(element instanceof HTMLElement)) {
			continue;
		}

		if (visible) {
			if (!(originalTabIndexKey in element.dataset)) {
				continue;
			}

			const originalTabIndex = element.dataset[originalTabIndexKey];
			if (originalTabIndex === '') {
				element.removeAttribute('tabindex');
			}
			else {
				element.tabIndex = Number(originalTabIndex);
			}
			delete element.dataset[originalTabIndexKey];
		}
		else {
			if (!(originalTabIndexKey in element.dataset)) {
				element.dataset[originalTabIndexKey] = element.getAttribute('tabindex') ?? '';
			}
			element.tabIndex = -1;
		}
	}
}

if (!FindWidget[tabIndexPatchKey]) {
	const originalReveal = FindWidget.prototype._reveal;
	const originalHide = FindWidget.prototype._hide;

	FindWidget.prototype._reveal = function (...args) {
		originalReveal.apply(this, args);
		setFindWidgetTabbableState(this, true);
	};

	FindWidget.prototype._hide = function (...args) {
		originalHide.apply(this, args);
		setFindWidgetTabbableState(this, false);
	};

	FindWidget[tabIndexPatchKey] = true;
}
