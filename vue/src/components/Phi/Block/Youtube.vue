<template>
    <div class="phi-block-youtube">

        <template v-if="!action">
            <iframe v-if="video.id" width="100%" height="420" :src="'https://www.youtube.com/embed/' + video.id" frameborder="0" allowfullscreen></iframe>
        </template>

        <template v-if="action == 'edit'">
            <input type="text" v-model="block.url" style="width: 100%" />
            <div v-show="!video.id">Esa no es una URL de youtube válida</div>
            <iframe v-if="video.id" width="100%" height="420" :src="'https://www.youtube.com/embed/' + video.id" frameborder="0" allowfullscreen></iframe>
        </template>

        <template v-if="action == 'info'">
            <strong>thumbnail</strong>
            <img v-if="video.id" :src="'https://img.youtube.com/vi/' + video.id + '/0.jpg'" />
        </template>

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

        info: {
            title: "descripcion"
        }
    },

    computed: {
        video: function () {

            var url = this.block.url;

            if (!url.trim().length) {
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