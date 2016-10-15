<template>
    <div class="phi-block-files">
        <template v-if="action == 'edit' && fullUrl">
            <dropzone :url="fullUrl" @success="success(arguments[0], arguments[1])"></dropzone>
        </template>

        <a v-for="file in files" class="phi-media" :href="file.url" target="_blank" rel="noopener">
            <div class="phi-media-figure">
                <img v-if="file.thumbnail" :src="file.thumbnail" :alt="file.title">
                <audio v-if="file.mimetype == 'audio/x-m4a'" controls preload="none">
                    <source :src="file.url" type="audio/mp4" />
                    <!--<p>Your browser does not support HTML5 audio.</p>-->
                </audio>
                <p>{{ file.size | bytes}}</p>
            </div>
            <div class="phi-media-body">
                <h1 v-text="file.title"></h1>
                <span v-text="file.name"></span>
            </div>
        </a>
    </div>
</template>

<script>
import app from '../../../store/app.js';

export default {
    name: "phi-block-files",
    props: ["post", "block", "action"],

    'phi-actions': {
        default: {
            title: "ver archivos"
        },

        edit: {
            title: "modificar archivos"
        }
    },

    data () {
        return {
			files:   [],
			fullUrl: null
        }
    },

    methods: {

		/* The response from the API is an array of uploaded files */
		success (file, response) {
			this.files = response.concat(this.files);
		},

        reload () {
			app.api.get(this.block.url)
				.then(files => this.files = files);
        }
    },

    created () {
        if (!this.block.url) {
            var random     = Math.floor((Math.random() * 100000) + 1);
            this.block.url = `posts/${this.post.id}/resources/files/block-` + random;
            this.$emit("change");
        }

        this.fullUrl = app.api.host + "/" + this.block.url;

        this.reload();
    }
}
</script>

<style scoped lang="sass">
.phi-block-files {
    .phi-media-figure {
        white-space: nowrap;
        width: 80px;

        p {
            margin: 0;
            padding-top: 5px;
            text-align: center;
            font-size: 0.8em;
            font-weight: 300;
        }
    }
}
</style>