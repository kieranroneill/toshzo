'use strict';

const express = require('express');

const MonzoRoute = require('./monzo.route');
const TeapotRoute = require('./teapot.route');

class Router {
    constructor() {
        this.router = express.Router();

        this.monzoRoute = new MonzoRoute(this.router);
        this.teapotRoute = new TeapotRoute(this.router);
    }
}

module.exports = Router;
