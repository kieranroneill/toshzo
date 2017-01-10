'use strict';

global.Promise = require('bluebird');

const $ = require('jquery');

// Services.
import { Toshzo } from './services';

// Pages.
import { AccountsPage, AuthPage } from './pages';

// Utilities.
import { Util } from './util';

$(document).ready(() => {
    const $pageLoaderElement = $('#pageLoader');
    const promises = [];

    // Do svg injection.
    promises.push(Util.svgInjectionPromise());
    promises.push(Toshzo.getReferences());

    Promise
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
