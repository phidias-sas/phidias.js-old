<template>
	<component
		class="phi-block"
		:is="'phi-block-' + block.type"
		:block="block"
		:action="action"
		@change="change()"
		@destroy="destroy()"
		@reset="reset()">
	</component>
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
	components["phi-block-" + type] = types[type];
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

	methods: {
		change () {
			this.$emit("change", this.block);
		},

		destroy () {
			this.$emit("destroy", this.block);
		},

		reset () {
			this.$emit("reset", this.block);
		}
	},

	/* testing */
	getActions (type) {
		if ((typeof types[type] == "undefined") || (typeof types[type]['phi-actions'] == "undefined")) {
			return {};
		}
		return types[type]['phi-actions'];	
	}
}

</script>