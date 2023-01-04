import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { getNightlyVersion, group, run, writeJsonFile } from '../lib';

const selfPath = __dirname;
const rootPath = join(selfPath, '..', '..');
const monacoEditorPackageJsonPath = resolve(rootPath, 'package.json');

async function prepareMonacoEditorReleaseStableOrNightly() {
	const monacoEditorPackageJson = JSON.parse(
		await readFile(monacoEditorPackageJsonPath, { encoding: 'utf-8' })
	) as { version: string };

	let version: string;

	const arg = process.argv[2];
	if (arg === 'stable') {
		version = monacoEditorPackageJson.version;
	} else if (arg === 'nightly') {
		version = getNightlyVersion(monacoEditorPackageJson.version);
	} else {
		throw new Error('Invalid argument');
	}

	await prepareMonacoEditorRelease(version);

	// npm package is now in ./release, ready to be published
}

async function prepareMonacoEditorRelease(version: string) {
	await group('npm ci', async () => {
		await run('npm ci', { cwd: resolve(rootPath, 'webpack-plugin') });
	});

	await group('Set Version', async () => {
		const packageJson = JSON.parse(
			await readFile(monacoEditorPackageJsonPath, { encoding: 'utf-8' })
		) as { version: string; devDependencies: Record<string, string> };
		packageJson.version = version;
		packageJson.devDependencies['monaco-editor-core'] = version;

		await writeJsonFile(monacoEditorPackageJsonPath, packageJson);
	});

	await group('Building & Testing', async () => {
		await run(resolve(selfPath, './monaco-editor.sh'), { cwd: rootPath });
	});
}

prepareMonacoEditorReleaseStableOrNightly();
