import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter);

import App from './App.vue'

import Inbox from './tests/inbox.vue'

//////////

// 1. Define route components.
// These can be imported from other files
import Foo from './tests/foo.vue'
import Bar from './tests/bar.vue'
// const Foo = { template: '<div>foo</div>' }
// const Bar = { template: '<div>bar</div>' }

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/', redirect: '/foo' },
  { path: '/foo', component: Foo, meta: {order: 1} },
  { path: '/bar', component: Bar, meta: {order: 2} },
  { path: '/inbox', component: Inbox, meta: {order: 3} }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for routes: routes
})

new Vue({
  el: '#app',
  render: h => h(App),
  router
})