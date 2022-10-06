<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

const editorRef = ref<HTMLElement>();

// @ts-ignore
self.MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === 'json') {
			return new jsonWorker();
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new cssWorker();
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new htmlWorker();
		}
		if (label === 'typescript' || label === 'javascript') {
			return new tsWorker();
		}
		return new editorWorker();
	}
};

onMounted(() => {
	monaco.editor.create(editorRef.value as HTMLElement, {
		value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
		language: 'typescript'
	});
	//monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
});
</script>

<template>
	<div ref="editorRef" class="editor" />
</template>

<style>
.editor {
	width: 100vw;
	height: 100vh;
}
</style>
