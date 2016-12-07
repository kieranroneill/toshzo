'use strict';

const chai = require('chai');
const httpCodes = require('http-codes');
const requestClient = require('request');
const sinon = require('sinon');

const monzoController = require('../../controllers/index').monzo;

const errors = require('../../config/errors.json');

const expect = chai.expect;

describe('controllers/monzo', () => {
    beforeEach(() => {
        process.env.MONZO_ACCESS_TOKEN = global.validAcccessToken;

        this.requestClientMock = sinon.mock(requestClient);
    });

    afterEach(() => {
        this.requestClientMock.restore();
    });

    describe('getAccounts()', () => {
        it('should fail if the access token is invalid', done => {
            process.env.MONZO_ACCESS_TOKEN = 'So terribly invalid.';

            monzoController
                .getAccounts()
                .catch(error => {
                    expect(error).to.be.an('object');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.INVALID_MONZO_TOKEN);
                })
                .finally(() => done());
        });

        it('should return the accounts if the access token is valid', done => {
            monzoController
                .getAccounts()
                .then(result => {
                    expect(result).to.be.an('array');
                })
                .finally(() => done());
        });
    });
});

