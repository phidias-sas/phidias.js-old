<template>
	<div>
        <section class="billboard">
            <h1>cartelera</h1>
        </section>

        <section class="nodes">
            <div class="phi-card">
                <router-link class="phi-media" v-for="node in nodes.items" :to="{name: 'node-dashboard', params:{nodeId: node.id}}">
                    <div class="phi-media-figure">
                        <img :src="app.api.host + '/icons/fa-users.png?color=2196F3&size=42'" :alt="node.type">
                    </div>
                    <div class="phi-media-body">
                        <small v-text="node.type"></small>
                        <h1 v-text="node.name"></h1>
                    </div>
                </router-link>
            </div>
        </section>
	</div>
</template>

<script>
import app from '../../store/app.js'

export default {
	name: "node-dashboard",

	data () {
		return {
            app,
            nodes: app.api.collection(`nodes/${this.$parent.nodeId}/nodes`)
		}
	},

    methods: {
        fetch (clear) {
            clear && (this.nodes.items = []);
            this.nodes.fetch();
        }
    },

	created () {
		this.fetch();
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