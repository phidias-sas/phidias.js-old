var gulp    = require('gulp');
var phidias = require('phidias-gulp')(gulp);

phidias.build({
    name: 'phidias-angular',
    src:  'src',
    dest: '.'
});