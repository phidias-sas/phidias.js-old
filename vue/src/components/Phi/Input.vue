<template>
	<div class="phi-input" :class="{_focused: focused, _dirty: !!value}">
		<input type="text" :value="value" @input="input" @focus="focused=true" @blur="focused=false" />
		<label v-text="label"></label>
	</div>
</template>

<script>
export default {

	props: {
		value: null,
		label: String
	},

	data () {
		return {
			focused: false
		}
	},

	methods: {
		input (event) {
			this.$emit("input", event.target.value);
		}
	},

	mounted () {
		var input = this.$el.querySelector("input");

		/* Copy all attributes into <input> element */
		if (this.$el.hasAttributes()) {
			for (var i = 0; i < this.$el.attributes.length; i++) {
				input.setAttribute(this.$el.attributes[i].name, this.$el.attributes[i].value);
			}
		}
	}
}

</script>

<style>
.phi-input input {
	color: inherit;
}
</style>