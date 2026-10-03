import test from 'node:test';
import assert from 'node:assert';
import * as monaco from '../node_modules/monaco-editor-core/esm/vs/editor/editor.api.js';

test('diff editor originalEditable option in inline mode (issue #5302)', async (t) => {
	await t.test('allows editing original model when originalEditable is true and readOnly is false in inline diff mode', () => {
		const originalModel = monaco.editor.createModel('original content', 'text/plain');
		const modifiedModel = monaco.editor.createModel('modified content', 'text/plain');
		const container = document.createElement('div');
		document.body.appendChild(container);

		const diffEditor = monaco.editor.createDiffEditor(container, {
			renderSideBySide: false,
			originalEditable: true,
			readOnly: false,
			renderOverviewRuler: false,
		});

		diffEditor.setModel({ original: originalModel, modified: modifiedModel });

		const origEditor = diffEditor.getOriginalEditor();
		const modEditor = diffEditor.getModifiedEditor();

		assert.strictEqual(origEditor.getOption(monaco.editor.EditorOption.readOnly), false);
		assert.strictEqual(modEditor.getOption(monaco.editor.EditorOption.readOnly), false);

		// Verify editing original model applies changes
		const editSuccess = origEditor.executeEdits('test', [{
			range: new monaco.Range(1, 1, 1, 1),
			text: 'prefix '
		}]);
		assert.strictEqual(editSuccess, true);
		assert.strictEqual(originalModel.getValue(), 'prefix original content');

		diffEditor.dispose();
		originalModel.dispose();
		modifiedModel.dispose();
	});

	await t.test('respects readOnly: true even when originalEditable: true in inline diff mode', () => {
		const originalModel = monaco.editor.createModel('original content', 'text/plain');
		const modifiedModel = monaco.editor.createModel('modified content', 'text/plain');
		const container = document.createElement('div');
		document.body.appendChild(container);

		const diffEditor = monaco.editor.createDiffEditor(container, {
			renderSideBySide: false,
			originalEditable: true,
			readOnly: true,
			renderOverviewRuler: false,
		});

		diffEditor.setModel({ original: originalModel, modified: modifiedModel });

		const origEditor = diffEditor.getOriginalEditor();
		const modEditor = diffEditor.getModifiedEditor();

		assert.strictEqual(origEditor.getOption(monaco.editor.EditorOption.readOnly), true);
		assert.strictEqual(modEditor.getOption(monaco.editor.EditorOption.readOnly), true);

		diffEditor.dispose();
		originalModel.dispose();
		modifiedModel.dispose();
	});

	await t.test('respects readOnly: false and originalEditable: false in inline diff mode', () => {
		const originalModel = monaco.editor.createModel('original content', 'text/plain');
		const modifiedModel = monaco.editor.createModel('modified content', 'text/plain');
		const container = document.createElement('div');
		document.body.appendChild(container);

		const diffEditor = monaco.editor.createDiffEditor(container, {
			renderSideBySide: false,
			originalEditable: false,
			readOnly: false,
			renderOverviewRuler: false,
		});

		diffEditor.setModel({ original: originalModel, modified: modifiedModel });

		const origEditor = diffEditor.getOriginalEditor();
		const modEditor = diffEditor.getModifiedEditor();

		assert.strictEqual(origEditor.getOption(monaco.editor.EditorOption.readOnly), true);
		assert.strictEqual(modEditor.getOption(monaco.editor.EditorOption.readOnly), false);

		diffEditor.dispose();
		originalModel.dispose();
		modifiedModel.dispose();
	});

	await t.test('preserves side-by-side behavior for originalEditable and readOnly options', () => {
		const originalModel = monaco.editor.createModel('original content', 'text/plain');
		const modifiedModel = monaco.editor.createModel('modified content', 'text/plain');
		const container = document.createElement('div');
		document.body.appendChild(container);

		const diffEditor = monaco.editor.createDiffEditor(container, {
			renderSideBySide: true,
			originalEditable: true,
			readOnly: false,
			renderOverviewRuler: false,
		});

		diffEditor.setModel({ original: originalModel, modified: modifiedModel });

		const origEditor = diffEditor.getOriginalEditor();
		const modEditor = diffEditor.getModifiedEditor();

		assert.strictEqual(origEditor.getOption(monaco.editor.EditorOption.readOnly), false);
		assert.strictEqual(modEditor.getOption(monaco.editor.EditorOption.readOnly), false);

		diffEditor.dispose();
		originalModel.dispose();
		modifiedModel.dispose();
	});
});
