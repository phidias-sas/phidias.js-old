<template>
	<div class="phi-page">
		<ons-progress-bar indeterminate v-show="app.api.isLoading"></ons-progress-bar>
		<div class="phi-page-toolbar">
            <button class="phi-button" @click="$router.push(node.parent ? {} : '/root')"> <i class="fa fa-arrow-left"></i></button>
			<h1 v-text="node.name"></h1>
		</div>
        <div class="phi-page-cover">
            <small v-html="node.type.singular || '&nbsp;'"></small> <!-- nbsp helps set the default cover height, which aides the transition animation-->
            <h1 v-html="node.name || '&nbsp;'"></h1>
        </div>
		<div class="phi-page-navigation">
			<router-link :to="{name:'node', params:{nodeId}}">Posts</router-link>
			<router-link :to="{name:'node-people', params:{nodeId}}">People</router-link>
		</div>

		<div class="phi-page-contents">
			<transition>
				<router-view></router-view>
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
            nodeId: this.$route.params.nodeId,
            node: {
				type: {}
			}
		}
	},

	created () {
        this.fetch();
	},

    methods: {
        fetch () {
            app.api.get("nodes/" + this.nodeId).then((node) => {
                this.node = node;
            });
        }
    }

}
</script>

<style scoped lang="sass">
.phi-page-toolbar {
	color: #fff;
}

.phi-page-cover {

}
</style>