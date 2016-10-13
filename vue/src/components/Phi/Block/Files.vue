<template>
    <div class="phi-block-files">
        <a v-for="file in files" class="phi-media" :href="file.url" target="_blank" rel="noopener">
            <div class="phi-media-figure">
                <img v-if="file.preview" :src="file.preview" :alt="file.title">
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
    props: ["block", "action"],

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
            files: []
        }
    },

    methods: {
        reload () {
            app.api.get(this.block.url)
                .then(files => this.files = files);
        }
    },

    mounted () {
        this.reload()
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