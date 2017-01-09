'use strict';

module.exports = (gulp, config, plugins) => {
    gulp.task('svgs', () => {
        const svgStream = gulp.src(config.Paths.svgs)
            .pipe(plugins.svgmin())
            .pipe(gulp.dest(config.Paths.dist + '/assets/svgs'));
        const pngStream = gulp.src(config.Paths.svgs)
            .pipe(plugins.svg2png())
            .pipe(gulp.dest(config.Paths.dist + '/assets/images'));

        return plugins.streamqueue({ objectMode: true }, svgStream, pngStream);
    });
};
