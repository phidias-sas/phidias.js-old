<template>
	<div>
        <div class="billboard">
            <h1>cartelera</h1>
        </div>
        <div class="billboard">
            <h1>resumen de actividad</h1>
        </div>
        <div class="billboard">
            <h1>etc.</h1>
        </div>        
	</div>
</template>

<script>
export default {
	name: "node-dashboard",
	data () {
		return {
		}
	},
    methods: {
    }
}
</script>

<style scoped lang="sass">
.billboard {
    padding: 24px;
    border: 1px dashed #ccc;
    margin-bottom: 12px;
    h1 {
        opacity: 0.3;
    }
}
</style>