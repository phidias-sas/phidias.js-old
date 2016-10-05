<template>

	<div class="phi-page">
		<ons-progress-bar indeterminate v-show="isLoading"></ons-progress-bar>

		<div class="phi-page-toolbar">
			<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
			
			<h1 v-text="type.plural"></h1>

			<button class="phi-button selection-count" v-show="selection.length > 0">
				<span v-text="selection.length"></span>
				<i class="fa fa-archive"></i>
			</button>

			<div class="phi-tooltip">
				<button class="phi-button"> <i class="fa fa-ellipsis-v"></i></button>
				<ul class="phi-menu _texture-paper">
					<li>seleccionar</li>
					<li :disabled="!selection.length">archivar</li>
					<li :disabled="!selection.length">marcar leído</li>
					<li :disabled="!selection.length">marcar no leído</li>
					<li>actualizar</li>
				</ul>
			</div>
		</div>

		<div class="phi-page-contents">

			<div class="empty" v-show="!threads.length">
				<p>no hay nada aquí</p>
			</div>

			<div class="phi-card">

				<div class="thread phi-media" v-for="thread in threads" :class="{selected: isSelected(thread)}">
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
			isLoading: false
		}
	},

	created () {
		this.initialize();
	},

	methods: {

		initialize () {

			this.selection = new Selection;

			this.collection = this.app.api.collection(`/people/${this.app.user.id}/threads/${this.$route.params.folder}`);

			this.collection.onUpdate((record, modifications) => {
				for (var i in this.threads) {
					if (this.threads[i].id == record.id) {
						this.threads[i] = Object.assign(this.threads[i], modifications);
						break;
					}
				}
			});

			this.fetch();
		},

		clear () {
			this.collection.clear()
				.then(() => {
					this.threads = [];
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


		isSelected (thread) {
			return this.selection.has(thread.id);
		},

		toggle (thread) {
			this.selection.toggle(thread.id);
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
