<template>
	<div class="phi-drawer" :class="{open: open, closed: !open}">
        <slot></slot>
	</div>
</template>

<script>
import Velocity from 'velocity-animate';

export default {
    name: "phi-drawer",

	props: {
		open: Boolean
	},

	methods: {
		toggle (isVisible) {
			if (isVisible) {
				Velocity(this.$el, "slideDown", {
					duration: 640,
					easing: [500, 20]
				});
			} else {
				Velocity(this.$el, "slideUp", {
					duration: 420,
					easing: [.42, 0, 0.2, 1]
				});
			}
		}
	},

    mounted () {
        this.$el.style.display = this.open ? "block" : "none";
    },

    watch: {
        open () {
            this.toggle(this.open);
        }
    }
}

</script>

<style scoped lang="sass">
.phi-drawer {
}
</style>