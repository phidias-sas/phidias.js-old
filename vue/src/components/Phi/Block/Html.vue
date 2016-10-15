<template>
    <div class="phi-block-html">
        <template v-if="!action">
            <div v-html="body"></div>
        </template>

        <template v-if="action == 'edit'">
            <quill v-model="body" @input="save()"></quill>
        </template>

        <template v-if="action == 'delete'">
            <h1>Eliminar este texto ?</h1>
            <button class="phi-button danger" @click="destroy()">Eliminar</button>
            <button class="phi-button cancel" @click="$emit('reset')">Cancelar</button>
        </template>
    </div>
</template>

<script>
import Quill from 'quill';
import app from '../../../store/app.js';

export default {
    name: "phi-block-html",
    props: ["block", "action"],

    'phi-actions': {
        default: {
            title: "ver HTML"
        },
        edit: {
            title: "editar HTML"
        },
        delete: {
            title: "eliminar"
        }
    },

    data () {
        return {
            body: null,
            timer: null
        }
    },

    created () {
        if (!this.block.url) {
            app.api.post("/media/html")
                .then(html => {
                    this.block.url = "media/html/" + html.id;
                    this.$emit("change");
                });
        } else {
            this.reload();
        }
    },

    methods: {
        reload () {
            app.api.get(this.block.url)
                .then((response) => {
                    this.body = response.body;
                });
        },

        destroy () {
            app.api.delete(this.block.url);
            this.$emit("destroy"); // don't wait for api response. just destroy the block
        },

        save () {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                app.api.put(this.block.url, {body: this.body});
            }, 500);
        }
    }
}
</script>