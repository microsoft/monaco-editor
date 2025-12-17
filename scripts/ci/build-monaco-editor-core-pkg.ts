import { rm } from 'fs/promises';
import { join } from 'path';
import { PackageJson, group, gitShallowClone, run, writeJsonFile, getNightlyVersion } from '../lib';
import { getNightlyEnv } from './env';

const selfPath = __dirname;
const rootPath = join(selfPath, '..', '..');
const dependenciesPath = join(rootPath, 'dependencies');
const vscodePath = join(dependenciesPath, 'vscode');
const monacoEditorPackageJsonPath = join(rootPath, 'package.json');

async function prepareMonacoEditorCoreReleaseStableOrNightly() {
	const monacoEditorPackageJson = require(monacoEditorPackageJsonPath) as {
		version: string;
		vscodeRef: string;
	};
	let version: string;
	let ref: string;

	const arg = process.argv[2];
	if (arg === 'stable') {
		version = monacoEditorPackageJson.version;
		ref = monacoEditorPackageJson.vscodeRef;
	} else if (arg === 'nightly') {
		version = getNightlyVersion(
			monacoEditorPackageJson.version,
			getNightlyEnv().PRERELEASE_VERSION
		);
		ref = getNightlyEnv().VSCODE_REF;
	} else {
		throw new Error('Invalid argument');
	}

	await prepareMonacoEditorCoreRelease(version, ref);

	// npm package is now in dependencies/vscode/out-monaco-editor-core, ready to be published
}

async function prepareMonacoEditorCoreRelease(version: string, vscodeRef: string) {
	await rm(dependenciesPath, { force: true, recursive: true });

	let vscodeCommitId: string;

	await group('Checkout vscode', async () => {
		const result = await gitShallowClone(
			vscodePath,
			'https://github.com/microsoft/vscode.git',
			vscodeRef
		);
		vscodeCommitId = result.commitId;
	});

	await group('Checkout vscode-loc', async () => {
		await gitShallowClone(
			// Must be a sibling to the vscode repository
			'dependencies/vscode-loc',
			'https://github.com/microsoft/vscode-loc.git',
			'main'
		);
	});

	await group('Set Version', async () => {
		const monacoEditorCorePackageJsonSourcePath = join(vscodePath, './build/monaco/package.json');
		const packageJson = require(monacoEditorCorePackageJsonSourcePath) as PackageJson;
		packageJson.version = version;
		// This ensures we can always figure out which commit monaco-editor-core was built from
		packageJson.vscodeCommitId = vscodeCommitId;
		await writeJsonFile(monacoEditorCorePackageJsonSourcePath, packageJson);
	});

	await group('Building & Testing', async () => {
		// Install dependencies
		await buildAndTest();
	});
}

async function buildAndTest() {
	await run('npm install', { cwd: vscodePath });
	await run('npm run playwright-install', { cwd: vscodePath });

	// Run checks and compilation
	await run('npm run gulp hygiene', { cwd: vscodePath });
	await run('npm run valid-layers-check', { cwd: vscodePath });
	await run('npm run eslint', { cwd: vscodePath });
	await run('npm run monaco-compile-check', { cwd: vscodePath });
	await run('npm run --max_old_space_size=4095 compile', { cwd: vscodePath });

	// Build editor distribution
	await run('npm run gulp editor-distro', { cwd: vscodePath });

	// Run browser tests
	await run('npm run test-browser -- --browser chromium', { cwd: vscodePath });

	// TypeScript typings test
	await run('mkdir typings-test', { cwd: vscodePath });
	const typingsTestDir = join(vscodePath, 'typings-test');
	await run('npm init -yp', { cwd: typingsTestDir });
	await run('../node_modules/.bin/tsc --init', { cwd: typingsTestDir });
	await run('echo "import \'../out-monaco-editor-core\';" > a.ts', { cwd: typingsTestDir });
	await run('../node_modules/.bin/tsc --noEmit', { cwd: typingsTestDir });

	// Monaco tests
	const testMonacoDir = join(vscodePath, 'test/monaco');
	await run('npm run esm-check', { cwd: testMonacoDir });
	await run('npm run bundle-webpack', { cwd: testMonacoDir });
	await run('npm run compile', { cwd: testMonacoDir });
	await run('npm test', { cwd: testMonacoDir });
}

prepareMonacoEditorCoreReleaseStableOrNightly();
