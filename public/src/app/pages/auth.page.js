'use strict';

const $ = require('jquery');

import BasePage from './base.page';

export default class AuthPage extends BasePage {
    constructor() {
        super();
        this.$superSecretForm = $('#superSecretForm');
    }

    init() {
        this.$superSecretForm.submit(this.onSuperSecretFormSubmit.bind(this));
    }

    onSuperSecretFormSubmit(/* event */) {

    }
}
