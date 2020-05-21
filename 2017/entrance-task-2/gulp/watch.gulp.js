'use strict';

import gulp        from 'gulp';
import watch       from 'gulp-watch';
import sequence    from 'gulp-sequence';
import browserSync from 'browser-sync';

let localhost = browserSync.create();

gulp.task('watch', function () {
  watch(`${config.paths.src}js/**/*.js`, function () {
    return sequence('scripts')(function (err) {
      if (err) console.log(err)
    });
  }).on('ready', localhost.reload);
});

