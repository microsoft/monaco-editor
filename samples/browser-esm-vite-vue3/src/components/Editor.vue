<script setup>
import { ref, onMounted, onUnmounted, toRaw } from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const editorRef = ref(null);
const editorInstance = ref(null);

onMounted(() => {
	if (editorRef.value && !editorInstance.value) {
		editorInstance.value = monaco.editor.create(editorRef.value, {
			value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
			language: 'javascript'
		});
	}
});

onUnmounted(() => toRaw(editorInstance.value)?.dispose());
</script>

<template>
	<div class="editor" ref="editorRef" />
</template>

<style scoped>
.editor {
	width: 100vw;
	height: 100vh;
}
</style>
