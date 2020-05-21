'use strict';

import gulp        from 'gulp';
import browserSync from 'browser-sync';

const localhost = browserSync.create();

gulp.task('server', function () {
  let files = [
    `${config.paths.build}js/**/*.js`
  ];

  localhost.init({
    startPath: `/`,
    server: {
      baseDir: `${config.paths.build}`
    },
    files: files
  });
})