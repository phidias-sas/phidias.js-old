<template>
	<div class="phi-page">
		<ons-progress-bar indeterminate v-show="app.api.isLoading"></ons-progress-bar>
		<div class="phi-page-toolbar">
            <button class="phi-button" @click="$router.push(node.parent ? {} : '/root')"> <i class="fa fa-arrow-left"></i></button>
		</div>
        <div class="phi-page-cover">
            <small v-html="node.type.singular || '&nbsp;'"></small> <!-- nbsp helps set the default cover height, which aides the transition animation-->
            <h1 v-html="node.name || '&nbsp;'"></h1>
        </div>
		<div class="phi-page-navigation">
			<router-link v-for="type in types" :to="{name:'node-posts', params:{nodeId, type: type.singular}}" v-text="type.plural"></router-link>
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

export default {
	name: "node",

	data () {
		return {
			app,
			types: [],
            nodeId: this.$route.params.nodeId,
			transitionDirection: "right",
            node: {
				type: {}
			}
		}
	},

    methods: {
		initialize (nodeId) {
			this.nodeId = nodeId;
			this.fetch();
		},

        fetch () {
            app.api.get("nodes/" + this.nodeId).then(node => this.node = node);
			app.api.get("types/bulletin").then(types => this.types = types);
        }
    },

	created () {
		this.initialize(this.$route.params.nodeId);
	},

	watch: {
		'$route' (to, from) {
			this.initialize(to.params.nodeId);
			this.transitionDirection = (from.params.type < to.params.type) ? 'left' : 'right';
		}
	}

}
</script>

<style scoped lang="sass">

.phi-page-cover {
	background: #f9f9f9 url('../../assets/covers/phidias.jpg') no-repeat 0 0;
	background-size: cover;
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

.phi-page-contents {
	position: relative;
}
</style>

<style lang="sass">
/* Transition between tabs */
$transition-duration:     .420s;
$transition-displacement: 42%;


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