import Client from './client.js';
import JWT from './jwt.js';

export default class App {

	constructor (id) {

		this.id = id;

		this.settings = {
			endpoint:       null,
			title:          null,
			logo:           null,
			googleClientId: null
		};

		this.api            = null;
		this.token          = null;
		this.user           = null;

		this.isLoaded       = false;
		this.storageKey     = "phidias.app:" + this.id;

		this.retrieve();
	}


	/* Local storage options */
	persist () {
		window.localStorage[this.storageKey] = JSON.stringify(this.settings);
	}

	retrieve () {
		if (window.localStorage[this.storageKey]) {
			this.load(JSON.parse(window.localStorage[this.storageKey]));
		}
	}

	load (settings) {

		this.settings = Object.assign(this.settings, settings);
		this.api      = new Client(this.settings.endpoint);

		/* Restore session */
        if ( window.sessionStorage[this.storageKey] ) {
            this.setToken(window.sessionStorage[this.storageKey]);
        }

		this.isLoaded = true;
		this.persist();
	}

	loadCode (code, rackUrl) {

		if (rackUrl == undefined) {
			rackUrl = "http://phidias.io/";
		}

		return new Client(rackUrl)
			.get("/code/" + code)
			.then((response) => {
				this.load({
					title:    response.data.title,
					logo:     response.data.logo,
					endpoint: response.data.url
				});
			});
	}


	/* Session management */

	get isAuthenticated () {
		return this.token != null;
	}

	setToken(string) {
		this.user  = JWT.decode(string);
		this.token = string;

		this.api.setToken(this.token);

		// Store token in session
		window.sessionStorage[this.storageKey] = this.token;
		return this.user;
	}

	logout() {
		this.user  = null;
		this.token = null;
		window.sessionStorage.removeItem(this.storageKey);
	}

	login (username, password) {
		return this.api.post("oauth/token",
			{ grant_type: "client_credentials" },
			{
				headers: {
					Authorization: 'Basic ' + btoa(username + ':' + password)
				}
			})
			.then((response) => {
				return this.setToken(response.data.access_token);
			});
	}

	googleLogin () {
		return new Promise((resolve, reject) => {
			this.getGoogleAuthorizationCode()
				.then((googleCode) => {
					this.api.post("oauth/google", {code: googleCode})
						.then((response) => {
							this.setToken(response.data.access_token);
							resolve(this.user);
						}, reject);
				}, reject);
		});
	}

	getGoogleAuthorizationCode() {
		// https://developers.google.com/identity/protocols/OAuth2UserAgent#formingtheurl
		var authUrl = "https://accounts.google.com/o/oauth2/v2/auth?" + Client.serialize({
			"redirect_uri":  "http://www.phidias.co/googlesignin.html",
			"client_id":     this.googleClientId,
			"scope":         "email",
			"response_type": "code",
			"prompt":        "select_account"
		});

		return new Promise(function (resolve, reject) {

			// Open the OAuth consent page in the InAppBrowser
			var authWindow = window.open(authUrl, '_blank');

			// Listen (one time) for messages sent from authWindow
			var listenMessage = function(event) {

				if (event.data.status == 'success') {
					resolve(event.data.code);
				} else {
					reject(event.data.error);
				}

				window.removeEventListener('message', listenMessage);
			}
			window.addEventListener('message', listenMessage);


			// Within phonegap, the created window will NOT have a window.opener, so
			// use this instead:
			authWindow.addEventListener('loadstart', function(e) {
				var url   = e.url;
				var code  = new RegExp(/\?code=(.+)$/).exec(url);
				var error = new RegExp(/\?error=(.+)$/).exec(url);

				var result = {};

				if (code) {
					result.status = 'success';
					result.code   = code[1];
				} else if (error) {
					result.status = 'error';
					result.error  = error[1];
				}

				if (code || error) {
					window.postMessage(result, "*");
					authWindow.close();
				}
			});

		});
	}

	getDataFromMetaTags () {

		var retval = {};

		/* Obtain data from metatags (in public/index.html) */
		var metas = document.querySelectorAll('meta');
		for (var cont = 0; cont < metas.length; cont++) {

			/* Obtain endpoint from "phi-endpoint" metatag */
			if (metas[cont].name == "phi-endpoint") {
				retval.endpoint = metas[cont].content;
			}

			/* Obtain title from "phi-endpoint" metatag */
			if (metas[cont].name == "phi-title") {
				retval.title = metas[cont].content;
			}

			/* Obtain logo from "phi-endpoint" metatag */
			if (metas[cont].name == "phi-logo") {
				retval.logo = metas[cont].content;
			}

			/* Obtain googleClientId from "phi-google-client-id" metatag */
			if (metas[cont].name == "phi-google-client-id") {
				retval.googleClientId = metas[cont].content;
			}

		}

		return retval;
	}


	registerPushNotifications(googleClientId) {

		if (typeof PushNotification == "undefined") {
			return;
		}

		var push = PushNotification.init({
			android: {
				senderID: googleClientId
			},
			ios: {
				alert: "true",
				badge: "true",
				sound: "true"
			},
			windows: {}
		});

		push.on('registration', (data) => {

			if (!window.device || !window.device.platform) {
				return;
			}

			phiApi.post("people/" + this.user.id + "/devices/", {
				token:    data.registrationId,
				platform: window.device.platform,
				model:    window.device.model,
				uuid:     window.device.uuid
			});

		});


		push.on('notification', function(data) {
			// data.message,
			// data.title,
			// data.count,
			// data.sound,
			// data.image,
			// data.additionalData

			window.dispatchEvent(new CustomEvent("phiNotification", {detail:data}));
		});

		push.on('error', function(e) {
			alert(e.message);
		});

	}

}