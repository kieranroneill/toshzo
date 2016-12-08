'use strict';

process.env.NODE_ENV = (process.env.NODE_ENV || 'development');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const express = require('express');
const expressValidator = require('express-validator');
const http = require('http');
const httpCodes = require('http-codes');
const morgan = require('morgan');
const path = require('path');

const auth = require('./middleware/index').auth;

const util = require('./util/index').util;

const config = require('./config/default.json');

const Router = require('./routes/router');

const app = express();
const server = http.Server(app);
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs'
});

//====================================================
// Configuration.
//====================================================

dotenv.config();

//====================================================
// Middleware.
//====================================================

app.use(morgan('dev')); // Log requests to console.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static(path.resolve(__dirname, 'web', 'dist')));
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

//====================================================
// Routes.
//====================================================

const router = new Router();

app.use(config.ENDPOINTS.API, router.router);

app.get(config.ROUTE.AUTH, (request, response) => response.render('auth', {
    clientId: process.env.MONZO_CLIENT_ID,
    redirectUri: util.getMonzoRedirectUri(request)
}));

app.get(config.ROUTE.ACCOUNTS, auth.isAuthenticated, (request, response) => response.render('accounts'));

app.get(config.ROUTE.COMPLETE, auth.isAuthenticated, (request, response) => response.render('complete'));

app.get('/', auth.isAuthenticated, (request, response) => response.render('index'));

//====================================================
// Errors...gotta catch 'em all.
//====================================================

app.use((error, request, response, next) => {
    if(error) {
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
