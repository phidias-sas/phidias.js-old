<template>
	<div class="phi-role-picker">

        <phi-drawer :open="!isCreating">
            <div class="role-list">
                <div v-for="role in selection" class="role">
                    <p v-text="toString(role)"></p>
                    <i class="fa fa-times" @click="deselect(role)"></i>
                </div>

                <select @change="select($event)">
                    <option value="">- {{ label }} -</option>
                    <option v-for="role in availableRoles" :value="role.maleNoun.singular" v-text="toString(role)"></option>
                    <option value="+">Crear rol</option>
                </select>
            </div>
        </phi-drawer>

        <phi-drawer :open="isCreating">
            <form class="role-adder" @submit.prevent="createRole()">
                <phi-input label="el" v-model="newRole.maleNoun.singular"></phi-input>
                <phi-input label="los" v-model="newRole.maleNoun.plural"></phi-input>
                /
                <phi-input label="la" v-model="newRole.femaleNoun.singular"></phi-input>
                <phi-input label="las" v-model="newRole.femaleNoun.plural"></phi-input>

                <button class="phi-button">crear</button>
                <button class="phi-button cancel" type="button" @click="isCreating = false">cancelar</button>
            </form>
        </phi-drawer>

	</div>
</template>

<script>
import app from '../../../store/app.js';

export default {
    name: "phi-role-picker",
	props: ["label", "value", "gender"],

    data () {
        return {
            roles: app.api.collection(`roles`),
            selection: [],
            isCreating: false,
            newRole: {
                maleNoun: {
                    singular: "",
                    plural: ""
                },
                femaleNoun: {
                    singular: "",
                    plural: ""
                }
            }
        }
    },

    computed: {

        // all roles in this.roles.items that are not added to the selection
        availableRoles () {
            return this.roles.items.filter((element, index, array) => {
                for (var i = 0; i < this.selection.length; i++) {
                    if (this.selection[i].maleNoun.singular == element.maleNoun.singular) {
                        return false;
                    }
                }
                return true;
            });
        }
    },

    methods: {
        select (event) {
            var role = event.target.value;

            if (!role) {
                return;
            }

            if (role == "+") {
                this.isCreating = true;
                event.target.value = "";
                return;
            }

            this.selection.push(this.getRole(role));
            event.target.value = "";
            this.$emit("input", this.selection);
            this.$emit("select", this.getRole(role));
        },

        deselect (role) {
            this.selection.splice(this.selection.indexOf(role), 1);
            this.$emit("input", this.selection);
            this.$emit("deselect", role);
        },

        createRole () {
            app.api.post('roles', this.newRole)
                .then(createdRole => {
                    this.isCreating = false;
                    this.roles.add(createdRole);
                    this.selection.push(createdRole);
                    this.$emit("input", this.selection);
                    this.$emit("select", createdRole);
                });
        },

        getRole (maleNoun) {
            for (var i = 0; i < this.roles.items.length; i++) {
                if (this.roles.items[i].maleNoun.singular == maleNoun) {
                    return this.roles.items[i];
                }
            }
            return null;
        },

        toString (role) {
            return this.gender == 1 ? role.maleNoun.singular : role.femaleNoun.singular;
        }
    },

    mounted () {
        this.roles.fetch();
        this.selection = this.value;
    },

    watch: {
		value (newValue) {
            this.selection = newValue;
		}
    }
}

</script>

<style scoped lang="sass">
.phi-role-picker {

    select {
        font-size: inherit;
        border: 0;
        background: transparent;
    }

    .role-list {

        & > * {
            display: inline-block;
        }

        .role {
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.1);
            
            margin: 0.25em;

            & > * {
                display: inline-block;
                padding: 8px 12px;
            }

            i {
                cursor: pointer;
                opacity: 0.5;

                &:hover {
                    color: red;
                    opacity: 1;
                }
            }
        }
    }

}
</style>