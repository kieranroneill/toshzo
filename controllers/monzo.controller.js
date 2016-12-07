'use strict';

const _ = require('underscore');
const httpCodes = require('http-codes');
const Q = require('q');
const requestClient = require('request');

const util = require('../util/index').util;

const config = require('../config/default.json');
const errors = require('../config/errors.json');

module.exports = {
    registerMonzoWebhook: () => {

    },

    checkMonzoWebhook: (accountId) => {

    },

    getAccounts: () => {
        const deferred = Q.defer();
        const options = {
            url: config.MONZO.BASE + config.MONZO.ACCOUNTS,
            method: 'GET',
            headers: {
                Authorization: process.env.MONZO_ACCESS_TOKEN
            },
            json: true
        };

        requestClient(options, (error, response, body) => {
            if(error || response.statusCode !== httpCodes.OK) {
                return deferred.reject(util.createError(response.statusCode, [errors.INVALID_MONZO_TOKEN]));
            }

            deferred.resolve(body.accounts);
        });

        return deferred
            .promise
            .then(accounts => _.map(accounts, account => account.id));
    }
};
