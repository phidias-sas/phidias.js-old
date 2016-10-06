import Dexie from 'dexie'
import Client from './client.js'

export default class Collection {

    constructor(client, url) {

        this.client = client;
        this.url    = url;
        this.db     = new Dexie("phidias.collection:" + url);

        this.db.version(1).stores({
            records: "id",
            origins: "++id, record, origin, timestamp"
        });

        this.listeners = {
            update: []
        };

        var _this = this;

        this.db.records.hook('updating', function (modifications, primKey, obj, transaction) {
            _this.listeners.update.forEach(function(callback) {
                callback(obj, modifications);
            });
        });
    }

    onUpdate(callback) {
        this.listeners.update.push(callback);
    }

    clear() {
        var _this = this;
        return _this.db.origins.clear().then(function() {
            _this.db.records.clear();
        });
    }

    delete() {
        return this.db.delete();
    }

    get(id) {

        var _this = this;

        // Look for record in local DB
        return this.db.records.get(id)
            .then(function(result) {

                if (!result || result._state == "partial") {  // Not found locally.  Fetch from API and store
                    return _this.client.get(_this.url + "/" + id)
                        .then(function(response) {

                            var record     = response.data;
                            record._iorder = result ? result._iorder : 0;

                            if (result) {
                                record = Object.assign(result, record);
                            }

                            _this.store(record, "get", true);
                            return record;
                        });
                }

                // Found.  Return record
                return result;
            });
    }

    fetch(parameters) {

        var _this = this;

        // first, we look in the database
        var originKey = this.constructor.toOriginKey(parameters);

        return this.db.origins.where("origin").equals(originKey).toArray(function(arr) {

            // found records for origin. Return all stored records
            if (arr.length) {
                return _this.db.records
                    .where("id").anyOf(arr.map(function(a) {return a.record}))
                    .sortBy("_iorder"); // sort by incoming order
            }

            // no records found.  fetch from API, store and return
            return _this.refresh(parameters);

        });
    }

    refresh(parameters) {

        var originKey = this.constructor.toOriginKey(parameters);

        return this.client.get(this.url, parameters)
            .then((response) => {

                var iorder = 0;  // incoming order (used for sorting)

                response.data.forEach((record) => {
                    record._iorder = iorder++;

                    if (!record.id) {
                        record.id = record._iorder;
                    }

                    this.store(record, originKey);
                });

                return response.data;
            });

    }

    store(record, originKey, isFinalForm) {

        record._state = isFinalForm ? "final" : "partial";

        this.db.records.put(record);

        this.db.origins.put({
            record:    record.id,
            origin:    originKey,
            timestamp: new Date()
        });

    }

    static toOriginKey(parameters) {
        return !parameters ? 'default' : Client.serialize(parameters);
    }

}