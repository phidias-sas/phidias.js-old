var gulp    = require('gulp');
var phidias = require('phidias-gulp')(gulp);

phidias.build({
    name: 'phidias-demo-app',
    src:  'src',
    dest: 'public/build'
});