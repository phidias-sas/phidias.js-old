<template>
	<div id="app">
		<transition name="slide">
			<keep-alive><router-view></router-view></keep-alive>
		</transition>
	</div>
</template>

<script>
export default {
	name: "index"
}
</script>

<style>
#app, #app > * {
	height: 100%;
}
</style>