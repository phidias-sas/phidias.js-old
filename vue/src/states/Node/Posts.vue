<template>
	<div>
		<!--<router-link :to="{name: 'node-compose', params:{nodeId: $parent.nodeId}}" class="phi-card phi-media adder">
			<i class="phi-media-figure fa fa-plus"></i>
			<h4 class="phi-media-body">publicar</h4>
		</router-link>-->
		<ons-fab position="bottom right" @click="compose()">
			<ons-icon icon="md-plus"></ons-icon>
		</ons-fab>

		<section v-if="drafts.items.length" class="drafts">
			<label for="">borradores</label>
			<div>
				<router-link :to="{name: 'node-compose', params:{nodeId: $parent.nodeId, postId: post.id}}" v-for="post in drafts.items" class="phi-media">
					<div class="phi-media-figure">
						<img :src="post.type.icon" :alt="post.type.singular">
					</div>
					<div class="phi-media-body">
						<h1 v-text="post.title || 'sin asunto'"></h1>
						<p v-text="post.description || 'sin texto'"></p>
						<small>creado {{ post.creationDate | date }}</small>
					</div>
				</router-link>
			</div>
		</section>

		<div class="phi-card">
			<router-link :to="{name: 'read', params:{threadId: post.thread}}" v-for="post in posts.items" class="phi-media">
				<div class="phi-media-figure">
					<img :src="post.type.icon" :alt="post.type.singular">
				</div>
				<div class="phi-media-body">
					<h1 v-text="post.title"></h1>
					<p v-text="post.description"></p>
					<small>publicado {{ post.publishDate | date }}</small>
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
			type:   null,
			page:   1,
			posts:  app.api.collection(`nodes/${this.$parent.nodeId}/posts/published`),
			drafts: app.api.collection(`nodes/${this.$parent.nodeId}/posts/drafts`)
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

			this.drafts.fetch({
				type: this.type,
				order: "-creationDate"
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

.drafts {
	font-size: 0.9em;
	margin-bottom: 24px;

	.phi-media-figure {
		opacity: 0.6;
	}

	label {
		display: block;
		text-transform: capitalize;
		font-size: 0.9em;
		color: #666;
		margin-bottom: 8px;
	}
}

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