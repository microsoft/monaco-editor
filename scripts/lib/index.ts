import { spawn } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';

export interface RunOptions {
	cwd: string;
}

export async function run(command: string, options: RunOptions) {
	console.log(`Running ${command} in ${options.cwd}`);
	const process = spawn(command, { shell: true, cwd: options.cwd, stdio: 'inherit' });
	return new Promise<void>((resolve, reject) => {
		process.on('exit', (code) => {
			if (code !== 0) {
				reject(new Error(`Command ${command} exited with code ${code}`));
			} else {
				resolve();
			}
		});
	});
}

export async function gitShallowClone(targetPath: string, repositoryUrl: string, ref: string) {
	await mkdir(targetPath, { recursive: true });
	const options: RunOptions = { cwd: targetPath };
	await run('git init', options);
	await run(`git remote add origin ${repositoryUrl}`, options);
	await run(`git fetch --depth 1 origin ${ref}`, options);
	await run(`git checkout ${ref}`, options);
}

export async function group(name: string, body: () => Promise<void>): Promise<void> {
	console.log(`##[group]${name}`);
	try {
		await body();
	} catch (e) {
		console.error(e);
		throw e;
	} finally {
		console.log('##[endgroup]');
	}
}

export async function writeJsonFile(filePath: string, jsonData: unknown): Promise<void> {
	await writeFile(filePath, JSON.stringify(jsonData, null, '\t') + '\n');
}

export function getNightlyVersion(version: string): string {
	const pieces = version.split('.');
	const minor = parseInt(pieces[1], 10);
	const date = new Date();
	const yyyy = date.getUTCFullYear();
	const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
	const dd = String(date.getUTCDate()).padStart(2, '0');
	return `0.${minor + 1}.0-dev.${yyyy}${mm}${dd}`;
}
