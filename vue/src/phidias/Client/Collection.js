export default class Collection {

    constructor (client, url) {
        this.client    = client;
        this.url       = url;
        this.items     = [];
        this.listeners = {
            update: []
        };
    }

    get isLoading() {
        return this.client.isLoading;
    }

    onUpdate (callback) {
        this.listeners.update.push(callback);
    }

    get (id) {
        return this.client.get(this.url + "/" + id)
            .then((result) => this.add(result));
    }

    fetch (parameters) {
        return this.client.get(this.url, parameters)
            .then((items) => this.addItems(items));
    }

    add (incoming) {
        for (var i = 0; i < this.items.length; i++) {
            if (Collection.areEqual(incoming, this.items[i])) {
                this.items[i] = Collection.merge(this.items[i], incoming);
                return this.items[i];
            }
        }
        this.items.push(incoming);
        return incoming;        
    }

    addItems (items) {
        items.forEach((item) => this.add(item));
        return items;
    }

    static merge (targetObject, sourceObject) {
        // return Object.assign(targetObject, sourceObject);  // override all targetObject properties with sourceObject
        return Object.assign(sourceObject, targetObject); // keep all targetObject properties intact.  only add properties from sourceObject
    }

    static areEqual (item1, item2) {
        return Collection.getId(item1) == Collection.getId(item2);
    }

    static getId (item) {
        return item.id ? item.id : JSON.stringify(item);
    }

}