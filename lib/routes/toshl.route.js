'use strict';

const httpCodes = require('http-codes');

const BaseRoute = require('./base.route.js');

const toshlController = require('../controllers/index').toshlController;

const util = require('../util/index').util;

const strings = require('../../config/strings.json');
const errors = require('../../config/errors.json');

class ToshlRoute extends BaseRoute {
    constructor(auth, router) {
        super(auth, router);
        this.registerRoutes();
    }

    registerRoutes() {
        // /toshl/token
        this.router
            .route(strings.endpoints.TOSHL + strings.endpoints.TOKEN)
            .get((request, response, next) => {
                let validationErrors;

                request.checkQuery('token', errors.REQUIRED_TOSHL_TOKEN).notEmpty();

                validationErrors = request.validationErrors();

                if(validationErrors) {
                    return next(util.createError(
                        httpCodes.BAD_REQUEST,
                        util.getExpressValidationErrors(validationErrors)
                    ));
                }

                toshlController
                    .me(request.query.token)
                    .then(result => response.json({ user: { id: result.id } }))
                    .catch(this.handleError.bind(this, next));
            });
    }
}

module.exports = ToshlRoute;
