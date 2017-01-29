'use strict';

const httpCodes = require('http-codes');

const BaseRoute = require('./base.route.js');

const util = require('../util/index').util;

const config = require('../config/default.json');
const errors = require('../config/errors.json');

class TeapotRoute extends BaseRoute {
    constructor(auth, router) {
        super(auth, router);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router
            .route(config.ENDPOINTS.TEAPOT)
            .get((request, response, next) => next(util.createError(httpCodes.IM_A_TEAPOT, [errors.TEAPOT_ERROR])));
    }
}

module.exports = TeapotRoute;