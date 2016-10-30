<template>
	<div class="phi-person-inscriptions">
        <ul class="roles">
            <li v-for="role in roles">{{ person.gender == 1 ? role.maleNoun.singular : role.femaleNoun.singular }}</li>
        </ul>
	</div>
</template>

<script>
import app from '../../../store/app.js';

export default {
    name: "phi-person-inscriptions",
	props: ["person", "node"],

    data () {
        return {
            roles: []
        }
    },

	methods: {
        fetch () {
            app.api.get(`nodes/${this.node}/people/${this.person.id}/roles`)
                .then(roles => this.roles = roles);
        }
	},

    created () {
        this.fetch();
    },

    updated () {
        this.$emit("ready");
    }

}

</script>

<style scoped lang="sass">
.phi-person-inscriptions {

    ul {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            display: inline-block;
            margin-right: 0.5em;
            padding: 8px 12px;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.1);
        }
    }

}
</style>