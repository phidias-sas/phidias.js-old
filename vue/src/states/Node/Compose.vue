<template>
	<div class="phi-page" id="compose">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
				<h1>Redactar</h1>
			</div>
			<div class="phi-page-header">
				<phi-input label="Título" v-model="post.title" @input="save()"></phi-input>
			</div>
		</div>
		<div class="phi-page-contents">
			<div v-if="post.id">
				<div class="phi-media" style="align-items:center">
					<div class="phi-media-figure phi-avatar">
						<img :src="post.author.avatar" :alt="post.author.firstName">
					</div>
					<div class="phi-media-body">
						<h3>{{post.author.firstName}} {{post.author.lastName}}</h3>
					</div>
				</div>
				<textarea v-model="post.description" @input="save()"></textarea>
				<phi-post-editor :post="post"></phi-post-editor>
			</div>
		</div>
	</div>
</template>

<script>
import app from '../../store/app.js';

export default {
	data () {
		return {
			nodeId: this.$route.params.nodeId,
			postId: this.$route.params.postId,

			post: {
				title: null,
				description: null
			}
		}
	},

	methods: {
		fetch () {
			return app.api.get(`posts/${this.postId}`)
				.then(post => this.post = post);
		},

		save () {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
				app.api.put(`posts/${this.postId}`, this.post);
				app.api.clear(`nodes/${this.nodeId}/posts/drafts`);
            }, 500);
		}
	},

	mounted () {
		this.fetch().then(() => this.$el.querySelector("input").focus());
	}
}
</script>

<style scoped lang="sass">
textarea {
	border-radius: 4px;
	margin-top: 6px;
}
</style>

<style lang="sass">

#compose {

	.phi-page-toolbar {
		color: #fff;
	}

	.phi-page-cover {
		background-color: #1C89B8;

		.phi-page-header {
			padding-top: 48px;
		}

		.phi-input {
			font-size: 1.8em;
			font-weight: 300;

			display: block;
			width: 100%;
			max-width: 768px;
			color: #fff;

			/* Highlight colors (label and underline) */
			&::after {
				border-color: rgba(255, 255, 255, 0.3);
			}
			&._dirty label,
			&._focused label {
				color: #fff;
			}
		}

	}

	textarea {
		display: block;

		width: 100%;
		max-width: 768px;
		min-height: 130px;

		font-size: 1.2em;
		font-weight: 300;
	}
}

</style>