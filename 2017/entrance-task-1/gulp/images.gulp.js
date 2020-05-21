'use strict';

import gulp  from 'gulp';

gulp.task('images', function () {
  gulp.src('./src/images/**/*.{png,jpg,svg,ico}')
    .pipe(gulp.dest('./dist/images/'));
})