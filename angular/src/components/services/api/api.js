(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .provider('phiApi', phiApi);

    function phiApi() {

        var provider      = this;
        provider.host     = null;
        provider.setHost  = setProviderHost;

        provider.$get     = service;

        /////////////////////////////////////////////////////

        function setProviderHost(host) {
            provider.host = host;
        }

        service.$inject = ['$http', '$q', 'phiApiToken', 'phiStorage'];
        function service($http, $q, phiApiToken, phiStorage) {

            var service = {

                /* Service configuration */
                host:    provider.host,
                setHost: setHost,

                /* Authentication functions */
                tokenString:     null,
                token:           null, //decoded token payload
                setToken:        setToken,

                /* Main service functions */
                get:      get,
                post:     post,
                put:      put,
                patch:    patch,
                options:  options,
                remove:   deleteFn,  //alias, when phiApi.delete() causes a syntax error ('delete' is a reserved JS keyword)
                'delete': deleteFn,

                /* Cache handlers */
                cache: phiStorage.session,
                getCache: getCache,
                maxCacheTime: 30 // default cache lifetime in seconds
            }


            ////////// experimental cache
            var listeners = {};
            var filters   = {};

            service.cache = function(request) {

                request = angular.extend({
                    maxCacheTime: service.maxCacheTime
                }, request);

                var storage = phiStorage.session;

                function getCacheKey(request) {
                    // !!! in the meantime
                    var url = request.url.replace(service.host,'').replace(/[/?]+$/, "");
                    return "api-cache:" + url;
                };


                function runListeners(current, previous) {
                    var url = request.url.replace(service.host,'').replace(/[/?]+$/, "");

                    if (url.indexOf('threads/all') > 0) {
                        for (var property in listeners) {
                            listeners[property](current, previous);
                            return;
                        }
                    }
                };

                function runFilters(cacheContent) {

                    var url = request.url.replace(service.host,'').replace(/[/?]+$/, "");

                    if (!filters[url]) {
                        return cacheContent.payload;
                    }

                    var filter = filters[url];
                    cacheContent.payload = filter(cacheContent.payload, new Date(cacheContent.timestamp));
                    return cacheContent.payload;

                };

                var cache = {

                    get: function() {
                        var cacheContent = storage.get(getCacheKey(request));
                        if (cacheContent) {
                            var age = (new Date() - new Date(cacheContent.timestamp))/1000;
                            if (age < request.maxCacheTime) {
                                return runFilters(cacheContent);
                            }
                        }
                    },

                    store: function(payload) {

                        var key      = getCacheKey(request);
                        var previous = storage.get(key);

                        runListeners(payload, previous ? previous.payload : null);

                        storage.set(key, {
                            payload: payload,
                            timestamp: new Date()
                        });

                        return cache;
                    },

                    clear: function() {
                        storage.clear(getCacheKey(request));

                        return cache;
                    },

                    patch: function(payload) {
                        var key          = getCacheKey(request);
                        var cacheContent = storage.get(key);
                        if (cacheContent) {
                            payload = angular.extend(cacheContent.payload, payload);
                        }

                        cache.store(payload);
                        return payload;
                    },

                    fetch: function(defaultValue) {
                        var key          = getCacheKey(request);
                        var cacheContent = storage.get(key);

                        if (!cacheContent) {
                            return defaultValue;
                        }

                        if (defaultValue == undefined) {
                            defaultValue = {};
                        }

                        return angular.extend(defaultValue, cacheContent.payload);
                    },

                    watch: function(callback) {
                        listeners[request.url] = callback;

                        return cache;
                    },

                    filter: function(callback) {
                        filters[request.url] = callback;

                        return cache;
                    }
                };

                return cache;
            }


            ///////////////////////////////////




            return service;

            ///////

            function setHost(host) {
                service.host = host;
            }

            function setToken(tokenString) {
                if (tokenString) {
                    service.token           = phiApiToken.decode(tokenString);
                    service.tokenString     = tokenString;
                } else {
                    service.token           = null;
                    service.tokenString     = null;
                }
            }

            function get(resource, data, config) {
                return execute('get', resource, data, config);
            }

            function post(resource, data, config) {
                return execute('post', resource, data, config);
            }

            function put(resource, data, config) {
                return execute('put', resource, data, config);
            }

            function patch(resource, data, config) {
                return execute('patch', resource, data, config);
            }

            function options(resource, data, config) {
                return execute('options', resource, data, config);
            }

            function deleteFn(resource, data, config) {
                return execute('delete', resource, data, config);
            }

            function getCache(method, resource, data, config) {

                var request = {
                    url: service.host ? service.host + '/' + resource : resource
                };

                if (method == 'get') {
                    request.url += '?' + serialize(data);
                }

                var cacheKey = "phi-api:" + request.url;
                var cacheContents = service.cache.get(cacheKey);
                if (!cacheContents) {
                    return null;
                }

                cacheContents.key = cacheKey;
                return cacheContents;
            }

            function execute(method, resource, data, config) {

                var request = {
                    method: method,
                    url:    service.host ? service.host + '/' + resource : resource,
                    data:   data
                };

                if (service.tokenString) {
                    angular.extend(request, {
                        headers: {
                            Authorization: 'Bearer ' + service.tokenString
                        }
                    });
                }

                angular.extend(request, config);

                if (method == 'get') {

                    request.url += '?' + serialize(request.data);
                    request.data = null;

                    var resourceCache  = service.cache(request);
                    var cachedResponse = resourceCache.get();
                    if (cachedResponse) {
                        var deferred = $q.defer();
                        deferred.resolve(cachedResponse);
                        return deferred.promise;
                    }

                    return $http(request)
                        .then(function(response) {
                            resourceCache.store(response);
                            return response;
                        });

                }

                return $http(request);

            }


            function serialize(obj, prefix) {

                var str = [];
                for(var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        var k = prefix ? prefix + '[' + p + ']' : p;
                        var v = obj[p];

                        if (v == null) {
                            continue;
                        }

                        if (typeof v == 'object') {
                            str.push(serialize(v, k));
                        } else if (typeof v == 'number' || v.length > 0) {
                            str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
                        }

                    }
                }

                return str.join('&');
            }


        }

    }

})();