/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';
import glob from 'glob';

/**
 * @param {string} filePath
 * @param {string} newExt
 */
export function changeExt(filePath, newExt) {
	if (filePath.endsWith(newExt)) {
		return filePath;
	}
	const idx = filePath.lastIndexOf('.');
	if (idx === -1) {
		return filePath + newExt;
	} else {
		return filePath.substring(0, idx) + newExt;
	}
}

/**
 * @returns {{ pathFromRoot: string, source: { value: string } | { absolutePath: string } }[]}
 */
export function getNlsFiles(rootPath = '') {
	const nlsDir = dirname(fileURLToPath(import.meta.resolve('monaco-editor-core/esm/nls.messages.en.js')));
	const files = readdirSync(nlsDir)
		.flatMap(file => {
			const match = /nls\.messages\.(?<lang>.+)\.js/.exec(file);
			if (!match) {
				return [];
			}
			const lang = match.groups?.lang;
			return [
				{
					pathFromRoot: join(rootPath, 'nls', 'lang', lang + '.js'),
					source: { absolutePath: join(nlsDir, file) }
				},
				{
					pathFromRoot: join(rootPath, 'nls', 'lang', lang + '.d.ts'),
					source: { value: 'export {};' }
				}
			];
		});

	return [
		...files,
	];
}

export const root = join(import.meta.dirname, '../');

/**
 * @param {string} pattern
 * @returns
 */
function findFiles(pattern) {
	return glob.sync(pattern, { cwd: root });
}

export function getEntryPoints(includeFeatures = false, includeDeprecated = true) {
	const features = includeFeatures ? Object.fromEntries(findFiles('./src/**/register.*').filter(p => !p.includes('.d.ts')).map(v => [v, join(root, v)])) : {};

	const deprecatedFiles = includeDeprecated ? findFiles('./src/deprecated/**/*.ts') : [];
	const deprecatedEntryPoints = Object.fromEntries(
		deprecatedFiles.map(v => {
			let key = v.replace(/^src\/deprecated\//, '');
			//key = key.replace(/(\.d)?\.ts$/, '');
			if (key.startsWith('./')) {
				key = key.substring(2);
			}
			return [key, join(root, v)];
		})
	);

	const result = {
		...features,
		'editor': join(root, 'src/editor.ts'),
		'index': join(root, './src/index.ts'),
		...deprecatedEntryPoints,
	};

	return result;
}

const mappedPaths = {
	[join(root, 'node_modules/monaco-editor-core/esm/')]: '.',
	[join(root, 'node_modules/')]: 'external/',
	[join(root, 'monaco-lsp-client/')]: 'external/monaco-lsp-client/',
	[join(root, 'src/deprecated')]: 'vs/',
	[join(root, 'src/')]: 'vs/',
};

/**
 * @param {string} moduleId
 * @param {string} newExt (with leading .)
 * @returns {string | undefined}
 */
export function mapModuleId(moduleId, newExt) {
	for (const [key, val] of Object.entries(mappedPaths)) {
		if (moduleId.startsWith(key)) {
			const relativePath = moduleId.substring(key.length);
			const result = changeExt(join(val, relativePath), newExt);
			return result;
		}
	}
	return undefined;
}

/**
 * @param {(moduleId: string) => boolean} [filter]
 * @return {import('rollup').Plugin}
 */
export function dtsDeprecationWarning(filter) {
	return {
		name: 'add-dts-deprecation-warning',
		generateBundle(options, bundle) {
			for (const fileName in bundle) {
				if (filter && !filter(fileName)) {
					continue;
				}
				const file = bundle[fileName];
				if (file.type === 'chunk' && fileName.endsWith('.d.ts')) {
					let content = file.code.toString();
					content = content + `
declare namespace languages {
	/** @deprecated Use the new top level "css" namespace instead. */
	export const css: { deprecated: true };

	/** @deprecated Use the new top level "html" namespace instead. */
	export const html: { deprecated: true };

	/** @deprecated Use the new top level "json" namespace instead. */
	export const json: { deprecated: true };

	/** @deprecated Use the new top level "typescript" namespace instead. */
	export const typescript: { deprecated: true };
}
					`;
					file.code = content;
				}
			}
		}
	};
}
