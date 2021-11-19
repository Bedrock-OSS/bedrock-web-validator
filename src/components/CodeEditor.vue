<template>
	<select v-model="selected_schema">
		<option v-bind:value="schema" v-for="schema in this.schemaOptions">
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
		:type="message.type"
	></Message>
	<div class="rel">
		<prism-editor
			class="my-editor mb-4 rel"
			v-model="editorCode"
			:highlight="highlighter"
			line-numbers
		></prism-editor>
		<pre
			class="mb-4 abs .my-editor error-overlay"
			id="error"
			v-html="overlayCode"
		></pre>
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
import { defineComponent, onMounted, ref } from 'vue'

import ErrorPrettifier from '../ErrorPrettifier'

import * as skins_validator from '../static/schemas/skins.js'

// https://stackoverflow.com/questions/4313841/insert-a-string-at-a-specific-index
String.prototype.insert = function (index, string) {
	if (index > 0) {
		return this.substring(0, index) + string + this.substr(index)
	}
	return string + this
}
//https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
String.prototype.replaceAt = function (index, replacement) {
	return (
		this.substr(0, index) +
		replacement +
		this.substr(index + replacement.length)
	)
}

export default defineComponent({
	components: {
		PrismEditor,
		Message,
	},
	computed: {
		overlayCode() {
			// Make everything whitespace
			const regex = /[^\s]/gi
			var temp = this.editorCode.replaceAll(regex, ' ')

			// Insert magic-values to use as regex base
			this.ranges.forEach((element) => {
				temp = temp.replaceAt(element['start'], '1')
				temp = temp.replaceAt(element['end'], '2')
			})

			// Replace markers
			temp = temp.replaceAll('1', '<span class="error-underline">')
			temp = temp.replaceAll('2', '</span>')

			return temp
		},
		schemaOptions() {
			return [
				{
					name: 'BP Animation Controller',
					path: 'behavior/animation_controllers/animation_controller',
				},
				{
					name: 'BP Animation',
					path: 'behavior/animations/animations',
				},
				{
					name: 'BP Biome',
					path: 'behavior/biomes/biomes',
				},
				{
					name: 'BP Block',
					path: 'behavior/blocks/blocks',
				},
				{
					name: 'BP Entity',
					path: 'behavior/entities/entities',
				},
				{
					name: 'BP Feature Rule',
					path: 'behavior/feature_rules/feature_rules',
				},
				{
					name: 'BP Feature Rule',
					path: 'behavior/feature_rules/feature_rules',
				},
				{
					name: 'BP Feature',
					path: 'behavior/features/features',
				},
				{
					name: 'BP Item',
					path: 'behavior/items/items',
				},
				{
					name: 'BP Loot Table',
					path: 'behavior/loot_tables/loot_tables',
				},
				{
					name: 'BP Loot Table',
					path: 'behavior/loot_tables/loot_tables',
				},
				{
					name: 'BP Recipe',
					path: 'behavior/recipes/recipes',
				},
				{
					name: 'BP Spawn Rules',
					path: 'behavior/spawn_rules/spawn_rules',
				},
				{
					name: 'BP Trading',
					path: 'behavior/trading/trading',
				},
				{
					name: 'BP Volume',
					path: 'behavior/volumes/volumes',
				},
			]
		},
		compiledSchemas() {
			return this.schemas.filter((element) => element['compile'])
		},
	},
	data() {
		return {
			selected_schema: {
				name: 'Select a Schema',
				path: '',
			},
			messages: [],
			ranges: [],
		}
	},
	methods: {
		clearMessages() {
			this.messages = []
		},
		addMessage(title, message, type) {
			this.messages.push({ message: message, title: title, type: type })
		},
		addError(title, message) {
			this.addMessage(title, message, 'error')
		},
		addWarning(title, message) {
			this.addMessage(title, message, 'warning')
		},
		addSuccess(title, message) {
			this.addMessage(title, message, 'success')
		},
		format() {
			// Clear old runs
			this.clearMessages()
			this.ranges = []

			// Get editor code
			try {
				this.editorCode = JSON.stringify(
					JSON.parse(this.editorCode),
					null,
					3
				)
			} catch (err) {
				this.addError('Your JSON is not valid:', err.message)
				return
			}

			const testData = JSON.stringify({
				data: this.editorCode,
				path: this.selected_schema.path,
			})

			// Fetch and display errors
			fetch('http://127.0.0.1:5000/api/validate_schema', {
				method: 'POST',
				body: testData,
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((error) => {
					try {
						if (error.valid) {
							this.addSuccess(error.title, error.message)
							return
						}

						const prettyError = ErrorPrettifier.prettify(
							this.editorCode,
							error
						)

						this.addError(error.title, error.message)

						this.ranges.push({
							start: prettyError['start']['offset'],
							end: prettyError['end']['offset'],
						})
					} catch (error) {
						this.addWarning(
							'Your JSON could not be understood',
							'Did you select wrong schema type?' + error.message
						)
					}
				})
		},
	},
	setup(props, context) {
		const editorCode = ref('{}')

		const highlighter = (code) => {
			return prism.highlight(code, prism.languages.json)
		}
		return { editorCode, highlighter }
	},
})
</script>

<style>
.error-underline {
	color: #ff69b4;
	text-decoration: underline;
	text-decoration-style: wavy;
}
.error-overlay {
	pointer-events: none;
	font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
	font-size: 14px;
	line-height: 1.5;
	padding: 5px;
	padding-left: 39px;
	text-align: left;
}
.rel {
	position: relative;
}
.abs {
	top: 0;
	left: 0;
	position: absolute;
}
.my-editor {
	background: #2d2d2d;
	color: #ccc;
	font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
	font-size: 14px;
	line-height: 1.5;
	padding: 5px;
}

.prism-editor__textarea:focus {
	outline: none;
}

.height-200 {
	min-height: 800px;
}

.mb-4 {
	margin-bottom: 1rem;
}
</style>
