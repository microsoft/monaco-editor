import { defineConfig } from 'vite';
import { join } from 'path';

export default defineConfig({
	server: {
		fs: {
			allow: ['../../', '../../../vscode']
		}
	},
	resolve: {
		alias: [{
			find: 'monaco-editor-core/esm/vs',
			replacement: join(__dirname, '../../../vscode/src/vs')
		}, {
			find: 'monaco-editor-core',
			replacement: join(__dirname, '../../../vscode/src/vs/editor/editor.main.ts')
		}],
	}
});
