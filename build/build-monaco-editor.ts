/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import path = require('path');
import fs = require('fs');
import {
	REPO_ROOT,
	readFiles,
	writeFiles,
	IFile,
	readFile,
	build,
	bundledFileHeader
} from '../build/utils';
import { removeDir } from '../build/fs';
import { generateMetadata } from './releaseMetadata';
import { buildAmdMinDev } from './amd/build.script';
import ts = require('typescript');

removeDir(`out/monaco-editor`);

buildAmdMinDev();

// esm folder
ESM_release();

// monaco.d.ts, editor.api.d.ts
releaseDTS();

// ThirdPartyNotices.txt
releaseThirdPartyNotices();

// esm/metadata.d.ts, esm/metadata.js
generateMetadata();

// package.json
(() => {
	const packageJSON = readFiles('package.json', { base: '' })[0];
	const json = JSON.parse(packageJSON.contents.toString());

	json.private = false;
	delete json.scripts['postinstall'];

	packageJSON.contents = Buffer.from(JSON.stringify(json, null, '  '));
	writeFiles([packageJSON], `out/monaco-editor`);
})();

(() => {
	/** @type {IFile[]} */
	let otherFiles = [];

	otherFiles = otherFiles.concat(readFiles('README.md', { base: '' }));
	otherFiles = otherFiles.concat(readFiles('CHANGELOG.md', { base: '' }));
	otherFiles = otherFiles.concat(
		readFiles('node_modules/monaco-editor-core/LICENSE', {
			base: 'node_modules/monaco-editor-core/'
		})
	);

	writeFiles(otherFiles, `out/monaco-editor`);
})();

function ESM_release() {
	const coreFiles = readFiles(`node_modules/monaco-editor-core/esm/**/*`, {
		base: 'node_modules/monaco-editor-core/esm',
		// we will create our own editor.api.d.ts which also contains the plugins API
		ignore: ['node_modules/monaco-editor-core/esm/vs/editor/editor.api.d.ts']
	});
	ESM_addImportSuffix(coreFiles);
	ESM_addPluginContribs(coreFiles);
	writeFiles(coreFiles, `out/monaco-editor/esm`);

	ESM_releasePlugins();

	build({
		entryPoints: ['src/editor/editor.main.ts', 'src/editor/editor.worker.ts'],
		bundle: true,
		target: 'esnext',
		format: 'esm',
		drop: ['debugger'],
		define: {
			AMD: 'false'
		},
		banner: {
			js: bundledFileHeader
		},
		external: ['./src/basic-languages/*', './edcore.main.js', './editor.worker.start'],
		alias: {
			'monaco-editor-core/esm/vs/editor/editor.worker.start': './editor.worker.start',
			'monaco-editor-core': './edcore.main.js'
		},
		outbase: `src/`,
		outdir: `out/monaco-editor/esm/vs/`,
		plugins: [
			{
				name: 'example',
				setup(build) {
					build.onResolve({ filter: /\/language\/|\/basic-languages\// }, (args) => {
						if (args.path.includes('monaco-editor-core')) {
							return undefined;
						}
						return { external: true };
					});
				}
			}
		]
	});
}

/**
 * Release a plugin to `esm`.
 * Adds a dependency to 'vs/editor/editor.api' in contrib files in order for `monaco` to be defined.
 * Rewrites imports for 'monaco-editor-core/**'
 */
function ESM_releasePlugins() {
	const files = readFiles(`out/languages/bundled/esm/**/*`, { base: 'out/languages/bundled/esm/' });

	for (const file of files) {
		if (!/(\.js$)|(\.ts$)/.test(file.path)) {
			continue;
		}

		let contents = file.contents.toString();

		// WARNING: this only returns the first occurence of each imported file!
		const info = ts.preProcessFile(contents);
		for (let i = info.importedFiles.length - 1; i >= 0; i--) {
			let importText = info.importedFiles[i].fileName;
			const pos = info.importedFiles[i].pos;
			const end = info.importedFiles[i].end;

			if (!/(^\.\/)|(^\.\.\/)/.test(importText)) {
				// non-relative import
				if (!/^monaco-editor-core/.test(importText)) {
					console.error(`Non-relative import for unknown module: ${importText} in ${file.path}`);
					process.exit(1);
				}

				if (importText === 'monaco-editor-core') {
					importText = 'monaco-editor-core/esm/vs/editor/editor.api';
				}

				const importFilePath = importText.substring('monaco-editor-core/esm/'.length);
				let relativePath = path
					.relative(path.dirname(file.path), importFilePath)
					.replace(/\\/g, '/');
				if (!/(^\.\/)|(^\.\.\/)/.test(relativePath)) {
					relativePath = './' + relativePath;
				}

				contents = contents.substring(0, pos + 1) + relativePath + contents.substring(end + 1);
			}
		}

		file.contents = Buffer.from(contents);
	}

	for (const file of files) {
		if (!/monaco\.contribution\.js$/.test(file.path)) {
			continue;
		}

		const apiFilePath = 'vs/editor/editor.api';
		let relativePath = path.relative(path.dirname(file.path), apiFilePath).replace(/\\/g, '/');
		if (!/(^\.\/)|(^\.\.\/)/.test(relativePath)) {
			relativePath = './' + relativePath;
		}

		let contents = file.contents.toString();
		contents = `import '${relativePath}';\n` + contents;
		file.contents = Buffer.from(contents);
	}

	ESM_addImportSuffix(files);
	writeFiles(files, `out/monaco-editor/esm`);
}

/**
 * Adds `.js` to all import statements.
 */
function ESM_addImportSuffix(files: IFile[]) {
	for (const file of files) {
		if (!/\.js$/.test(file.path)) {
			continue;
		}

		let contents = file.contents.toString();

		const info = ts.preProcessFile(contents);
		for (let i = info.importedFiles.length - 1; i >= 0; i--) {
			const importText = info.importedFiles[i].fileName;
			const pos = info.importedFiles[i].pos;
			const end = info.importedFiles[i].end;

			if (/(\.css)|(\.js)$/.test(importText)) {
				// A CSS import or an import already using .js
				continue;
			}

			contents = contents.substring(0, pos + 1) + importText + '.js' + contents.substring(end + 1);
		}

		file.contents = Buffer.from(contents);
	}
}

/**
 * - Rename esm/vs/editor/editor.main.js to esm/vs/editor/edcore.main.js
 * - Create esm/vs/editor/editor.main.js that that stiches things together
 */
function ESM_addPluginContribs(files: IFile[]) {
	for (const file of files) {
		if (!/editor\.main\.js$/.test(file.path)) {
			continue;
		}
		file.path = file.path.replace(/editor\.main/, 'edcore.main');
	}
}

/**
 * Edit monaco.d.ts:
 * - append monaco.d.ts from plugins
 */
function releaseDTS() {
	const monacodts = readFiles('node_modules/monaco-editor-core/monaco.d.ts', {
		base: 'node_modules/monaco-editor-core'
	})[0];

	let contents = monacodts.contents.toString();

	const additionalDtsFiles: Record<string, string> = {
		'out/languages/tsc/common/workers.d.ts': 'monaco.editor'
	};
	Object.entries(additionalDtsFiles).forEach(([filePath, namespace]) => {
		try {
			const dtsFile = readFile(filePath);
			let dtsContent = dtsFile.contents.toString();

			// Remove imports
			dtsContent = dtsContent.replace(/import .*\n/gm, '');
			dtsContent = dtsContent.replace(/export declare function/gm, 'export function');

			// Wrap in namespace if specified
			if (namespace) {
				dtsContent = `declare namespace ${namespace} {\n${dtsContent
					.split('\n')
					.map((line) => (line ? `    ${line}` : line))
					.join('\n')}\n}`;
			}

			contents += '\n' + dtsContent;
		} catch (error) {
			console.warn(`Could not read d.ts file: ${filePath}`);
		}
	});

	const extraContent = readFiles('out/languages/bundled/*.d.ts', {
		base: 'out/languages/bundled/'
	}).map((file) => {
		return file.contents.toString().replace(/\/\/\/ <reference.*\n/m, '');
	});

	contents =
		[
			'/*!-----------------------------------------------------------',
			' * Copyright (c) Microsoft Corporation. All rights reserved.',
			' * Type definitions for monaco-editor',
			' * Released under the MIT license',
			'*-----------------------------------------------------------*/'
		].join('\n') +
		'\n' +
		contents +
		'\n' +
		extraContent.join('\n');

	// Ensure consistent indentation and line endings
	contents = cleanFile(contents);

	monacodts.contents = Buffer.from(contents);

	const editorapidts = {
		path: 'esm/vs/editor/editor.api.d.ts',
		contents: Buffer.from(toExternalDTS(contents))
	};

	writeFiles([monacodts, editorapidts], `out/monaco-editor`);

	// fs.writeFileSync('website/typedoc/monaco.d.ts', contents);
}

/**
 * Transforms a .d.ts which uses internal modules (namespaces) to one which is usable with external modules
 * This function is duplicated in the `vscode` repo.
 * @param {string} contents
 */
function toExternalDTS(contents) {
	const lines = contents.split(/\r\n|\r|\n/);
	let killNextCloseCurlyBrace = false;
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		if (killNextCloseCurlyBrace) {
			if ('}' === line) {
				lines[i] = '';
				killNextCloseCurlyBrace = false;
				continue;
			}

			if (line.indexOf('    ') === 0) {
				lines[i] = line.substr(4);
			} else if (line.charAt(0) === '\t') {
				lines[i] = line.substr(1);
			}

			continue;
		}

		if ('declare namespace monaco {' === line) {
			lines[i] = '';
			killNextCloseCurlyBrace = true;
			continue;
		}

		if (line.indexOf('declare namespace monaco.') === 0) {
			lines[i] = line.replace('declare namespace monaco.', 'export namespace ');
		}

		if (line.indexOf('declare var MonacoEnvironment') === 0) {
			lines[i] = `declare global {\n    var MonacoEnvironment: Environment | undefined;\n}`;
		}
	}
	return lines.join('\n').replace(/\n\n\n+/g, '\n\n');
}

/**
 * Normalize line endings and ensure consistent 4 spaces indentation
 */
function cleanFile(contents: string): string {
	return contents
		.split(/\r\n|\r|\n/)
		.map(function (line) {
			const m = line.match(/^(\t+)/);
			if (!m) {
				return line;
			}
			const tabsCount = m[1].length;
			let newIndent = '';
			for (let i = 0; i < 4 * tabsCount; i++) {
				newIndent += ' ';
			}
			return newIndent + line.substring(tabsCount);
		})
		.join('\n');
}

/**
 * Edit ThirdPartyNotices.txt:
 * - append ThirdPartyNotices.txt from plugins
 */
function releaseThirdPartyNotices() {
	const tpn = readFiles('node_modules/monaco-editor-core/ThirdPartyNotices.txt', {
		base: 'node_modules/monaco-editor-core'
	})[0];

	let contents = tpn.contents.toString();

	console.log('ADDING ThirdPartyNotices from ./ThirdPartyNotices.txt');
	let thirdPartyNoticeContent = fs
		.readFileSync(path.join(REPO_ROOT, 'ThirdPartyNotices.txt'))
		.toString();
	thirdPartyNoticeContent = thirdPartyNoticeContent.split('\n').slice(8).join('\n');

	contents += '\n' + thirdPartyNoticeContent;
	tpn.contents = Buffer.from(contents);

	writeFiles([tpn], `out/monaco-editor`);
}
