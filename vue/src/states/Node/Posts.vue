<template>
	<div>
		<!--<router-link :to="{name: 'node-compose', params:{nodeId: $parent.nodeId}}" class="phi-card phi-media adder">
			<i class="phi-media-figure fa fa-plus"></i>
			<h4 class="phi-media-body">publicar</h4>
		</router-link>-->
		<ons-fab position="bottom right" @click="compose()">
			<ons-icon icon="md-plus"></ons-icon>
		</ons-fab>

		<div class="phi-card">
			<router-link :to="{name: 'read', params:{threadId: post.thread}}" v-for="post in posts.items" class="phi-media">
				<div class="phi-media-figure">
					<img :src="post.type.icon" :alt="post.type.singular">
				</div>
				<div class="phi-media-body">
					<h1 v-text="post.title"></h1>
					<p v-text="post.description"></p>
					<small>{{ post.publishDate | date }}</small>
				</div>
			</router-link>
		</div>

	</div>
</template>

<script>
import app from '../../store/app.js'

export default {
	name: "node-posts",

	data () {
		return {
			app,
			type: null,
			page: 1,
			posts: app.api.collection(`nodes/${this.$parent.nodeId}/posts/published`)
		}
	},

	methods: {

		initialize (type) {
			this.type = type;
			this.posts.items = [];
			this.fetch();
		},

		fetch () {
			this.posts.fetch({
				type: this.type,
				page: this.page,
				order: "-publishDate"
			});
		},

		compose () {
			this.app.api.post(`nodes/${this.$parent.nodeId}/posts/drafts`, {type: this.type})
				.then(draft => {
					this.$router.push({name: 'node-compose', params:{nodeId: this.$parent.nodeId, postId: draft.id}});
				});
		}
	},

	mounted () {
		this.initialize(this.$route.params.type);
	},

	watch: {
		'$route' (to) {
			this.initialize(to.params.type);
		}
	}


}
</script>

<style scoped lang="sass">
.adder {
	margin-bottom: 16px;
	align-items: center;

	.phi-media-figure {
		font-size: 1.4em;
		line-height: 1.6em;
		text-align: center;
	}
}

.phi-media-body {

	p {
		padding: 6px 0;
		font-weight: 300;
	}

	small {
		font-size: 0.8em;
		display: block;
		color: #aaa;
		padding: 3px 0;
	}
}
</style>