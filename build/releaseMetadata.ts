/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import glob = require('glob');
import path = require('path');
import fs = require('fs');
import { REPO_ROOT } from './utils';
import { ensureDir } from './fs';

function getBasicLanguages(): { label: string; entry: string }[] {
	const files = glob.sync('./out/monaco-editor/esm/vs/languages/definitions/*/register.js', {
		cwd: path.dirname(__dirname)
	});

	return files.map((file) => {
		const label = file
			.substring('./out/monaco-editor/esm/vs/languages/definitions/'.length)
			.replace('/register.js', '');
		const entry = `vs/languages/definitions/${label}/register`;
		return {
			label: label,
			entry: entry
		};
	});
}

function readAdvancedLanguages(): Promise<string[]> {
	return new Promise((resolve, reject) => {
		glob(
			'./out/monaco-editor/esm/vs/languages/features/*/register.js',
			{ cwd: path.dirname(__dirname) },
			(err, files) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(
					files
						.map((file) => file.substring('./out/monaco-editor/esm/vs/languages/features/'.length))
						.map((file) => file.substring(0, file.length - '/register.js'.length))
				);
			}
		);
	});
}

function getAdvancedLanguages(): Promise<
	{ label: string; entry: string; worker: { id: string; entry: string } }[]
> {
	return readAdvancedLanguages().then((languages) => {
		let result = [];
		for (const lang of languages) {
			let shortLang = lang === 'typescript' ? 'ts' : lang;
			const entry = `vs/languages/features/${lang}/register`;
			checkFileExists(entry);
			const workerId = `vs/languages/features/${lang}/${shortLang}Worker`;
			const workerEntry = `vs/languages/features/${lang}/${shortLang}.worker`;
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
		const filePath = path.join(REPO_ROOT, 'out/monaco-editor/esm', `${moduleName}.js`);
		if (!fs.existsSync(filePath)) {
			console.error(`Could not find ${filePath}.`);
			process.exit(1);
		}
	}
}

export function generateEsmMetadataJsAndDTs() {
	return Promise.all([getBasicLanguages(), getAdvancedLanguages()]).then(
		([basicLanguages, advancedLanguages]) => {
			basicLanguages.sort((a, b) => strcmp(a.entry, b.entry));
			advancedLanguages.sort((a, b) => strcmp(a.entry, b.entry));

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
			const dtsDestination = path.join(REPO_ROOT, 'out/monaco-editor/esm/metadata.d.ts');
			ensureDir(path.dirname(dtsDestination));
			fs.writeFileSync(dtsDestination, dtsContents.replace(/\r\n/g, '\n'));

			const jsContents = `
exports.features = ${JSON.stringify(features, null, '  ')};
exports.languages = ${JSON.stringify(languages, null, '  ')};
`;
			const jsDestination = path.join(REPO_ROOT, 'out/monaco-editor/esm/metadata.js');
			ensureDir(path.dirname(jsDestination));
			fs.writeFileSync(jsDestination, jsContents.replace(/\r\n/g, '\n'));

			for (const feature of [...features, ...languages]) {
				const entries = [].concat(feature.entry);
				for (const entry of entries) {
					const dtsDestination = path.join(REPO_ROOT, 'out/monaco-editor/esm', entry) + '.d.ts';
					ensureDir(path.dirname(dtsDestination));
					if (!fs.existsSync(dtsDestination)) {
						fs.writeFileSync(dtsDestination, 'export {}\n');
					}
				}
			}
		}
	);
}

function strcmp(a: string, b: string) {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
}

function getFeatures(): { label: string; entry: string | string[] }[] {
	const featureFiles = glob.sync('./out/monaco-editor/esm/vs/features/*/register.js', {
		cwd: path.dirname(__dirname)
	});

	return featureFiles.map((file) => {
		const featureName = file
			.substring('./out/monaco-editor/esm/vs/features/'.length)
			.replace('/register.js', '');
		const entry = `vs/features/${featureName}/register`;
		return {
			label: featureName,
			entry: entry
		};
	});
}
