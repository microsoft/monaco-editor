<script setup>
import { onMounted, defineEmits, ref } from 'vue';

const MONACO_VS_PATH = 'https://unpkg.com/monaco-editor@0.32.1/min/vs';

let instance;
const container = ref();
const emit = defineEmits(['value']);

onMounted(() => {
	window.require.config({ paths: { vs: MONACO_VS_PATH } });

	const code = ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n');

	const model = monaco.editor.createModel(
		code,
		'javascript',
		monaco.Uri.parse('json://grid/settings.json')
	);

	instance = monaco.editor.create(container.value, {
		model,
		tabSize: 2,
		automaticLayout: true,
		scrollBeyondLastLine: false,
		minimap: {
			enabled: false
		},
		scrollbar: {
			vertical: 'visible',
			horizontal: 'visible'
		}
	});

	instance.onDidChangeModelContent(() => {
		const value = instance.getValue();
		emit('value', value);
	});
});
</script>

<template>
	<div class="editor-wrapper">
		<div class="editor" ref="container"></div>
	</div>
</template>

<style>
.editor-wrapper {
	border: 1px solid #ececec;
}
.editor {
	height: 550px;
}
</style>
