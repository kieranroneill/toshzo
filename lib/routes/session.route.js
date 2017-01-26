'use strict';

const Promise = require('bluebird');
const httpCodes = require('http-codes');

const BaseRoute = require('./base.route');

const monzoController = require('../controllers/index').monzoController;
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
                    .then()
                    .catch(this.handleError.bind(this, next));
            });
    }
}

module.exports = SessionRoute;
