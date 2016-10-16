<template>
	<div class="phi-page">
		<ons-progress-bar indeterminate v-show="folder.isLoading"></ons-progress-bar>
		<div class="phi-page-cover">
			<div class="phi-page-toolbar" :class="{_hidden: toolbarIsHidden}">
				
				<button v-if="$route.params.folder == 'archive'" class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
				<button v-if="$route.params.folder != 'archive'" class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>

				<h1 v-text="$route.params.folder == 'archive' ? 'archivados' : type.plural"></h1>

				<button v-if="$route.params.folder != 'archive'" @click="moveTo('archive')" class="phi-button selection-count" v-show="selection.length > 0">
					<span v-text="selection.length"></span>
					<i class="fa fa-archive"></i>
				</button>

				<button v-if="$route.params.folder == 'archive'" @click="moveTo('inbox')" class="phi-button selection-count" v-show="selection.length > 0">
					<span v-text="selection.length"></span>
					<i class="fa fa-inbox"></i>
				</button>

				<div class="phi-tooltip">
					<button class="phi-button"> <i class="fa fa-ellipsis-v"></i></button>
					<ul class="phi-menu _texture-paper">
						<li>
							<span>seleccionar</span>
							<ul class="phi-menu">
								<li @click="select('all')">todos</li>
								<li @click="select('read')">leídos</li>
								<li @click="select('unread')">no leídos</li>
								<li @click="select('none')">ninguno</li>
							</ul>
						</li>
						<li @click="moveTo('archive')" :disabled="!selection.length">archivar</li>
						<li @click="moveTo('read')" :disabled="!selection.length">marcar leído</li>
						<li @click="moveTo('unread')" :disabled="!selection.length">marcar no leído</li>
						<hr>
						<li @click="refresh()">actualizar</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="phi-page-contents">
			<div class="empty" v-show="!folder.threads.length && !folder.isLoading">
				<p>no hay nada aquí</p>
			</div>

			<div class="phi-card">
				<div class="thread phi-media" v-for="thread in folder.threads" :class="{selected: isSelected(thread), read: !!thread.stub.readDate, unread: !thread.stub.readDate}">
					<div class="phi-media-figure phi-avatar" @click="toggle(thread)">
						<img :src="thread.author.avatar" :alt="thread.author.firstName">
						<i class="fa fa-check"></i>
					</div>
					<router-link class="phi-media-body" :to="{name: 'read', params:{threadId: thread.id}}">
						<h1 v-text="thread.title"></h1>
						<p>
							<span v-text="thread.author.firstName + ' ' + thread.author.lastName"></span> -
							<span v-text="thread.description"></span>
						</p>
					</router-link>
				</div>
			</div>

			<button @click="fetch(page+1)" v-show="hasNextPage">Siguiente pagina</button>
		</div>

		<div class="phi-toast" :class="{shown: lastAction}">
			<div v-if="lastAction">
				<p class="phi-media-body" v-text="folder.redact(lastAction, type)"></p>
				<a @click="undo()">deshacer</a>
			</div>
		</div>

	</div>
</template>

<script>
import app from '../../store/app.js'
import Folder from '../../phidias/Folder.js'
import Selection from '../../phidias/Selection.js'

export default {

	data () {

		return {
			app,

			type: {
				singular: this.$route.query.type || null,
				plural:   this.$route.query.type || null,
				gender:   1
			},

			folder:     new Folder(app, this.$route.params.folder),
			selection:  new Selection,

			page:        1,
			hasNextPage: false,
			search:      null,

			lastAction: null,

			toolbarIsHidden: false
		}
	},

	created () {
		this.fetch();
	},

	mounted () {
		// https://codepen.io/IliaSky/pen/VjgBqQ?editors=0110
		var page        = this.$el;
		var scrollValue = 0;

		var toolbar = this.$el.querySelector(".phi-page-toolbar");

		['scroll', 'touchmove'].forEach((eventName) => {   // apparently 'touchmove' event is also needed for iOS
			page.addEventListener(eventName, () => {
				var delta = page.scrollTop - scrollValue;
				if (Math.abs(delta) > 8) {
					this.toolbarIsHidden = delta > 0  && scrollValue > toolbar.clientHeight;
					scrollValue = page.scrollTop;
				}

				toolbar.style.top = page.scrollTop + "px";
			});
		});

	},

	methods: {

		fetch (page) {

			this.page = Math.max(page == undefined ? 1 : page, 0);

			return this.folder.fetch({
				type: this.$route.query.type || null,
				page: this.page,
				q:    this.search == undefined ? null : this.search
			})
			.then((results) => {
				this.hasNextPage = results.length >= 20;

				// get type from first result
				if (results.length) {
					this.type = results[0].type;
				}
			});
		},

		refresh () {
			return this.app.api.clear(this.folder.url)
				.then(() => this.fetch());
		},

		moveTo (targetFolder) {
			this.folder.move(this.selection.items, targetFolder)
				.then(action => {
					this.lastAction = action;

					setTimeout(() => {
						this.lastAction = null
					}, 3000);
				});
		},

		undo () {
			if (!this.lastAction) {
				return;
			}
			this.folder.undo(this.lastAction);
		},

		select (query) {
			this.selection.clear();
			if (query == "none") {
				return;
			}
			this.folder.threads.forEach((thread) => {
				switch (query) {
					case "all":
						this.selection.add(thread.id);
					break;

					case "read":
						!!thread.stub.readDate && this.selection.add(thread.id);
					break;

					case "unread":
						!thread.stub.readDate && this.selection.add(thread.id);
					break;
				}
			});
		},

		isSelected (thread) {
			return this.selection.has(thread.id);
		},

		toggle (thread) {
			this.selection.toggle(thread.id);
		}
	}

}

</script>

<style scoped lang="sass">

.phi-toast {

	position: fixed;
	bottom: 16px;
	left: 16px;

	max-width: 420px;

	/* !!! */
	left: 280px;

	transition: transform 180ms ease-in-out;
	transform: translate3d(0, 200%, 0);

	&.shown {
		transform: translate3d(0, 0, 0);
	}

	& > div {

		display: flex;
		align-items: center;

		border-radius: 6px;
		background-color: #333;
		color: #fff;

		p, a {
			display: block;
			padding: 18px 24px;
			font-weight: 400;
		}

		a {
			color: #b2cfff;
			text-transform: uppercase;
		}

	}

}


/* This makes for smooth transitions when entering from states with high cover images */
/*.phi-page-cover {
	background-color: #1C89B8;
}*/

.phi-page-toolbar {
	background-color: #f3f3f3;
	img {
		width: 24px;
		height: 24px;
		margin-right: 1em;
	}
}

.empty {
	text-align: center;
	padding-top: 96px;
	background: url('../../assets/cactus.png') no-repeat top center;
	margin-top: 64px;

	p {
		font-size: 1.2em;
		margin: 12px 0;
		color: #666;
	}
}


.selection-count {
	width: auto;

	& > * {
		display: inline-block;
		margin-right: 0.5em;
	}

	span {
		font-size: 0.8em;
	}
}

.phi-menu li {
	white-space: nowrap;
}


.thread {

	cursor: pointer;

	.phi-media-figure {
		display: flex;
		align-items: center;
	}

	.phi-media-figure i {
		display: none;

		font-size: 22px;
		text-align: center;
		color: #1C89B8;
	}

	&.unread {
		h1, p {
			font-weight: bold;
		}
	}

	&.selected {
		background: #ff8;
		.phi-media-figure i {
			display: block;
		}
		.phi-media-figure img {
			display: none;
		}
	}
}
</style>
