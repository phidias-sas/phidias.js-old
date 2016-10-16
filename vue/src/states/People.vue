<template>
	<div class="phi-page">
		<ons-progress-bar indeterminate v-show="app.api.isLoading"></ons-progress-bar>
        <div class="phi-page-cover">
            <div class="phi-page-toolbar">
                <h1>Personas</h1>
            </div>
        </div>
		<div class="phi-page-contents">
			<div class="phi-card">
                <div class="_padded phi-media">
                    <i class="phi-media-figure fa fa-search" style="line-height: 2em; text-align: center"></i>
                    <phi-input class="phi-media-body" v-model="search" label="buscar" style="margin:5px; display:block" @input="debounce()"></phi-input>
                </div>
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
	</div>
</template>

<script>
import app from '../store/app.js'

export default {
	name: "people",

	data () {
		return {
			app,
            people: app.api.collection("people"),
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