<template>
	<div class="phi-person-picker">
        <phi-input :label="label" v-model="query" @input="debounce()"></phi-input>
        <div class="results">
            <div v-for="person in results" class="person phi-media" @click="select(person)">
                <div class="phi-media-figure phi-avatar">
                    <img :src="person.avatar" :alt="person.firstName">
                </div>
                <h1 class="phi-media-body">{{person.firstName}} {{person.lastName}}</h1>
            </div>
        </div>
	</div>
</template>

<script>
import app from '../../../store/app.js';

export default {
    name: "phi-person-picker",
	props: ["label"],

    data () {
        return {
            query: "",
            results: []
        }
    },

	methods: {
        select (person) {
            this.selected = person;
            this.$emit("select", person);
            this.reset();
        },

        find () {
            app.api.get("people", {q: this.query}).then(results => this.results = results);
        },

        debounce () {
            if (!this.query) {
                return this.reset();
            }
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.find(), 500);
        },

        reset () {
            this.query   = "";
            this.results = [];
        }
	}
}

</script>

<style scoped lang="sass">
.phi-person-picker {
    .phi-input {
        display: block;
    }

    .results {
        max-height: 400px;
        overflow: auto;

        .person {
            .phi-avatar {
                width: 20px !important;
                height: 20px !important;
            }

            .phi-media-body {
                font-size: 1em;
                align-self: center;
            }
        }
    }
}
</style>