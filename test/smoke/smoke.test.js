/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const playwright = require('playwright');
const { assert } = require('chai');

/** @typedef {import('./common').BrowserKind} BrowserKind */
/** @typedef {import('./common').PackagerKind} PackagerKind */
/** @typedef {import('./common').TestInfo} TestInfo */

/** @type TestInfo */
const testInfo = JSON.parse(process.env.MONACO_TEST_INFO || '');

const URLS = {
	amd: `http://127.0.0.1:${testInfo.port}/test/smoke/amd/index.html`,
	webpack: `http://127.0.0.1:${testInfo.port}/test/smoke/webpack/index.html`,
	esbuild: `http://127.0.0.1:${testInfo.port}/test/smoke/esbuild/index.html`,
	vite: `http://127.0.0.1:${testInfo.port}/test/smoke/vite/dist/index.html`,
	parcel: `http://127.0.0.1:${testInfo.port}/test/smoke/parcel/dist/index.html`
};
const URL = URLS[testInfo.packager];

suite(`Smoke Test '${testInfo.packager}' on '${testInfo.browser}'`, () => {
	/** @type {playwright.Browser} */
	let browser;

	/** @type {playwright.Page} */
	let page;

	suiteSetup(async () => {
		browser = await playwright[testInfo.browser].launch({
			headless: !testInfo.debugTests,
			devtools: testInfo.debugTests && testInfo.browser === 'chromium'
			// slowMo: testInfo.debugTests ? 2000 : 0
		});
	});

	suiteTeardown(async () => {
		await browser.close();
	});

	let pageErrors = [];

	setup(async () => {
		pageErrors = [];
		page = await browser.newPage({
			viewport: {
				width: 800,
				height: 600
			}
		});
		page.on('pageerror', (e) => {
			console.log(e);
			pageErrors.push(e);
		});
		const response = await page.goto(URL);
		if (!response) {
			assert.fail('Failed to load page');
		}
		assert.strictEqual(response.status(), 200);
	});

	teardown(async () => {
		for (const e of pageErrors) {
			throw e;
		}
		await page.close();
	});

	/**
	 * @param {string} text
	 * @param {string} language
	 * @returns Promise<void>
	 */
	async function createEditor(text, language) {
		return await page.evaluate(
			`window.ed = monacoAPI.editor.create(document.getElementById('editor-container'), { value: '${text}', language: '${language}' })`
		);
	}

	/**
	 * @param {number} lineNumber
	 * @param {number} column
	 * @returns Promise<void>
	 */
	async function setEditorPosition(lineNumber, column) {
		return await page.evaluate(
			`window.ed.setPosition({ lineNumber: ${lineNumber}, column: ${column} });`
		);
	}

	/**
	 * @param {string} commandId
	 * @param {any} [args]
	 * @returns Promise<void>
	 */
	async function triggerEditorCommand(commandId, args) {
		return await page.evaluate(
			`window.ed.trigger(null, '${commandId}', ${args ? JSON.stringify(args) : 'undefined'});`
		);
	}

	async function focusEditor() {
		await page.evaluate(`window.ed.focus();`);
	}

	test('`monacoAPI` is exposed as global', async function () {
		assert.strictEqual(await page.evaluate(`typeof monacoAPI`), 'object');
	});

	test('should be able to create plaintext editor', async function () {
		await createEditor('hello world', 'plaintext');

		// type a link in it
		await setEditorPosition(1, 12);
		await triggerEditorCommand('type', { text: '\nhttps://www.microsoft.com' });

		// check that the link gets highlighted, which indicates that the web worker is healthy
		await page.waitForSelector('.detected-link');
	});

	test('css smoke test', async function () {
		await createEditor('.sel1 { background: red; }\\n.sel2 {}', 'css');

		// check that a squiggle appears, which indicates that the language service is up and running
		await page.waitForSelector('.squiggly-warning');
	});

	test('html smoke test', async function () {
		await createEditor('<title>hi</title>', 'html');

		// we need to try this a couple of times because the web worker might not be ready yet
		for (let attempt = 1; attempt <= 2; attempt++) {
			// trigger hover
			await focusEditor();
			await setEditorPosition(1, 3);
			await page.keyboard.press('F1');
			await page.keyboard.type('Show Hover');
			await page.keyboard.press('Enter');

			// check that a hover explaining the `<title>` element appears, which indicates that the language service is up and running
			try {
				await page.waitForSelector(
					`text=The title element represents the document's title or name`,
					{ timeout: 5000 }
				);
			} catch (err) {}
		}
	});

	test('json smoke test', async function () {
		await createEditor('{}', 'json');

		// we need to try this a couple of times because the web worker might not be ready yet
		for (let attempt = 1; attempt <= 2; attempt++) {
			// trigger suggestions
			await focusEditor();
			await setEditorPosition(1, 2);
			await triggerEditorCommand('editor.action.triggerSuggest');

			// check that a suggestion item for `$schema` appears, which indicates that the language service is up and running
			try {
				await page.waitForSelector(`text=$schema`, { timeout: 5000 });
			} catch (err) {}
		}
	});

	test('typescript smoke test', async function () {
		await createEditor('window.add', 'typescript');

		// check that a squiggle appears, which indicates that the language service is up and running
		await page.waitForSelector('.squiggly-error');

		// at this point we know that the web worker is healthy, so we can trigger suggestions

		// trigger suggestions
		await focusEditor();
		await setEditorPosition(1, 11);
		await triggerEditorCommand('editor.action.triggerSuggest');

		// check that a suggestion item for `addEventListener` appears, which indicates that the language service is up and running
		await page.waitForSelector(`text=addEventListener`);

		// find the TypeScript worker
		const tsWorker = page.workers().find((worker) => {
			const url = worker.url();
			return /ts\.worker(\.[a-f0-9]+)?\.js$/.test(url) || /workerMain.js#typescript$/.test(url);
		});
		if (!tsWorker) {
			assert.fail('Could not find TypeScript worker');
		}

		// check that the TypeScript worker exposes `ts` as a global
		assert.strictEqual(await tsWorker.evaluate(`typeof ts`), 'object');

		// check that the TypeScript worker exposes the full `ts` as a global
		assert.strictEqual(await tsWorker.evaluate(`typeof ts.optionDeclarations`), 'object');
	});
});

function timeout(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	});
}
