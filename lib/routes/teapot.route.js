'use strict';

const httpCodes = require('http-codes');

const BaseRoute = require('./base.route.js');

const utilities = require('../utilities/index');

const strings = require('../../config/strings.json');
const errors = require('../../config/errors.json');

class TeapotRoute extends BaseRoute {
    constructor(router) {
        super(router);
    }

    registerRoutes() {
        this.router
            .route(strings.endpoints.TEAPOT)
            .get((request, response, next) => next(utilities.errorsUtil.createRequestError(
                httpCodes.IM_A_TEAPOT,
                [errors.TEAPOT_ERROR]
            )));
    }
}

module.exports = TeapotRoute;
