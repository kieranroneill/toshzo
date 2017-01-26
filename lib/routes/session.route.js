'use strict';

const Promise = require('bluebird');
const httpCodes = require('http-codes');

const BaseRoute = require('./base.route');

const monzoController = require('../controllers/index').monzoController;
const sessionController = require('../controllers/index').sessionController;
const toshlController = require('../controllers/index').toshlController;

const util = require('../util/index').util;

const config = require('../config/default.json');
const errors = require('../config/errors.json');

class SessionRoute extends BaseRoute {
    constructor(auth, router) {
        super(auth, router);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router
            .route(config.ENDPOINTS.SESSION)
            .get((request, response, next) => {
                let validationErrors;

                request.checkQuery('token', errors.REQUIRED_SESSION_TOKEN).notEmpty();

                validationErrors = request.validationErrors();

                if(validationErrors) {
                    return next(util.createError(
                        httpCodes.BAD_REQUEST,
                        util.getExpressValidationErrors(validationErrors)
                    ));
                }

                sessionController
                    .verifySessionToken(request.clientIp, request.query.token)
                    .then(() => response.sendStatus(httpCodes.OK))
                    .catch(this.handleError.bind(this, next));
            })
            .post((request, response, next) => {
                let validationErrors;

                request.checkBody('monzoToken', errors.REQUIRED_MONZO_TOKEN).notEmpty();
                request.checkBody('toshlToken', errors.REQUIRED_TOSHL_TOKEN).notEmpty();

                validationErrors = request.validationErrors();

                if(validationErrors) {
                    return next(util.createError(
                        httpCodes.BAD_REQUEST,
                        util.getExpressValidationErrors(validationErrors)
                    ));
                }

                // Check both tokens are valid.
                Promise
                    .all([
                        monzoController.whoAmI(request.body.monzoToken),
                        toshlController.me(request.body.toshlToken)
                    ])
                    .then(() => response.json({
                        token: sessionController
                            .createSessionToken(request.clientIp, request.body.monzoToken, request.body.toshlToken)
                    }))
                    .catch(this.handleError.bind(this, next));
            });
    }
}

module.exports = SessionRoute;