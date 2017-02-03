'use strict';

const BaseRoute = require('./base.route.js');

const strings = require('../../config/strings.json');

class ReferencesRoute extends BaseRoute {
    constructor(auth, router) {
        super(auth, router);
        this.registerRoutes();
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
