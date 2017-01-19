'use strict';

process.env.NODE_ENV = (process.env.NODE_ENV || 'development');

const bodyParser = require('body-parser');
const chokidar = require('chokidar');
const dotenv = require('dotenv');
const express = require('express');
const expressValidator = require('express-validator');
const helmet = require('helmet');
const http = require('http');
const httpCodes = require('http-codes');
const morgan = require('morgan');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const authMiddleware = require('./lib/middleware/index').authMiddleware;
const headerMiddleware = require('./lib/middleware/index').headerMiddleware;

const config = require('./lib/config/default.json');
const webpackDevConfig = require('./webpack.dev.config');

const Router = require('./lib/routes/router');

const app = express();
const server = http.Server(app);
const router = new Router(authMiddleware);
const staticPath = path.resolve(__dirname, 'public', 'dist');
let watcher, webpackCompiler;

//====================================================
// Configuration.
//====================================================

dotenv.config();

// This is used to watch for file changes.
if(process.env.NODE_ENV === 'development') {
    watcher = chokidar.watch('./lib');

    watcher.on('ready', () => {
        watcher.on('all', () => {
            Object
                .keys(require.cache)
                .forEach(id => {
                    if (/[\/\\]lib[\/\\]/.test(id)) {
                        delete require.cache[id];
                    }
                });
        });
    });
}

//====================================================
// Middleware.
//====================================================

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(headerMiddleware.addResponseHeaders);

// Use hot reloading in development; serve from memory.
if (process.env.NODE_ENV === 'development') {
    webpackCompiler = webpack(webpackDevConfig);

    app.use(webpackDevMiddleware(webpackCompiler, {
        publicPath: webpackDevConfig.output.publicPath,
        stats: {
            'colors': true,
            'chunks': false,
            'errors-only': true
        }
    }));

    /* eslint-disable no-console */
    app.use(webpackHotMiddleware(webpackCompiler, {
        log: console.log
    }));
    /* eslint-enable no-console */
}
else {
    app.use(express
        .static(staticPath, { setHeaders: headerMiddleware.addStaticResponseHeaders })
    );
}

//====================================================
// Routes.
//====================================================

// API routes.
app.use(config.ENDPOINTS.API, router.router);

// Use client-side routing.
app.get('*', (request, response) => response.sendFile(path.resolve(staticPath, 'index.html')));

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
    const addr = server.address();

    /* eslint-disable no-console */
    console.log('Environment: ' + process.env.NODE_ENV);
    console.log('The unicorns are running free at http://%s:%d', addr.address, addr.port);
    /* eslint-enable no-console */
});

// Export for testing.
module.exports.app = app;
