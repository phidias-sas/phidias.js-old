import {App} from "../phidias/Phidias.js"; 

var app = new App;

console.log("store app initialized", app);
window.$phidiasApp = app;

/* Manage local storage persistense */
var appKey    = "phidias-vue-app";
var storedApp = window.localStorage[appKey];
if (storedApp) {
    app.load(JSON.parse(storedApp));
    // app.api.cacheIsEnabled = false;
}

app.on("load", () => {
    window.localStorage[appKey] = JSON.stringify(app.options);
});

/* Load session from localStorage */
var tokenKey    = appKey+":token";
var storedToken = window.localStorage[tokenKey];
if (storedToken) {
    app.setToken(storedToken);
}

app.on("login", () => {
    window.localStorage[tokenKey] = app.token;
});

app.on("logout", () => {
    window.localStorage.removeItem(tokenKey);
});

/* Google Client ID */
app.options.googleClientId = "890266961007.apps.googleusercontent.com";

export default app;