'use strict';

const BaseRoute = require('./base.route');

const strings = require('../../config/strings.json');
const packageJson = require('../../package.json');

class InfoRoute extends BaseRoute {
    constructor(router) {
        super(router);
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
