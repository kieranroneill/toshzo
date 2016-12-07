'use strict';

module.exports = (gulp, config, plugins) => {
    const isDevelopment = (plugins.util.env.dev || plugins.util.env.development || plugins.util.env.watch);

    /**
     * Copies the scripts and concatenates the vendor files.
     */
    gulp.task('scripts', () => {
        const stream = plugins
            .browserify({
                entries: config.Paths.scripts.main,
                debug: false // Build source maps
            })
            .transform(plugins.babelify)
            .bundle()
            .pipe(plugins.vinylSourceStream('bundle.js'))
            .pipe(plugins.vinylBuffer());

        if(isDevelopment) {
            stream.pipe(plugins.livereload());
        }
        else {
            stream.pipe(plugins.uglify({ mangle: false, preserveComments: false }));
        }

        return stream.pipe(gulp.dest(config.Paths.dist + '/js'));
    });
};
