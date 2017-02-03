'use strict';

const httpCodes = require('http-codes');

const util = require('../util/index').util;

const errors = require('../../config/errors.json');

class BaseRoute {
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
    }

    /**
     * A curried function that simply handles the errors spat out from the promise chain.
     * @param next a bound callback from an express route.
     * @param error the error provided by the wrapper function.
     */
    handleError(next, error) {
        // Non-custom error.
        if(error.name) {
            return next(util.createError(httpCodes.INTERNAL_SERVER_ERROR, [errors.SERVER_ERROR]));
        }

        next(error);
    }
}

module.exports = BaseRoute;
