<template>

    <div>
        <!--<phi-input v-model="search" label="buscar" style="display:block" @input="debounce()"></phi-input>-->

        <div class="phi-card">
            <router-link class="phi-media" v-for="node in nodes.items" :to="{name: 'node-nodes', params:{nodeId: node.id}}">
                <div class="phi-media-figure">
                    <img :src="node.type.icon || defaultIcon" :alt="node.type">
                </div>
                <div class="phi-media-body">
                    <small v-text="node.type"></small>
                    <h1 v-text="node.name"></h1>
                </div>
            </router-link>
        </div>
    </div>

</template>

<script>
import app from '../../store/app.js'

export default {
	name: "node-nodes",

	data () {
		return {
			app,
            nodes: app.api.collection(`nodes/${this.$parent.nodeId}/nodes`),
            search: null,
            timer: null,
            defaultIcon: app.api.host + '/icons/fa-users.png?color=2196F3&size=42'
		}
	},

    methods: {
        fetch (clear) {
            clear && (this.nodes.items = []);
            this.nodes.fetch();
        },

        debounce () {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.fetch(true), 500);
        }
    },

	created () {
		this.fetch();
	}
}
</script>