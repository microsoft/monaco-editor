/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

/**
 * @typedef { { src:string; built:string; releaseDev:string; releaseMin:string; } } ICorePaths
 * @typedef { { dev:string; min:string; esm: string; } } IPluginPaths
 * @typedef { { name:string; contrib:string; modulePrefix:string; rootPath:string; paths:IPluginPaths } } IPlugin
 * @typedef { { METADATA: {CORE:{paths:ICorePaths}; PLUGINS:IPlugin[];} } } IMetadata
 */
/** @typedef {import('../build/utils').IFile} IFile */

const path = require('path');
const fs = require('fs');
const { REPO_ROOT, removeDir, readFiles, writeFiles } = require('../build/utils');
const ts = require('typescript');
/**@type { IMetadata } */
const metadata = require('../metadata.js');
const { generateMetadata } = require('./releaseMetadata');

removeDir(`release`);

// dev folder
AMD_releaseOne('dev');

// min folder
AMD_releaseOne('min');

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
	writeFiles([packageJSON], `release`);
})();

(() => {
	/** @type {IFile[]} */
	let otherFiles = [];

	otherFiles = otherFiles.concat(readFiles('README.md', { base: '' }));
	otherFiles = otherFiles.concat(readFiles('CHANGELOG.md', { base: '' }));
	otherFiles = otherFiles.concat(
		readFiles('node_modules/monaco-editor-core/min-maps/**/*', {
			base: 'node_modules/monaco-editor-core/'
		})
	);
	otherFiles = otherFiles.concat(
		readFiles('node_modules/monaco-editor-core/LICENSE', {
			base: 'node_modules/monaco-editor-core/'
		})
	);

	writeFiles(otherFiles, `release`);
})();

/**
 * Release to `dev` or `min`.
 * @param {'dev'|'min'} type
 */
function AMD_releaseOne(type) {
	const coreFiles = readFiles(`node_modules/monaco-editor-core/${type}/**/*`, {
		base: `node_modules/monaco-editor-core/${type}`
	});
	AMD_addPluginContribs(type, coreFiles);
	writeFiles(coreFiles, `release/${type}`);

	for (const plugin of metadata.METADATA.PLUGINS) {
		AMD_releasePlugin(plugin, type, `release/${type}`);
	}
}

/**
 * Release a plugin to `dev` or `min`.
 * @param {IPlugin} plugin
 * @param {'dev'|'min'} type
 * @param {string} destinationPath
 */
function AMD_releasePlugin(plugin, type, destinationPath) {
	const pluginPath = path.join(plugin.rootPath, plugin.paths[type]); // dev or min
	const contribPath =
		path.join(pluginPath, plugin.contrib.substring(plugin.modulePrefix.length)) + '.js';

	const files = readFiles(`${pluginPath}/**/*`, { base: pluginPath, ignore: [contribPath] });
	writeFiles(files, path.join(destinationPath, plugin.modulePrefix));
}

/**
 * Edit editor.main.js:
 * - rename the AMD module 'vs/editor/editor.main' to 'vs/editor/edcore.main'
 * - append monaco.contribution modules from plugins
 * - append new AMD module 'vs/editor/editor.main' that stiches things together
 *
 * @param {'dev'|'min'} type
 * @param {IFile[]} files
 */
function AMD_addPluginContribs(type, files) {
	for (const file of files) {
		if (!/editor\.main\.js$/.test(file.path)) {
			continue;
		}

		let contents = file.contents.toString();

		// Rename the AMD module 'vs/editor/editor.main' to 'vs/editor/edcore.main'
		contents = contents.replace(/"vs\/editor\/editor\.main\"/, '"vs/editor/edcore.main"');

		/** @type {string[]} */
		let extraContent = [];
		/** @type {string[]} */
		let allPluginsModuleIds = [];

		metadata.METADATA.PLUGINS.forEach(function (plugin) {
			allPluginsModuleIds.push(plugin.contrib);
			const pluginPath = path.join(plugin.rootPath, plugin.paths[type]); // dev or min
			const contribPath =
				path.join(REPO_ROOT, pluginPath, plugin.contrib.substring(plugin.modulePrefix.length)) +
				'.js';
			let contribContents = fs.readFileSync(contribPath).toString();

			contribContents = contribContents.replace(
				/define\((['"][a-z\/\-]+\/fillers\/monaco-editor-core['"]),\[\],/,
				"define($1,['vs/editor/editor.api'],"
			);

			extraContent.push(contribContents);
		});

		extraContent.push(
			`define("vs/editor/editor.main", ["vs/editor/edcore.main","${allPluginsModuleIds.join(
				'","'
			)}"], function(api) { return api; });`
		);
		let insertIndex = contents.lastIndexOf('//# sourceMappingURL=');
		if (insertIndex === -1) {
			insertIndex = contents.length;
		}
		contents =
			contents.substring(0, insertIndex) +
			'\n' +
			extraContent.join('\n') +
			'\n' +
			contents.substring(insertIndex);

		file.contents = Buffer.from(contents);
	}
}

function ESM_release() {
	const coreFiles = readFiles(`node_modules/monaco-editor-core/esm/**/*`, {
		base: 'node_modules/monaco-editor-core/esm',
		// we will create our own editor.api.d.ts which also contains the plugins API
		ignore: ['node_modules/monaco-editor-core/esm/vs/editor/editor.api.d.ts']
	});
	ESM_addImportSuffix(coreFiles);
	ESM_addPluginContribs(coreFiles);
	writeFiles(coreFiles, `release/esm`);

	for (const plugin of metadata.METADATA.PLUGINS) {
		ESM_releasePlugin(plugin, `release/esm`);
	}
}

/**
 * Release a plugin to `esm`.
 * Adds a dependency to 'vs/editor/editor.api' in contrib files in order for `monaco` to be defined.
 * Rewrites imports for 'monaco-editor-core/**'
 * @param {IPlugin} plugin
 * @param {string} destinationPath
 */
function ESM_releasePlugin(plugin, destinationPath) {
	const pluginPath = path.join(plugin.rootPath, plugin.paths['esm']);

	const files = readFiles(`${pluginPath}/**/*`, { base: pluginPath });

	for (const file of files) {
		if (!/(\.js$)|(\.ts$)/.test(file.path)) {
			continue;
		}

		let contents = file.contents.toString();

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

				const myFileDestPath = path.join(plugin.modulePrefix, file.path);
				const importFilePath = importText.substring('monaco-editor-core/esm/'.length);
				let relativePath = path
					.relative(path.dirname(myFileDestPath), importFilePath)
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

		const myFileDestPath = path.join(plugin.modulePrefix, file.path);
		const apiFilePath = 'vs/editor/editor.api';
		let relativePath = path.relative(path.dirname(myFileDestPath), apiFilePath).replace(/\\/g, '/');
		if (!/(^\.\/)|(^\.\.\/)/.test(relativePath)) {
			relativePath = './' + relativePath;
		}

		let contents = file.contents.toString();
		contents = `import '${relativePath}';\n` + contents;
		file.contents = Buffer.from(contents);
	}

	ESM_addImportSuffix(files);
	writeFiles(files, path.join(destinationPath, plugin.modulePrefix));
}

/**
 * Adds `.js` to all import statements.
 * @param {IFile[]} files
 */
function ESM_addImportSuffix(files) {
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

			if (/\.css$/.test(importText)) {
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
 * @param {IFile[]} files
 */
function ESM_addPluginContribs(files) {
	for (const file of files) {
		if (!/editor\.main\.js$/.test(file.path)) {
			continue;
		}
		file.path = file.path.replace(/editor\.main/, 'edcore.main');
	}

	const mainFileDestPath = 'vs/editor/editor.main.js';

	/** @type {string[]} */
	let mainFileImports = [];
	for (const plugin of metadata.METADATA.PLUGINS) {
		const contribDestPath = plugin.contrib;

		let relativePath = path
			.relative(path.dirname(mainFileDestPath), contribDestPath)
			.replace(/\\/g, '/');
		if (!/(^\.\/)|(^\.\.\/)/.test(relativePath)) {
			relativePath = './' + relativePath;
		}

		mainFileImports.push(relativePath);
	}

	const mainFileContents =
		mainFileImports.map((name) => `import '${name}';`).join('\n') +
		`\n\nexport * from './edcore.main';`;

	files.push({
		path: mainFileDestPath,
		contents: Buffer.from(mainFileContents)
	});
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

	/** @type {string[]} */
	const extraContent = [];
	metadata.METADATA.PLUGINS.forEach(function (plugin) {
		const dtsPath = path.join(plugin.rootPath, './monaco.d.ts');
		try {
			let plugindts = fs.readFileSync(dtsPath).toString();
			plugindts = plugindts.replace(/\/\/\/ <reference.*\n/m, '');
			extraContent.push(plugindts);
		} catch (err) {
			return;
		}
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

	writeFiles([monacodts, editorapidts], `release`);

	fs.writeFileSync('website/playground/monaco.d.ts.txt', contents);
	fs.writeFileSync('website/typedoc/monaco.d.ts', contents);
}

/**
 * Transforms a .d.ts which uses internal modules (namespaces) to one which is usable with external modules
 * This function is duplicated in the `vscode` repo.
 * @param {string} contents
 * @returns string
 */
function toExternalDTS(contents) {
	let lines = contents.split(/\r\n|\r|\n/);
	let killNextCloseCurlyBrace = false;
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];

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

		if (line.indexOf('declare let MonacoEnvironment') === 0) {
			lines[i] = `declare global {\n    let MonacoEnvironment: Environment | undefined;\n}`;
		}
		if (line.indexOf('    MonacoEnvironment?') === 0) {
			lines[i] = `    MonacoEnvironment?: Environment | undefined;`;
		}
	}
	return lines.join('\n').replace(/\n\n\n+/g, '\n\n');
}

/**
 * Normalize line endings and ensure consistent 4 spaces indentation
 * @param {string} contents
 * @returns {string}
 */
function cleanFile(contents) {
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

	writeFiles([tpn], `release`);
}
