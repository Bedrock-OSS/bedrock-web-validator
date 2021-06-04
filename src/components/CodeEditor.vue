<template>
	<button
		@click="format"
		class="
			bg-blue-500
			hover:bg-blue-700
			text-white
			font-bold
			py-2
			px-4
			rounded
		"
	>
		Format
	</button>
	<Message
		v-for="message in this.messages"
		:title="BOB"
		:message="message"
	></Message>
	<div>
		<prism-editor
			class="my-editor height-200 mb-4"
			v-model="editorCode"
			:highlight="highlighter"
			line-numbers
		></prism-editor>
	</div>
</template>

<script>
// import Prism Editor
import { PrismEditor } from 'vue-prism-editor'
import Message from './Message.vue'

import 'vue-prism-editor/dist/prismeditor.min.css' // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css' // import syntax highlighting styles
import 'prismjs/components/prism-json'
import Ajv from 'ajv'
import { defineComponent, onMounted, ref } from 'vue'

let language_names_url =
	'https://raw.githubusercontent.com/Blockception/Minecraft-bedrock-json-schemas/main/language/language_names.json'

let languages_url =
	'https://raw.githubusercontent.com/Blockception/Minecraft-bedrock-json-schemas/main/language/languages.json'

async function fetchJson(url) {
	return new Promise((resolve, reject) => {
		fetch(url)
			.then((res) => res.json())
			.then((out) => {
				resolve(out)
			})
			.catch((err) => {
				reject(out)
			})
	})
}
async function loadAllSchemas(ajv) {
	const proms = []
	await proms.push(fetchJson(language_names_url))
	await proms.push(fetchJson(languages_url))

	const [language_names, languages] = await Promise.all(proms)
	ajv.addSchema(language_names)
	console.log('SCHEMAS LOADED!')
	return ajv.compile(languages)
}

//Advanced Schema Validator
const ajv = new Ajv()
var validate
loadAllSchemas(ajv).then((value) => (validate = value))

export default defineComponent({
	components: {
		PrismEditor,
		Message,
	},
	data() {
		return {
			messages: ['nothing to show'],
		}
	},
	methods: {
		format() {
			this.messages = []
			try {
				this.editorCode = JSON.stringify(
					JSON.parse(this.editorCode),
					null,
					3
				)
			} catch (err) {
				this.messages.push(err.message)
				return
			}

			const testData = JSON.parse(this.editorCode)

			const valid = validate(testData)

			console.log('Attempting to validate: ')
			console.log(testData)

			if (!valid) {
				validate.errors.forEach((element) => {
					this.messages.push(element)
				})
			} else {
				this.messages.push('Looks Ok to Me!')
			}
		},
	},
	setup(props, context) {
		const editorCode = ref('hey')

		const highlighter = (code) => {
			return prism.highlight(code, prism.languages.json)
		}
		return { editorCode, highlighter }
	},
})
</script>

<style>
.my-editor {
	/* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
	background: #2d2d2d;
	color: #ccc;

	/* you must provide font-family font-size line-height. Example: */
	font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
	font-size: 14px;
	line-height: 1.5;
	padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
	outline: none;
}

.height-200 {
	height: 800px;
}

.mb-4 {
	margin-bottom: 1rem;
}
</style>
