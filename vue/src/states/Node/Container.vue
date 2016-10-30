<template>
	<div class="phi-page">
		<ons-progress-bar indeterminate v-show="app.api.isLoading"></ons-progress-bar>
		<div class="phi-page-cover" :style="{'background-image': `url(${coverImage})`}">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
				<ul class="phi-breadcrumbs phi-page-toolbar-wide">
					<li v-for="crumb in app.breadcrumbs">
						<router-link :to="{name:'node', params:{nodeId:crumb.id}}" v-text="crumb.name"></router-link>
					</li>
				</ul>
			</div>

			<phi-drawer :open="!pageIsCollapsed">
				<div class="phi-page-header">
					<small v-html="node.type.singular || '&nbsp;'"></small> <!-- nbsp helps set the default cover height, which aides the transition animation-->
					<h1 v-html="node.name || '&nbsp;'"></h1>
				</div>
			</phi-drawer>

			<div class="phi-page-navigation">
				<router-link :to="{name:'node', params:{nodeId}}" exact>Inicio</router-link>
				<router-link v-for="type in types" :to="{name:'node-posts', params:{nodeId, type: type.singular}}" v-text="type.plural"></router-link>
				<router-link :to="{name:'node-people', params:{nodeId}}">Personas</router-link>
				<router-link :to="{name:'node-nodes', params:{nodeId}}">Grupos</router-link>
			</div>
		</div>
		<div class="phi-page-contents" :class="'moving-'+transitionDirection">
			<!--
			I wasted HOURS finding this:
			http://archive.forum.vuejs.org/topic/4840/keep-canreuse-in-vue-router-2-0/3
			use :key="$route.path"
			-->
			<transition name="slidetab">
				<router-view :key="$route.path"></router-view>
			</transition>
		</div>
	</div>
</template>

<script>
import app from '../../store/app.js'

function base_convert(number, initial_base, change_base) {
	if ((initial_base && change_base) <2 || (initial_base && change_base)>36) {
		return null; // Base must be between 2 and 36
	}
    return parseInt(number + '', initial_base).toString(change_base);
}

export default {
	name: "node-container",

	data () {

		var nodeId    = this.$route.params.nodeId;
		var nodeNum   = base_convert(nodeId, 36, 10).toString();
		var lastDigit = nodeNum.substring(nodeNum.length-1);

		return {
			app,
			types: [],
            nodeId: this.$route.params.nodeId,
			transitionDirection: "left",
            node: {
				id: null,
				type: {}
			},

			pageIsCollapsed: this.$route.name != 'node',
			coverImage: '/img/covers/random/' + lastDigit + '.jpg'
		}
	},

    methods: {
        fetch () {
			app.api.get("types/bulletin").then(types => this.types = types);
            return app.api.get("nodes/" + this.nodeId).then(node => this.node = node);
        }
    },

	created () {
		this.fetch()
			.then(node => {
				app.pushCrumb(node);
			});
	},

	watch: {
		'$route' (to, from) {
			this.pageIsCollapsed = to.name != 'node'
			if (from.params.type && to.params.type) {
				this.transitionDirection = (from.params.type < to.params.type) ? 'left' : 'right';
			} else {
				this.transitionDirection = (from.meta.order < to.meta.order) ? 'left' : 'right';
			}
		}
	},

	beforeRouteEnter (to, from, next) {
		app.api.get("types/bulletin").then(types => {
			app.api.get("nodes/" + to.params.nodeId).then(node => {
				next(vm => {
					vm.types = types;
					vm.node  = node;
				});
			});
		});
	}

}
</script>

<style scoped lang="sass">

.phi-page-cover {
	background: #f9f9f9 url('../../assets/covers/phidias.jpg') no-repeat 0 0;
	background-size: cover;

	.phi-menu {
		color: #333;
	}
}

.phi-page-toolbar {
	color: #fff;
}

ons-progress-bar {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
}


.phi-page-navigation {
	text-transform: uppercase;
	& > * {
		/*color: rgba(255, 255, 255, 0.8);*/
		font-weight: 300;
	}
}

.phi-page-contents {
	position: relative;
}
</style>

<style lang="sass">
/* Transition between tabs */
$transition-duration:     .420s;
$transition-displacement: 210px;


.slidetab-enter-active,
.slidetab-leave-active {
	position: absolute;
	top: 16px; /* must be the same as .phi-page-contents padding */
	left: 16px;
	right: 16px;

	transition: transform $transition-duration, opacity $transition-duration;

	ons-fab {
		display: none;
	}
}

.slidetab-enter,
.slidetab-leave-active {
	opacity: 0;
}

.moving-left {
	.slidetab-enter {
		transform: translate3d($transition-displacement, 0, 0);
	}
	.slidetab-leave-active {
		transform: translate3d(-$transition-displacement, 0, 0);
	}
}

.moving-right {
	.slidetab-enter {
		transform: translate3d(-$transition-displacement, 0, 0);
	}
	.slidetab-leave-active {
		transform: translate3d($transition-displacement, 0, 0);
	}
}


</style>