'use strict';

const BaseRoute = require('./base.route.js');

const config = require('../config/default.json');

class ReferencesRoute extends BaseRoute {
    constructor(auth, router) {
        super(auth, router);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router
            .route(config.ENDPOINTS.REFERENCES)
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
