'use strict';

const express = require('express');

const MonzoRoute = require('./monzo.route.js');
const ReferenceRoute = require('./reference.route.js');
const TeapotRoute = require('./teapot.route.js');

class Router {
    constructor(auth) {
        this.router = express.Router();

        this.monzoRoute = new MonzoRoute(auth, this.router);
        this.referenceRoute = new ReferenceRoute(auth, this.router);
        this.teapotRoute = new TeapotRoute(auth, this.router);
    }
}

module.exports = Router;
