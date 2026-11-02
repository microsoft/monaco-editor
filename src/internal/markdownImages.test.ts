/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { test } from 'node:test';
import * as assert from 'node:assert';
import { MarkdownRendererService } from 'monaco-editor-core/esm/vs/platform/markdown/browser/markdownRenderer';
import { CodeEditorWidget } from 'monaco-editor-core/esm/vs/editor/browser/widget/codeEditor/codeEditorWidget';
import { AllowedImageOrigins, isRemoteImageAllowed } from './markdownImages';

const markdown = {
	value: [
		'![remote](https://attacker.example/collect?leak=1)',
		'![allowed](https://img.shields.io/badge.svg)',
		'![inline](data:image/png;base64,iVBORw0KGgo=)',
		'![protocolRelative](//attacker.example/collect)',
		'[link](https://example.com/docs)'
	].join('\n\n')
};

function renderImageSources(
	allowedOrigins?: AllowedImageOrigins,
	withContext = true
): Record<string, string | null> {
	const service = new MarkdownRendererService({} as any);
	const editor = { getRawOptions: () => ({ markdownImages: { allowedOrigins } }) };
	const rendered = service.render(markdown, withContext ? { context: editor } : undefined) as {
		element: HTMLElement;
		dispose(): void;
	};
	const result: Record<string, string | null> = {};
	const images = rendered.element.querySelectorAll('img');
	for (let i = 0; i < images.length; i++) {
		result[images[i].getAttribute('alt')!] = images[i].getAttribute('src');
	}
	const link = rendered.element.querySelector('a');
	result['link'] = link && (link.getAttribute('data-href') ?? link.getAttribute('href'));
	rendered.dispose();
	return result;
}

test('isRemoteImageAllowed matches exact origins', () => {
	assert.strictEqual(isRemoteImageAllowed('https://a.example/x.png', undefined), false);
	assert.strictEqual(isRemoteImageAllowed('https://a.example/x.png', []), false);
	assert.strictEqual(isRemoteImageAllowed('https://a.example/x.png', true), true);
	assert.strictEqual(isRemoteImageAllowed('https://a.example/x.png', ['https://a.example']), true);
	assert.strictEqual(isRemoteImageAllowed('https://a.example/x.png', ['https://a.example/']), true);
	assert.strictEqual(isRemoteImageAllowed('http://a.example/x.png', ['https://a.example']), false);
	assert.strictEqual(
		isRemoteImageAllowed('https://a.example:8443/x', ['https://a.example']),
		false
	);
	assert.strictEqual(isRemoteImageAllowed('https://sub.a.example/x', ['https://a.example']), false);
	assert.strictEqual(isRemoteImageAllowed('https://a.example/x', ['not an origin']), false);
});

test('remote images are blocked by default, data images and links are kept', () => {
	for (const sources of [renderImageSources(undefined), renderImageSources(undefined, false)]) {
		assert.strictEqual(sources['remote'], null);
		assert.strictEqual(sources['allowed'], null);
		assert.strictEqual(sources['protocolRelative'], null);
		assert.strictEqual(sources['inline'], 'data:image/png;base64,iVBORw0KGgo=');
		assert.strictEqual(sources['link'], 'https://example.com/docs');
	}
});

test('allowedOrigins allows the listed origins only', () => {
	const sources = renderImageSources(['https://img.shields.io']);
	assert.strictEqual(sources['remote'], null);
	assert.strictEqual(sources['allowed'], 'https://img.shields.io/badge.svg');
	assert.strictEqual(sources['inline'], 'data:image/png;base64,iVBORw0KGgo=');
});

test('allowedOrigins: true allows all remote images', () => {
	const sources = renderImageSources(true);
	assert.strictEqual(sources['remote'], 'https://attacker.example/collect?leak=1');
	assert.strictEqual(sources['allowed'], 'https://img.shields.io/badge.svg');
});

test('updateOptions keeps markdownImages in the raw editor options', () => {
	const rawOptions: any = {};
	const forwarded: unknown[] = [];
	const editor = {
		getRawOptions: () => rawOptions,
		_configuration: { updateOptions: (o: unknown) => forwarded.push(o) }
	};
	CodeEditorWidget.prototype.updateOptions.call(editor, {
		markdownImages: { allowedOrigins: ['https://img.shields.io'] }
	});
	assert.deepStrictEqual(rawOptions.markdownImages, { allowedOrigins: ['https://img.shields.io'] });
	CodeEditorWidget.prototype.updateOptions.call(editor, {
		markdownImages: { allowedOrigins: true }
	});
	assert.deepStrictEqual(rawOptions.markdownImages, { allowedOrigins: true });
	CodeEditorWidget.prototype.updateOptions.call(editor, { fontSize: 20 });
	assert.deepStrictEqual(rawOptions.markdownImages, { allowedOrigins: true });
	assert.strictEqual(forwarded.length, 3);
});
