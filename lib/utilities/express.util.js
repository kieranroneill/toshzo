'use strict';

const _ = require('underscore');

module.exports = {
    getExpressValidationErrors: errors => _.map(errors, object => object.msg),

    /**
     * Returns a random port between the ranges of 49152–65535.
     * @return a random port.
     */
    randomPort: () => _.random(49152, 65535)
};
