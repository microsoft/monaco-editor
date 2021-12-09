/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { REPO_ROOT, prettier, ensureDir } = require('./utils');

const customFeatureLabels = {
	'vs/editor/browser/controller/coreCommands': 'coreCommands',
	'vs/editor/contrib/caretOperations/caretOperations': 'caretOperations',
	'vs/editor/contrib/caretOperations/transpose': 'transpose',
	'vs/editor/contrib/colorPicker/colorDetector': 'colorDetector',
	'vs/editor/contrib/rename/onTypeRename': 'onTypeRename',
	'vs/editor/contrib/gotoSymbol/link/goToDefinitionAtPosition': 'gotoSymbol',
	'vs/editor/contrib/snippet/snippetController2': 'snippets',
	'vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess': 'gotoLine',
	'vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess': 'quickCommand',
	'vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess': 'quickOutline',
	'vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess': 'quickHelp'
};

/**
 * @returns { Promise<{ label: string; entry: string; }[]> }
 */
function getBasicLanguages() {
	return new Promise((resolve, reject) => {
		glob(
			'./release/esm/vs/basic-languages/*/*.contribution.js',
			{ cwd: path.dirname(__dirname) },
			(err, files) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(
					files.map((file) => {
						const entry = file.substring('./release/esm/'.length).replace(/\.js$/, '');
						const label = path.basename(file).replace(/\.contribution\.js$/, '');
						return {
							label: label,
							entry: entry
						};
					})
				);
			}
		);
	});
}

/**
 * @returns { Promise<string[]> }
 */
function readAdvancedLanguages() {
	return new Promise((resolve, reject) => {
		glob(
			'./release/esm/vs/language/*/monaco.contribution.js',
			{ cwd: path.dirname(__dirname) },
			(err, files) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(
					files
						.map((file) => file.substring('./release/esm/vs/language/'.length))
						.map((file) => file.substring(0, file.length - '/monaco.contribution.js'.length))
				);
			}
		);
	});
}

/**
 * @returns { Promise<{ label: string; entry: string; worker: { id: string; entry: string; }; }[]> }
 */
function getAdvancedLanguages() {
	return readAdvancedLanguages().then((languages) => {
		let result = [];
		for (const lang of languages) {
			let shortLang = lang === 'typescript' ? 'ts' : lang;
			const entry = `vs/language/${lang}/monaco.contribution`;
			checkFileExists(entry);
			const workerId = `vs/language/${lang}/${shortLang}Worker`;
			const workerEntry = `vs/language/${lang}/${shortLang}.worker`;
			checkFileExists(workerEntry);
			result.push({
				label: lang,
				entry: entry,
				worker: {
					id: workerId,
					entry: workerEntry
				}
			});
		}
		return result;
	});

	function checkFileExists(moduleName) {
		const filePath = path.join(REPO_ROOT, 'release/esm', `${moduleName}.js`);
		if (!fs.existsSync(filePath)) {
			console.error(`Could not find ${filePath}.`);
			process.exit(1);
		}
	}
}

function generateMetadata() {
	return Promise.all([getBasicLanguages(), getAdvancedLanguages()]).then(
		([basicLanguages, advancedLanguages]) => {
			basicLanguages.sort(strcmp);
			advancedLanguages.sort(strcmp);

			let i = 0,
				len = basicLanguages.length;
			let j = 0,
				lenJ = advancedLanguages.length;
			let languages = [];
			while (i < len || j < lenJ) {
				if (i < len && j < lenJ) {
					if (basicLanguages[i].label === advancedLanguages[j].label) {
						let entry = [];
						entry.push(basicLanguages[i].entry);
						entry.push(advancedLanguages[j].entry);
						languages.push({
							label: basicLanguages[i].label,
							entry: entry,
							worker: advancedLanguages[j].worker
						});
						i++;
						j++;
					} else if (basicLanguages[i].label < advancedLanguages[j].label) {
						languages.push(basicLanguages[i]);
						i++;
					} else {
						languages.push(advancedLanguages[j]);
						j++;
					}
				} else if (i < len) {
					languages.push(basicLanguages[i]);
					i++;
				} else {
					languages.push(advancedLanguages[j]);
					j++;
				}
			}

			const features = getFeatures();

			const dtsContents = `
/*!----------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *----------------------------------------------------------------*/

export interface IWorkerDefinition {
	id: string;
	entry: string;
}

export interface IFeatureDefinition {
	label: string;
	entry: string | string[] | undefined;
	worker?: IWorkerDefinition;
}

export const features: IFeatureDefinition[];

export const languages: IFeatureDefinition[];

export type EditorLanguage = ${languages.map((el) => `'${el.label}'`).join(' | ')};

export type EditorFeature = ${features.map((el) => `'${el.label}'`).join(' | ')};

export type NegatedEditorFeature = ${features.map((el) => `'!${el.label}'`).join(' | ')};

`;
			const dtsDestination = path.join(REPO_ROOT, 'release/esm/metadata.d.ts');
			ensureDir(path.dirname(dtsDestination));
			fs.writeFileSync(dtsDestination, dtsContents.replace(/\r\n/g, '\n'));

			const jsContents = `
exports.features = ${JSON.stringify(features, null, '  ')};
exports.languages = ${JSON.stringify(languages, null, '  ')};
`;
			const jsDestination = path.join(REPO_ROOT, 'release/esm/metadata.js');
			ensureDir(path.dirname(jsDestination));
			fs.writeFileSync(jsDestination, jsContents.replace(/\r\n/g, '\n'));
		}
	);
}
exports.generateMetadata = generateMetadata;

/**
 * @tyoe {string} a
 * @tyoe {string} b
 */
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
 * @returns {{label:string;entry:string|string[];}[]}
 */
function getFeatures() {
	const skipImports = [
		'vs/editor/browser/widget/codeEditorWidget',
		'vs/editor/browser/widget/diffEditorWidget',
		'vs/editor/browser/widget/diffNavigator',
		'vs/editor/common/standaloneStrings',
		'vs/editor/contrib/tokenization/tokenization',
		'vs/editor/editor.all',
		'vs/base/browser/ui/codicons/codiconStyles',
		'vs/editor/contrib/gotoSymbol/documentSymbols'
	];

	/** @type {string[]} */
	let features = [];
	const files =
		fs.readFileSync(path.join(REPO_ROOT, 'release/esm/vs/editor/edcore.main.js')).toString() +
		fs.readFileSync(path.join(REPO_ROOT, 'release/esm/vs/editor/editor.all.js')).toString();
	files.split(/\r\n|\n/).forEach((line) => {
		const m = line.match(/import '([^']+)'/);
		if (m) {
			const tmp = path.posix.join('vs/editor', m[1]).replace(/\.js$/, '');
			if (skipImports.indexOf(tmp) === -1) {
				features.push(tmp);
			}
		}
	});

	/** @type {{label:string;entry:any;}[]} */
	let result = features.map((feature) => {
		return {
			label: customFeatureLabels[feature] || path.basename(path.dirname(feature)),
			entry: feature
		};
	});

	result.sort((a, b) => {
		const labelCmp = strcmp(a.label, b.label);
		if (labelCmp === 0) {
			return strcmp(a.entry, b.entry);
		}
		return labelCmp;
	});

	for (let i = 0; i < result.length; i++) {
		if (i + 1 < result.length && result[i].label === result[i + 1].label) {
			if (typeof result[i].entry === 'string') {
				result[i].entry = [result[i].entry];
			}
			result[i].entry.push(result[i + 1].entry);
			result.splice(i + 1, 1);
		}
	}

	return result;
}
