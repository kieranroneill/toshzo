'use strict';

const _ = require('underscore');

const InfoRoute = require('./info.route');
const MonzoRoute = require('./monzo.route');
const ReferencesRoute = require('./references.route');
const SessionRoute = require('./session.route');
const TeapotRoute = require('./teapot.route');
const ToshlRoute = require('./toshl.route');

module.exports = express => {
    const router = express.Router();

    // Register routes.
    _.each([
        new InfoRoute(router),
        new MonzoRoute(router),
        new ReferencesRoute(router),
        new SessionRoute(router),
        new TeapotRoute(router),
        new ToshlRoute(router)
    ], element => element.registerRoutes());

    return router;
};
