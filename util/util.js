'use strict';

const _ = require('underscore');

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

    getExpressValidationErrors: (errors) => {
        return _.map(errors, (object) => {
            return object.msg;
        });
    }
};
