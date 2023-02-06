/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const yaserver = require('yaserver');
const http = require('http');
const cp = require('child_process');
const path = require('path');

/** @typedef {import('./common').BrowserKind} BrowserKind */
/** @typedef {import('./common').PackagerKind} PackagerKind */
/** @typedef {import('./common').TestInfo} TestInfo */

const DEBUG_TESTS = process.argv.includes('--debug-tests');
const REPO_ROOT = path.join(__dirname, '../../');
const PORT = 8563;

yaserver
	.createServer({
		rootDir: REPO_ROOT
	})
	.then((staticServer) => {
		const server = http.createServer((request, response) => {
			return staticServer.handle(request, response);
		});
		server.listen(PORT, '127.0.0.1', async () => {
			try {
				await runTests();
				console.log(`All good`);
				process.exit(0);
			} catch (err) {
				console.error(err);
				process.exit(1);
			}
		});
	});

async function runTests() {
	// uncomment to shortcircuit and run a specific combo
	// await runTest('webpack', 'chromium'); return;
	/** @type {PackagerKind[]} */
	const testTypes = ['amd', 'webpack', 'esbuild', 'vite', 'parcel'];

	for (const type of testTypes) {
		await runTest(type, 'chromium');
		await runTest(type, 'firefox');
		await runTest(type, 'webkit');
	}
}

/**
 * @param {PackagerKind} packager
 * @param {BrowserKind} browser
 * @returns
 */
function runTest(packager, browser) {
	return new Promise((resolve, reject) => {
		/** @type TestInfo */
		const testInfo = {
			browser,
			packager,
			debugTests: DEBUG_TESTS,
			port: PORT
		};
		const env = { MONACO_TEST_INFO: JSON.stringify(testInfo), ...process.env };
		const proc = cp.spawn(
			'node',
			[
				path.join(REPO_ROOT, 'node_modules/mocha/bin/mocha'),
				'test/smoke/*.test.js',
				'--no-delay',
				'--headless',
				'--timeout',
				'20000'
			],
			{
				env,
				stdio: 'inherit'
			}
		);
		proc.on('error', reject);
		proc.on('exit', (code) => {
			if (code === 0) {
				resolve(undefined);
			} else {
				reject(code);
			}
		});
	});
}
