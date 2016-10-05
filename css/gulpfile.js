'use strict';
 
var gulp   = require('gulp'),
    sass   = require('gulp-sass'),
    concat = require('gulp-concat');

var sources = ['./src/global/**/*.scss', './src/components/**/*.scss'];

gulp.task('sass', function () {
 return gulp.src(sources)
   .pipe(concat('phidias.min.css'))
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  //  .pipe(gulp.dest('./dist/'));
   .pipe(gulp.dest('../vue/dist/')); /// !!! TEMPORARY! 
});

gulp.task('sass:watch', function () {
  gulp.watch(sources, ['sass']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['sass:watch']);