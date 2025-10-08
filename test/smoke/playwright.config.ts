/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { defineConfig, devices } from '@playwright/test';

const packagers = ['amd', 'webpack', 'esbuild', 'vite'] as const;
const browsers = [
	{ name: 'chromium', device: devices['Desktop Chrome'] },
	{ name: 'firefox', device: devices['Desktop Firefox'] },
	{ name: 'webkit', device: devices['Desktop Safari'] }
];

export default defineConfig({
	testDir: '.',
	testMatch: '*.test.ts',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	timeout: 20000,
	use: {
		trace: 'on-first-retry',
		baseURL: `http://127.0.0.1:${process.env.PORT || 8563}`
	},

	projects: packagers.flatMap((packager) =>
		browsers.map((browser) => ({
			name: `${packager}-${browser.name}`,
			use: browser.device,
			metadata: { packager }
		}))
	),

	webServer: {
		command: 'node server.js',
		url: `http://127.0.0.1:${process.env.PORT || 8563}`,
		reuseExistingServer: !process.env.CI
	}
});
