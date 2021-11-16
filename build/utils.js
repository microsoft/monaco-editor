/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const esbuild = require('esbuild');
/** @type {any} */
const alias = require('esbuild-plugin-alias');
const glob = require('glob');

const REPO_ROOT = path.join(__dirname, '../');
exports.REPO_ROOT = REPO_ROOT;

const existingDirCache = new Set();
/**
 * @param {string} dirname
 */
function ensureDir(dirname) {
	/** @type {string[]} */
	const dirs = [];

	while (dirname.length > REPO_ROOT.length) {
		dirs.push(dirname);
		dirname = path.dirname(dirname);
	}
	dirs.reverse();
	dirs.forEach((dir) => {
		if (!existingDirCache.has(dir)) {
			try {
				fs.mkdirSync(dir);
			} catch (err) {}
			existingDirCache.add(dir);
		}
	});
}
exports.ensureDir = ensureDir;

/**
 * Copy a file.
 *
 * @param {string} _source
 * @param {string} _destination
 */
function copyFile(_source, _destination) {
	const source = path.join(REPO_ROOT, _source);
	const destination = path.join(REPO_ROOT, _destination);

	ensureDir(path.dirname(destination));
	fs.writeFileSync(destination, fs.readFileSync(source));

	console.log(`Copied ${_source} to ${_destination}`);
}
exports.copyFile = copyFile;

/**
 * Remove a directory and all its contents.
 *
 * @param {string} _dirPath
 */
function removeDir(_dirPath) {
	const dirPath = path.join(REPO_ROOT, _dirPath);
	if (!fs.existsSync(dirPath)) {
		return;
	}
	rmDir(dirPath);
	console.log(`Deleted ${_dirPath}`);

	/**
	 * @param {string} dirPath
	 */
	function rmDir(dirPath) {
		const entries = fs.readdirSync(dirPath);
		for (const entry of entries) {
			const filePath = path.join(dirPath, entry);
			if (fs.statSync(filePath).isFile()) {
				fs.unlinkSync(filePath);
			} else {
				rmDir(filePath);
			}
		}
		fs.rmdirSync(dirPath);
	}
}
exports.removeDir = removeDir;

/**
 * Launch the typescript compiler synchronously over a project.
 *
 * @param {string} _projectPath
 */
function tsc(_projectPath) {
	const projectPath = path.join(REPO_ROOT, _projectPath);
	console.log(`Launching compiler at ${_projectPath}...`);
	cp.spawnSync(
		process.execPath,
		[path.join(__dirname, '../node_modules/typescript/lib/tsc.js'), '-p', projectPath],
		{ stdio: 'inherit' }
	);
	console.log(`Compiled ${_projectPath}`);
}
exports.tsc = tsc;

/**
 * Launch prettier on a specific file.
 *
 * @param {string} _filePath
 */
function prettier(_filePath) {
	const filePath = path.join(REPO_ROOT, _filePath);
	cp.spawnSync(
		process.execPath,
		[path.join(__dirname, '../node_modules/prettier/bin-prettier.js'), '--write', filePath],
		{ stdio: 'inherit' }
	);

	console.log(`Ran prettier over ${_filePath}`);
}
exports.prettier = prettier;

/**
 * Transform an external .d.ts file to an internal .d.ts file
 *
 * @param {string} _source
 * @param {string} _destination
 * @param {string} namespace
 */
function dts(_source, _destination, namespace) {
	const source = path.join(REPO_ROOT, _source);
	const destination = path.join(REPO_ROOT, _destination);

	const lines = fs
		.readFileSync(source)
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

	ensureDir(path.dirname(destination));
	fs.writeFileSync(destination, result.join('\n'));

	prettier(_destination);
}
exports.dts = dts;

/**
 * @param {import('esbuild').BuildOptions} options
 */
function build(options) {
	esbuild.build(options).then((result) => {
		if (result.errors.length > 0) {
			console.error(result.errors);
		}
		if (result.warnings.length > 0) {
			console.error(result.warnings);
		}
	});
}
exports.build = build;

/**
 * @param {{
 *   base: string;
 *   entryPoints: string[];
 *   external: string[];
 * }} options
 */
function buildESM(options) {
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
		outdir: `out/release/${options.base}/esm/`,
		plugins: [
			alias({
				'vscode-nls': path.join(__dirname, 'fillers/vscode-nls.ts')
			})
		]
	});
}
exports.buildESM = buildESM;

/**
 * @param {'dev'|'min'} type
 * @param {{
 *   base: string;
 *   entryPoint: string;
 *   amdModuleId: string;
 *   amdDependencies?: string[];
 * }} options
 */
function buildOneAMD(type, options) {
	/** @type {import('esbuild').BuildOptions} */
	const opts = {
		entryPoints: [options.entryPoint],
		bundle: true,
		target: 'esnext',
		format: 'iife',
		define: {
			AMD: 'true'
		},
		globalName: 'moduleExports',
		banner: {
			js: `${bundledFileHeader}define("${options.amdModuleId}",[${(options.amdDependencies || [])
				.map((dep) => `"${dep}"`)
				.join(',')}],()=>{`
		},
		footer: {
			js: 'return moduleExports;\n});'
		},
		outbase: `src/${options.base}`,
		outdir: `out/release/${options.base}/${type}/`,
		plugins: [
			alias({
				'vscode-nls': path.join(__dirname, '../build/fillers/vscode-nls.ts'),
				'monaco-editor-core': path.join(__dirname, '../build/fillers/monaco-editor-core-amd.ts')
			})
		]
	};
	if (type === 'min') {
		opts.minify = true;
	}
	build(opts);
}

/**
 * @param {{
 *   base: string;
 *   entryPoint: string;
 *   amdModuleId: string;
 *   amdDependencies?: string[];
 * }} options
 */
function buildAMD(options) {
	buildOneAMD('dev', options);
	buildOneAMD('min', options);
}
exports.buildAMD = buildAMD;

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

const bundledFileHeader = (() => {
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
exports.bundledFileHeader = bundledFileHeader;

/** @typedef {{ path:string; contents:Buffer;}} IFile */

/**
 * @param {string} pattern
 * @param {{ base:string; ignore?:string[]; dot?:boolean; }} options
 * @returns {IFile[]}
 */
function readFiles(pattern, options) {
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
exports.readFiles = readFiles;

/**
 * @param {IFile[]} files
 * @param {string} dest
 */
function writeFiles(files, dest) {
	for (const file of files) {
		const fullPath = path.join(REPO_ROOT, dest, file.path);
		ensureDir(path.dirname(fullPath));
		fs.writeFileSync(fullPath, file.contents);
	}
}
exports.writeFiles = writeFiles;
