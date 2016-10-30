<template>
	<div class="phi-page scrollable">
		<ons-progress-bar indeterminate v-show="collection.isLoading"></ons-progress-bar>

		<div class="phi-page-cover">
			<div class="phi-page-toolbar" :class="{_hidden: toolbarIsHidden}">
				<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
				<h1></h1>
				<!--<div class="phi-tooltip">
					<button class="phi-button"> <i class="fa fa-ellipsis-v"></i></button>
					<ul class="phi-menu _texture-paper">
						<li>do A</li>
						<li>do B</li>
					</ul>
				</div>-->
			</div>
			<div class="phi-page-header">
				<h1 v-if="thread" v-text="thread.title"></h1>
			</div>
		</div>

		<div class="phi-page-contents phi-container" v-if="thread" >

			<!--<header class="phi-card _z-0">
				<div class="phi-media">
					<div class="phi-media-figure phi-avatar">
						<img :src="thread.author.avatar" alt="thread.author.firstName">
					</div>
					<div class="phi-media-body">
						<div class="thread-author" v-text="`${thread.author.firstName} ${thread.author.lastName}`"></div>
						<div class="thread-description" v-text="thread.description"></div>
					</div>
				</div>
			</header>-->

			<div v-for="post in thread.replies.slice().reverse()" class="post phi-media">

				<div class="phi-media-figure phi-avatar" @click="toggleUserInfo(post)">
					<img :src="post.author.avatar" :alt="post.author.firstName">
				</div>

				<div class="phi-media-body">
					<h1 class="post-author" v-text="post.author.firstName + ' ' + post.author.lastName"></h1>
					<div class="post-date">
						<span v-if="post.publishDate">{{ post.publishDate | date }}</span>
						<span v-if="!post.publishDate">enviando ...</span>
					</div>

					<phi-drawer :open="post.isExpanded" v-if="thread.node">
						<phi-person-inscriptions v-if="post.isInfoLoaded" :person="post.author" :node="thread.node" @ready="post.isExpanded = true"></phi-person-inscriptions>
					</phi-drawer>

					<div class="post-body">
						<div class="post-description" v-text="post.description"></div>
						<phi-block v-for="block in post.blocks" :block="block"></phi-block>
					</div>
				</div>
			</div>

		</div>

		<div class="phi-page-footer" v-if="canReply">
			<div class="reply">
				<textarea v-model="replyBody" @keydown.enter.prevent="sendReply()"></textarea>
				<button class="phi-button" :disabled="!replyBody.trim()" @click="sendReply()">enviar</button>
			</div>
		</div>

	</div>
</template>

<script>
import app from '../../store/app.js'

var collection;
var destroyListener;

export default {
	data () {
		return {
			app,
			collection,
			thread: null,
			toolbarIsHidden: false,
			replyBody: ""
		}
	},

	computed: {
		canReply () {
            if (!this.thread || !this.thread.tags) {
                return false;
            }
            return this.thread.tags.indexOf("repliable") >= 0;
		}
	},

	methods: {

		toggleUserInfo (post) {
			if (!post.isInfoLoaded) {
				post.isInfoLoaded = true;
				return;
			}
			post.isExpanded = !post.isExpanded;
		},

		scrollToBottom () {
			setTimeout(() => {
				this.$el.scrollTop = this.$el.scrollHeight;
			}, 200);
		},

		sendReply () {
			var outgoing = {
				author: this.app.user,
				description: this.replyBody
			};

			this.replyBody = "";
			this.thread.replies.unshift(outgoing);
			this.scrollToBottom();

			this.app.api.post(`/threads/${this.thread.id}/replies`, outgoing)
				.then(post => {
					this.thread.replies.splice(this.thread.replies.indexOf(outgoing), 1);
					this.appendReply(post);
				});
		},

		appendReply (post) {
            if (!post || !post.id) {
                return;
            }

			// clear the cache
			this.app.api.clear(`/people/${app.user.id}/threads/inbox/${this.thread.id}`);

            // ignore if the post is already present
            for (var cont = 0; cont < this.thread.replies.length; cont++) {
                if (this.thread.replies[cont].id == post.id) {
                    return;
                }
            }

            this.thread.replies.unshift(post);
            this.scrollToBottom();
		}

	},

	mounted () {

		destroyListener = app.on("notification", stub => {
			this.appendReply(stub.post);
		});

		this.scrollToBottom();

		/*
		Hide toolbar on scroll
		https://codepen.io/IliaSky/pen/VjgBqQ?editors=0110
		*/
		var page        = this.$el;
		var scrollValue = 0;
		var toolbar     = this.$el.querySelector(".phi-page-toolbar");
		['scroll', 'touchmove'].forEach((eventName) => {   // apparently 'touchmove' event is also needed for iOS
			page.addEventListener(eventName, () => {
				var delta = page.scrollTop - scrollValue;
				if (Math.abs(delta) > 8) {
					this.toolbarIsHidden = delta > 0  && scrollValue > toolbar.clientHeight;
					scrollValue = page.scrollTop;
				}
			});
		});
	},



	// called before the route that renders this component is confirmed.
	// does NOT have access to `this` component instance,
	// because it has not been created yet when this guard is called!
	beforeRouteEnter (to, from, next) {
		collection = app.api.collection(`/people/${app.user.id}/threads/inbox`);
		collection.get(to.params.threadId)
			.then(thread => {

				// Additional properties to be tracked
				thread.replies.forEach(post => {
					post.isInfoLoaded = false;
					post.isExpanded   = false;
				});

				next(vm => {
					vm.thread = thread;
				});
			});
	},

	beforeRouteLeave (to, from, next) {
		destroyListener();
		next();
	}
}
</script>

<style lang="sass" scoped>
$phi-avatar-size: 32px;

.phi-page-cover {
	background-color: #1C89B8;
	h1 {
		font-size: 2em;
		font-weight: 300;
	}
}

.phi-page-toolbar {
	color: #fff;
	background-color: #1C89B8;
}

.phi-tooltip .phi-menu {
	min-width: 156px;
	color: #333;
}

.phi-page-contents {
	padding: 16px;
	padding-bottom: 104px;
	position: relative;
}

.reply {
	display: flex;
	padding: 12px;
	background: #f3f3f3;

	textarea {
		flex: 1;
		height: 48px;
		margin-right: 12px;
		font-size: 1.1em;
	}
}


.phi-avatar {
	width: $phi-avatar-size;
	max-width: $phi-avatar-size;
	min-width: $phi-avatar-size;

	height: $phi-avatar-size;
	max-height: $phi-avatar-size;
	min-height: $phi-avatar-size;
}


.thread-author {
	font-size: 1em;
	font-weight: bold;
	margin-bottom: 4px;
}

.thread-description {
	white-space: pre-wrap;
	font-size: 1.1em;
}



.post {
	margin-bottom: 22px;
	padding: 0;

	.phi-media-body {
		max-width: 100%;
	}

	h1 {
		margin-bottom: 8px;
	}

	.phi-avatar {
		margin-top: 3px;
		cursor: pointer;
	}

	.post-author, .post-date {
		display: inline-block;
		font-size: 0.9em;
		margin: 0 0 3px 0;
	}

	.post-author {
		color: #444;
		margin: 0 0 3px 0;
	}

	.post-date {
		color: #000;
		opacity: 0.4;
		font-size: 0.8em;
		margin-left: 6px;
	}

	.post-description {
		margin: 0;
		font-weight: 300;

		max-width: 100%;
		overflow-x: hidden;
	}

	.phi-block {
		margin: 6px 0;
	}
}

.phi-person-inscriptions {
	padding: 4px 0 12px 0;
	font-size: 0.8em;
}

</style>