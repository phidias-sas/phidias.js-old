<template>
    <div class="phi-block-youtube">
        <input type="text" v-model="block.url" style="width: 100%" />
        <div v-show="!video.id">Esa no es una URL de youtube válida</div>
        <iframe v-if="video.id" width="100%" height="420" :src="'https://www.youtube.com/embed/' + video.id" frameborder="0" allowfullscreen></iframe>
    </div>
</template>

<script>
export default {

    name: "phi-block-youtube",
    props: ["block"],

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