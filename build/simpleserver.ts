/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs = require('fs');
import path = require('path');
import http = require('http');
import yaserver = require('yaserver');
import { REPO_ROOT } from './utils';
import { ensureDir } from './fs';

generateTestSamplesTask();

const SERVER_ROOT = path.normalize(path.join(REPO_ROOT, '../'));
createSimpleServer(SERVER_ROOT, 8080);
createSimpleServer(SERVER_ROOT, 8088);

function generateTestSamplesTask() {
	const sampleNames = fs.readdirSync(path.join(REPO_ROOT, 'test/manual/samples'));
	let samples = sampleNames.map((sampleName) => {
		const samplePath = path.join(REPO_ROOT, 'test/manual/samples', sampleName);
		const sampleContent = fs.readFileSync(samplePath).toString();
		return {
			name: sampleName,
			content: sampleContent
		};
	});

	// Add samples from website
	{
		let sampleNames = fs.readdirSync(path.join(REPO_ROOT, 'website/index/samples'));
		sampleNames = sampleNames.filter((name) => /^sample/.test(name));

		samples = samples.concat(
			sampleNames.map((sampleName) => {
				const samplePath = path.join(REPO_ROOT, 'website/index/samples', sampleName);
				const sampleContent = fs.readFileSync(samplePath).toString();
				return {
					name: sampleName,
					content: sampleContent
				};
			})
		);
	}

	const prefix =
		'//This is a generated file via `npm run simpleserver`\ndefine([], function() { return';
	const suffix = '; });';

	const destination = path.join(REPO_ROOT, 'test/manual/generated/all-samples.js');
	ensureDir(path.dirname(destination));
	fs.writeFileSync(destination, prefix + JSON.stringify(samples, null, '\t') + suffix);
}

function createSimpleServer(rootDir: string, port: number) {
	yaserver
		.createServer({
			rootDir: rootDir
		})
		.then((staticServer) => {
			const server = http.createServer((request, response) => {
				return staticServer.handle(request, response);
			});
			server.listen(port, '127.0.0.1', () => {
				console.log(`Running at http://127.0.0.1:${port}`);
			});
		});
}
