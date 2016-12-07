'use strict';

const config = require('./gulp/config');

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')(config.Plugins.loadPlugins);

require('./gulp/tasks/clean')(gulp, config, plugins);
require('./gulp/tasks/scripts')(gulp, config, plugins);
require('./gulp/tasks/styles')(gulp, config, plugins);

gulp.task('default', done => {
    plugins.runSequence(['clean'], ['scripts', 'styles'], done);

    if(plugins.util.env.watch) {
        const logger = new plugins.consologger();
        const onWatchChange = event => {
            logger.grey('File').yellow(event.path).grey('changed').print();
        };

        // Listen for livereload changes.
        plugins.livereload.listen();

        // Watch for changes.
        gulp.watch(config.Paths.scripts.watch, ['scripts'])
            .on('change', onWatchChange);
        gulp.watch(config.Paths.styles.watch, ['styles'])
            .on('change', onWatchChange);

        logger.yellow('Watching for file changes... Use Ctrl+C to exit.').print();
    }
});
