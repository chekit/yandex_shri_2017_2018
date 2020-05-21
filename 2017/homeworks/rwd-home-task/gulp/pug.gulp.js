'use strict';

import gulp   from 'gulp';
import pug    from 'gulp-pug';
import debug  from 'gulp-debug';
import notify from 'gulp-notify';

gulp.task('copy:jsAsserts', () => {
   let sources = [
        // './node_modules/picturefill/dist/*.min.js'
        './node_modules/object-fit-images/dist/*.min.js'
   ];

   return gulp.src(sources)
        .pipe(gulp.dest('./src/js/libs/'))
});

// gulp.task('copy:cssAsserts', () => {
// });

gulp.task('pug', ['copy:jsAsserts'], () => {
    return gulp.src(`${config.paths.src}*.pug`)
        .pipe(pug({
           pretty: true
        }))
        .on('error', notify.onError({
            message: "Error: <%= error.message %>",
            title: "Error in Jade Partials"
        }))
        .pipe(gulp.dest(`${config.paths.html}`));
});
