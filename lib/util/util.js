'use strict';

const _ = require('underscore');
const httpsCodes = require('http-codes');

const config = require('../config/default.json');
const errors = require('../config/errors.json');

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

    createMonzoError: (statusCode) => {
        const error = {
            status: statusCode,
            error: [errors.SERVER_ERROR]
        };

        switch(statusCode) {
            case httpsCodes.UNAUTHORIZED:
                error.error = [errors.INVALID_MONZO_TOKEN];
                break;
            default:
                error.status = httpsCodes.INTERNAL_SERVER_ERROR;
                break;
        }

        return error;
    },

    createToshlError: (statusCode) => {
        const error = {
            status: statusCode,
            error: [errors.SERVER_ERROR]
        };

        switch(statusCode) {
            case httpsCodes.UNAUTHORIZED:
                error.error = [errors.INVALID_TOSHL_TOKEN];
                break;
            case httpsCodes.TOO_MANY_REQUESTS:
                error.error = [errors.TOO_MANY_REQUESTS];
                break;
            default:
                error.status = httpsCodes.INTERNAL_SERVER_ERROR;
                break;
        }

        return error;
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
    },

    /**
     * Forms a base URL used for authenticated requests to Toshl.
     * @param token a Toshl access token.
     * @returns {string} a signed base URL.
     */
    getSignedToshlUrl: (token) => {
        let baseUrl = 'https://username:{$username}:@api.toshl.com';

        return encodeURI(baseUrl.replace('{$username}', token));
    },

    /**
     * Returns a random port between the ranges of 49152–65535.
     * @return a random port.
     */
    randomPort: () => _.random(49152, 65535)
};
