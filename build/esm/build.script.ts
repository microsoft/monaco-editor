import { run } from '../../scripts/lib/index';

export async function buildESM() {
	const rootPath = import.meta.dirname;
	await run('bunx rollup -c rollup.config.mjs', { cwd: rootPath });
	await run('bunx rollup -c rollup-types.config.mjs', { cwd: rootPath });
}
