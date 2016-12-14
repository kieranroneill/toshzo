'use strict';

const _ = require('underscore');
const httpCodes = require('http-codes');
const Promise = require('bluebird');
const requestClient = require('request');

const util = require('../util/index').util;

const config = require('../config/default.json');

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
    }
};
