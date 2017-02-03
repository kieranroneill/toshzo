'use strict';

const BaseRoute = require('./base.route');

const strings = require('../../config/strings.json');
const packageJson = require('../../package.json');

class InfoRoute extends BaseRoute {
    constructor(auth, router) {
        super(auth, router);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router
            .route(strings.endpoints.INFO)
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
