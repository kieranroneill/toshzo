'use strict';

const chai = require('chai');
const httpCodes = require('http-codes');
const requestClient = require('request');
const sinon = require('sinon');

const monzoController = require('../../controllers/index').monzo;

const errors = require('../../config/errors.json');

const expect = chai.expect;

describe('controllers/monzo', () => {
    const accountId = 'I am Groot';
    const anotherAccountId = 'I am baby Groot';

    beforeEach(() => {
        this.requestClientGetStub = sinon.stub(requestClient, 'get');
    });

    afterEach(() => {
        this.requestClientGetStub.restore();
    });

    describe('checkWebhooks()', () => {
        it('should fail if the access token is invalid', done => {
            const responseBody = {
                code: 'unauthorized',
                message: 'User authentication required'
            };

            process.env.MONZO_ACCESS_TOKEN = 'So terribly invalid.';

            this.requestClientGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED, body: responseBody }, responseBody);

            monzoController
                .getWebhooks([accountId])
                .catch(error => {
                    expect(error).to.be.an('object');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.INVALID_MONZO_TOKEN);

                    done();
                });
        });

        it('should provide a list of filtered webhooks', done => {
            const responseBody = {
                webhooks: [
                    {
                        account_id: accountId,
                        id: 'webhook_000091yhhOmrXQaVZ1Irsv',
                        url: process.env.MONZO_WEBHOOK_URL
                    },
                    {
                        account_id: 'I am Rocket',
                        id: 'webhook_99978SkdgsAsta7stiad77',
                        url: 'http://no.idea.where.com'
                    }
                ]
            };

            process.env.MONZO_ACCESS_TOKEN = 'I am a valid token.... ftw!';

            this.requestClientGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .getWebhooks([accountId])
                .then(result => {
                    expect(result).to.be.an('array');
                    expect(result).to.be.lengthOf(1);

                    done();
                });
        });

        it('should provide the list of webhooks', done => {
            const responseBody = {
                webhooks: [
                    {
                        account_id: accountId,
                        id: 'webhook_000091yhhOmrXQaVZ1Irsv',
                        url: process.env.MONZO_WEBHOOK_URL
                    },
                    {
                        account_id: anotherAccountId,
                        id: 'webhook_99978SkdgsAsta7stiad77',
                        url: process.env.MONZO_WEBHOOK_URL
                    }
                ]
            };

            process.env.MONZO_ACCESS_TOKEN = 'I am a valid token.... ftw!';

            this.requestClientGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .getWebhooks([accountId, anotherAccountId])
                .then(result => {
                    expect(result).to.be.an('array');
                    expect(result).to.be.lengthOf(2);

                    done();
                });
        });
    });

    describe('getAccounts()', () => {
        it('should fail if the access token is invalid', done => {
            const responseBody = {
                code: 'unauthorized',
                message: 'User authentication required'
            };
            
            process.env.MONZO_ACCESS_TOKEN = 'So terribly invalid.';

            this.requestClientGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED, body: responseBody }, responseBody);

            monzoController
                .getAccounts()
                .catch(error => {
                    expect(error).to.be.an('object');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.INVALID_MONZO_TOKEN);

                    done();
                });
        });

        it('should return the accounts if the access token is valid', done => {
            const responseBody = {
                accounts: [
                    {
                        id: 'acc_00009237aqC8c5umZmrRdh',
                        description: 'Peter Pan\'s Account',
                        created: '2015-11-13T12:17:42Z'
                    }
                ]
            };

            process.env.MONZO_ACCESS_TOKEN = 'I am a valid token.... ftw!';

            this.requestClientGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .getAccounts()
                .then(result => {
                    expect(result).to.be.an('array');

                    done();
                });
        });
    });
});

