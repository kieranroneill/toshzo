'use strict';

const _ = require('underscore');
const httpCodes = require('http-codes');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const requestClient = require('request');

const util = require('../util/index').util;

const config = require('../config/default.json');
const errors = require('../config/errors.json');

module.exports = {
    getMonzoAccounts: (accessToken) => {
        const promise = new Promise((resolve, reject) => {
            const options = {
                url: config.MONZO.BASE + config.MONZO.ACCOUNTS,
                headers: {
                    Authorization: accessToken
                },
                json: true
            };

            requestClient
                .get(options, (error, response, body) => {
                    if(error || response.statusCode !== httpCodes.OK) {
                        return reject(util.createMonzoError(response.statusCode));
                    }

                    resolve(body.accounts);
                });
        });

        return promise.then(accounts => _.map(accounts, account => account.id));
    },

    /**
     * Gets a signed token that expires in 1 hour.
     * @param clientIp the IP address of the requesting client.
     * @param expiresIn expiry time in seconds.
     */
    getStateToken: (clientIp, expiresIn = 3600) => jwt
        .sign({ clientIp: clientIp }, process.env.SUPER_SECRET, { expiresIn: expiresIn }),

    getWebhooks: (accessToken, accountId) => {
        const promise = new Promise((resolve, reject) => {
            const options = {
                url: config.MONZO.BASE + config.MONZO.WEBHOOKS + '?account_id=' + accountId,
                headers: {
                    Authorization: accessToken
                },
                json: true
            };

            requestClient
                .get(options, (error, response, body) => {
                    if(error || response.statusCode !== httpCodes.OK) {
                        return reject(util.createMonzoError(response.statusCode));
                    }

                    resolve(body.webhooks);
                });
        });

        // Remove any irrelevant webhooks.
        return promise.then(webhooks => _.filter(webhooks, webhook => (webhook.url === process.env.MONZO_WEBHOOK_URL)));
    },

    registerWebhook: (accessToken, accountId, webhookUrl) => {
        return new Promise((resolve, reject) => {
            const options = {
                url: config.MONZO.BASE + config.MONZO.WEBHOOKS,
                headers: {
                    Authorization: accessToken
                },
                body: {
                    account_id: accountId,
                    url: webhookUrl
                },
                json: true
            };

            requestClient
                .post(options, (error, response, body) => {
                    if(error || response.statusCode !== httpCodes.OK) {
                        return reject(util.createMonzoError(response.statusCode));
                    }

                    resolve(body);
                });
        });
    },

    /**
     * Returns a promise that is resolved if client's token is valid.
     * @param clientIp the client IP address used in the signing.
     * @param token the signed token to verify
     * @return a Promise.
     */
    verifyStateToken: (clientIp, token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.SUPER_SECRET, (error, decoded) => {
                if(error) {
                    switch(error.name) {
                        case 'TokenExpiredError':
                            return reject(util.createError(httpCodes.UNAUTHORIZED, [errors.TOKEN_HAS_EXPIRED]));
                        default:
                            return reject(util.createError(httpCodes.UNAUTHORIZED, [errors.INVALID_STATE_TOKEN]));
                    }
                }

                if(clientIp !== decoded.clientIp) {
                    return reject(util.createError(httpCodes.UNAUTHORIZED, [errors.INVALID_CLIENT]));
                }

                resolve();
            });
        });
    },

    /**
     * Gets the Monzo user details.
     * @param accessToken a Monzo access token.
     * @return a Promise.
     */
    whoAmI: accessToken => {
        return new Promise((resolve, reject) => {
            const options = {
                url: config.MONZO.BASE + config.MONZO.WHOAMI,
                headers: { Authorization: 'Bearer ' + accessToken }
            };

            requestClient
                .get(options, (error, response, body) => {
                    if(error || response.statusCode !== httpCodes.OK) {
                        return reject(util.createMonzoError(response.statusCode));
                    }

                    resolve(body);
                });
        });
    }
};
