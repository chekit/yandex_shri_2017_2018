'use strict';

import gulp  from 'gulp';
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';

function optimizeImages(isVerbose) {
	isVerbose && console.info('Task is starting. You can grab some coffee and cookies for now! ;) ');

	if (isVerbose) {
		return gulp.src(`${config.paths.img_src}`)
			.pipe(cache(imagemin({ 
				optimizationLevel: 3, 
				progressive: true, 
				interlaced: true,
				verbose: isVerbose || false
			})))
			.pipe(gulp.dest(`${config.paths.img_dist}`));
	}

	return gulp.src(`${config.paths.img_src}`)
		.pipe(gulp.dest(`${config.paths.img_dist}`));
}

gulp.task('images', () => optimizeImages());
gulp.task('images:optimize', () => optimizeImages(true));

