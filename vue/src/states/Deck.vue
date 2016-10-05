<template>

	<ons-splitter>

		<ons-splitter-content id="main-view" :class="'move-'+transitionDirection">

			<transition 
				name="slide"
				@before-enter="beforeEnter"
				@before-leave="beforeLeave"
				@enter="enter"
				@after-leave="afterLeave"
				>
				<router-view></router-view>
			</transition>

		</ons-splitter-content>


		<ons-splitter-side
			swipe-target-width="64"
			side="left"
			width="280px"
			collapse="portrait"
			swipeable
			>

			<header>
				<div class="phi-avatar">
					<img :src="app.user.avatar" :alt="app.user.firstName">
				</div>
				
				<h1 v-text="app.user.firstName + ' ' + app.user.lastName"></h1>
			</header>

			<div class="phi-menu" @click="toggleMenu">
				<router-link to="/dashboard" v-text="app.settings.title"></router-link>
				<router-link to="/folder/archive">Archivados</router-link>

				<hr>
				<router-link to="/foo">Foo</router-link>
				<router-link to="/bar">Bar</router-link>
				<hr>

				<router-link to="/login">Logout</router-link>
			</div>

		</ons-splitter-side>

	</ons-splitter>

</template>


<script>
import Client from '../phidias/client.js'
import app from '../store/app.js'

var incomingCover = null;
var outgoingCover = null;

export default {

	name: "app",

	data () {
		return {
			app,
			transitionDirection: 'left'
		}
	},

	methods: {

		toggleMenu () {
			this.$el.left.toggle();
		},

		beforeEnter (el) {
			incomingCover = el.querySelector('.phi-page-cover');
		},

		beforeLeave (el) {
			outgoingCover = el.querySelector('.phi-page-cover');

			if (incomingCover) {
				incomingCover.initialHeight = incomingCover.clientHeight;
			}

			var newCoverHeight = outgoingCover ? outgoingCover.clientHeight : 0;
			incomingCover && (incomingCover.style.height = newCoverHeight + "px");
			outgoingCover && (outgoingCover.style.height = newCoverHeight + "px");

			// force repaint
			incomingCover && incomingCover.offsetHeight;
			outgoingCover && outgoingCover.offsetHeight;
		},

		enter (el) {
			var newCoverHeight = incomingCover ? incomingCover.initialHeight : 0;
			incomingCover && (incomingCover.style.height = newCoverHeight + "px");
			outgoingCover && (outgoingCover.style.height = newCoverHeight + "px");
		},

		afterLeave (el) {
			incomingCover && (incomingCover.style.height = "auto");
			outgoingCover && (outgoingCover.style.height = "auto");
		}
	},

	watch: {
		$route (to, from) {
			this.transitionDirection = (to.meta.order - from.meta.order) > 0 ? 'left' : 'right';
		}
	}

}
</script>

<style lang="sass">

$transition-duration:     .420s;
$transition-displacement: 420px;

ons-splitter-mask {
	background-color: rgba(0, 0, 0, 0.5);
}

ons-splitter-side {
	background: #fff;

	header {

		text-align: left;

		background: #f9f9f9 url('../assets/covers/phidias.jpg') no-repeat 0 0;
		background-size: cover;

		padding: 16px;
		padding-top: 56px;

		& > h1 {
			color: #fff;
			font-size: 1.2em;
			text-shadow: 0 2px 2px rgba(0, 0, 0, 0.6);
		}

	}

}



.slide-enter-active,
.slide-leave-active {

	transition: opacity $transition-duration;

	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	width: 100%;

	.phi-page-contents, .phi-page-navigation > * {
		transition: transform $transition-duration;
	}
}

.slide-enter-active {
	z-index: 1;
}

.slide-leave-active {
	z-index: 2;
	opacity: 0;
}

/* Page cover transition */
.phi-page-cover {
	transition: height $transition-duration, padding $transition-duration;
}

.slide-enter,
.slide-leave-active {
	.phi-page-cover {
		padding: 0;
	}	
}


/* Page toolbar transitions */
.slide-enter-active,
.slide-leave-active {
	.phi-page-toolbar {
		transition: transform $transition-duration;
	}
}

.slide-enter {
	.phi-page-toolbar {
		transform: translate3d(0, -100%, 0);
	}
}


.slide-leave-active {
	.phi-page-toolbar {
		transform: translate3d(0, -100%, 0);
	}
}




.move-left {

	.slide-enter {
		.phi-page-contents, .phi-page-navigation > * {
			transform: translate3d($transition-displacement, 0, 0);
		}
	}

	.slide-leave-active {
		.phi-page-contents, .phi-page-navigation > * {
			transform: translate3d(-$transition-displacement, 0, 0);
		}
	}
}

.move-right {

	.slide-enter {
		.phi-page-contents, .phi-page-navigation > * {
			transform: translate3d(-$transition-displacement, 0, 0);
		}
	}

	.slide-leave-active {
		.phi-page-contents, .phi-page-navigation > * {
			transform: translate3d($transition-displacement, 0, 0);
		}
	}

}




/* Toolbar animations */
#main-page .page__content {
	top: 0;
	padding-top: 44px;
}

#main-page .navigation-bar {
	opacity: 1;
	transform: translate3d(0, 0, 0);
	transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

#main-page.hidden-bar .navigation-bar {
	opacity: 0;
	transform: translate3d(0, -44px, 0);
}

/* Android Material Design */
#main-page.hidden-bar .navigation-bar--material {
	opacity: 0;
	transform: translate3d(0, -56px, 0);
}

#main-page .navigation-bar--material + .page__background + .page__content {
	padding-top: 56px;
}


</style>
