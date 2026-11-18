import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { join } from 'path';
import {
	PackageJson,
	group,
	gitShallowClone,
	run,
	runGetOutput,
	writeJsonFile,
	getNightlyVersion
} from '../lib';
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

/**
 * Returns the pnpm version that VS Code pins in the `packageManager` field of its package.json,
 * or `undefined` for VS Code commits from before its migration from npm to pnpm.
 */
function getPinnedPnpmVersion(): string | undefined {
	const packageJson = require(join(vscodePath, 'package.json')) as { packageManager?: string };
	return /^pnpm@(\d+\.\d+\.\d+)/.exec(packageJson.packageManager ?? '')?.[1];
}

/**
 * Installs VS Code's JavaScript dependencies without running install scripts.
 * The editor build doesn't need VS Code's native modules, and compiling them for Electron
 * downloads Electron's headers, which the build agents' network isolation blocks.
 * Of the install steps VS Code runs in its postinstall script, this keeps the Electron typings
 * and the installs of its separate dependency roots (such as `build`).
 */
async function installWithoutNativeModules(pnpmVersion: string) {
	await run(`npm install -g pnpm@${pnpmVersion}`, { cwd: vscodePath });
	await run('pnpm install --frozen-lockfile --ignore-scripts', { cwd: vscodePath });
	await run('node build/npm/electronTypes.ts', { cwd: vscodePath });
	const separateRoots = JSON.parse(
		await runGetOutput(
			`node --input-type=module -e "import { separateRoots } from './build/npm/dirs.ts'; console.log(JSON.stringify(separateRoots));"`,
			{ cwd: vscodePath }
		)
	) as string[];
	for (const dir of separateRoots) {
		await run('pnpm install --frozen-lockfile --ignore-scripts', { cwd: join(vscodePath, dir) });
	}
}

async function buildAndTest() {
	const pnpmVersion = getPinnedPnpmVersion();
	// npm passes arguments after `--` to a script, pnpm passes them on as they are.
	const pm = pnpmVersion ? 'pnpm' : 'npm';
	const argsSeparator = pnpmVersion ? '' : '-- ';
	if (pnpmVersion) {
		await installWithoutNativeModules(pnpmVersion);
	} else {
		await run('node build/npm/preinstall.ts', {
			cwd: vscodePath,
			env: { ...process.env, npm_execpath: undefined, npm_command: 'ci' }
		});
		const foundryLocalInstaller = 'build/azure-pipelines/common/foundryLocalInstall.ts';
		const hasFoundryLocalInstaller = existsSync(join(vscodePath, foundryLocalInstaller));
		if (hasFoundryLocalInstaller) {
			await run('node build/azure-pipelines/common/disableFoundryLocalInstall.ts', {
				cwd: vscodePath
			});
		}
		await run('npm install', { cwd: vscodePath });
		if (hasFoundryLocalInstaller) {
			await run(`node ${foundryLocalInstaller}`, { cwd: vscodePath });
		}
	}
	await run(`${pm} run playwright-install`, { cwd: vscodePath });

	// Run checks and compilation
	await run(`${pm} run gulp hygiene`, { cwd: vscodePath });
	await run(`${pm} run valid-layers-check`, { cwd: vscodePath });
	await run(`${pm} run eslint`, { cwd: vscodePath });
	await run(`${pm} run monaco-compile-check`, { cwd: vscodePath });
	// Only compile the client (gulp `compile` task); skip the `compile-copilot`
	// step that `npm run compile` also triggers. The Copilot extension is not part
	// of monaco-editor-core, and its build requires VS Code release-pipeline env
	// vars (VSCODE_QUALITY, etc.) that aren't set here.
	await run(`${pm} run gulp compile`, { cwd: vscodePath });

	// Build editor distribution
	await run(`${pm} run gulp editor-distro`, { cwd: vscodePath });

	// Run browser tests
	await run(`${pm} run test-browser ${argsSeparator}--browser chromium`, { cwd: vscodePath });

	// TypeScript typings test
	await run('mkdir typings-test', { cwd: vscodePath });
	const typingsTestDir = join(vscodePath, 'typings-test');
	// Newer VS Code commits also install TypeScript 7 (`tsc`) and run this check with TypeScript 6 (`tsc6`).
	const tsc = existsSync(join(vscodePath, 'node_modules/.bin/tsc6')) ? 'tsc6' : 'tsc';
	// npm writes a CommonJS package.json here; `pnpm init` would default to ES modules.
	await run('npm init -yp', { cwd: typingsTestDir });
	await run(`../node_modules/.bin/${tsc} --init`, { cwd: typingsTestDir });
	await run('echo "import \'../out-monaco-editor-core\';" > a.ts', { cwd: typingsTestDir });
	await run(`../node_modules/.bin/${tsc} --noEmit`, { cwd: typingsTestDir });

	// Monaco tests
	const testMonacoDir = join(vscodePath, 'test/monaco');
	await run(`${pm} run esm-check`, { cwd: testMonacoDir });
	await run(`${pm} run bundle-webpack`, { cwd: testMonacoDir });
	await run(`${pm} run compile`, { cwd: testMonacoDir });
	await run(`${pm} test`, { cwd: testMonacoDir });
}

prepareMonacoEditorCoreReleaseStableOrNightly();
