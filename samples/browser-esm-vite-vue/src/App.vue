<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const editorItemRef = ref(null);
let editorInstance: monaco.editor.IStandaloneCodeEditor;

onMounted(() => {
  if (editorItemRef.value && !editorInstance) {
    monaco.editor.create(editorItemRef.value, {
					value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
					language: 'typescript'
    });
  }
});

onUnmounted(() => {
  editorInstance?.dispose();
});
</script>

<template>
  <div class="editor" ref="editorItemRef"></div>
</template>

<style lang="css" scoped>
.editor {
	width: 100vw;
	height: 100vh;
}
</style>
