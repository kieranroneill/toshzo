'use strict';

const httpCodes = require('http-codes');

const util = require('../util/index').util;

const errors = require('../config/errors.json');

module.exports = {
    isAuthenticated: function(request, response, next) {
        const token = request.headers['toshzo-token'];

        if(!token || token !== process.env.SUPER_SECRET) {
            return next(util.createError(httpCodes.UNAUTHORIZED, [errors.INVALID_SUPER_SECRET]));
        }

        next();
    }
};
