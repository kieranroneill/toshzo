'use strict';

const _ = require('underscore');
const httpCodes = require('http-codes');
const Q = require('q');
const requestClient = require('request');

const util = require('../util/index').util;

const config = require('../config/default.json');

module.exports = {
    getToshlAccounts: (accessToken) => {
        const deferred = Q.defer();
        const options = {
            url: util.getSignedToshlUrl(accessToken) + config.TOSHL.ACCOUNTS,
            json: true
        };

        requestClient
            .get(options, (error, response, body) => {
                if(error || response.statusCode !== httpCodes.OK) {
                    return deferred.reject(util.createToshlError(response.statusCode));
                }

                deferred.resolve(body);
            });

        return deferred
            .promise
            .then(accounts => _.filter(accounts, account => (account.status === 'active')));
    }
};
