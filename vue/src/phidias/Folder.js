export default class Folder {

    constructor (app, folder) {
        this.app        = app;
        this.folder     = folder;
        this.url        = this.getFolderUrl(folder);
        this.collection = app.api.collection(this.url);
    }

    get isLoading () {
        return this.collection.isLoading;
    }

    get threads () {
        return this.collection.items;
    }

    get (threadId) {
        return this.collection.get(threadId);
    }

    fetch (parameters) {
        return this.collection.fetch(parameters);
    }

    /* Selection must be an array of thread ids.  Target can be either inbox, archive, trash, read or unread */
    move (selection, target) {

        return this.app.api.post(this.getFolderUrl(target), selection)
            .then((response) => {
                if (target != "read" && target != "unread") {
                    this.removeItems(selection);
                }

                return {
                    selection,
                    target
                }
            });
    }

    removeItems (items) {
        for (var i = 0; i < items.length; i++) {
            var index = this.findThreadIndex(items[i]);
            if (index < 0) {
                return;
            }

            this.collection.items.splice(index, 1);
        }
    }

    findThreadIndex (threadId) {
        for (var i = 0; i < this.collection.items.length; i++) {
            if (this.collection.items[i].id == threadId) {
                return i;
            }
        }
        return -1;
    }

    undo (action) {
        var targetFolder = this.folder;

        if (action.target == "read") {
            targetFolder = "unread";
        } else if (action.target == "unread") {
            targetFolder = "read";
        }

        return this.move(action.selection, targetFolder);
    }

    getFolderUrl (folder) {
        return `/people/${this.app.user.id}/threads/${folder}`;
    }

    redact (action, type = {singular:'elemento', plural:'elementos', gender:1}) {
        var plural    = action.selection.length > 1;
        var redaction = action.selection.length + ' ';

        switch (action.target) {
            case 'inbox':
                redaction = redaction + (plural ? type.plural + ' restaurados' : type.singular + ' restaurado');
            break;

            case 'archive':
                redaction = redaction + (plural ? type.plural + ' archivados' : type.singular + ' archivado');
            break;

            case 'trash':
                redaction = redaction + (plural ? type.plural + ' eliminados' : type.singular + ' eliminado');
            break;

            case 'read':
                redaction = redaction + (plural ? 'marcados como leidos' : 'marcado como leído');
            break;

            case 'unread':
                redaction = redaction + (plural ? 'marcados como no leidos' : 'marcado como no leído');
            break;
        }

        return redaction;
    }    

}