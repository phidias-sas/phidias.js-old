<template>
    <div class="phi-post-editor">

		<h1 v-text="post.title"></h1>
		<div class="phi-media">
			<div class="phi-media-figure phi-avatar">
				<img :src="post.author.avatar" :alt="post.author.firstName">
			</div>
			<h3 class="phi-media-body" v-text="post.author.firstName + ' ' + post.author.lastName"></h3>
		</div>
		<div v-text="post.description"></div>

		<div class="phi-post-editor-blocks">

			<div v-for="block in post.blocks">
				<div class="phi-block-toolbar phi-media">
					<div class="phi-media-body"></div>
					<div class="phi-media-right">
						<div class="phi-tooltip">
							<button> <i class="fa fa-ellipsis-v"></i></button>
							<ul class="phi-menu _texture-paper">
								<li v-for="(action, actionName) in block._actions" v-text="action.title" @click="block._action = actionName == 'default' ? null : actionName"></li>
							</ul>
						</div>
					</div>
				</div>
				<phi-block :block="block" :action="block._action" @ready="block._actions = arguments[0].actions"></phi-block>
			</div>

		</div>

		<div class="phi-post-editor-adder">
			<ul class="phi-menu">
				<li>Foo</li>
				<li>Bar</li>
				<li>Shoo</li>
			</ul>
		</div>

    </div>
</template>

<script>
import Sortable from 'sortablejs';

export default {

	name: "phi-post-editor",

	props: {
		// post: {
		// 	type: Object,
		// 	required: true
		// }
	},

	mounted () {
		this.sortable = Sortable.create(this.$el.querySelector('.phi-post-editor-blocks'), {
			handle:        '.phi-media-body',
			animation:     150,
			forceFallback: true // it will not work otherwise
		});
	},

	data () {
		return {

			sortable: null,

			post: {
				"id": "6g0gu96d",
				"type": "mensaje",
				"title": "Santiago",
				"description": "http:\/\/bestanimations.com\/Military\/Explosions\/explosion-animation.gif",
				"creationDate": null,
				"publishDate": "1474949648",
				"sendDate": null,
				"deleteDate": null,
				"author": {
					"id": "6",
					"email": null,
					"gender": "1",
					"firstName": "Esteban",
					"lastName": "Diaz",
					"lastName2": "Cardona",
					"birthDay": null,
					"document": null,
					"documentType": null,
					"avatar": "https:\/\/phidias-storage-1.s3.amazonaws.com\/phidias\/pictures\/current\/picture_e7441dc9dd5140c26865ec2951dc7559.jpg",
					"mobile": null
				},
				"audience": null,
				"node": null,
				"thread": null,
				"replyTo": null,
				"forwardOf": null,
				"blocks": [
					{
						"id": "6g0gu98j",
						"post": "6g0gu96d",
						"type": "image",
						"url": "http://pre08.deviantart.net/acef/th/pre/i/2016/286/c/d/inquisitor_by_hydraevil-daku6a8.jpg",
						"title": null,
						"description": null,
						"creationDate": "0",
						"publishDate": null,
						"deleteDate": null,
						"order": "0",
						"highlight": "0",
						_actions: null,
						_action: null

					},

					{
						type: 'youtube',
						url: 'https://www.youtube.com/watch?v=DWtXwzQHV80',
						_actions: null,
						_action: null
					},

					{
						"id": "6g0gu98j",
						"post": "6g0gu96d",
						"type": "image",
						"url": "http:\/\/bestanimations.com\/Military\/Explosions\/explosion-animation.gif",
						"title": null,
						"description": null,
						"creationDate": "0",
						"publishDate": null,
						"deleteDate": null,
						"order": "0",
						"highlight": "0",
						_actions: null,
						_action: null
					}
				],
				"stub": {
					"id": "6g0gu9f5",
					"post": "6g0gu96d",
					"person": "6",
					"creationDate": "1474949648",
					"readDate": "1474949648",
					"archiveDate": null,
					"deleteDate": null,
					"starDate": null
				}
			}
		}
	}
}

</script>

<style scoped lang="sass">

/*.sortable-fallback {
	border: 3px solid red;
	iframe {
		display: none;
	}
}*/

.phi-post-editor {
	max-width: 768px;
}


.phi-post-editor-blocks > div {
	margin-bottom: 24px;
}


.phi-block-toolbar {

	padding: 0;
	background: rgba(0, 0, 0, 0.1);
	border-radius: 4px;

	.phi-media-body {
		cursor: move;
	}

	.phi-media-right {

		button {
			margin: 3px;
			padding: 8px 12px;
			background: transparent;
			border: none;
		}

		.phi-menu {
			min-width: 120px;
			text-align: left;
		}
	}

}

</style>