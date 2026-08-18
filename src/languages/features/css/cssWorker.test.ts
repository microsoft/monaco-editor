/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CSSWorker } from './cssWorker';

function createWorker(content: string, uri = 'file:///test.css'): CSSWorker {
	const model = {
		uri: { toString: () => uri },
		version: 1,
		getValue: () => content
	};
	const ctx = { getMirrorModels: () => [model] } as any;
	return new CSSWorker(ctx, { languageId: 'css', options: {} });
}

describe('CSSWorker', () => {
	it('doHover does not throw on invalid nth-child selectors', async () => {
		const worker = createWorker(':nth-child() { }');
		assert.strictEqual(await worker.doHover('file:///test.css', { line: 0, character: 3 }), null);
	});

	it('doHover returns a hover for valid selectors', async () => {
		const worker = createWorker('li:nth-child(2n of .important) { }');
		const hover = await worker.doHover('file:///test.css', { line: 0, character: 1 });
		assert.ok(hover);
	});
});
