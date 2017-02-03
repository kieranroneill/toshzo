'use strict';

const httpCodes = require('http-codes');

const BaseRoute = require('./base.route.js');

const monzoController = require('../controllers/index').monzoController;

const utilities = require('../utilities/index');

const strings = require('../../config/strings.json');
const errors = require('../../config/errors.json');

class MonzoRoute extends BaseRoute {
    constructor(auth, router) {
        super(auth, router);
        this.registerRoutes();
    }

    registerRoutes() {
        // /monzo/accounts
        this.router
            .route(strings.endpoints.MONZO + strings.endpoints.ACCOUNTS)
            .all(this.auth.isAuthenticated)
            .get((request, response) => {
                response.json();
            });

        // /monzo/token/access
        this.router
            .route(strings.endpoints.MONZO + strings.endpoints.TOKEN + strings.endpoints.ACCESS)
            .post((request, response, next) => {
                let validationErrors;

                request.checkBody('token', errors.REQUIRED_STATE_TOKEN).notEmpty();
                request.checkBody('code', errors.REQUIRED_AUTHORISATION_CODE).notEmpty();
                request.checkBody('redirectUri', errors.REQUIRED_REDIRECT_URI).notEmpty();

                validationErrors = request.validationErrors();

                if(validationErrors) {
                    return next(utilities.errorsUtil.createRequestError(
                        httpCodes.BAD_REQUEST,
                        utilities.expressUtil.getExpressValidationErrors(validationErrors)
                    ));
                }

                monzoController
                    // First, verify the state token.
                    .verifyStateToken(request.clientIp, request.body.token)
                    // Next, get an access token.
                    .then(() => monzoController.getAccessToken(request.body.code, request.body.redirectUri))
                    .then(result => response.json({ token: result.access_token }))
                    .catch(this.handleError.bind(this, next));
            });

        // /monzo/token/state
        this.router
            .route(strings.endpoints.MONZO + strings.endpoints.TOKEN + strings.endpoints.STATE)
            .post((request, response) => response.json({ token: monzoController.createStateToken(request.clientIp) }));
    }
}

module.exports = MonzoRoute;
