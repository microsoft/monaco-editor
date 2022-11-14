import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { group, run, writeJsonFile } from '../lib';

const selfPath = __dirname;
const rootPath = join(selfPath, '..', '..');
const monacoEditorPackageJsonPath = resolve(rootPath, 'package.json');

async function prepareMonacoEditorReleaseStable() {
	const monacoEditorPackageJson = JSON.parse(
		await readFile(monacoEditorPackageJsonPath, { encoding: 'utf-8' })
	) as { version: string };
	await prepareMonacoEditorRelease(monacoEditorPackageJson.version);

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
		// TODO packageJson.devDependencies['monaco-editor-core'] = version;

		await writeJsonFile(monacoEditorPackageJsonPath, packageJson);
	});

	await group('Building & Testing', async () => {
		await run(resolve(selfPath, './monaco-editor.sh'), { cwd: rootPath });
	});
}

prepareMonacoEditorReleaseStable();
