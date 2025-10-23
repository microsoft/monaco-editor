import { run } from '../../scripts/lib/index';

export async function buildESM() {
	const rootPath = __dirname;
	await run('npx rollup -c rollup.config.mjs', { cwd: rootPath });
	await run('npx rollup -c rollup-types.config.mjs', { cwd: rootPath });
}
