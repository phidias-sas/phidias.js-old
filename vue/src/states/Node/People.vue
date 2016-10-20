<template>

    <div>

        <phi-input v-model="search" label="buscar" style="display:block" @input="debounce()"></phi-input>

        <div class="phi-card">
            <router-link class="phi-media" v-for="person in people.items" :to="{name: 'person', params:{personId: person.id}}">
                <div class="phi-media-figure phi-avatar">
                    <img :src="person.avatar" :alt="person.firstName">
                </div>
                <div class="phi-media-body">
                    <h1 v-text="person.firstName + ' ' + person.lastName"></h1>
                    <small v-text="person.email"></small>
                </div>
            </router-link>
        </div>

    </div>

</template>

<script>
import app from '../../store/app.js'

export default {
	name: "node-people",

	data () {
		return {
			app,
            people: app.api.collection(`nodes/${this.$parent.nodeId}/people`),
            search: null,
            timer: null
		}
	},

    methods: {
        fetch (clear) {
            clear && (this.people.items = []);
            this.people.fetch({q: this.search, order: 'lastName'});
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