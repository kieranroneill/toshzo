'use strict';

const httpCodes = require('http-codes');

const utilities = require('../utilities/index');

const controllers = require('../controllers/index');

const strings = require('../../config/strings.json');
const errors = require('../../config/errors.json');

module.exports = {
    isAuthenticated: (request, response, next) => {
        const token = request.headers[strings.headers.SESSION_TOKEN];

        if(!token) {
            return next(utilities.errorsUtil.createRequestError(httpCodes.UNAUTHORIZED, [errors.REQUIRED_SESSION_TOKEN]));
        }

        return controllers.sessionController
            .verifySessionToken(request.clientIp, token)
            .then(session => next(null, session))
            .catch(next);
    },

    isAuthenticatedAsPromised: (clientIp, token) => {
        if(!token) {
            return Promise.reject(utilities.errorsUtil.createRequestError(
                httpCodes.UNAUTHORIZED,
                [errors.REQUIRED_SESSION_TOKEN]
            ));
        }

        return controllers.sessionController.verifySessionToken(clientIp, token);
    }
};
