<template>
	<div class="phi-page">
		<ons-progress-bar indeterminate v-show="app.api.isLoading"></ons-progress-bar>
		<div class="phi-page-toolbar">
			<h1>Administración</h1>
		</div>
		<div class="phi-page-cover" style="background: transparent"></div>
		<div class="phi-page-contents">
			<div class="phi-card">
                <router-link class="phi-media" v-for="node in nodes.items" :to="{name: 'node', params:{nodeId: node.id}}">
                    <div class="phi-media-body">
                        <small v-text="node.type"></small>
                        <h1 v-text="node.name"></h1>
                    </div>
                </router-link>
			</div>
		</div>
	</div>
</template>

<script>
import app from '../store/app.js'

export default {
	name: "root",

	data () {
		return {
			app,
            nodes: null
		}
	},

	created () {
		this.nodes = app.api.collection("nodes");
        this.nodes.fetch();
	}

}
</script>