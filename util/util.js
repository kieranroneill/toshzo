'use strict';

const _ = require('underscore');

const config = require('../config/default.json');

module.exports = {
    /**
     * Simply returns a custom error object.
     * @param status the HTTP error status.
     * @param errors an array of error strings
     * @returns an error object.
     */
    createError: (status, errors) => {
        return {
            status: status,
            error: errors
        };
    },

    getExpressValidationErrors: errors => _.map(errors, object => object.msg),

    /**
     * Builds the Monzo redirect uri.
     * @param request a valid request to harvest the host.
     * @returns {string} the Monzo redirect uri.
     */
    getMonzoRedirectUri: request => {
        let redirectUri = request.protocol + '//' + request.headers.host;

        redirectUri += config.ENDPOINTS.API;
        redirectUri += config.ENDPOINTS.MONZO;
        redirectUri += config.ENDPOINTS.AUTH;

        return redirectUri;
    }
};
