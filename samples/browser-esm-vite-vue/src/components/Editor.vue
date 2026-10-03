<template>
	<div class="editor" ref="editorContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const editorContainer = ref<HTMLDivElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

onMounted(() => {
	if (editorContainer.value) {
		editor = monaco.editor.create(editorContainer.value, {
			value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
			language: 'typescript'
		});
	}
});

onUnmounted(() => {
	editor?.dispose();
});
</script>

<style scoped>
.editor {
	width: 100vw;
	height: 100vh;
}
</style>