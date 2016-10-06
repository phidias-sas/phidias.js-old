<template>

	<div class="phi-page">
		<ons-progress-bar indeterminate v-show="isLoading"></ons-progress-bar>
		<div class="phi-page-toolbar" :class="{_hidden: toolbarIsHidden}">
			<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
			<h1></h1>
			<div class="phi-tooltip">
				<button class="phi-button"> <i class="fa fa-ellipsis-v"></i></button>
				<ul class="phi-menu _texture-paper">
					<li>do A</li>
					<li>do B</li>
					<li>do C</li>
				</ul>
			</div>
		</div>

		<div class="phi-page-cover">
			<h1 v-if="thread" v-text="thread.title"></h1>
		</div>

		<div class="phi-page-contents" v-if="thread" >

			<div v-for="post in thread.replies" class="phi-media post">
				<div class="phi-media-figure phi-avatar">
					<img :src="post.author.avatar" :alt="post.author.firstName">
				</div>
				<div class="phi-media-body">
					<h1 v-text="post.author.firstName + ' ' + post.author.lastName"></h1>
					<div class="description" v-text="post.description"></div>
					<phi-block v-for="block in post.blocks" :block="block"></phi-block>
					<div class="date">{{ post.publishDate | test }}</div>
				</div>
			</div>

		</div>

	</div>
</template>

<script>
import moment from 'moment'
import app from '../../store/app.js'

export default {

	data () {
		return {
			app,
			thread: null,
			isLoading: false,
			toolbarIsHidden: false
		}
	},

	created () {
		this.collection = this.app.api.collection(`/people/${this.app.user.id}/threads/inbox`);
		this.fetch();
	},

	mounted () {
    // https://codepen.io/IliaSky/pen/VjgBqQ?editors=0110
    var page        = this.$el;
    var scrollValue = 0;

    page.addEventListener('scroll', (e) => {
      var delta = page.scrollTop - scrollValue;
      if (Math.abs(delta) > 8) {
        this.toolbarIsHidden = delta > 0 && scrollValue > 64;
        scrollValue = page.scrollTop;
      }
    });		
	},

	methods: {

		fetch () {
			this.isLoading = true;
			this.collection.get(this.$route.params.threadId)
				.then((thread) => {
					this.thread = thread;
					this.isLoading = false;
				});
		}

	},

	filters: {
		test (value) {
			return moment(value * 1000).calendar();
		}
	}

}



</script>


<style lang="sass" scoped>

.phi-page-contents {
	padding: 0;
	position: relative;
}

.phi-page-toolbar {
	color: #fff;
	background-color: #1C89B8;
}

.phi-tooltip .phi-menu {
	min-width: 156px;
}

.phi-page-cover {
	background-color: #1C89B8;

	h1 {
		font-size: 2em;
		font-weight: 300;
	}
}


.post {
	width: 768px;
	max-width: 100%;

	margin-bottom: 16px;

	.phi-media-body {
		max-width: 100%;
	}

	h1 {
		margin-bottom: 8px;
	}

	.description {
		margin: 0;
		padding: 12px 16px;
		background: #fff;
		border-radius: 4px;

		font-size: 1.1em;
		font-weight: 300;

		max-width: 100%;
		overflow-x: hidden;
	}

	.date {
		margin-top: 8px;
		padding: 0 8px;
		font-size: .8em;
		color: #999;
	}
}

</style>
