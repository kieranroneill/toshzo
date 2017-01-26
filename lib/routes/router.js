'use strict';

const express = require('express');

const InfoRoute = require('./info.route');
const MonzoRoute = require('./monzo.route');
const ReferencesRoute = require('./references.route');
const SessionRoute = require('./session.route');
const ToshlRoute = require('./toshl.route');

class Router {
    constructor(auth) {
        this.router = express.Router();

        this.infoRoute = new InfoRoute(auth, this.router);
        this.monzoRoute = new MonzoRoute(auth, this.router);
        this.referencesRoute = new ReferencesRoute(auth, this.router);
        this.sessionRoute = new SessionRoute(auth, this.router);
        this.toshlRoute = new ToshlRoute(auth, this.router);
    }
}

module.exports = Router;
