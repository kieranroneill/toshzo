'use strict';

const httpCodes = require('http-codes');
const requestClient = require('request');

const BaseRoute = require('./base.route');

const util = require('../util/index').util;

const config = require('../config/default.json');
const errors = require('../config/errors.json');

class Monzo extends BaseRoute {
    constructor(router) {
        super(router);
        this.registerRoutes();
    }

    registerRoutes() {
        // /monzo
        this.router
            .route(config.ENDPOINTS.MONZO);

        // /monzo/auth
        this.router
            .route(config.ENDPOINTS.MONZO + config.ENDPOINTS.AUTH)
            .post((request, response, next) => {
                let validationErrors, options;

                request.checkBody('authorizationCode', errors.REQUIRED_AUTHORIZATION_CODE).notEmpty();

                validationErrors = request.validationErrors();

                if(validationErrors) {
                    return next(util.createError(
                        httpCodes.BAD_REQUEST,
                        util.getExpressValidationErrors(validationErrors)
                    ));
                }

                options = {
                    url: config.MONZO.BASE + config.MONZO.TOKEN,
                    headers: {
                        Authorization: process.env.MONZO_ACCESS_TOKEN
                    },
                    form: {
                        grant_type: 'authorization_code',
                        client_id: process.env.MONZO_CLIENT_ID,
                        client_secret: process.env.MONZO_CLIENT_SECRET,
                        redirect_uri: process.env.MONZO_REDIRECT_URI,
                        code: request.body.authorizationCode
                    },
                    json: true
                };

                requestClient
                    .post(options, (error, result, body) => {
                        if(error || result.statusCode !== httpCodes.OK) {
                            return next(util.createError(result.statusCode, [errors.INVALID_AUTHORIZATION_CODE]));
                        }

                        process.env.MONZO_ACCESS_TOKEN = body.access_token;
                        process.env.MONZO_REFRESH_TOKEN = body.refresh_token;

                        // Redirect to complete.
                        response.redirect(config.ROUTE.COMPLETE);
                    });
            });
    }
}

module.exports = Monzo;
