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
				<router-view :key="$route.params.nodeId"></router-view>
			</transition>
		</ons-splitter-content>

		<ons-splitter-side
			swipe-target-width="64"
			side="left"
			width="260px"
			collapse="portrait"
			swipeable
			>
			<header class="phi-media">
				<div class="phi-media-figure phi-avatar">
					<img :src="app.user.avatar" :alt="app.user.firstName">
				</div>
				<h1 class="phi-media-body" v-text="app.user.firstName + ' ' + app.user.lastName"></h1>
			</header>
			<div class="phi-menu" @click="toggleMenu">
				<router-link to="/dashboard">Bandeja de entrada</router-link>
				<router-link to="/folder/archive">Archivados</router-link>
				<hr>

				<label class="phi-menu-label">años lectivos</label>
				<router-link v-for="node in nodes.items" :to="{name:'node', params:{nodeId:node.id}}" v-text="node.name" @click.native="app.clearCrumbs()"></router-link>
				<hr>

				<!--<label class="phi-menu-label">pruebas</label>
				<router-link to="/people">Personas</router-link>
				<router-link to="/root">Grupos</router-link>
				<hr>-->

				<div @click="logout()">Cerrar sesión</div>

				<hr>
				<div @click="clearCache()">[borrar cache]</div>
			</div>
		</ons-splitter-side>

	</ons-splitter>
</template>

<script>
import app from '../store/app.js'

var incomingCover = null;
var outgoingCover = null;

export default {
	name: "deck",

	data () {
		return {
			app,
			nodes: app.api.collection("nodes"),
			transitionDirection: 'left'
		}
	},

	mounted () {
		this.nodes = app.api.collection("nodes");
		this.nodes.fetch();
	},

	methods: {
		logout () {
			this.app.logout();
			this.$router.push('login');
		},

		toggleMenu () {
			this.$el.left.toggle();
		},

		beforeEnter (el) {
			incomingCover = el.querySelector('.phi-page-cover');
		},

		beforeLeave (el) {
			outgoingCover = el.querySelector('.phi-page-cover');

			setTimeout(() => {
				incomingCover && (incomingCover.initialHeight = incomingCover.clientHeight);

				var newCoverHeight = outgoingCover ? outgoingCover.clientHeight : 0;
				incomingCover && (incomingCover.style.height = newCoverHeight + "px");
				outgoingCover && (outgoingCover.style.height = newCoverHeight + "px");

				if (incomingCover && outgoingCover) {
					incomingCover.initialbackgroundColor = window.getComputedStyle(incomingCover).backgroundColor;
					incomingCover.style.backgroundColor  = window.getComputedStyle(outgoingCover).backgroundColor;
				}

				// force repaint
				incomingCover && incomingCover.offsetHeight;
				outgoingCover && outgoingCover.offsetHeight;
			}, 0);
		},

		enter (el) {
			setTimeout(() => {
				var newCoverHeight = incomingCover ? incomingCover.initialHeight : 0;
				incomingCover && (incomingCover.style.height = newCoverHeight + "px");
				outgoingCover && (outgoingCover.style.height = newCoverHeight + "px");

				incomingCover && (incomingCover.style.backgroundColor = incomingCover.initialbackgroundColor);
	
			}, 0);
		},

		afterLeave (el) {
			incomingCover && (incomingCover.style.height = "auto");
			outgoingCover && (outgoingCover.style.height = "auto");
		},


		clearCache () {
			this.app.api.cache.empty().then(() => { alert("Cache borrado") });
		}
	},

	watch: {
		$route (to, from) {

			if (to.params.nodeId) {
				this.transitionDirection = from.params.nodeId < to.params.nodeId ? 'left' : 'right';
			} else {
				this.transitionDirection = (to.meta.order - from.meta.order) > 0 ? 'left' : 'right';
			}

		}
	}

}
</script>

<style lang="sass">
$transition-duration:     .420s;
$transition-displacement: 210px;

ons-splitter-mask {
	background-color: rgba(0, 0, 0, 0.5);
}

ons-splitter-side {
	background: #fff;
	background: #4D5250; /* slack's */
	background: #4D5050;
	color: #eaeaea;

	overflow: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;

	hr {
		opacity: 0;
	}

	header {
		text-align: left;
		margin: 12px 0;

		& > h1 {
			color: #fff;
			opacity: 0.8;
			font-size: 1.2em;
			text-shadow: 0 2px 2px rgba(0, 0, 0, 0.6);
			align-self: center;
		}

	}

}



.slide-enter-active,
.slide-leave-active {

	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	width: 100%;

	transition: opacity $transition-duration;

	.phi-page-contents, .phi-page-navigation > * {
		transition: transform $transition-duration;
	}
}

.slide-leave-active {
	opacity: 0;
}


.slide-enter,
.slide-enter-active {
	z-index: 1;
}

.slide-leave,
.slide-leave-active {
	z-index: 2;
}


/* Page cover transition */
.phi-page-cover {
	transition: height $transition-duration, padding $transition-duration;
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