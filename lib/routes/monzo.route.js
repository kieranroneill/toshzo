'use strict';

const httpCodes = require('http-codes');

const BaseRoute = require('./base.route.js');

const controllers = require('../controllers/index');

const middlewares = require('../middlewares/index');

const utilities = require('../utilities/index');

const strings = require('../../config/strings.json');
const errors = require('../../config/errors.json');

class MonzoRoute extends BaseRoute {
    constructor(router) {
        super(router);
    }

    registerRoutes() {
        // /monzo/accounts
        this.router
            .route(strings.endpoints.MONZO + strings.endpoints.ACCOUNTS)
            .all(middlewares.authMiddleware.isAuthenticated)
            .get((request, response, next) => {
                controllers.monzoController
                    .getAccounts(request.session.monzoToken)
                    .then(result => response.json(result))
                    .catch(this.handleError.bind(this, next));
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

                controllers.monzoController
                    // First, verify the state token.
                    .verifyStateToken(request.clientIp, request.body.token)
                    // Next, get an access token.
                    .then(() => controllers. monzoController.getAccessToken(request.body.code, request.body.redirectUri))
                    .then(result => response.json({ token: result.access_token }))
                    .catch(this.handleError.bind(this, next));
            });

        // /monzo/token/state
        this.router
            .route(strings.endpoints.MONZO + strings.endpoints.TOKEN + strings.endpoints.STATE)
            .post((request, response) => response.json({
                token: controllers.monzoController.createStateToken(request.clientIp)
            }));
    }
}

module.exports = MonzoRoute;
