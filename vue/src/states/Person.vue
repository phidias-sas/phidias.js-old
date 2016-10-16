<template>
	<div class="phi-page">
		<ons-progress-bar indeterminate v-show="app.api.isLoading"></ons-progress-bar>
        <div class="phi-page-cover">
            <div class="phi-page-toolbar">
                <button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
                <h1 v-text="person.name"></h1>
            </div>
            <div class="phi-page-header">
                <div class="phi-media" style="font-size: 1.3em; color: #fff">
                    <div class="phi-media-figure phi-avatar" style="width: 64px; height: 64px; max-width: 64px; max-height: 64px">
                        <img :src="person.avatar" :alt="person.firstName">
                    </div>
                    <div class="phi-media-body">
                        <h1 v-text="person.firstName + ' ' + person.lastName"></h1>
                        <small v-text="person.email"></small>
                    </div>
                </div>
            </div>
        </div>
		<div class="phi-page-contents">
			<div class="phi-card _padded">
                <phi-input v-for="(value, propertyName) in person" :label="propertyName" v-model="person[propertyName]" style="display:block; margin-bottom: 32px"></phi-input>
			</div>
            <pre>{{ person }}</pre>
		</div>
	</div>
</template>

<script>
import app from '../store/app.js'

export default {
	name: "person",

	data () {
		return {
			app,
            personId: this.$route.params.personId,
            person: {}
		}
	},

	created () {
        this.fetch();
	},

    methods: {
        fetch () {
            app.api.get("people/" + this.personId).then((person) => {
                this.person = person;

                // having fun ...
                if (this.person.id == app.user.id) {
                    app.user = this.person;
                }
            });
        }
    }

}
</script>

<style scoped lang="sass">
.phi-page-toolbar {
    color: #fff;
}

.phi-page-cover {
    background-color: #1C89B8;
}
</style>