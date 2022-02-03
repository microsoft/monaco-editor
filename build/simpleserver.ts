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

const WEBSITE_GENERATED_PATH = path.join(REPO_ROOT, 'website/playground/new-samples');

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

	/** @type {{ chapter: string; name: string; id: string; path: string; }[]} */
	const PLAY_SAMPLES = require(path.join(WEBSITE_GENERATED_PATH, 'all.js')).PLAY_SAMPLES;
	/** @type {{ path: string; name: string; }[]} */
	const locations = [];
	for (let i = 0; i < PLAY_SAMPLES.length; i++) {
		const sample = PLAY_SAMPLES[i];
		const sampleId = sample.id;
		const samplePath = path.join(WEBSITE_GENERATED_PATH, sample.path);

		const html = fs.readFileSync(path.join(samplePath, 'sample.html'));
		const js = fs.readFileSync(path.join(samplePath, 'sample.js'));
		const css = fs.readFileSync(path.join(samplePath, 'sample.css'));

		const result = [
			'<!DOCTYPE html>',
			'<!-- THIS IS A GENERATED FILE VIA `npm run simpleserver` -->',
			'<html>',
			'<head>',
			'	<base href="../..">',
			'	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />',
			'</head>',
			'<body>',
			'<style>',
			'/*----------------------------------------SAMPLE CSS START*/',
			'',
			css,
			'',
			'/*----------------------------------------SAMPLE CSS END*/',
			'</style>',
			'<a class="loading-opts" href="generated/playground/index.html">[&lt;&lt; BACK]</a> <br/>',
			'THIS IS A GENERATED FILE VIA `npm run simpleserver`',
			'',
			'<div id="bar" style="margin-bottom: 6px;"></div>',
			'',
			'<div style="clear:both"></div>',
			'<div id="outer-container" style="width:800px;height:450px;border: 1px solid grey">',
			'<!-- ----------------------------------------SAMPLE HTML START-->',
			'',
			html,
			'',
			'<!-- ----------------------------------------SAMPLE HTML END-->',
			'</div>',
			'<div style="clear:both"></div>',
			'',
			'<script src="dev-setup.js"></script>',
			'<script>',
			'loadEditor(function() {',
			'/*----------------------------------------SAMPLE JS START*/',
			'',
			js,
			'',
			'/*----------------------------------------SAMPLE JS END*/',
			'});',
			'</script>',
			'</body>',
			'</html>'
		];

		const destination = path.join(
			REPO_ROOT,
			'test/manual/generated/playground/' + sampleId + '.html'
		);
		ensureDir(path.dirname(destination));
		fs.writeFileSync(destination, result.join('\n'));
		locations.push({
			path: sampleId + '.html',
			name: sample.chapter + ' &gt; ' + sample.name
		});
	}

	const index = [
		'<!DOCTYPE html>',
		'<!-- THIS IS A GENERATED FILE VIA `npm run simpleserver` -->',
		'<html>',
		'<head>',
		'	<base href="../..">',
		'</head>',
		'<body>',
		'<a class="loading-opts" href="index.html">[&lt;&lt; BACK]</a><br/>',
		'THIS IS A GENERATED FILE VIA `npm run simpleserver`<br/><br/>',
		locations
			.map(function (location) {
				return (
					'<a class="loading-opts" href="generated/playground/' +
					location.path +
					'">' +
					location.name +
					'</a>'
				);
			})
			.join('<br/>\n'),
		'<script src="dev-setup.js"></script>',
		'</body>',
		'</html>'
	];
	fs.writeFileSync(
		path.join(REPO_ROOT, 'test/manual/generated/playground/index.html'),
		index.join('\n')
	);
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
