<template>
	<div class="tip custom-block">
		<p class="custom-block-title">{{ this.title }}</p>
		<p>{{ this.message }}</p>
	</div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
	props: ['title', 'message', 'type'],
	data() {
		return {}
	},
	setup(props, context) {},
})
</script>

<style>
.custom-block {
	margin: 1rem 0;
	border-left: 0.5rem solid;
	padding: 0.1rem 1.5rem;
	overflow-x: auto;
}
.custom-block-title {
	margin-bottom: -0.4rem;
	font-weight: 600;
}
.custom-block p {
	display: block;
	margin-block-start: 1em;
	margin-block-end: 1em;
	margin-inline-start: 0px;
	margin-inline-end: 0px;
}

.custom-block.tip {
	border-color: #3eaf7c;
	background-color: #f3f5f7;
	color: black;
}
.custom-block.warning {
	border-color: #e7c000;
	color: #6b5900;
	background-color: rgba(255, 229, 100, 0.3);
}
.custom-block.danger {
	border-color: #c00;
	color: #4d0000;
	background-color: #ffe6e6;
}
</style>
