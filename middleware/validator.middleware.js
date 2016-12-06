'use strict';

const _ = require('underscore');

const config = require('../config/default.json');

module.exports = {
    customValidators: {
        /**
         * Checks the colour is a valid enum.
         * @param value colour to check.
         * @returns true if the colour is a valid colour enum.
         */
        isColourValid: (value) => {
            return _
                .chain(config.COLOURS)
                .values()
                .contains(value)
                .value();
        }
    }
};
