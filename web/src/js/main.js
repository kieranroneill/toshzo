'use strict';

const $ = require('jquery');
const axios = require('axios');
const SVGInjector = require('svg-injector');

import toshzo from './models/toshzo';

$(document).ready(() => {
    // Do the injection
    SVGInjector(document.querySelectorAll('img.svg-inject'), { pngFallback: '/assets/images' });

    axios
        .get('/api/reference')
        .then(response => {
            toshzo.monzo.clientId = response.data.monzo.clientId;
            toshzo.monzo.redirectUri = response.data.monzo.redirectUri;
        });
});
