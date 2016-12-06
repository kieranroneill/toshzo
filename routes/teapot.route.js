'use strict';

const httpCodes = require('http-codes');

const BaseRoute = require('./base.route');

const util = require('../util/index').util;

const config = require('../config/default.json');
const errors = require('../config/errors.json');

class Teapot extends BaseRoute {
    constructor(router) {
        super(router);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router
            .route(config.ROUTE.TEAPOT_ENDPOINT)
            .get((request, response, next) => next(util.createError(httpCodes.IM_A_TEAPOT, [errors.TEAPOT_ERROR])));
    }
}

module.exports = Teapot;
