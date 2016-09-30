document.addEventListener("DOMContentLoaded", function(event) {

    var app = new Vue({

        el: '#app',

        data: {
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
        },

        created: function () {
            this.api   = new Phidias.Client("https://phidias.api.phidias.co");
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

    });

});