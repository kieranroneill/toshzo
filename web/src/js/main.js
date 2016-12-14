'use strict';

const $ = require('jquery');
const axios = require('axios');
const Q = require('q');

// Models.
import { Toshzo } from './models';

// Pages.
import { AccountsPage, AuthPage } from './pages';

// Utilities.
import { Util } from './util';

function getReferences() {
    const deferred = Q.defer();

    axios
        .get('/api/reference')
        .then(response => {
            Toshzo.monzo.clientId = response.data.monzo.clientId;
            Toshzo.monzo.redirectUri = response.data.monzo.redirectUri;

            deferred.resolve();
        })
        .catch(deferred.reject);

    return deferred.promise;
}

$(document).ready(() => {
    const $pageLoaderElement = $('#pageLoader');
    const promises = [];

    // Do svg injection.
    promises.push(Util.svgInjectionPromise());
    promises.push(getReferences());

    Q
        .all(promises)
        .then(() => {
            const path = window.location.pathname.split('/')[1]; // Get the first level URL.
            let page = new AuthPage();

            // Load a page, based on the path.
            switch(path) {
                case 'accounts':
                    page = new AccountsPage();
                    break;
                case 'auth':
                    page = new AuthPage();
                    break;
                default:
                    break;
            }

            page.init();

            $pageLoaderElement.fadeOut();
        });
});
