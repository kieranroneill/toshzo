'use strict';

const express = require('express');

const MonzoRoute = require('./monzo.route.js');
const ReferencesRoute = require('./references.route.js');

class Router {
    constructor(auth) {
        this.router = express.Router();

        this.monzoRoute = new MonzoRoute(auth, this.router);
        this.referencesRoute = new ReferencesRoute(auth, this.router);
    }
}

module.exports = Router;
