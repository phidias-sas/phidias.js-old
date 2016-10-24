<template>
    <div class="phi-block-youtube">

        <section class="default" v-if="!action">
            <iframe v-if="video.id" width="100%" height="420" :src="'https://www.youtube.com/embed/' + video.id" frameborder="0" allowfullscreen></iframe>
        </section>

        <section class="edit" v-if="action == 'edit'">
            <phi-input label="URL de youtube" v-model="block.url"></phi-input>
            <div class="warning" v-show="block.url && !video.id">Esa no parece una URL válida de youtube</div>
            <img v-if="video.id" :src="'https://img.youtube.com/vi/' + video.id + '/0.jpg'" />

            <footer>
                <button class="phi-button" @click="save()" :disabled="!block.url || !video.id">Aceptar</button>
                <button class="phi-button cancel" @click="cancel()">Cancelar</button>
            </footer>
        </section>

        <section class="delete" v-if="action == 'delete'">
            <h1>Eliminar este video ?</h1>
            <button class="phi-button danger" @click="$emit('destroy')">Eliminar</button>
            <button class="phi-button cancel" @click="$emit('reset')">Cancelar</button>
        </section>

        <!--<template v-if="action == 'info'">
            <strong>thumbnail</strong>
            <img v-if="video.id" :src="'https://img.youtube.com/vi/' + video.id + '/0.jpg'" />
        </template>-->

    </div>
</template>

<script>
export default {

    name: "phi-block-youtube",
    props: ["block", "action"],

    'phi-actions': {
        default: {
            title: "ver video (iframe)"
        },
        edit: {
            title: "editar video"
        },
        delete: {
            title: "eliminar"
        }
    },

    data () {
        return {
            initialUrl: null
        }
    },

    mounted () {
        this.initialUrl = this.block.url;
    },

    methods: {
        save () {
            this.$emit('change');
            this.$emit('reset');
        },

        cancel () {
            this.block.url = this.initialUrl;
            if (!this.block.url) {
                this.$emit("destroy");
            } else {
                this.$emit("reset");
            }
        }
    },

    computed: {
        video: function () {

            var url = this.block.url;
            if (!url || !url.trim().length) {
                return {};
            }

            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match  = url.match(regExp);

            if (match && match[2].length == 11) {
                return {id: match[2]};
            } else {
                return {};
            }
        }
    }
}
</script>

<style scoped lang="sass">

section.edit {

    text-align: center;

    .phi-input {
        display: block;
        margin-top: 24px;
    }

    img {
        margin-top: 24px;
    }

    .warning {
        font-size: 0.9em;
        color: #d9534f;
        text-align: left;
    }

    footer {
        margin-top: 24px;
    }


}

</style>