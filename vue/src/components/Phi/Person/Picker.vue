<template>
	<div class="phi-person-picker">

        <template v-if="selected">
            <div class="selected person phi-media">
                <div class="phi-media-figure phi-avatar">
                    <img :src="selected.avatar" :alt="selected.firstName">
                </div>
                <h1 class="phi-media-body">{{selected.firstName}} {{selected.lastName}}</h1>
                <i class="phi-media-right fa fa-times" @click="deselect(person)"></i>
            </div>
        </template>

        <template v-if="!selected">
            <div class="search">
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

	</div>
</template>

<script>
import app from '../../../store/app.js';

export default {
    name: "phi-person-picker",
	props: ["label", "value"],

    data () {
        return {
            query: "",
            results: [],
            selected: null
        }
    },

	methods: {
        select (person) {
            this.selected = person;
            this.$emit("input", this.selected);
            this.reset();
        },

        deselect (person) {
            this.selected = null;
            this.$emit("input", this.selected);
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
            this.results = [];
            this.query   = "";
        }
	},

    watch: {
		value (newValue, oldValue) {
			if (this.selected && newValue && this.selected.id == newValue.id) {
				return;
			}
            this.selected = newValue;
		}
    }
}

</script>

<style scoped lang="sass">
.phi-person-picker {

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

    .search {
        .phi-input {
            display: block;
        }

        .results {
            max-height: 400px;
            overflow: auto;
        }
    }

}
</style>