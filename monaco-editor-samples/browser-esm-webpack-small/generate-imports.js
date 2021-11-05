/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const glob = require('glob');
const path = require('path');
const fs = require('fs');

const FILE_PATH = path.join(__dirname, 'index.js');
generateLanguages();
generateFeatures();

/**
 * @returns { Promise<string[]> }
 */
function getBasicLanguages() {
	return new Promise((resolve, reject) => {
		glob(
			'./node_modules/monaco-editor/esm/vs/basic-languages/*/*.contribution.js',
			{ cwd: path.dirname(__dirname) },
			(err, files) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(
					files.map((file) => {
						return file.substring('./node_modules/monaco-editor/esm/'.length).replace(/\.js$/, '');
					})
				);
			}
		);
	});
}

/**
 * @returns { Promise<string[]> }
 */
function getAdvancedLanguages() {
	return new Promise((resolve, reject) => {
		glob(
			'./node_modules/monaco-editor/esm/vs/language/*/monaco.contribution.js',
			{ cwd: path.dirname(__dirname) },
			(err, files) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(
					files
						.map((file) => file.substring('./node_modules/monaco-editor/esm/vs/language/'.length))
						.map((file) => file.substring(0, file.length - '/monaco.contribution.js'.length))
						.map((lang) => `vs/language/${lang}/monaco.contribution`)
				);
			}
		);
	});
}

function generateLanguages() {
	return Promise.all([getBasicLanguages(), getAdvancedLanguages()]).then(
		([basicLanguages, advancedLanguages]) => {
			basicLanguages.sort(strcmp);
			advancedLanguages.sort(strcmp);

			const allLanguages = advancedLanguages.concat(basicLanguages);
			const imports = allLanguages
				.map((l) => `import 'monaco-editor/esm/${l}.js';`)
				.map((l) => `${/python/.test(l) ? '' : '// '}${l}`)
				.join('\n');

			let contents = fs.readFileSync(FILE_PATH).toString();
			contents = contents.replace(
				/\/\/ BEGIN_LANGUAGES\n([\/ a-zA-Z0-9'\/\-\.;]+\n)+\/\/ END_LANGUAGES/,
				`// BEGIN_LANGUAGES\n${imports}\n// END_LANGUAGES`
			);
			fs.writeFileSync(FILE_PATH, contents);
		}
	);
}

function strcmp(a, b) {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
}

/**
 * @returns { string[] }
 */
function generateFeatures() {
	const skipImports = [
		'vs/editor/common/standaloneStrings',
		'vs/editor/contrib/tokenization/tokenization',
		'vs/editor/editor.all',
		'vs/base/browser/ui/codicons/codiconStyles'
	];

	let features = [];
	const files =
		fs
			.readFileSync(
				path.join(__dirname, '../node_modules/monaco-editor/esm/vs/editor/edcore.main.js')
			)
			.toString() +
		fs
			.readFileSync(
				path.join(__dirname, '../node_modules/monaco-editor/esm/vs/editor/editor.all.js')
			)
			.toString();
	files.split(/\r\n|\n/).forEach((line) => {
		const m = line.match(/import '([^']+)'/);
		if (m) {
			const tmp = path.posix.join('vs/editor', m[1]).replace(/\.js$/, '');
			if (skipImports.indexOf(tmp) === -1) {
				features.push(tmp);
			}
		}
	});

	features.sort(strcmp);
	const imports = features
		.map((l) => `import 'monaco-editor/esm/${l}.js';`)
		.map((l) => `${/(coreCommands)|(findController)/.test(l) ? '' : '// '}${l}`)
		.join('\n');

	let contents = fs.readFileSync(FILE_PATH).toString();
	contents = contents.replace(
		/\/\/ BEGIN_FEATURES\n([\/ a-zA-Z0-9'\/\-\.;]+\n)+\/\/ END_FEATURES/,
		`// BEGIN_FEATURES\n${imports}\n// END_FEATURES`
	);
	fs.writeFileSync(FILE_PATH, contents);
}
