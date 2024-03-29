'use strict';

import gulp from 'gulp';
import sequence from 'gulp-sequence';
import requireDir from 'require-dir';

global.config = require('./project.paths.json');

requireDir('./gulp');

gulp.task('default', sequence(['clean', 'clear'], 'sass', 'pug', 'images', 'modernizr', 'scripts', 'libs'));

gulp.task('dev', sequence('default', 'server', 'watch'));

gulp.task('deploy', sequence(['clean', 'clear'], 'sass:nomap', 'pug', 'images:optimize', 'modernizr', 'scripts', 'libs'));