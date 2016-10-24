<template>
    <div class="phi-container">

        <div class="phi-card inscription-adder">
            <phi-drawer :open="isOpen">
                <form @submit.prevent="createInscription()">
                    <phi-person-picker label="persona" v-model="newInscription.person"></phi-person-picker>
                    <footer>
                        <button class="phi-button" :disabled="!newInscription.person">inscribir</button>
                        <button type="button" class="phi-button cancel" @click="isOpen = false; newInscription.person = null">cancelar</button>
                    </footer>
                </form>
            </phi-drawer>

            <phi-drawer :open="!isOpen">
                <div class="phi-media" @click="isOpen = true">
                    <i class="phi-media-figure fa fa-plus"></i>
                    <h1 class="phi-media-body">inscribir persona</h1>
                </div>
            </phi-drawer>
        </div>

        <phi-input class="search" v-model="search" label="buscar" style="display:block" @input="debounce()"></phi-input>

        <div class="phi-card">
            <router-link class="person phi-media" v-for="person in people.items" :to="{name: 'person', params:{personId: person.id}}">
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
            timer: null,

            /* New group form */
            isOpen: false,
            newInscription: {
                person: null,
                roles: ["estudiante"]
            }
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
        },

        createInscription () {
            if (!this.newInscription.person) {
                return;
            }

            app.api.post(`nodes/${this.$parent.nodeId}/people`, {
                id:    this.newInscription.person.id,
                roles: this.newInscription.roles
            }).then( addedPeople => {
                var newPerson   = this.newInscription.person;
                newPerson.roles = this.newInscription.roles;

                this.people.add(newPerson);

                this.isOpen = false;
                this.newInscription = {
                    person: null,
                    roles: ["estudiante"]
                };
            });
        }
    },

    watch: {
        isOpen (value) {
            value && setTimeout(() => this.$el.querySelector(".inscription-adder input").focus(), 140);
        }
    },

	created () {
		this.fetch();
	}
}
</script>

<style scoped lang="sass">

.person {
    .phi-media-body {
        align-self: center;
    }
}

.inscription-adder {

    margin-bottom: 16px;
    cursor: pointer;
    opacity: 0.9;

    form {
        padding: 16px;

        select, .phi-input {
            display: block;
        }

        select {
            margin-bottom: 24px;
            border: 0;
            background: transparent;
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

.phi-input.search {
    margin: 16px 0;
}
</style>