<template>
    <div class="phi-container">
        <!--<phi-input v-model="search" label="buscar" style="display:block" @input="debounce()"></phi-input>-->

        <div class="phi-card group-adder">
            <phi-drawer :open="isOpen">
                <form @submit.prevent="createGroup()">
                    <phi-type-picker v-model="newGroup.type" context="node" label="escoge un tipo"></phi-type-picker>
                    <phi-input v-model="newGroup.name" label="nombre" class="group-name"></phi-input>

                    <footer>
                        <button class="phi-button" :disabled="!newGroup.name.trim() || !newGroup.type">guardar</button>
                        <button type="button" class="phi-button cancel" @click="isOpen = false">cancelar</button>
                    </footer>
                </form>
            </phi-drawer>

            <phi-drawer :open="!isOpen">
                <div class="phi-media" @click="isOpen = true">
                    <i class="phi-media-figure fa fa-plus"></i>
                    <h1 class="phi-media-body">crear grupo</h1>
                </div>
            </phi-drawer>
        </div>

        <section v-for="typeData in types" class="type">
            <h1 v-text="typeData.nodes.length == 1 ? typeData.type.singular : typeData.type.plural"></h1>
            <div class="phi-card">
                <router-link class="phi-media" v-for="node in typeData.nodes" :to="{name: 'node-nodes', params:{nodeId: node.id}}">
                    <div class="phi-media-figure">
                        <img :src="node.type.icon || defaultIcon" :alt="node.type">
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
	name: "node-nodes",

	data () {
		return {
			app,
            nodes: app.api.collection(`nodes/${this.$parent.nodeId}/nodes`),
            search: null,
            timer: null,
            defaultIcon: app.api.host + '/icons/fa-users.png?color=2196F3&size=42',

            /* New group form */
            isOpen: false,
            newGroup: {name: "", type: ""}
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
        },

        debounce () {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.fetch(true), 500);
        },

        createGroup () {
            this.app.api.post(`nodes/${this.$parent.nodeId}/nodes`, this.newGroup)
                .then(newGroup => {
                    newGroup.type = {singular: newGroup.type};
                    this.nodes.add(newGroup);
                    this.newGroup = {name: "", type: ""};
                    this.isOpen   = false;
                })
        }
    },

	created () {
		this.fetch();
	}/*,

    watch: {
        isOpen (value) {
            //value && this.$el.querySelector(".group-name input").focus(); // does not work (don't really know why)
            value && setTimeout(() => this.$el.querySelector(".group-name input").focus(), 140);
        }
    }*/
}
</script>

<style scoped lang="sass">
section.type {
    margin-bottom: 24px;

    h1 {
        font-size: 1em;
        padding: 6px 0;
        color: #666;
    }
}

.group-adder {

    margin-bottom: 16px;
    cursor: pointer;
    opacity: 0.9;

    form {
        padding: 16px;

        .phi-input {
            display: block;
            margin-top: 24px;
        }

        footer {
            margin-top: 16px;
        }
    }

    .phi-media {
        .phi-media-figure {
            text-align: center;
            align-self: center;
            font-size: 16px;
        }
        .phi-media-body {
            font-size: 1.1em;
        }
    }

}
</style>