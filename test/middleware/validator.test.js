'use strict';

const chai = require('chai');

const validator = require('../../middleware/index').validator;

const config = require('../../config/default.json');

const expect = chai.expect;

describe('middleware/validator', () => {
    describe('customValidators', () => {
        describe('isColourValid()', () => {
            it('should return false if no colour is defined', () => {
                const result = validator.customValidators.isColourValid();

                expect(result).to.be.false;
            });

            it('should return false if the colour is not valid', () => {
                const result = validator.customValidators.isColourValid('brown');

                expect(result).to.be.false;
            });

            it('should return true if the colour is valid', () => {
                const result = validator.customValidators.isColourValid(config.COLOURS.WHITE);

                expect(result).to.be.true;
            });
        });
    });
});
