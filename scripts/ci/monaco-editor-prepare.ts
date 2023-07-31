import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { PackageJson, getNightlyVersion, group, run, writeJsonFile, gitCommitId } from '../lib';
import { getNightlyEnv } from './env';

const selfPath = __dirname;
const rootPath = join(selfPath, '..', '..');
const monacoEditorPackageJsonPath = resolve(rootPath, 'package.json');
const monacoEditorCorePackageJsonPath = resolve(
	rootPath,
	'node_modules',
	'monaco-editor-core',
	'package.json'
);

async function prepareMonacoEditorReleaseStableOrNightly() {
	const monacoEditorPackageJson = JSON.parse(
		await readFile(monacoEditorPackageJsonPath, { encoding: 'utf-8' })
	) as PackageJson;

	let version: string;

	const arg = process.argv[2];
	if (arg === 'stable') {
		version = monacoEditorPackageJson.version;
	} else if (arg === 'nightly') {
		version = getNightlyVersion(
			monacoEditorPackageJson.version,
			getNightlyEnv().PRERELEASE_VERSION
		);
	} else {
		throw new Error('Invalid argument');
	}

	await prepareMonacoEditorRelease(version);

	// npm package is now in ./out/monaco-editor, ready to be published
}

async function prepareMonacoEditorRelease(monacoEditorCoreVersion: string) {
	await group('npm ci', async () => {
		await run('npm ci', { cwd: resolve(rootPath, 'webpack-plugin') });
	});

	await group('Set Version & Update monaco-editor-core Version', async () => {
		const packageJson = JSON.parse(
			await readFile(monacoEditorPackageJsonPath, { encoding: 'utf-8' })
		) as PackageJson;
		packageJson.version = monacoEditorCoreVersion;
		packageJson.devDependencies['monaco-editor-core'] = monacoEditorCoreVersion;
		await writeJsonFile(monacoEditorPackageJsonPath, packageJson);
	});

	await group('npm install to pick up monaco-editor-core', async () => {
		await run('npm install', { cwd: rootPath });
	});

	await group('Setting vscode commitId from monaco-editor-core', async () => {
		const monacoEditorCorePackageJson = JSON.parse(
			await readFile(monacoEditorCorePackageJsonPath, { encoding: 'utf-8' })
		) as PackageJson;
		const packageJson = JSON.parse(
			await readFile(monacoEditorPackageJsonPath, { encoding: 'utf-8' })
		) as PackageJson;
		packageJson.vscodeCommitId = monacoEditorCorePackageJson.vscodeCommitId;
		packageJson.monacoCommitId = await gitCommitId(rootPath);
		await writeJsonFile(monacoEditorPackageJsonPath, packageJson);
	});

	await group('Building & Testing', async () => {
		await run(resolve(selfPath, './monaco-editor.sh'), { cwd: rootPath });
	});
}

prepareMonacoEditorReleaseStableOrNightly();
