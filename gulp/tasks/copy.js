'use strict';

module.exports = (gulp, config) => {
    gulp.task('copy:fonts', () => {
        gulp.src(config.Paths.fonts)
            .pipe(gulp.dest(config.Paths.dist + '/assets/fonts'));
    });
};
