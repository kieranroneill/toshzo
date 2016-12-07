'use strict';

module.exports = (gulp, config, plugins) => {
    const isDevelopment = (plugins.util.env.dev || plugins.util.env.development || plugins.util.env.watch);

    gulp.task('styles', () => {
        const libStream = gulp.src(config.Paths.styles.lib);
        const sassStream = gulp.src(config.Paths.styles.main)
            .pipe(plugins.concat('style.scss'))
            .pipe(plugins.sass({ includePaths: ['./web/src/scss'] }).on('error', plugins.sass.logError))
            .pipe(plugins.autoprefixer()); // Add vendor prefixes.
        let stream = plugins.streamqueue({ objectMode: true }, libStream, sassStream)
            .pipe(plugins.concat('style.css'));

        if(isDevelopment) {
            stream.pipe(plugins.livereload());
        }
        else {
            stream.pipe(plugins.minifyCss({ keepSpecialComments: 0 }));
        }

        return stream.pipe(gulp.dest(config.Paths.dist + '/css'));
    });
};

