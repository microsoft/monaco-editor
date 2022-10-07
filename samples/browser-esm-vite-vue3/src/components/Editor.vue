<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as monaco from 'monaco-editor';

const editorRef = ref<HTMLElement>();
const editorInstance = ref<monaco.editor.IStandaloneCodeEditor | null>(null);

onMounted(() => {
	if (editorRef.value && !editorInstance.value) {
		editorInstance.value = monaco.editor.create(editorRef.value, {
			value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
			language: 'typescript'
		});
	}
});

onUnmounted(() => {
	editorInstance.value?.dispose();
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
