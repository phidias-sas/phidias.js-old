export default class Push {

	subscribe () {
		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
				.then(function(subscription) {
					console.log("subscription OK", subscription);
					// TODO: Send the subscription subscription.endpoint
					// to your server and save it to send a push message
					// at a later date
					// return sendSubscriptionToServer(subscription);
				})
				.catch(function(e) {
					console.log("subscription Error", e);
					if (Notification.permission === 'denied') {
						// The user denied the notification permission which
						// means we failed to subscribe and the user will need
						// to manually change the notification permission to
						// subscribe to push messages
						console.log('Permission for Notifications was denied');
					} else {
						// A problem occurred with the subscription, this can
						// often be down to an issue or lack of the gcm_sender_id
						// and / or gcm_user_visible_only
						console.log('Unable to subscribe to push.', e);
					}
				});
		});
	}

	unsubscribe () {
		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			// To unsubscribe from push messaging, you need get the
			// subcription object, which you can call unsubscribe() on.
			serviceWorkerRegistration.pushManager.getSubscription()
				.then(
					function(pushSubscription) {
						// Check we have a subscription to unsubscribe
						if (!pushSubscription) {
							// No subscription object
							return;
						}

						// TODO: Make a request to your server to remove
						// the users data from your data store so you
						// don't attempt to send them push messages anymore

						// We have a subcription, so call unsubscribe on it
						pushSubscription.unsubscribe().then(function() {
							// Successful unsubscription
						}).catch(function(e) {
							// We failed to unsubscribe, this can lead to
							// an unusual state, so may be best to remove
							// the subscription id from your data store and
							// inform the user that you disabled push
							console.log('unsubscription error: ', e);
						});
					})
				.catch(function(e) {
					window.Demo.debug.log('Error thrown while unsubscribing from ' + 'push messaging.', e);
				});
		});
	}

}