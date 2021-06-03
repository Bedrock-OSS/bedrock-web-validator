<template>
	<div class="app">
		<CodeEditor></CodeEditor>
	</div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import CodeEditor from './components/CodeEditor.vue'

export default defineComponent({
	name: 'App',
	data() {
		return {
			code: 'TEST',
			messages: 'Messages',
		}
	},
	components: {
		CodeEditor,
	},
})
</script>
<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.app {
	margin: 15px;
}
</style>
