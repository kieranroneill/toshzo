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
            errors: errors
        };
    },

    createMonzoError: statusCode => {
        const error = {
            status: statusCode,
            errors: [errors.SERVER_ERROR]
        };

        switch(statusCode) {
            case httpsCodes.BAD_REQUEST:
                error.errors = [errors.INVALID_REQUEST];
                break;
            case httpsCodes.TOO_MANY_REQUESTS:
                error.errors = [errors.TOO_MANY_REQUESTS];
                break;
            case httpsCodes.UNAUTHORIZED:
                error.errors = [errors.INVALID_MONZO_TOKEN];
                break;
            default:
                error.status = httpsCodes.INTERNAL_SERVER_ERROR;
                break;
        }

        return error;
    },

    createToshlError: statusCode => {
        const error = {
            status: statusCode,
            errors: [errors.SERVER_ERROR]
        };

        switch(statusCode) {
            case httpsCodes.BAD_REQUEST:
                error.errors = [errors.INVALID_REQUEST];
                break;
            case httpsCodes.TOO_MANY_REQUESTS:
                error.errors = [errors.TOO_MANY_REQUESTS];
                break;
            case httpsCodes.UNAUTHORIZED:
                error.errors = [errors.INVALID_TOSHL_TOKEN];
                break;
            default:
                error.status = httpsCodes.INTERNAL_SERVER_ERROR;
                break;
        }

        return error;
    },

    getExpressValidationErrors: errors => _.map(errors, object => object.msg),

    /**
     * Returns a random port between the ranges of 49152–65535.
     * @return a random port.
     */
    randomPort: () => _.random(49152, 65535)
};
