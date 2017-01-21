'use strict';

const _ = require('underscore');
const httpCodes = require('http-codes');
const Promise = require('bluebird');
const requestClient = require('request');

const util = require('../util/index').util;

const config = require('../config/default.json');

module.exports = {
    getToshlAccounts: personalToken => {
        const promise = new Promise((resolve, reject) => {
            const options = {
                auth: { username: personalToken },
                url: config.TOSHL.BASE + config.TOSHL.ACCOUNTS,
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
    },

    me: personalToken => {
        return new Promise((resolve, reject) => {
            const options = {
                auth: { username: personalToken },
                url: config.TOSHL.BASE + config.TOSHL.ME,
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
    }
};
