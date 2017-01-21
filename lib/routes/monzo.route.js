'use strict';

const httpCodes = require('http-codes');

const BaseRoute = require('./base.route.js');

const monzoController = require('../controllers/index').monzoController;

const util = require('../util/index').util;

const config = require('../config/default.json');
const errors = require('../config/errors.json');

class MonzoRoute extends BaseRoute {
    constructor(auth, router) {
        super(auth, router);
        this.registerRoutes();
    }

    registerRoutes() {
        // /monzo/token/access
        this.router
            .route(config.ENDPOINTS.MONZO + config.ENDPOINTS.TOKEN + config.ENDPOINTS.ACCESS)
            .post((request, response, next) => {
                let validationErrors, redirectUri;

                request.checkQuery('token', errors.REQUIRED_STATE_TOKEN).notEmpty();
                request.checkQuery('code', errors.REQUIRED_AUTHORISATION_CODE).notEmpty();

                validationErrors = request.validationErrors();

                if(validationErrors) {
                    return next(util.createError(
                        httpCodes.BAD_REQUEST,
                        util.getExpressValidationErrors(validationErrors)
                    ));
                }

                redirectUri = request.protocol + '://' + request.headers.host + config.ROUTES.AUTH;

                monzoController
                    // First, verify the state token.
                    .verifyStateToken(request.clientIp, request.query.token)
                    // Next, get an access token.
                    .then(() => monzoController.getAccessToken(request.query.code, redirectUri))
                    .then(result => response.json({ token: result.access_token }))
                    .catch(this.handleError.bind(this, next));
            });

        // /monzo/token/state
        this.router
            .route(config.ENDPOINTS.MONZO + config.ENDPOINTS.TOKEN + config.ENDPOINTS.STATE)
            .post((request, response) => response.json({ token: monzoController.createStateToken(request.clientIp) }));
    }
}

module.exports = MonzoRoute;
