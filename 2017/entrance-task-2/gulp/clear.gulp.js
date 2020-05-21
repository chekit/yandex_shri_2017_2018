'use strict';

import gulp  from 'gulp';
import cache from 'gulp-cache';

//Clear Cache
gulp.task('clear', function (done) {
  return cache.clearAll(done);
});