<template>
	<component :is="'phi-block-' + block.type" :block="block" class="phi-block"></component>
</template>

<script>
import Youtube from './Block/Youtube.vue';
import Html from './Block/Html.vue';
import Image from './Block/Image.vue';

export default {

	name: "phi-block",

	props: {
		block: {
			type: Object,
			required: true
		},

		action: {
			type: String,
			default: "default"
		}
	},

	components: { 
		"phi-block-html":    Html,
		"phi-block-youtube": Youtube,
		"phi-block-image":   Image
	}
}

</script>