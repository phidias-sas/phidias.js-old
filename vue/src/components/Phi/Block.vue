<template>
	<component :is="'phi-block-' + block.type" :block="block" :action="action" class="phi-block"></component>
</template>

<script>
/* Declare all components */
import Youtube from './Block/Youtube.vue';
import Html from './Block/Html.vue';
import Image from './Block/Image.vue';
import Files from './Block/Files.vue';

var types = { 
	html:    Html,
	youtube: Youtube,
	image:   Image,
	files:   Files
}

var components = {};
for (var type in types) {
	components["phi-block-"+type] = types[type];
}

export default {
	name: "phi-block",
	components,
	props: {
		block: {
			type: Object,
			required: true
		},
		action: {
			type: String
		}
	},

	created () {
		var type = this.block.type.toLowerCase();
		if ((typeof types[type] == "undefined") || (typeof types[type]['phi-actions'] == "undefined")) {
			return;
		}

		this.$emit("ready", {
			actions: types[type]['phi-actions']
		});
	}
}

</script>