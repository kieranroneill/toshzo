'use strict';

const _ = require('underscore');
const httpCodes = require('http-codes');

const errors = require('../../config/errors.json');

class RequestError extends Error {
    constructor(status, errors, message) {
        super(message);

        this.name = 'RequestError';
        this.status = status;
        this.errors = errors;
    }
}

/**
 * Creates a extended error that is used for http request errors.
 * @param status a HTTP request error code.
 * @param errors an array of error messages.
 * @param message the message to provide the standard Error class.
 * @return {RequestError} a valid RequestError.
 */
const createRequestError = (status, errors, message) => {
    if(!status || status < 400 || status >= 600) {
        status = httpCodes.BAD_REQUEST;
    }

    if(!_.isArray(errors)) {
        errors = [];
    }

    return new RequestError(status, errors, message);
};

module.exports = {
    createMonzoError: statusCode => {
        const error = createRequestError(statusCode);

        switch(statusCode) {
            case httpCodes.BAD_REQUEST:
                error.errors = [errors.INVALID_REQUEST];
                break;
            case httpCodes.TOO_MANY_REQUESTS:
                error.errors = [errors.TOO_MANY_REQUESTS];
                break;
            case httpCodes.UNAUTHORIZED:
                error.errors = [errors.INVALID_MONZO_TOKEN];
                break;
            default:
                error.status = httpCodes.INTERNAL_SERVER_ERROR;
                error.errors = [errors.SERVER_ERROR];
                break;
        }

        return error;
    },

    createRequestError: (status, errors, message) => createRequestError(status, errors, message),

    createToshlError: statusCode => {
        const error = createRequestError(statusCode);

        switch(statusCode) {
            case httpCodes.BAD_REQUEST:
                error.errors = [errors.INVALID_REQUEST];
                break;
            case httpCodes.TOO_MANY_REQUESTS:
                error.errors = [errors.TOO_MANY_REQUESTS];
                break;
            case httpCodes.UNAUTHORIZED:
                error.errors = [errors.INVALID_TOSHL_TOKEN];
                break;
            default:
                error.status = httpCodes.INTERNAL_SERVER_ERROR;
                error.errors = [errors.SERVER_ERROR];
                break;
        }

        return error;
    }
};
