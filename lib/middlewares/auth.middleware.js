'use strict';

const httpCodes = require('http-codes');

const utilities = require('../utilities/index');

const controllers = require('../controllers/index');

const strings = require('../../config/strings.json');
const errors = require('../../config/errors.json');

module.exports = {
    isAuthenticated: function(request, response, next) {
        const token = request.headers[strings.headers.SESSION_TOKEN];

        if(!token) {
            return next(utilities.errorsUtil.createRequestError(httpCodes.UNAUTHORIZED, [errors.REQUIRED_SESSION_TOKEN]));
        }

        return controllers.sessionController
            .verifySessionToken(request.clientIp, token)
            .then(() => next())
            .catch(next);
    },

    isAuthenticatedAsPromised: function(clientIp, token) {
        if(!token) {
            return Promise.reject(utilities.errorsUtil.createRequestError(
                httpCodes.UNAUTHORIZED,
                [errors.REQUIRED_SESSION_TOKEN]
            ));
        }

        return controllers.sessionController.verifySessionToken(clientIp, token);
    }
};
