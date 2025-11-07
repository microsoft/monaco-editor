/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';

/**
 * @param {string} filePath
 * @param {string} newExt
 */
export function changeExt(filePath, newExt) {
	const idx = filePath.lastIndexOf('.');
	if (idx === -1) {
		return filePath + newExt;
	} else {
		return filePath.substring(0, idx) + newExt;
	}
}

export function getNlsEntryPoints() {
	const nlsDir = dirname(fileURLToPath(import.meta.resolve('monaco-editor-core/esm/nls.messages.en.js')));
	const nlsFiles = readdirSync(nlsDir)
		.filter(file => file.startsWith('nls.messages.') && file.endsWith('.js'))
		.reduce((acc, file) => {
			// @ts-ignore
			acc[file] = join(nlsDir, file);
			return acc;
		}, {});
	return nlsFiles;
}

const root = join(import.meta.dirname, '../');

const mappedPaths = {
	[join(root, 'node_modules/monaco-editor-core/esm/')]: '.',
	[join(root, 'node_modules/')]: 'external/',
	[join(root, 'monaco-lsp-client/')]: 'external/monaco-lsp-client/',
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
			return changeExt(join(val, relativePath), newExt);
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
