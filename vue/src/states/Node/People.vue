<template>
    <div class="phi-container">

        <div class="phi-card inscription-adder">
            <phi-drawer :open="isOpen">
                <form @submit.prevent="saveInscriptions()">

                    <div class="inscription phi-media" v-for="inscription in inscriptions">
                        <div class="phi-media-figure phi-avatar">
                            <img :src="inscription.avatar" :alt="inscription.firstName">
                        </div>
                        <div class="phi-media-body">
                            <h1>{{inscription.firstName}} {{inscription.lastName}}</h1>
                            <phi-role-picker v-model="inscription.roles" :gender="inscription.gender" label="escoger rol"></phi-role-picker>
                        </div>
                    </div>

                    <phi-person-picker label="persona" @select="appendPerson(arguments[0])"></phi-person-picker>

                    <footer>
                        <button class="phi-button" :disabled="!inscriptions.length">inscribir</button>
                        <button type="button" class="phi-button cancel" @click="isOpen = false; inscriptions = []">cancelar</button>
                    </footer>
                </form>
            </phi-drawer>

            <phi-drawer :open="!isOpen">
                <div class="phi-media handle" @click="isOpen = true">
                    <i class="phi-media-figure fa fa-plus"></i>
                    <h1 class="phi-media-body">inscribir</h1>
                </div>
            </phi-drawer>
        </div>

        <phi-input class="search" v-model="search" label="buscar" style="display:block" @input="debounce()"></phi-input>

        <div class="phi-card">
            <div class="person phi-media" v-for="person in people.items">
                <router-link class="phi-media-figure phi-avatar" :to="{name: 'person', params:{personId: person.id}}">
                    <img :src="person.avatar" :alt="person.firstName">
                </router-link>
                <div class="phi-media-body">
                    <h1 v-text="person.firstName + ' ' + person.lastName"></h1>
                    <phi-role-picker 
                        label="agregar rol"
                        v-model="person.roles"
                        :gender="person.gender"
                        @select="addRole(person, arguments[0])"
                        @deselect="removeRole(person, arguments[0])"
                    >
                    </phi-role-picker>
                </div>
                <i class="phi-media-right fa fa-times" @click="deleteInscription(person)"></i>
            </div>
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
            inscriptions: []
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

        appendPerson (person) {
            person.roles = [];
            this.inscriptions.push(person);
        },

        saveInscriptions () {
            if (!this.inscriptions.length) {
                return;
            }

            app.api.post(`nodes/${this.$parent.nodeId}/people`, this.inscriptions)
                .then( addedPeople => {
                    addedPeople.forEach(person => this.people.add(person));
                    this.isOpen       = false;
                    this.inscriptions = [];
                });
        },

        addRole (person, role) {
            app.api.put(`nodes/${this.$parent.nodeId}/people/${person.id}/roles/${role.maleNoun.singular}`)
                .then(() => app.api.clear(`nodes/${this.$parent.nodeId}/people`));
        },

        removeRole (person, role) {
            app.api.delete(`nodes/${this.$parent.nodeId}/people/${person.id}/roles/${role.maleNoun.singular}`)
                .then(() => app.api.clear(`nodes/${this.$parent.nodeId}/people`));
        },

        deleteInscription (person) {

            if (!confirm(`Retirar a ${person.firstName} ${this.$parent.node.type.gender == 1 ? 'del' : 'de la'} ${this.$parent.node.type.singular} ?`)) {
                return;
            }

            app.api.delete(`nodes/${this.$parent.nodeId}/people/${person.id}`)
                .then(() => {
                    app.api.clear(`nodes/${this.$parent.nodeId}/people`);
                    this.people.remove(person);
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


<style lang="sass">
/* Omitir la "X" de borrar rol cuando solo hay uno (no funciona dentro de un script "scoped") */
.person {
    .phi-role-picker {
        .role:only-of-type i {
            display: none !important;
        }
    }
}
</style>


<style scoped lang="sass">

.inscription-adder {

    margin-bottom: 16px;
    cursor: pointer;
    opacity: 0.9;

    .phi-person-picker {
        margin-top: 16px;
    }

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

    .handle {

        align-items: center;

        .phi-media-figure {
            text-align: center;
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