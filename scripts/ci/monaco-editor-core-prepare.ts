import { mkdir, rm } from 'fs/promises';
import { join, resolve } from 'path';
import { PackageJson, group, gitShallowClone, run, writeJsonFile, getNightlyVersion } from '../lib';
import { getNightlyEnv } from './env';

const selfPath = __dirname;
const rootPath = join(selfPath, '..', '..');
const dependenciesPath = join(rootPath, 'dependencies');
const vscodePath = resolve(dependenciesPath, 'vscode');
const monacoEditorPackageJsonPath = resolve(rootPath, 'package.json');

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
	await mkdir(vscodePath, { recursive: true });

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
		const monacoEditorCorePackageJsonSourcePath = resolve(
			vscodePath,
			'./build/monaco/package.json'
		);
		const packageJson = require(monacoEditorCorePackageJsonSourcePath) as PackageJson;
		packageJson.version = version;
		// This ensures we can always figure out which commit monaco-editor-core was built from
		packageJson.vscodeCommitId = vscodeCommitId;
		await writeJsonFile(monacoEditorCorePackageJsonSourcePath, packageJson);
	});

	await group('Building & Testing', async () => {
		await run(resolve(selfPath, './monaco-editor-core.sh'), { cwd: vscodePath });
	});
}

prepareMonacoEditorCoreReleaseStableOrNightly();
