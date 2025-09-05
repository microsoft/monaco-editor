/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

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

			// Look for `new URL("...?worker", import.meta.url)` patterns.
			const regex = /new\s+URL\s*\(\s*(['"`])(.*?)\?worker\1\s*,\s*import\.meta\.url\s*\)?/g;

			let match;
			let modified = false;
			let result = code;
			let offset = 0;
			/** @type {string[]} */
			const additionalImports = [];

			while ((match = regex.exec(code)) !== null) {
				let path = match[2];

				if (!path.startsWith('.') && !path.startsWith('/')) {
					path = `./${path}`;
				}

				const start = match.index;
				const end = start + match[0].length;

				const varName = `__worker_url_${idx++}__`;
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
