<template>
    <div class="phi-block-html">
        <template v-if="!action">
            <div v-html="body"></div>
        </template>

        <template v-if="action == 'edit'">
            <quill v-model="body"></quill>
        </template>
    </div>
</template>

<script>
import app from '../../../store/app.js';
import Quill from 'quill';

export default {

    name: "phi-block-html",
    props: ["block", "action"],

    data () {
        return {
            body: null
        }
    },

    mounted () {
        this.reload();
    },

    methods: {
        reload () {
            app.api.get(this.block.url)
                .then((response) => {
                    this.body = response.body;
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