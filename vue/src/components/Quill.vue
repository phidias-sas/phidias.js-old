<template>
	<div>
		<div class="editor"></div>
	</div>
</template>

<script>
import Quill from 'quill'

export default {
	name: "quill",
	props: ["value"],
	data () {
		return {
			quill: null
		}
	},

	mounted () {

		this.quill = new Quill(this.$el.querySelector('.editor'), {
			modules: {
				toolbar: [
					[{ header: [1, 2, false] }],
					['bold', 'italic', 'underline'],
					['image', 'code-block']
				]
			},
			theme: 'snow' // 'snow' or 'bubble'
		});

		this.quill.container.firstChild.innerHTML = this.value;

		this.quill.on('text-change', (delta, oldDelta, source) => {
			if (source == 'user') {
				this.$emit("input", this.quill.container.firstChild.innerHTML);
			}
		});

	},

	watch: {
		value (newValue, oldValue) {
			if (newValue == this.quill.container.firstChild.innerHTML) {
				return;
			}

			this.quill.container.firstChild.innerHTML = newValue;
		}
	}
}
</script>