'use strict';

module.exports = (gulp, config, plugins) => {
    gulp.task('copy:fonts', () => {
        gulp.src(config.Paths.fonts)
            .pipe(gulp.dest(config.Paths.dist + '/assets/fonts'))
            .pipe(plugins.livereload());
    });
};
