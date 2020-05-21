'use strict';

import gulp       from 'gulp'
import babelify   from 'babelify';
import browserify from 'browserify';
import buffer     from 'vinyl-buffer';
import source     from 'vinyl-source-stream';
import uglify     from 'gulp-uglify';
import rename     from "gulp-rename";
import eslint     from 'gulp-eslint';

gulp.task('lint', function () {
  return gulp.src([
    `${config.paths.srcd}js/**/*.js`, 
    `!${config.paths.bsrc}js/libs/**/*.*`
  ])
    .pipe(eslint())
    .pipe(eslint.format());
})

gulp.task('scripts', ['lint'], function () {
    const bundler = browserify(`${config.paths.src}js/index.js`);
    bundler.transform(babelify);

    bundler.bundle()
        .on('error', function (err) { console.error(err); })
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(gulp.dest(`${config.paths.build}js`));
});