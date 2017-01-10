'use strict';

const _ = require('underscore');
const httpCodes = require('http-codes');
const Promise = require('bluebird');
const requestClient = require('request');

const util = require('../util/index').util;

const config = require('../config/default.json');

module.exports = {
    getToshlAccounts: (accessToken) => {
        const promise = new Promise((resolve, reject) => {
            const options = {
                url: util.getSignedToshlUrl(accessToken) + config.TOSHL.ACCOUNTS,
                json: true
            };

            requestClient
                .get(options, (error, response, body) => {
                    if(error || response.statusCode !== httpCodes.OK) {
                        return reject(util.createToshlError(response.statusCode));
                    }

                    resolve(body);
                });
        });

        return promise.then(accounts => _.filter(accounts, account => (account.status === 'active')));
    }
};
