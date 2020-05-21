'use strict';

import gulp from 'gulp';
import jsdoc from'gulp-jsdoc3';

gulp.task('doc', function (cb) {
    gulp.src(['README.md', './src/**/*.js'], {read: false})
        .pipe(jsdoc(cb));
});