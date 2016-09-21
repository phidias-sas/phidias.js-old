var Phidias = Phidias || {};

Phidias.Client = class {

    constructor(host) {
        this.host = host;
        this.token = {
            string: null,
            data:   null
        };
    }

    execute(method, url, data, config) {

        method = method.toUpperCase();

        if (config == undefined) {
            config = {};
        }

        if (method == "GET" && data != undefined) {
            url  += "?" + this.constructor.serialize(data);
            data = null;
        }

        var xhr = new XMLHttpRequest;
        xhr.open(method, this.host + "/" + url);

        // Set default headers
        xhr.setRequestHeader("Content-Type", "application/json");

        // Overwrite with incoming headers
        if (config.headers != undefined) {
            for (var headerName in config.headers) {
                xhr.setRequestHeader(headerName, config.headers[headerName]);
            }
        }

        return new Promise(function(resolve, reject) {

            xhr.onload = function() {
                if (xhr.status == 200) {
                    resolve({
                        data: JSON.parse(xhr.response),
                        xhr: xhr
                    });
                } else {
                    reject({
                        data: Error(xhr.statusText),
                        xhr: xhr
                    });
                }
            };

            // Handle network errors
            xhr.onerror = function(progressEvent) {
                reject(Error("Network Error"));
            };

            // Execute the request
            xhr.send(JSON.stringify(data));

        });

    }

    get(url, data, config) {
        return this.execute("GET", url, data, config);
    }

    post(url, data, config) {
        return this.execute("POST", url, data, config);
    }

    put(url, data, config) {
        return this.execute("PUT", url, data, config);
    }

    delete(url, data, config) {
        return this.execute("DELETE", url, data, config);
    }

    patch(url, data, config) {
        return this.execute("PATCH", url, data, config);
    }

    options(url, data, config) {
        return this.execute("OPTIONS", url, data, config);
    }


    /* Client credentials authentication with OAuth */
    setToken(string) {
        this.token = {
            string: string,
            data: Phidias.Jwt.decode(string)
        };

        return this.token.data;
    }

    authenticate(username, password, url) {
        var _this = this;

        if (url == undefined) {
            url = "oauth/token";
        }

        return this.post(url, {grant_type: "client_credentials"}, {
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            }
        }).then(function(response) {
            return _this.setToken(response.data.access_token);
        });

    }

    logout() {
        this.token = {
            string: null,
            data: null
        };
    }

    static serialize(obj, prefix) {
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


};
