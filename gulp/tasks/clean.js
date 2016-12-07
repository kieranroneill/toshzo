'use strict';

module.exports = (gulp, config, plugins) => {
    /**
     * Remove everything from the dist directory.
     */
    gulp.task('clean', () => {
        return gulp.src(config.Paths.dist, { read: false })
            .pipe(plugins.clean());
    });
};
