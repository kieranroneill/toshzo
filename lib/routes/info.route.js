'use strict';

const BaseRoute = require('./base.route');

const config = require('../config/default.json');
const packageJson = require('../../package.json');

class InfoRoute extends BaseRoute {
    constructor(auth, router) {
        super(auth, router);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router
            .route(config.ENDPOINTS.INFO)
            .get((request, response) => {
                response.json({
                    author: packageJson.author.name,
                    description: packageJson.description,
                    source: packageJson.repository.url,
                    version: packageJson.version
                });
            });
    }
}

module.exports = InfoRoute;
