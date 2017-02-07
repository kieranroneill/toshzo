'use strict';

const httpCodes = require('http-codes');

const BaseRoute = require('./base.route.js');

const controllers = require('../controllers/index');

const middlewares = require('../middlewares/index');

const utilities = require('../utilities/index');

const strings = require('../../config/strings.json');
const errors = require('../../config/errors.json');

class ToshlRoute extends BaseRoute {
    constructor(router) {
        super(router);
    }

    registerRoutes() {
        // /toshl/accounts
        this.router
            .route(strings.endpoints.TOSHL + strings.endpoints.ACCOUNTS)
            .get((request, response, next) => {
                middlewares.authMiddleware
                    .isAuthenticatedAsPromised(request.clientIp, request.headers[strings.headers.SESSION_TOKEN])
                    .then(result => controllers.toshlController.getAccounts(result.toshToken))
                    .then(result => response.json(result))
                    .catch(this.handleError.bind(this, next));
            });

        // /toshl/token
        this.router
            .route(strings.endpoints.TOSHL + strings.endpoints.TOKEN)
            .get((request, response, next) => {
                let validationErrors;

                request.checkQuery('token', errors.REQUIRED_TOSHL_TOKEN).notEmpty();

                validationErrors = request.validationErrors();

                if(validationErrors) {
                    return next(utilities.errorsUtil.createRequestError(
                        httpCodes.BAD_REQUEST,
                        utilities.expressUtil.getExpressValidationErrors(validationErrors)
                    ));
                }

                controllers.toshlController
                    .me(request.query.token)
                    .then(result => response.json({ user: { id: result.id } }))
                    .catch(this.handleError.bind(this, next));
            });
    }
}

module.exports = ToshlRoute;
