<template>
	<div class="phi-type-picker">
        <phi-drawer :open="!isCreating">
            <select @change="select($event)">
                <option value="" :selected="!value">- {{ label }} -</option>
                <option v-for="type in types" :value="type.singular" v-text="type.singular" :selected="value == type.singular"></option>
                <option value="+">crear tipo</option>
            </select>
        </phi-drawer>

        <phi-drawer :open="isCreating">
            <form @submit.prevent="createType()">
                <select v-model="newType.gender">
                    <option value="1">el</option>
                    <option value="0">la</option>
                </select>
                <phi-input label="singular" v-model="newType.singular"></phi-input>
                <phi-input label="plural" v-model="newType.plural"></phi-input>
                <button class="phi-button">crear</button>
                <button class="phi-button cancel" type="button" @click="isCreating = false">cancelar</button>
            </form>
        </phi-drawer>
	</div>
</template>

<script>
import app from '../../../store/app.js';

export default {
    name: "phi-type-picker",
	props: ["label", "value", "context"],

    data () {
        return {
            types: [],

            isCreating: false,
            newType: {
                gender: 1,
                plural: "",
                singular: ""
            }
        }
    },

    mounted () {
        this.fetch();
    },

	methods: {

        fetch () {
            return app.api.get(`types/${this.context}`).then(types => this.types = types);
        },

        select (event) {
            var value = event.target.value;

            if (value == "+") {
                this.isCreating = true;
                return;
            }

            if (!value) {
                this.$emit("input", null);
                return;
            }

            this.$emit("input", value);
        },

        createType () {
            return app.api.post(`types/${this.context}`, this.newType)
                .then(createdType => {
                    this.types.push(createdType);
                    this.$emit("input", createdType.singular);
                    this.isCreating = false;
                    this.newType = {gender: 1, plural: "", singular: ""};
                });
        }
	}/*,

    watch: {
		value (newValue, oldValue) {
			if (this.selected && newValue && this.selected.id == newValue.id) {
				return;
			}
            this.selected = newValue;
		}
    }*/
}

</script>

<style scoped lang="sass">
.phi-type-picker {

    select {
        display: block;
        border: 0;
        background: transparent;
        font-size: inherit;
        cursor: pointer;
    }

    form {
        display: flex;
        align-items: center;

        select {
            margin-right: 16px;
        }

        .phi-input {
            flex: 1;
            margin-right: 16px;
        }
    }

}
</style>