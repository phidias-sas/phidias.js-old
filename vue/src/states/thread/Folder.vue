<template>

	<div class="phi-page">
		<ons-progress-bar indeterminate v-show="isLoading"></ons-progress-bar>

		<div class="phi-page-toolbar" :class="{_hidden: toolbarIsHidden}">
			<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>

			<!--<img v-if="type.icon" :src="type.icon" >-->
			<h1 v-text="type.plural"></h1>

			<button v-if="$route.params.folder != 'archive'" @click="archive()" class="phi-button selection-count" v-show="selection.length > 0">
				<span v-text="selection.length"></span>
				<i class="fa fa-archive"></i>
			</button>

			<button v-if="$route.params.folder == 'archive'" @click="restore()" class="phi-button selection-count" v-show="selection.length > 0">
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

		<div class="phi-page-contents">
			<div class="empty" v-show="!threads.length && !isLoading">
				<p>no hay nada aquí</p>
			</div>

			<div class="phi-card">
				<div class="thread phi-media" v-for="thread in threads" :class="{selected: isSelected(thread), read: !!thread.stub.readDate, unread: !thread.stub.readDate}">
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
		</div>

		<div class="phi-toast" :class="{shown: !!lastAction}">
			<div v-if="lastAction" class="phi-media">
				<p v-text="redact(lastAction)" class="phi-media-body"></p>
				<a @click="undo()">deshacer</a>
			</div>
		</div>

	</div>
</template>

<script>
import app from '../../store/app.js'

export default {

	data () {
		return {

			app,

			type: {
				singular: this.$route.query.type || null,
				plural:   this.$route.query.type || null,
				gender:   1
			},

			collection: null,
			threads: [],
			selection: null,

			page: 1,
			search: null,
			hasNextPage: false,
			isLoading: false,

			lastAction: null,

			toolbarIsHidden: false
		}
	},

	created () {
		this.initialize();
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

		initialize () {

			this.selection  = new Selection;
			this.collection = this.app.api.collection(`/people/${this.app.user.id}/threads/${this.$route.params.folder}`);

			// this.collection.onUpdate((record, modifications) => {
			// 	for (var i in this.threads) {
			// 		if (this.threads[i].id == record.id) {
			// 			this.threads[i] = Object.assign(this.threads[i], modifications);
			// 			break;
			// 		}
			// 	}
			// });

			this.fetch();
		},

		refresh () {
			this.collection.refresh({
				type: this.$route.query.type || null,
				page: 1,
				q:    null
			})
			.then((threads) => {
				this.threads = threads;
			});
		},

		fetch (page) {

			this.isLoading = true;

			this.collection.fetch({
				type: this.$route.query.type || null,
				page: page == undefined ? 1 : page,
				q:    this.search == undefined ? null : this.search
			})
			.then((results) => {

				this.hasNextPage = results.length >= 20;

				if (page > 1) {
					this.threads = this.threads.concat(results);
				} else {
					this.threads = results;
				}

				// get type from first result
				if (this.threads.length) {
					this.type = this.threads[0].type;
				}

				this.isLoading = false;

			});
		},

		select (query) {

			this.selection.clear();

			if (query == "none") {
				return;
			}

			this.threads.forEach((thread) => {
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
		},

		/* Move selected messages between folders */
		moveTo (targetFolder, isUndoable) {

			var selection = this.selection.elements;

			if (!selection.length) {
				return;
			}

			if (isUndoable != false) {

				this.lastAction = {
					target:    targetFolder,
					selection: selection
				};

				/* Delete the last action in 5 seconds */
				setTimeout(() => {
					this.lastAction = null;
				}, 5000);
			}

			/* Modify local threads */
			for (var i = 0; i < selection.length; i++) {
				var index = this.findThreadIndex(selection[i]);
				if (index < 0) {
					return;
				}

				if (targetFolder == "read" || targetFolder == "unread") {
					this.threads[0].stub.readDate = targetFolder == "read" ? new Date() : null;
				} else {
					this.threads.splice(index, 1);
				}
			}

			var targetFolderUrl = `/people/${this.app.user.id}/threads/${targetFolder}`;
			return this.app.api.post(targetFolderUrl, selection).then(this.refresh);
		},


		findThreadIndex (threadId) {
			for (var i = 0; i < this.threads.length; i++) {
				if (this.threads[i].id == threadId) {
					return i;
				}
			}
			return -1;
		},

		/* Uno last action*/
		undo () {

			if (!this.lastAction) {
				return;
			}

			var opposingFolder;

			switch (this.lastAction.target) {
				case "read":
					opposingFolder = "unread";
				break;

				case "unread":
					opposingFolder = "read";
				break;

				default:
					opposingFolder = this.$route.params.folder;
				break;			
			}

			this.moveTo(this.lastAction.selection, opposingFolder, false);
			this.lastAction = null;
		},

        redact (action) {

            var plural    = action.selection.length > 1;
            var redaction = action.selection.length + ' ';

            switch (action.target) {
                case 'inbox':
                    redaction = redaction + (plural ? this.type.plural + ' restaurados' : this.type.singular + ' restaurado');
                break;

                case 'archive':
                    redaction = redaction + (plural ? this.type.plural + ' archivados' : this.type.singular + ' archivado');
                break;

                case 'trash':
                    redaction = redaction + (plural ? this.type.plural + ' eliminados' : this.type.singular + ' eliminado');
                break;

                case 'read':
                    redaction = redaction + (plural ? 'marcados como leidos' : 'marcado como leído');
                break;

                case 'unread':
                    redaction = redaction + (plural ? 'marcados como no leidos' : 'marcado como no leído');
                break;
            }

            return redaction;
        }	



	}

}

class Selection {
	constructor () {
		this.elements = [];
	}

	get length () {
		return this.elements.length;
	}

	clear () {
		this.elements = [];
	}

	has (element) {
		return this.elements.indexOf(element) != -1;
	}

	add (element) {
		this.elements.push(element);
	}

	remove (element) {
		this.elements.splice(this.elements.indexOf(element), 1);
	}

	toggle (element) {
		this.has(element) ? this.remove(element) : this.add(element);
	}
}
</script>

<style scoped lang="sass">

.phi-toast {

	position: fixed;
	bottom: 16px;
	left: 16px;

	align-items: center;

	height: 64px;
	min-width: 128px;

	border-radius: 6px;
	background-color: #333;

	color: #fff;

	p, a {
		display: block;
		padding: 12px 24px;
		font-weight: 400;
	}

	p {
		flex: 1;
	}


	transition: transform 180ms ease-in-out;
	transform: translate3d(0, 200%, 0);

	&.shown {
		transform: translate3d(0, 0, 0);
	}

}

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
