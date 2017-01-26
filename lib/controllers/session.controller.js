'use strict';

const httpCodes = require('http-codes');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const monzoController = require('./monzo.controller');
const toshlController = require('./toshl.controller');

const util = require('../util/index').util;

const errors = require('../config/errors.json');

module.exports = {
    /**
     * Creates a sign session token used for authenticating requests.
     * @param clientIp the client IP address used in the signing.
     * @param monzoToken a Monzo access token.
     * @param toshlToken a Toshl personal token.
     * @param expiresIn the expiry time in seconds (default 2 hours)
     * @return a signed session token.
     */
    createSessionToken: (clientIp, monzoToken, toshlToken, expiresIn = 7200) => jwt
        .sign({
            clientIp: clientIp,
            monzoToken: monzoToken,
            toshlToken: toshlToken
        }, process.env.SUPER_SECRET, { expiresIn: expiresIn }),


    /**
     * Returns a promise that is resolved if the session token is valid.
     * @param clientIp the client IP address used in the signing.
     * @param token the signed token to verify.
     * @return a Promise.
     */
    verifySessionToken: (clientIp, token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.SUPER_SECRET, (error, decoded) => {
                if(error) {
                    switch(error.name) {
                        case 'TokenExpiredError':
                            return reject(util.createError(httpCodes.UNAUTHORIZED, [errors.TOKEN_HAS_EXPIRED]));
                        default:
                            return reject(util.createError(httpCodes.UNAUTHORIZED, [errors.INVALID_SESSION_TOKEN]));
                    }
                }

                if(clientIp !== decoded.clientIp) {
                    return reject(util.createError(httpCodes.UNAUTHORIZED, [errors.INVALID_CLIENT]));
                }

                Promise
                    .all([
                        monzoController.whoAmI(decoded.monzoToken),
                        toshlController.me(decoded.toshlToken)
                    ])
                    .then(resolve)
                    .catch(reject);
            });
        });
    }
};
