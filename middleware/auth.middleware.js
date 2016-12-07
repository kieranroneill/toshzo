'use strict';

const requestClient = require('request');

const config = require('../config/default.json');

module.exports = {
    isAuthenticated: function(request, response, next) {
        let options;

        if(!process.env.MONZO_ACCESS_TOKEN) {
            return response.redirect(config.ROUTE.AUTH);
        }

        options = {
            url: config.MONZO.BASE + config.MONZO.WHOAMI,
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + process.env.MONZO_ACCESS_TOKEN
            },
            json: true
        };

        requestClient(options, (error, result, body) => {
            if(error || !body.authenticated) {
                return response.redirect(config.ROUTE.AUTH);
            }

            next();
        });
    }
};
