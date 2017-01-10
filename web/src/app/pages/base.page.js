'use strict';

const $ = require('jquery');

export default class BasePage {
    constructor() {
        this.$document = $(document);
        this.$loader = $('#loader');
        this.$window = $(window);
    }

    hideLoader() {
        this.$loader.hide();
    }

    showLoader() {
        this.$loader.show();
    }
}
