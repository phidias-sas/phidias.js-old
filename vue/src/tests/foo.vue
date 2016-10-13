<template>
	<div class="phi-page">
		<div class="phi-page-toolbar" :class="{_hidden: toolbarIsHidden}">
			<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
			<h1></h1>
			<div class="phi-tooltip">
				<button class="phi-button"> <i class="fa fa-ellipsis-v"></i></button>
				<ul class="phi-menu _texture-paper">
					<li>do A</li>
					<li>do B</li>
					<li>do C</li>
				</ul>
			</div>
		</div>

		<div class="phi-page-cover">
			<h1>Hello, this is foo</h1>
		</div>

		<div class="phi-page-navigation">
			<router-link active-class="_active" to="/foo"><ons-ripple color="rgba(0, 0, 0, 0.1)"></ons-ripple>Foo</router-link>
			<router-link active-class="_active" to="/bar"><ons-ripple color="rgba(0, 0, 0, 0.1)"></ons-ripple>Bar</router-link>
			<router-link active-class="_active" to="/Inbox"><ons-ripple color="rgba(0, 0, 0, 0.1)"></ons-ripple>Inbox</router-link>
		</div>

		<div class="phi-page-contents">


			<phi-post-editor></phi-post-editor>

			<!--Block test-->
			<!--<section>
				<div class="block" v-for="block in blocks">
					<select v-model="block._action">
						<option v-for="(action, actionName) in block._actions" :value="actionName == 'default' ? null : actionName" v-text="action.title"></option>
					</select>
					<phi-block :block="block" :action="block._action" @ready="loadActions(block, arguments[0].actions)"></phi-block>
				</div>
			</section>-->

			<div class="resizeme _texture-paper _padded" v-show="false">
				<p>Lorem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka rem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka</p>
				<p>Lorem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka rem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka</p>
				<p>Lorem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka rem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka</p>
				<p>Lorem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka rem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka</p>
				<p>Lorem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka rem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka</p>
				<p>Lorem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka rem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka</p>
				<p>Lorem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka rem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka</p>
				<p>Lorem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka rem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka</p>
				<p>Lorem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka rem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka</p>
				<p>Lorem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka rem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka</p>
				<p>Lorem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka rem ipf kdshlkfhsdalkfhslksalf jasdhlfkhasdflkjshdfkljah flkashdf lkasdh flkasjdfh kshdjks dfjklsh fjk ahskhsjka</p>
			</div>

			<h1 @click="toggle()" class="_texture-paper _padded">Foo</h1>

			<div class="phi-tooltip">
				<button class="phi-button"> <i class="fa fa-ellipsis-v"></i></button>
				<ul class="phi-menu _texture-paper">
					<li>do A</li>
					<li>do B</li>
					<li>do C</li>
				</ul>
			</div>

		</div>

	</div>
</template>

<script>
import Velocity from 'velocity-animate';

export default {

	data () {
		return {
			body: null,
			toolbarIsHidden: false,
			action: null,

			blocks: [
				{
					type: 'youtube',
					url: 'https://www.youtube.com/watch?v=DWtXwzQHV80',
					_actions: null, // if properties are not declared here, they cannot be added dinamically later
					_action: null
				},
				{
					type: 'youtube',
					url: 'https://www.youtube.com/watch?v=uUw-vMjzuPM',
					_actions: null,
					_action: null
				}
			]

		}
	},

	methods: {

		loadActions (block, actions) {
			block._actions = actions;
		},

		toggle() {
			var el        = this.$el.querySelector('.resizeme');
			var isVisible = getComputedStyle(el).display != "none";
			Velocity(el, isVisible ? "slideUp" : "slideDown", {
				duration: 320,
				easing: [.42, 0, 0.2, 1]
			});
		}

	},

	mounted () {
		var _this = this;

		// https://codepen.io/IliaSky/pen/VjgBqQ?editors=0110
		var page        = this.$el.querySelector(".phi-page-contents");
		var scrollValue = 0;

		page.addEventListener('scroll', function (e) {
			var delta = this.scrollTop - scrollValue;
			if (Math.abs(delta) > 8) {
				_this.toolbarIsHidden = delta > 0 && scrollValue > 36;
				scrollValue = this.scrollTop;
			}
		});

	}


}

</script>

<style lang="sass" scoped>

#foo {
	position: relative;
}

.resizeme {
	overflow: auto;
	max-height: 400px;
}

.phi-menu {
	width: 180px;
}
</style>