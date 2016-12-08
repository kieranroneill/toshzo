'use strict';

const $ = require('jquery');
const axios = require('axios');
const SVGInjector = require('svg-injector');

// Models.
import { Toshzo } from './models';

// Pages.
import { AccountsPage } from './pages';

$(document).ready(() => {
    const path = window.location.pathname.split('/')[1]; // Get the first level URL.
    const accountsPage = new AccountsPage();

    // Do the injection
    SVGInjector(document.querySelectorAll('img.svg-inject'), { pngFallback: '/assets/images' });

    axios
        .get('/api/reference')
        .then(response => {
            Toshzo.monzo.clientId = response.data.monzo.clientId;
            Toshzo.monzo.redirectUri = response.data.monzo.redirectUri;
        });

    // Load a page, based on the path.
    switch(path) {
        case 'accounts':
            accountsPage.init();
            break;
        default:
            break;
    }
});
