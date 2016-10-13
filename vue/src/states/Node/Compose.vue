<template>
    <div class="phi-page" id="compose">
		<div class="phi-page-toolbar">
			<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
            <h1>Publicar</h1>
		</div>
        <div class="phi-page-cover">
            <phi-input label="Título" v-model="post.title"></phi-input>
        </div>
        <div class="phi-page-contents">
            <textarea v-model="post.description"></textarea>
            <phi-post-editor></phi-post-editor>
        </div>
    </div>
</template>

<script>
export default {

    data () {
        return {
            post: {
                title: null,
                description: null
            }
        }
    },

    mounted () {
        this.$el.querySelector("input").focus();
    }
}
</script>

<style lang="sass">

#compose {

    .phi-page-toolbar {
        color: #fff;
    }

    .phi-page-cover {
        background-color: #1C89B8;

        .phi-input {
            margin: 18px 0;
            font-size: 1.8em;
            font-weight: 300;

            display: block;
            width: 100%;
            max-width: 768px;
            color: #fff;

            /* Highlight colors (label and underline) */
            &::after {
                border-color: rgba(255, 255, 255, 0.3);
            }
            &._dirty label,
            &._focused label {
                color: #fff;
            }
        }

    }

    textarea {
        display: block;

        width: 100%;
        max-width: 768px;
        min-height: 130px;

        font-size: 1.2em;
        font-weight: 300;
    }
}

</style>