/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';
import * as esbuild from 'esbuild';
import alias from 'esbuild-plugin-alias';
import * as glob from 'glob';
import { ensureDir } from './fs';

export const REPO_ROOT = path.join(__dirname, '../');

/**
 * Launch the typescript compiler synchronously over a project.
 */
export function tsc(_projectPath: string) {
	const projectPath = path.join(REPO_ROOT, _projectPath);
	console.log(`Launching compiler at ${_projectPath}...`);
	const res = cp.spawnSync(
		process.execPath,
		[path.join(__dirname, '../node_modules/typescript/lib/tsc.js'), '-p', projectPath],
		{ stdio: 'inherit' }
	);
	console.log(`Compiled ${_projectPath}`);
	if (res.status !== 0) {
		process.exit(res.status);
	}
}


export function build(options: import('esbuild').BuildOptions) {
	esbuild.build(options).then((result) => {
		if (result.errors.length > 0) {
			console.error(result.errors);
		}
		if (result.warnings.length > 0) {
			console.error(result.warnings);
		}
	});
}

export function buildESM(options: { base: string; entryPoints: string[]; external: string[] }) {
	build({
		entryPoints: options.entryPoints,
		bundle: true,
		target: 'esnext',
		format: 'esm',
		define: {
			AMD: 'false'
		},
		banner: {
			js: bundledFileHeader
		},
		external: options.external,
		outbase: `src/${options.base}`,
		outdir: `out/esm/vs/${options.base}/`,
		plugins: [
			alias({
				'vscode-nls': path.join(__dirname, 'fillers/vscode-nls.ts')
			})
		]
	});
}

function getGitVersion() {
	const git = path.join(REPO_ROOT, '.git');
	const headPath = path.join(git, 'HEAD');
	let head;

	try {
		head = fs.readFileSync(headPath, 'utf8').trim();
	} catch (e) {
		return void 0;
	}

	if (/^[0-9a-f]{40}$/i.test(head)) {
		return head;
	}

	const refMatch = /^ref: (.*)$/.exec(head);

	if (!refMatch) {
		return void 0;
	}

	const ref = refMatch[1];
	const refPath = path.join(git, ref);

	try {
		return fs.readFileSync(refPath, 'utf8').trim();
	} catch (e) {
		// noop
	}

	const packedRefsPath = path.join(git, 'packed-refs');
	let refsRaw;

	try {
		refsRaw = fs.readFileSync(packedRefsPath, 'utf8').trim();
	} catch (e) {
		return void 0;
	}

	const refsRegex = /^([0-9a-f]{40})\s+(.+)$/gm;
	let refsMatch;
	const refs = {};

	while ((refsMatch = refsRegex.exec(refsRaw))) {
		refs[refsMatch[2]] = refsMatch[1];
	}

	return refs[ref];
}

export const bundledFileHeader = (() => {
	const sha1 = getGitVersion();
	const semver = require('../package.json').version;
	const headerVersion = semver + '(' + sha1 + ')';

	const BUNDLED_FILE_HEADER = [
		'/*!-----------------------------------------------------------------------------',
		' * Copyright (c) Microsoft Corporation. All rights reserved.',
		' * Version: ' + headerVersion,
		' * Released under the MIT license',
		' * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt',
		' *-----------------------------------------------------------------------------*/',
		''
	].join('\n');

	return BUNDLED_FILE_HEADER;
})();
