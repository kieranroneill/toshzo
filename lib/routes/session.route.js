'use strict';

const Promise = require('bluebird');
const httpCodes = require('http-codes');

const BaseRoute = require('./base.route');

const monzoController = require('../controllers/index').monzoController;
const sessionController = require('../controllers/index').sessionController;
const toshlController = require('../controllers/index').toshlController;

const utilities = require('../utilities/index');

const strings = require('../../config/strings.json');
const errors = require('../../config/errors.json');

class SessionRoute extends BaseRoute {
    constructor(router) {
        super(router);
    }

    getMonzoInformation(accessToken) {
        return monzoController
            .getAccounts(accessToken)
            .then(result => ({ account: result[0] }));
    }

    getToshlInformation(personalToken) {
        let accounts;

        return toshlController
            .getAccounts(personalToken)
            .then(result => {
                accounts = result;

                return toshlController.getCategories(personalToken);
            })
            .then(result => ({ categories: result, accounts: accounts }));
    }

    registerRoutes() {
        this.router
            .route(strings.endpoints.SESSION)
            .get((request, response, next) => {
                let validationErrors;

                request.checkQuery('token', errors.REQUIRED_SESSION_TOKEN).notEmpty();

                validationErrors = request.validationErrors();

                if(validationErrors) {
                    return next(utilities.errorsUtil.createRequestError(
                        httpCodes.BAD_REQUEST,
                        utilities.expressUtil.getExpressValidationErrors(validationErrors)
                    ));
                }

                sessionController
                    .verifySessionToken(request.clientIp, request.query.token)
                    .then(() => response.sendStatus(httpCodes.OK))
                    .catch(this.handleError.bind(this, next));
            })
            .post((request, response, next) => {
                let body, validationErrors;

                request.checkBody('monzoToken', errors.REQUIRED_MONZO_TOKEN).notEmpty();
                request.checkBody('toshlToken', errors.REQUIRED_TOSHL_TOKEN).notEmpty();

                validationErrors = request.validationErrors();

                if(validationErrors) {
                    return next(utilities.errorsUtil.createRequestError(
                        httpCodes.BAD_REQUEST,
                        utilities.expressUtil.getExpressValidationErrors(validationErrors)
                    ));
                }

                // Check both tokens are valid.
                Promise
                    .all([
                        monzoController.whoAmI(request.body.monzoToken),
                        toshlController.me(request.body.toshlToken)
                    ])
                    .then(() => {
                        body = {
                            token: sessionController
                                .createSessionToken(request.clientIp, request.body.monzoToken, request.body.toshlToken)
                        };

                        // Get the accounts.
                        return Promise
                            .all([
                                this.getMonzoInformation(request.body.monzoToken),
                                this.getToshlInformation(request.body.toshlToken)
                            ]);
                    })
                    .spread((monzo, toshl) => {
                        body = {
                            monzo: monzo,
                            toshl: toshl,
                            ...body
                        };

                        return this.setUpMonzoWebhooks(request.body.monzoToken, monzo.account.id);
                    })
                    .then(() => response.json(body))
                    .catch(this.handleError.bind(this, next));
            });
    }

    setUpMonzoWebhooks(accessToken, accountId) {

    }
}

module.exports = SessionRoute;
