'use strict';

const config = require('../config/default.json');

module.exports = {
    addResponseHeaders: (request, response, next) => {
        // Show the unicorn power!
        response.set(config.HEADERS.POWERED_BY, 'Unicorns!');

        next();
    },

    addStaticResponseHeaders: (response) => {
        // Show the unicorn power!
        response.set(config.HEADERS.POWERED_BY, 'Unicorns!');
    }
};
