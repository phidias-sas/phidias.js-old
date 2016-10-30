<template>
    <div class="phi-post-editor">

		<div class="phi-post-editor-blocks">

			<div v-for="editable in editables" :data-id="editable.block.id">
				<div v-if="!editable.deleted" class="editable-block">

					<div class="phi-block-toolbar phi-media">
						<div class="phi-media-body sortable-handle"></div>
						<div class="phi-media-right">
							<div class="phi-tooltip" :class="{open: editable.menuIsOpen}">
								<button
									@focus="editable.menuIsOpen = true"
									@blur="editable.menuIsOpen = false"
									@click="editable.menuIsOpen = true"
									>
										<i class="fa fa-ellipsis-v"></i>
								</button>

								<ul class="phi-menu _texture-paper">
									<li v-for="(action, actionName) in editable.actions"
										v-text="action.title"
										@mousedown="editable.setAction(actionName); editable.menuIsOpen = false"
										@touchstart="editable.setAction(actionName); editable.menuIsOpen = false"
										>
										<!-- must be mousedown because click will cause the tooltip to lose focus and hide beforehand -->
									</li>
								</ul>
							</div>
						</div>
					</div>

					<phi-block
						:post="post"
						:block="editable.block"
						:action="editable.currentAction"
						@change="editable.save(arguments[0])"
						@destroy="editable.destroy()"
						@reset="editable.setAction()"
						>
					</phi-block>
				</div>
			</div>

		</div>

		<div class="phi-post-editor-adder phi-card">
			<div class="type-list" v-show="false" @click="toggleAdder()">
				<div v-for="(typedata, typename) in types" class="phi-media" :class="'type-'+typename" @click="createBlock(typename)">
					<i class="phi-media-figure fa" :class="typedata.icon"></i>
					<p class="phi-media-body" v-text="typedata.title"></p>
				</div>
			</div>

			<div class="toggler phi-media" @click="toggleAdder()">
				<i class="phi-media-figure fa fa-plus"></i>
				<p class="phi-media-body">adjuntar</p>
			</div>
		</div>

    </div>
</template>

<script>
import Sortable from 'sortablejs';
import Velocity from 'velocity-animate';
import Block from '../Block.vue';
import app from '../../../store/app.js';


export default {

	name: "phi-post-editor",

	props: {
		post: {
			type: Object,
			required: true
		}
	},

	data () {
		return {
			editables: [],

			types: {
				html: {
					title: "Texto HTML",
					icon: "fa-font"
				},
				youtube: {
					title: "Youtube",
					icon: "fa-youtube-play"
				},
				files: {
					title: "Archivos",
					icon: "fa-files-o"
				},
				form: {
					title: "Formulario",
					icon: "fa-pencil-square-o"
				}
			}
		}
	},

	methods: {

		toEditable (block, initialAction) {
			var vm = this;
			return {
				block,
				actions: Block.getActions(block.type),
				currentAction: initialAction,
				deleted: false,
				menuIsOpen: false,

				setAction (actionName) {
					this.currentAction = actionName == 'default' ? null : actionName;
				},

				save () {
					var blocksUrl = "/posts/" + vm.post.id + "/blocks";
					if (this.block.id) {
						app.api.put(blocksUrl + "/" + this.block.id, this.block);
					} else {
						app.api.post(blocksUrl, this.block).then(createdBlock => this.block.id = createdBlock.id);
					}
					vm.change();
				},

				destroy () {
					this.deleted = true;
					vm.post.blocks.splice(vm.post.blocks.indexOf(this.block), 1);
					if (this.block.id) {
						app.api.delete("/posts/" + vm.post.id + "/blocks/" + this.block.id);
						vm.change();
					}
				}
			};
		},

		createBlock (type) {
			var newBlock = {type, url: null, order: this.post.blocks.length + 1};
			this.post.blocks.push(newBlock);
			this.editables.push(this.toEditable(newBlock, "edit"));
		},

		toggleAdder () {
			var el        = this.$el.querySelector('.type-list');
			var isVisible = getComputedStyle(el).display != "none";

			if (isVisible) {
				Velocity(el, "slideUp", {
					duration: 280,
					easing: [.42, 0, 0.2, 1]
				});
			} else {
				Velocity(el, "slideDown", {
					duration: 840,
					easing: [500, 20]
				});
			}
		},

		change () {
			this.$emit("change");
			this.post.id && app.api.clear(`posts/${this.post.id}`);
		}
	},

	mounted () {
		var vm         = this;
		this.editables = this.post.blocks.map(block => this.toEditable(block));

		Sortable.create(this.$el.querySelector('.phi-post-editor-blocks'), {
			handle: '.sortable-handle',
			animation: 150,
			forceFallback: true, // it will not work otherwise.  This took me HOURS to discover :(
			onUpdate () {
				app.api.put("/posts/" + vm.post.id + "/blocks", this.toArray());
				vm.change();
			}
		});
	}
}

</script>

<style scoped lang="sass">

.sortable-ghost {
	opacity: 0;
}

.phi-post-editor-adder {
	.phi-media {
		align-items: center;
		cursor: pointer;
		padding: 8px 12px;

		&:hover {
			background: rgba(0, 0, 0, 0.1);
		}
	}

	.phi-media-figure {
		font-size: 1.4em;
		line-height: 1.7em;
		text-align: center;
	}
}

.type-list {
	.type-youtube .phi-media-figure {
		color: #e62117;
	}
}

.phi-post-editor {
	max-width: 768px;
}

.editable-block {

	margin-bottom: 24px;
	background: #fff;
	padding: 6px;

	.phi-block-toolbar {
		margin-bottom: 6px;
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
}

</style>