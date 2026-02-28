/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// TODO merge this with the ESM version plugin.
// The main difference is that in this context, the default output is AMD, so ?esm would be outputted as AMD as well.

// TODO: adopt @vscode/esm-rollup-plugin when it becomes available.

/**
 * @type {() => import('rollup').Plugin}
 */
export function urlToEsmPlugin() {
	return {
		name: 'import-meta-url',
		async transform(code, id) {
			if (this.environment?.mode === 'dev') {
				return;
			}
			let idx = 0;

			// Look for `new URL("...?esm", import.meta.url)` patterns.
			const regex = /new\s+URL\s*\(\s*(['"`])(.*?)\?esm\1\s*,\s*import\.meta\.url\s*\)?/g;

			let match;
			let modified = false;
			let result = code;
			let offset = 0;
			/** @type {string[]} */
			const additionalImports = [];

			while ((match = regex.exec(code)) !== null) {
				let path = match[2];

				// Skip invalid paths (e.g., "..." in error messages)
				if (!path || path === '...' || !/^[./\w@-]/.test(path)) {
					continue;
				}

				const start = match.index;
				const end = start + match[0].length;

				const varName = `__worker_url_${idx++}__`;
				console.log(`Rewriting worker URL import in ${id}: ${path}?worker`);
				additionalImports.push(`import ${varName} from ${JSON.stringify(path + '?worker&url')};`);

				const replacement = varName;

				result = result.slice(0, start + offset) + replacement + result.slice(end + offset);
				offset += replacement.length - (end - start);
				modified = true;
			}

			if (!modified) {
				return null;
			}

			result = additionalImports.join('\n') + '\n' + result;

			return {
				code: result,
				map: null
			};
		}
	};
}
