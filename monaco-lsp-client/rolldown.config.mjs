// @ts-check

import { join } from 'path';
import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';
import del from 'rollup-plugin-delete';
import alias from '@rollup/plugin-alias';

export default defineConfig({
	input: {
		index: join(import.meta.dirname, './src/index.ts')
	},
	output: {
		dir: join(import.meta.dirname, './out'),
		format: 'es'
	},
	external: ['monaco-editor-core'],
	plugins: [
		del({ targets: 'out/*' }),
		alias({
			entries: {
				ws: 'undefined'
			}
		}),
		dts({
			tsconfig: false,
			compilerOptions: {
				stripInternal: true
			},
			resolve: true
		})
	]
});
