<template>
	<select v-model="selected">
		<option v-bind:value="schema" v-for="schema in this.compiledSchemas">
			{{ schema.name }}
		</option>
	</select>

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
		:title="message.title"
		:message="message.message"
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

import schemas from '../static/schemas.json'
import molang from '../static/molang.json'
import ErrorPrettifier from '../ErrorPrettifier'

async function fetchJson(data) {
	return new Promise((resolve, reject) => {
		fetch(data['url'])
			.then((res) => res.json())
			.then((out) => {
				data['data'] = out
				resolve(data)
			})
			.catch((err) => {
				reject(out)
			})
	})
}

// Import json schemas, and store in-memory

var validate
async function loadAllSchemas(ajv) {
	const proms = []

	// Queue up schemas for download
	for (const schema of schemas) {
		proms.push(fetchJson(schema))
	}

	// Wait for all schemas to be downloaded before going forward
	await Promise.all(proms).then((values) => {
		// Add all schemas
		values.forEach((element) => {
			ajv.addSchema(element['data'], element['id'])
		})

		ajv.addFormat('molang', molang)

		for (const schema of schemas) {
			if (schema['compile'] == true) {
				schema['validator'] = ajv.getSchema(schema['id'])
			}
		}
	})
}

//Advanced Schema Validator
const ajv = new Ajv({
	strict: false,
	allErrors: true,
	verbose: true,
	validateFormats: false,
})

loadAllSchemas(ajv)

export default defineComponent({
	components: {
		PrismEditor,
		Message,
	},
	computed: {
		compiledSchemas() {
			return this.schemas.filter((element) => element['compile'])
		},
	},
	data() {
		return {
			selected: {},
			schemas: schemas,
			messages: [],
		}
	},
	methods: {
		clearMessages() {
			this.messages = []
		},
		addMessage(title, message) {
			this.messages.push({ message: message, title: title })
		},
		getValidator() {
			return this.selected['validator']
		},
		format() {
			this.clearMessages()

			try {
				this.editorCode = JSON.stringify(
					JSON.parse(this.editorCode),
					null,
					3
				)
			} catch (err) {
				this.addMessage('Your JSON is not valid:', err.message)
				return
			}

			const testData = JSON.parse(this.editorCode)

			const validate = this.getValidator()
			const valid = validate(testData)
			console.log(validate.errors)
			console.log(ajv.errors)
			console.log(ajv)
			console.log(ajv.errorsText())
			ErrorPrettifier.prettify(this.editorCode, validate.errors[0]);

			if (!valid) {
				try {
					validate.errors.forEach((element) => {
						this.addMessage(
							'Your JSON did not match the schema:',
							element
						)
					})
				} catch (error) {
					this.addMessage(
						'Your JSON could not be understood',
						'Did you select wrong schema type?'
					)
				}
			} else {
				this.addMessage('Your JSON is correct!', 'Congrats!')
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
