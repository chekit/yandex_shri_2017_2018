'use strict';

import gulp  from 'gulp';
import del   from 'del';
import cache from 'gulp-cache';

//Clean Dir
gulp.task('clean', function () {
  return del([`${config.paths.build}`]);
});

//Clear Cache
gulp.task('clear', function (done) {
  return cache.clearAll(done);
});