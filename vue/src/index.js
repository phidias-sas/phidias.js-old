/* Fastclick:  removes the 300ms tap delay on mobile devices */
import Fastclick from 'fastclick';
Fastclick.attach(document.body);

/* Configure moment.js locale */
import moment from 'moment';
moment.locale("es");

/* Vue :) */
import Vue from 'vue'
import VueRouter from 'vue-router'

/* Set up routes */
import Code from './states/Code.vue'
import Login from './states/Login.vue'

import Deck from './states/Deck.vue'
import Dashboard from './states/Dashboard.vue'
import Folder from './states/thread/Folder.vue'
import Read from './states/thread/Read.vue'

import Foo from './tests/foo.vue'
import Bar from './tests/bar.vue'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/foo' },

    { path: '/code',  component: Code },
    { path: '/login', component: Login },
    { path: '/deck',  component: Deck,
      children: [
        { path: '/dashboard', component: Dashboard, meta: {order: 1} },
        { path: '/folder/:folder', component: Folder, meta: {order: 2}, name: 'folder' },
        { path: '/read/:threadId', component: Read, meta: {order: 3}, name: 'read' },

        { path: '/foo',   component: Foo,   meta: {order: 8} },
        { path: '/bar',   component: Bar,   meta: {order: 9} }
      ]
    },

  ]
})


/* Global components */
import Input from './components/Phi/Input.vue';
Vue.component("phi-input", Input);

import Block from './components/Phi/Block.vue';
Vue.component("phi-block", Block);


/* Initialize the main app (via the App component) */
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App),
  router
})