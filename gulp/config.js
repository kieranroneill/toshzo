'use strict';

const src = './web/src';

module.exports = {
    Paths: {
        dist: './web/dist',
        fonts: src + '/assets/fonts/**/*',
        scripts: {
            main: src + '/js/main.js',
            watch: src + '/js/**/*.js'
        },
        styles: {
            main: src + '/scss/main.scss',
            lib: src + '/lib/**/*.css',
            watch: src + '/scss/**/*.scss'
        },
        svgs: src + '/assets/svgs/**/*',
        templates: './views/**/*.hbs'
    },

    Plugins: {
        loadPlugins: {
            pattern: [
                'babelify',
                'browserify',
                'consologger',
                'gulp-*',
                'gulp.*',
                'run-sequence',
                'streamqueue',
                'vinyl-buffer',
                'vinyl-source-stream'
            ]
        }
    }
};
