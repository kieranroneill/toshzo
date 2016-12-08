'use strict';

const $ = require('jquery');

export default class BasePage {
    constructor() {
        this.$document = $(document);
        this.$window = $(window);
    }
}
