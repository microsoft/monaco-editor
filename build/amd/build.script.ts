declare const __dirname: string;
import { run } from '../../scripts/lib/index';

export async function buildAmdMinDev() {
	const rootPath = __dirname;
	await run('bunx vite build --mode development', { cwd: rootPath });
	await run('bunx vite build', { cwd: rootPath });
	await run('bunx rollup -c rollup-types.config.mjs', { cwd: rootPath });
}
