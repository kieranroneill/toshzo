'use strict';

const express = require('express');

const MonzoRoute = require('./monzo.route.js');
const ReferenceRoute = require('./reference.route.js');

class Router {
    constructor(auth) {
        this.router = express.Router();

        this.monzoRoute = new MonzoRoute(auth, this.router);
        this.referenceRoute = new ReferenceRoute(auth, this.router);
    }
}

module.exports = Router;
