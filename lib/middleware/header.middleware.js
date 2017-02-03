'use strict';

const strings = require('../../config/strings.json');

module.exports = {
    addResponseHeaders: (request, response, next) => {
        // Show the unicorn power!
        response.set(strings.headers.POWERED_BY, 'Unicorns!');

        next();
    },

    addStaticResponseHeaders: (response) => {
        // Show the unicorn power!
        response.set(strings.headers.POWERED_BY, 'Unicorns!');
    }
};
