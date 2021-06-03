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
import { PrismEditor } from 'vue-prism-editor' //
import 'vue-prism-editor/dist/prismeditor.min.css' // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css' // import syntax highlighting styles
import 'prismjs/components/prism-json'
import Ajv from 'ajv'
import { defineComponent, onMounted, ref } from 'vue'

// Schemas
import skinpacks from '/public/schemas/skinpacks/skin.json'

// https://raw.githubusercontent.com/Blockception/Minecraft-bedrock-json-schemas/main/skinpacks/skins.json
export default defineComponent({
	components: {
		PrismEditor,
	},
	methods: {
		format() {
			try {
				this.editorCode = JSON.stringify(
					JSON.parse(this.editorCode),
					null,
					3
				)
			} catch (err) {
				console.log(err.message)
			}
		},
	},
	setup(props, context) {
		const editorCode = ref('hey')
		const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

		const schema = {
			$id: 'http://example.com/schemas/schema.json',
			type: 'object',
			properties: {
				foo: { $ref: 'defs.json#/definitions/int' },
				bar: { $ref: 'defs.json#/definitions/str' },
			},
		}

		const defsSchema = {
			$id: 'http://example.com/schemas/defs.json',
			definitions: {
				int: { type: 'integer' },
				str: { type: 'string' },
			},
		}

		// Add definitions
		ajv.addSchema(defsSchema)

		// Compile
		const validate = ajv.compile(schema)

		const data = {
			foo: 1,
			cap: 1,
			bar: 1,
		}
		console.log(skinpacks)

		const valid = validate(data)

		if (!valid) {
			console.log(validate.errors)
		} else {
			console.log('BOB')
		}

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
