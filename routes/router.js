'use strict';

const express = require('express');

const TeapotRoute = require('./teapot.route');
const UnicornRoute = require('./unicorn.route');

class Router {
    constructor() {
        this.router = express.Router();

        this.teapotRoute = new TeapotRoute(this.router);
        this.unicornRoute = new UnicornRoute(this.router);
    }
}

module.exports = Router;
