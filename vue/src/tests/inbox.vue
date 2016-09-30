<template>

    <div id="inbox">

        <h1 v-text="api.isAuthenticated ? api.token.data.firstName : 'login'">Testing</h1>

        <form v-if="!api.isAuthenticated">
            <input type="text" v-model="username" />
            <input type="password" v-model="password" />
            <button type="button" @click="authenticate()"> Enter </button>
        </form>

        <div v-if="api.isAuthenticated">

            <button @click="fetch()"> Fetch </button>
            <button @click="clear()"> Clear </button>
            <button @click="api.logout()"> Logout </button>

            <hr>

            <div style="display:flex">

                <div style="width: 500px; padding: 16px">

                    <div style="display: flex">
                        <input style="flex: 1; height: 100%" type="text" v-model="search" class="search" />
                        <button type="button" @click="fetch()" style="margin-left: 12px">search</button>
                    </div>

                    <ul class="threads">
                        <li v-for="thread in threads" @click="read(thread)" :class="{active: !!current && current.id == thread.id, thread: true}">
                            {{ thread.id }}
                            {{ thread.title }}
                            <small v-text="thread._state"></small>
                        </li>
                    </ul>
                    <button v-if="hasNextPage" @click="fetch(++page)"> Next page! </button>
                </div>

                <div style="flex:1; padding: 0 12px">
                    <h1 v-text="current ? current.title : '...'">...</h1>
                    <div>{{ current }}</div>
                </div>

            </div>

        </div>

    </div>
</template>

<script>
import Client from '../phidias/client.js'

export default {

    data () {
        return {
            message: 'loading',

            api: null,
            inbox: null,
            threads: [],

            page: 1,
            search: null,
            hasNextPage: false,

            current: null,

            username: null,
            password: null
        }
    },

    created: function () {
        this.api   = new Client("https://phidias.api.phidias.co");
        this.inbox = null;

        this.initialize();
    },

    methods: {

        initialize: function() {

            if (!this.api.isAuthenticated) {
                return;
            }

            var _this = this;

            this.inbox = this.api.collection("/people/" + this.api.token.data.id + "/threads/inbox");

            this.inbox.onUpdate(function(record, modifications) {
                for (var i in _this.threads) {
                    if (_this.threads[i].id == record.id) {
                        _this.threads[i] = Object.assign(_this.threads[i], modifications);
                        break;
                    }
                }
            });

            this.fetch();
        },

        authenticate: function() {
            var _this = this;
            this.api.authenticate(this.username, this.password)
                .then(this.initialize)
                .catch(function(response) {
                    console.log("ERROR", response);
                });
        },

        clear: function () {
            var _this = this;
            this.inbox.clear()
                .then(function() {
                    _this.threads = [];
                });
        },

        read: function(thread) {
            var _this = this;
            this.inbox.get(thread.id)
                .then(function(result) {
                    _this.current = result;
                });
        },

        fetch: function (page) {

            var _this = this;

            var params = {
                page: page == undefined ? 1 : page,
                q:    this.search == undefined ? null : this.search
            };

            this.inbox.fetch(params)
                .then(function(results) {

                    _this.hasNextPage = results.length >= 20;

                    if (page > 1) {
                        _this.threads = _this.threads.concat(results);
                    } else {
                        _this.threads = results;
                    }

                    // Now let's fetch the first one:
                    if (!_this.current) {
                        _this.read(_this.threads[0]);
                    }

                });
        }

    }

}



</script>


<style scoped>
.threads {
    list-style: none;
    margin: 0;
    padding: 0;
}

.thread {
    cursor: pointer;

    display: block;
    padding: 8px;
}

.thread:hover {
    background: #f1f1f1;
}

.thread.active {
    background: #ff8;
}

input.search {
    width: 100%;
    margin-bottom: 12px;
}
</style>
