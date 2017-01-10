'use strict';

process.env.NODE_ENV = (process.env.NODE_ENV || 'development');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const expressValidator = require('express-validator');
const helmet = require('helmet');
const http = require('http');
const httpCodes = require('http-codes');
const morgan = require('morgan');
const path = require('path');

const authMiddleware = require('./middleware/index').auth;
const headerMiddleware = require('./middleware/index').header;

const util = require('./util/index').util;

const config = require('./config/default.json');

const Router = require('./routes/router');

const app = express();
const server = http.Server(app);

//====================================================
// Configuration.
//====================================================

dotenv.config();

//====================================================
// Middleware.
//====================================================

app.use(helmet());
app.use(morgan('dev')); // Log requests to console.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static(path.resolve(__dirname, 'web', 'dist'), { setHeaders: headerMiddleware.addStaticResponseHeaders }));
app.use(headerMiddleware.addResponseHeaders);

//====================================================
// Routes.
//====================================================

const router = new Router(authMiddleware);

app.use(config.ENDPOINTS.API, router.router);

app.get(config.ROUTE.AUTH, (request, response) => response.render('auth'));

app.get(config.ROUTE.ACCOUNTS, authMiddleware.isAuthenticated, (request, response) => response.render('accounts'));

app.get(config.ROUTE.COMPLETE, authMiddleware.isAuthenticated, (request, response) => response.render('complete'));

app.get(config.ROUTE.SETUP, (request, response) => response.render('setup', {
    clientId: process.env.MONZO_CLIENT_ID,
    redirectUri: util.getMonzoRedirectUri(request)
}));

app.get('/', authMiddleware.isAuthenticated, (request, response) => response.redirect(config.ROUTE.ACCOUNTS));

//====================================================
// Errors...gotta catch 'em all.
//====================================================

app.use((error, request, response, next) => {
    if(error) {
        if(error.status === httpCodes.UNAUTHORIZED) {
            return response.redirect(config.ROUTE.AUTH);
        }

        return response.status(error.status || httpCodes.INTERNAL_SERVER_ERROR).json({ error: error.error });
    }

    next();
});

//====================================================
// Start server and open sockets.
//====================================================

server.listen(config.PORT, process.env.SERVER_IP, () => {
    /* eslint-disable no-console */
    console.log('Environment: ' + process.env.NODE_ENV);
    console.log('The unicorns are running free at ' + process.env.SERVER_IP + ':' + config.PORT);
    /* eslint-enable no-console */
});

// Export for testing.
module.exports.app = app;
