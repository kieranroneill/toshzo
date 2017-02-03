'use strict';

const httpCodes = require('http-codes');

const utilities = require('../utilities/index');

const strings = require('../../config/strings.json');
const errors = require('../../config/errors.json');

module.exports = {
    isAuthenticated: function(request, response, next) {
        const token = request.headers[strings.headers.TOSHL_TOKEN];

        if(!token || token !== process.env.SUPER_SECRET) {
            return next(utilities.errorsUtil.createRequestError(httpCodes.UNAUTHORIZED, [errors.INVALID_SUPER_SECRET]));
        }

        next();
    }
};
