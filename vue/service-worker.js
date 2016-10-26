'use strict';
importScripts("./service-worker/dexie.min.js");

var db = null;

function getDb() {
	if (db == null) {
		db = new Dexie("service-worker-data");
		db.version(1).stores({settings: "name"});
	}
	return db;
}

self.addEventListener('push', function(event) {

	getDb().settings
		.get("app")
		.then(result => {
			var app = result.value;

			fetch(app.endpoint + '/post/notification/unread?destination=' + app.subscriptionId, {
				headers: {"Authorization": "Bearer " + app.authentication}
			})
			.then(response => response.ok ? response.json() : [])
			.then(stubs => {
				if (!stubs || !stubs.length) {
					return;
				}

				var stub = stubs[stubs.length - 1];  // !! only show the last one

				if (stub.post.author.id == app.userId) {
					// return;
				}


				/*
				Broadcast the event to all clients and show a notification if none of the clients is reading the thread
				i.e. thread id is not on the url
				*/
				clients.matchAll({
					type: 'window'
				}).then(clientList => {

					var displayNotification = true;

					clientList.map(client => {
						client.postMessage(stub); // see https://ponyfoo.com/articles/serviceworker-messagechannel-postmessage#broadcasting-from-a-serviceworker-to-every-client
						if (client.url.indexOf(stub.post.thread) >= 0) {
							displayNotification = false;
						}
					});

					if (displayNotification) {
						var title = stub.post.title;
						var body  = stub.post.description;
						var icon  = stub.post.author.avatar ? stub.post.author.avatar : '/icons/drawable-xxxhdpi-icon.png';
						var tag   = "thread-" + stub.post.thread;

						self.registration.showNotification(title, {
							body: body,
							icon: icon,
							tag:  tag,
							data: stub.post
						});
					}
				});

			});

		});

});

self.addEventListener('notificationclick', function(event) {
	// Android doesn’t close the notification when you click on it
	// See: http://crbug.com/463146
	event.notification.close();

	event.waitUntil(clients.matchAll({
		type: 'window'
	}).then(function(clientList) {
		if (!clientList.length) {
			return clients.openWindow ? clients.openWindow('/#/read/' + event.notification.data.thread) : null;
		}

		/* Redirect all clients to the thread */
		clientList.map(client => {
			client.navigate('/#/read/' + event.notification.data.thread);
		});

		/* Focus the last one */
		clientList[clientList.length - 1].focus();
	}));
});