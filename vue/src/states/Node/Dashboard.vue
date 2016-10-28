<template>
	<div>
        <section class="billboard">
            <h1>cartelera</h1>
        </section>

        <section v-for="typeData in types" class="type">
            <h1 v-text="typeData.nodes.length == 1 ? typeData.type.singular : typeData.type.plural"></h1>
            <div class="phi-card">
                <router-link class="phi-media" v-for="node in typeData.nodes" :to="{name: 'node', params:{nodeId: node.id}}">
                    <div class="phi-media-figure">
                        <img :src="app.api.host + '/icons/fa-users.png?color=2196F3&size=42'" :alt="node.type">
                    </div>
                    <h1 class="phi-media-body" v-text="node.name"></h1>
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

    computed: {
        types () {
            var retval = {};
            for (var i = 0; i < this.nodes.items.length; i++) {
                var node = this.nodes.items[i];
                if (typeof retval[node.type.singular] == "undefined") {
                    retval[node.type.singular] = {
                        type: node.type,
                        nodes: []
                    };
                }
                retval[node.type.singular].nodes.push(node);
            }

            return retval;
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

section.type {
    margin-bottom: 24px;

    h1 {
        font-size: 1em;
        padding: 6px 0;
        color: #666;
    }
}
</style>