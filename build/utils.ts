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
export function runTsc(_projectPath: string) {
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

/**
 * Launch prettier on a specific file.
 */
export function prettier(_filePath: string) {
	const filePath = path.join(REPO_ROOT, _filePath);
	cp.spawnSync(
		process.execPath,
		[path.join(__dirname, '../node_modules/prettier/bin-prettier.js'), '--write', filePath],
		{ stdio: 'inherit' }
	);

	console.log(`Ran prettier over ${_filePath}`);
}

/**
 * Transform an external .d.ts file to an internal .d.ts file
 */
export function massageAndCopyDts(source: string, destination: string, namespace: string) {
	const absoluteSource = path.join(REPO_ROOT, source);
	const absoluteDestination = path.join(REPO_ROOT, destination);

	const lines = fs
		.readFileSync(absoluteSource)
		.toString()
		.split(/\r\n|\r|\n/);

	let result = [
		`/*---------------------------------------------------------------------------------------------`,
		` *  Copyright (c) Microsoft Corporation. All rights reserved.`,
		` *  Licensed under the MIT License. See License.txt in the project root for license information.`,
		` *--------------------------------------------------------------------------------------------*/`,
		``,
		`declare namespace ${namespace} {`
	];
	for (let line of lines) {
		if (/^import/.test(line)) {
			continue;
		}
		if (line === 'export {};') {
			continue;
		}
		line = line.replace(/    /g, '\t');
		line = line.replace(/declare /g, '');
		if (line.length > 0) {
			line = `\t${line}`;
			result.push(line);
		}
	}
	result.push(`}`);
	result.push(``);

	ensureDir(path.dirname(absoluteDestination));
	fs.writeFileSync(absoluteDestination, result.join('\n'));

	prettier(destination);
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
		drop: ['debugger'],
		define: {
			AMD: 'false'
		},
		banner: {
			js: bundledFileHeader
		},
		external: options.external,
		outbase: `src/${options.base}`,
		outdir: `out/languages/bundled/esm/vs/${options.base}/`,
		plugins: [
			alias({
				'vscode-nls': path.join(__dirname, 'fillers/vscode-nls.ts')
			})
		]
	});
}

function buildOneAMD(
	type: 'dev' | 'min',
	options: {
		base: string;
		entryPoint: string;
		amdModuleId: string;
		amdDependencies?: string[];
		external?: string[];
	}
) {
	if (!options.amdDependencies) {
		options.amdDependencies = [];
	}
	options.amdDependencies.unshift('require');

	const opts: esbuild.BuildOptions = {
		entryPoints: [options.entryPoint],
		bundle: true,
		target: 'esnext',
		format: 'iife',
		drop: ['debugger'],
		define: {
			AMD: 'true'
		},
		globalName: 'moduleExports',
		banner: {
			js: `${bundledFileHeader}define("${options.amdModuleId}", [${(options.amdDependencies || [])
				.map((dep) => `"${dep}"`)
				.join(',')}],(require)=>{`
		},
		footer: {
			js: 'return moduleExports;\n});'
		},
		outbase: `src/${options.base}`,
		outdir: `out/languages/bundled/amd-${type}/vs/${options.base}/`,
		plugins: [
			alias({
				'vscode-nls': path.join(__dirname, '../build/fillers/vscode-nls.ts'),
				'monaco-editor-core': path.join(__dirname, '../src/fillers/monaco-editor-core-amd.ts')
			})
		],
		external: ['vs/editor/editor.api', ...(options.external || [])]
	};
	if (type === 'min') {
		opts.minify = true;
	}
	build(opts);
}

export function buildAMD(options: {
	base: string;
	entryPoint: string;
	amdModuleId: string;
	amdDependencies?: string[];
	external?: string[];
}) {
	buildOneAMD('dev', options);
	buildOneAMD('min', options);
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

export interface IFile {
	path: string;
	contents: Buffer;
}

export function readFiles(
	pattern: string,
	options: { base: string; ignore?: string[]; dot?: boolean }
): IFile[] {
	let files = glob.sync(pattern, { cwd: REPO_ROOT, ignore: options.ignore, dot: options.dot });
	// remove dirs
	files = files.filter((file) => {
		const fullPath = path.join(REPO_ROOT, file);
		const stats = fs.statSync(fullPath);
		return stats.isFile();
	});

	const base = options.base;
	const baseLength = base === '' ? 0 : base.endsWith('/') ? base.length : base.length + 1;
	return files.map((file) => {
		const fullPath = path.join(REPO_ROOT, file);
		const contents = fs.readFileSync(fullPath);
		const relativePath = file.substring(baseLength);
		return {
			path: relativePath,
			contents
		};
	});
}

export function writeFiles(files: IFile[], dest: string) {
	for (const file of files) {
		const fullPath = path.join(REPO_ROOT, dest, file.path);
		ensureDir(path.dirname(fullPath));
		fs.writeFileSync(fullPath, file.contents);
	}
}
