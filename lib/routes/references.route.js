'use strict';

const BaseRoute = require('./base.route.js');

const strings = require('../../config/strings.json');

class ReferencesRoute extends BaseRoute {
    constructor(router) {
        super(router);
    }

    registerRoutes() {
        this.router
            .route(strings.endpoints.REFERENCES)
            .get((request, response) => {
                response.json({
                    monzo: {
                        clientId: process.env.MONZO_CLIENT_ID
                    }
                });
            });
    }
}

module.exports = ReferencesRoute;
