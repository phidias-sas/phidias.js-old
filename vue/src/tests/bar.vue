<template>
    <div class="phi-page">

        <div class="phi-page-toolbar">
            <button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
        </div>

        <div class="phi-page-cover">
            <h1>This is Bar</h1>
        </div>

        <div class="phi-page-navigation">
            <router-link active-class="_active" to="/foo"><ons-ripple color="rgba(0, 0, 0, 0.1)"></ons-ripple>Foo</router-link>
            <router-link active-class="_active" to="/bar"><ons-ripple color="rgba(0, 0, 0, 0.1)"></ons-ripple>Bar</router-link>
            <router-link active-class="_active" to="/Inbox"><ons-ripple color="rgba(0, 0, 0, 0.1)"></ons-ripple>Inbox</router-link>
        </div>

        <div class="phi-page-contents">
            <h1 v-text="title">Bar</h1>
            <small v-text="type"></small>
            <hr>
            <button @click="type = 'foo'">foo</button>
            <button @click="type = 'inbox'">inbox</button>
            <button @click="type = 'bar'">bar</button>
            <hr>
            <component :is="type"></component>
            <hr>
            <h2>A block:</h2>
            <phi-block :block="block"></phi-block>
        </div>
    </div>
</template>

<script>
import Foo from './foo.vue';

export default {

    name: "Bar",

    data () {
        return {
            title: "Hello",
            type: null,

            block: {
                type: 'html',
                url: 'https://www.youtube.com/watch?v=DWtXwzQHV80'
            }
        }
    },

    components: { Foo, Bar:this }
}

</script>