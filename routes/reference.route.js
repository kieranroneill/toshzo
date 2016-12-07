'use strict';

const BaseRoute = require('./base.route');

const config = require('../config/default.json');

class Reference extends BaseRoute {
    constructor(router) {
        super(router);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router
            .route(config.ENDPOINTS.REFERENCE)
            .get((request, response) => {
                response.json({
                    monzo: {
                        clientId: process.env.MONZO_CLIENT_ID
                    }
                });
            });
    }
}

module.exports = Reference;
