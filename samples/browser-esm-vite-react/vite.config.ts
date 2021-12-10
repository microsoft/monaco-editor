import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import monacoEditorPlugin from 'vite-plugin-monaco-editor';

const prefix = `monaco-editor/esm/vs`;

// https://vitejs.dev/config/
export default defineConfig({
	// optimizeDeps: {
	// 	include: ['monaco-graphql']
	// },
	// build: {
	// 	rollupOptions: {
	// 		output: {
	// 			manualChunks: {
	// 				jsonWorker: [`${prefix}/language/json/json.worker`],
	// 				cssWorker: [`${prefix}/language/css/css.worker`],
	// 				htmlWorker: [`${prefix}/language/html/html.worker`],
	// 				tsWorker: [`${prefix}/language/typescript/ts.worker`],
	// 				gqlWorker: ['monaco-graphql/esm/graphql.worker'],
	// 				editorWorker: [`${prefix}/editor/editor.worker`]
	// 			}
	// 		}
	// 	}
	// },
	plugins: [
		react()
		// monacoEditorPlugin({
		// 	customWorkers: [{ label: 'graphql', entry: 'monaco-graphql/esm/graphql.worker' }]
		// })
	]
});
