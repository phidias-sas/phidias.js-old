/* Fastclick:  removes the 300ms tap delay on mobile devices */
import Fastclick from 'fastclick';
Fastclick.attach(document.body);

/* Configure moment.js locale */
import moment from 'moment';
moment.locale("es");

/* Vue :) */
import Vue from 'vue'
import VueRouter from 'vue-router'

/* Import filters */
import './filters/filters.js';

/* Import custom vue components */
import Quill from './components/Quill.vue';
import Dropzone from './components/Dropzone/Dropzone.vue';

import PhiDrawer from './components/Phi/Drawer.vue';
import PhiInput from './components/Phi/Input.vue';
import PhiBlock from './components/Phi/Block.vue';
import PhiPostEditor from './components/Phi/Post/Editor.vue';
import PhiPersonPicker from './components/Phi/Person/Picker.vue';
import PhiPersonInscriptions from './components/Phi/Person/Inscriptions.vue';
import PhiTypePicker from './components/Phi/Type/Picker.vue';
import PhiRolePicker from './components/Phi/Role/Picker.vue';

Vue.component("quill", Quill);
Vue.component("dropzone", Dropzone);
Vue.component("phi-drawer", PhiDrawer);
Vue.component("phi-input", PhiInput);
Vue.component("phi-block", PhiBlock);
Vue.component("phi-post-editor", PhiPostEditor);
Vue.component("phi-person-picker", PhiPersonPicker);
Vue.component("phi-person-inscriptions", PhiPersonInscriptions);
Vue.component("phi-type-picker", PhiTypePicker);
Vue.component("phi-role-picker", PhiRolePicker);

/* Set up routes */
import Code from './states/Code.vue'
import Login from './states/Login.vue'

import Deck from './states/Deck.vue'
import Dashboard from './states/Dashboard.vue'
import Folder from './states/thread/Folder.vue'
import Read from './states/thread/Read.vue'

import NodeContainer from './states/Node/Container.vue'
import NodeDashboard from './states/Node/Dashboard.vue'
import NodePosts from './states/Node/Posts.vue'
import NodeCompose from './states/Node/Compose.vue'

import NodePeople from './states/Node/People.vue'
import NodeNodes from './states/Node/Nodes.vue'
import NodeImport from './states/Node/Import.vue'

import Root from './states/Root.vue'
import People from './states/People.vue'
import Person from './states/Person.vue'

Vue.use(VueRouter);

const router = new VueRouter({
	routes: [
		{ path: '/', redirect: '/dashboard' },

		{ path: '/code',  component: Code, name: 'code', meta: {isPublic: true} },
		{ path: '/login', component: Login, name: 'login', meta: {isPublic: true} },

		{ path: '/deck',  component: Deck,
			children: [
				{ path: '/dashboard', component: Dashboard, meta: {order: 1} },
				{ path: '/folder/:folder', component: Folder, meta: {order: 2}, name: 'folder' },
				{ path: '/read/:threadId', component: Read, meta: {order: 99}, name: 'read' },
				{ path: '/people',   component: People,   meta: {order: 10}, name: 'people' },
				{ path: '/person/:personId', component: Person, meta: {order: 11}, name: 'person' },
				{ path: '/root',   component: Root,   meta: {order: 12}, name: 'root' },

				{ path: '/nodes/:nodeId', component: NodeContainer, meta: {order: 13},
					children: [
						{ path: '', component: NodeDashboard, meta: {order: 14}, name: 'node' },
						{ path: 'posts/:type', component: NodePosts, meta: {order: 15}, name: 'node-posts' },
						{ path: 'people', component: NodePeople, meta: {order: 16}, name: 'node-people' },
						{ path: 'nodes',  component: NodeNodes, meta: {order: 17}, name: 'node-nodes' },
						{ path: 'import', component: NodeImport, meta: {order: 18}, name: 'node-import' }
					]
				},

				{ path: '/nodes/:nodeId/posts/compose/:postId', component: NodeCompose, meta: {order: 20}, name: 'node-compose' }

			]
		},

	]
});

/*
Navigation guards:
redirect to /code if app is not initialized,
redirect to /login if user is not authenticated
*/
import app from './store/app.js';

router.beforeEach((to, from, next) => {

	if (to.name != 'code' && !app.isLoaded) {
		next({name: 'code'});
		return;
	}

	if (!to.meta.isPublic && !app.isAuthenticated) {
		next({name: 'login'});
		return;
	}

	next();
});

/* Initialize the app (via the Index component) */
import Index from './states/Index.vue'

new Vue({
	el: '#app',
	render: h => h(Index),
	router
});

/* serviceWoker registration */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}