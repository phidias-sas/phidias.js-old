<template>
    <div class="phi-block-html">
        <h2>Bloque de HTML :)</h2>

        <div id="editor"></div>
        <div v-html="body"></div>
        <pre v-text="body"></pre>

        <input type="text" v-model="block.url" style="width: 100%" />
        <pre>{{ block }}</pre>
    </div>
</template>

<script>
import Client from '../../../phidias/client.js'
import Quill from 'quill'

export default {

    name: "phi-block-html",
    props: ["block"],

    data () {
        return {
            initial: "<h1>Hello world</h1>",
            body: null,
            editor: null
        }
    },

    mounted () {

        this.editor = new Quill(this.$el.querySelector("#editor"), {
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'code-block']
                ]
            },
            placeholder: 'Compose an epic...',
            theme: 'snow' // 'snow' or 'bubble'
        });

        this.editor.container.firstChild.innerHTML = this.initial;
        this.body = this.editor.container.firstChild.innerHTML;

        this.editor.on('text-change', (delta, oldDelta, source) => {
            if (source == 'api') {
                // console.log("An API call triggered this change.");
            } else if (source == 'user') {
                // console.log("A user action triggered this change.");
                this.body = this.editor.container.firstChild.innerHTML;
            }
        });

    },

    methods: {
        reload () {

            console.log("reloading", this);

            var _this = this;
            this.body = "loading";

            new Client(this.block.url)
                .get("&")
                .then(function(response) {
                    _this.body = response.body;
                }, function(error) {
                    _this.body = "Error";
                });
        }
    },

    watch: {
        block: {
            deep: true,
            handler () {
                this.reload();
            }
        }
    }
}
</script>