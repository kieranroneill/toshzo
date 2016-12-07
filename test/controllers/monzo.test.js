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

    beforeEach(() => {
        this.requestClientGetStub = sinon.stub(requestClient, 'get');
        this.requestClientPostStub = sinon.stub(requestClient, 'post');
    });

    afterEach(() => {
        this.requestClientGetStub.restore();
        this.requestClientPostStub.restore();
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

    describe('getWebhooks()', () => {
        it('should fail if the access token is invalid', done => {
            const responseBody = {
                code: 'unauthorized',
                message: 'User authentication required'
            };

            process.env.MONZO_ACCESS_TOKEN = 'So terribly invalid.';

            this.requestClientGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED, body: responseBody }, responseBody);

            monzoController
                .getWebhooks(accountId)
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
                        account_id: accountId,
                        id: 'webhook_99978SkdgsAsta7stiad77',
                        url: 'http://no.idea.where.com'
                    }
                ]
            };

            process.env.MONZO_ACCESS_TOKEN = 'I am a valid token.... ftw!';

            this.requestClientGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .getWebhooks(accountId)
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
                        account_id: accountId,
                        id: 'webhook_99978SkdgsAsta7stiad77',
                        url: process.env.MONZO_WEBHOOK_URL
                    }
                ]
            };

            process.env.MONZO_ACCESS_TOKEN = 'I am a valid token.... ftw!';

            this.requestClientGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .getWebhooks(accountId)
                .then(result => {
                    expect(result).to.be.an('array');
                    expect(result).to.be.lengthOf(2);

                    done();
                });
        });
    });

    describe('registerWebhooks()', () => {
        it('should fail if the access token is invalid', done => {
            const responseBody = {
                code: 'unauthorized',
                message: 'User authentication required'
            };

            process.env.MONZO_ACCESS_TOKEN = 'So terribly invalid.';

            this.requestClientPostStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED, body: responseBody }, responseBody);

            monzoController
                .registerWebhook(accountId)
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

        it('should register the new webhook', done => {
            const responseBody = {
                webhook: {
                    account_id: accountId,
                    id: 'webhook_id',
                    url: process.env.MONZO_WEBHOOK_URL
                }
            };

            process.env.MONZO_ACCESS_TOKEN = 'Oh yeah baby!!';

            this.requestClientPostStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .registerWebhook(accountId)
                .then(result => {
                    expect(result).to.be.an('object');
                    expect(result).to.have.property('webhook');
                    expect(result.webhook).to.have.property('account_id')
                        .to.be.equal(accountId);
                    expect(result.webhook).to.have.property('id')
                        .to.be.equal('webhook_id');
                    expect(result.webhook).to.have.property('url')
                        .to.be.equal(process.env.MONZO_WEBHOOK_URL);

                    done();
                });
        });
    });
});

