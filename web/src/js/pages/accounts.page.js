'use strict';

const axios = require('axios');
const dragula = require('dragula');

import BasePage from './base.page';

export default class AccountsPage extends BasePage {
    constructor() {
        super();
    }

    init() {
        axios
            .get('/api/accounts')
            .then(response => {

            });
    }
}
