'use strict';

const $ = require('jquery');
const axios = require('axios');

import toshzo from './models/toshzo';

$(document).ready(() => {
    axios
        .get('/api/reference')
        .then(response => {
            toshzo.monzo.clientId = response.data.monzo.clientId;
            toshzo.monzo.redirectUri = response.data.monzo.redirectUri;
        });
});
