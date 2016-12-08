'use strict';

const chai = require('chai');
const httpCodes = require('http-codes');
const requestClient = require('request');
const sinon = require('sinon');

const toshlController = require('../../controllers/index').toshl;

const errors = require('../../config/errors.json');

const expect = chai.expect;

describe('controllers/toshl', () => {
    beforeEach(() => {
        this.requestClientGetStub = sinon.stub(requestClient, 'get');
    });

    afterEach(() => {
        this.requestClientGetStub.restore();
    });

    describe('getToshlAccounts()', () => {

    });
});
