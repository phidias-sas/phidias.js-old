<template>
	<div class="phi-page">

		<ons-progress-bar indeterminate v-show="isLoading"></ons-progress-bar>

		<div class="phi-page-toolbar">
			<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
			<h1>Bandeja de entrada</h1>
		</div>

		<div class="phi-page-contents">

			<section v-if="!!billboard">
				<router-link class="phi-card" :to="'/threads/all/'+billboard.thread">
					<h1 v-text="billboard.title"></h1>
					<div v-text="billboard.description"></div>
				</router-link>
			</section>

			<section v-show="!!types">
				<div class="phi-card _z-0">
					<router-link class="phi-media" v-for="type in types" :to="{name: 'folder', params:{folder: 'inbox'}, query:{type: type.singular}}">
						<img class="phi-media-figure" :src="type.icon || defaultIcon" :alt="type.plural"  >
						<div class="phi-media-body">
							<h1 v-text="type.plural"></h1>
							<p v-show="!!type.unread">{{type.unread==1 ? 'uno' : type.unread}} nuevo{{type.unread==1 ? '' : 's'}}</p>
						</div>
					</router-link>
				</div>
			</section>

		</div>
	</div>
</template>

<script>
import app from '../store/app.js';

export default {

	name: "dashboard",

	data () {
		return {
			app,
			types: [],
			billboard: null,
			error: null,
			isLoading: false,
			defaultIcon: app.api.host + "/icons/fa-file-text.png?color=2196F3&size=42"
		}
	},

	created () {
		this.fetch();
	},

	methods: {
		fetch () {

			var baseUrl      = `people/${app.user.id}/posts/types`;
			var collection   = app.api.collection(baseUrl);
			var billboardUrl = `people/${app.user.id}/posts/inbox?tags=highlight&limit=1`;

			this.isLoading = true;

			/* Fetch type list */
			collection.fetch()
				.then((data) => {
					this.types     = data;
					this.isLoading = false;
				})
				.catch((error) => {
					this.error     = error;
					this.isLoading = false;
				});

			/* Fetch billboard */
			this.app.api.get(billboardUrl)
				.then((response) => {
					this.billboard = response.length && !response[0].stub.readDate ? response[0] : null;
				});

		}
	}
}
</script>


<style lang="sass" scoped>

.phi-page-cover {
	background: transparent;
	color: #444;

	h1 {
		font-size: 24px;
	}
}

.phi-media-body {
	align-self: center;

	h1 {
		font-size: 1.6em;
		font-weight: 400;
		text-transform: capitalize;
	}
}

</style>