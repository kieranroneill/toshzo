'use strict';

import httpCodes from 'http-codes';
import jwt from 'jsonwebtoken';
import Promise from 'bluebird';

import { monzoController } from '../../lib/controllers';
import errors from '../config/errors.json';

describe('controllers/monzo', () => {
    const accountId = 'I am Groot';
    const clientIp = 'http://i.am.a.client';
    const webhookUrl = 'webhookery';

    beforeEach(function() {
        this.requestGetStub = stub(request, 'get');
        this.requestPostStub = stub(request, 'post');
    });

    afterEach(function() {
        this.requestGetStub.restore();
        this.requestPostStub.restore();
    });

    describe('getMonzoAccounts()', function() {
        it('should fail if the access token is invalid', function(done) {
            const accessToken = 'So terribly invalid.';
            const responseBody = {
                code: 'unauthorized',
                message: 'User authentication required'
            };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED, body: responseBody }, responseBody);

            monzoController
                .getMonzoAccounts(accessToken)
                .catch(error => {
                    expect(error).to.be.an('object');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_MONZO_TOKEN);

                    done();
                });
        });

        it('should return the accounts if the access token is valid', function(done) {
            const accessToken = 'I am a valid token.... ftw!';
            const responseBody = {
                accounts: [
                    {
                        id: 'acc_00009237aqC8c5umZmrRdh',
                        description: 'Peter Pan\'s Account',
                        created: '2015-11-13T12:17:42Z'
                    }
                ]
            };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .getMonzoAccounts(accessToken)
                .then(result => {
                    expect(result).to.be.an('array');

                    done();
                });
        });
    });

    describe('getStateToken()', () => {
        it('should return an error if the token secret is incorrect', function(done) {
            const token = monzoController.getStateToken('http://127.0.0.1');

            jwt.verify(token, 'this is not the correct secret', error => {
                expect(error.name).to.equal('JsonWebTokenError');

                done();
            });
        });

        it('should return a token signed with the client IP address', function(done) {
            const token = monzoController.getStateToken(clientIp);

            jwt.verify(token, process.env.SUPER_SECRET, (error, decoded) => {
                expect(error).to.be.null;
                expect(decoded).to.have.property('clientIp');
                expect(decoded.clientIp).to.equal(clientIp);


                done();
            });
        });

        it('should return a token that expires in the default time', function(done) {
            const token = monzoController.getStateToken(clientIp);

            jwt.verify(token, process.env.SUPER_SECRET, (error, decoded) => {
                expect(error).to.be.null;
                expect(decoded.exp - decoded.iat).to.equal(30); // Default time difference should be 30 secs.

                done();
            });
        });

        it('should return a token that expires in a specified time', function(done) {
            const token = monzoController.getStateToken(clientIp, 300);

            jwt.verify(token, process.env.SUPER_SECRET, (error, decoded) => {
                expect(error).to.be.null;
                expect(decoded.exp - decoded.iat).to.equal(300);

                done();
            });
        });
    });

    describe('getWebhooks()', function() {
        it('should fail if the access token is invalid', function(done) {
            const accessToken = 'So terribly invalid.';
            const responseBody = {
                code: 'unauthorized',
                message: 'User authentication required'
            };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED, body: responseBody }, responseBody);

            monzoController
                .getWebhooks(accessToken, accountId)
                .catch(error => {
                    expect(error).to.be.an('object');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_MONZO_TOKEN);

                    done();
                });
        });

        it('should provide a list of filtered webhooks', function(done) {
            const accessToken = 'I am a valid token.... ftw!';
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

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .getWebhooks(accessToken, accountId)
                .then(result => {
                    expect(result).to.be.an('array');
                    expect(result).to.be.lengthOf(1);

                    done();
                });
        });

        it('should provide the list of webhooks', function(done) {
            const accessToken = 'I am a valid token.... ftw!';
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

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .getWebhooks(accessToken, accountId)
                .then(result => {
                    expect(result).to.be.an('array');
                    expect(result).to.be.lengthOf(2);

                    done();
                });
        });
    });

    describe('registerWebhooks()', function() {
        it('should fail if the access token is invalid', function(done) {
            const accessToken = 'So terribly invalid.';
            const responseBody = {
                code: 'unauthorized',
                message: 'User authentication required'
            };

            this.requestPostStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED, body: responseBody }, responseBody);

            monzoController
                .registerWebhook(accessToken, accountId, webhookUrl)
                .catch(error => {
                    expect(error).to.be.an('object');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_MONZO_TOKEN);

                    done();
                });
        });

        it('should register the new webhook', function(done) {
            const accessToken = 'Oh yeah baby!!';
            const responseBody = {
                webhook: {
                    account_id: accountId,
                    id: 'webhook_id',
                    url: process.env.MONZO_WEBHOOK_URL
                }
            };

            this.requestPostStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .registerWebhook(accessToken, accountId, webhookUrl)
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

    describe('verifyStateToken()', function() {
        it('should fail if the token has expired', function(done) {
            const token = monzoController.getStateToken(clientIp, 1);

            Promise
                .delay(2000) // Delay for 2 seconds.
                .then(() => monzoController.verifyStateToken(clientIp, token))
                .catch(error => {
                    expect(error).to.be.an('object');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.TOKEN_HAS_EXPIRED);

                    done();
                });
        });

        it('should fail if the client IP address is incorrect', function(done) {
            const token = monzoController.getStateToken(clientIp);

            monzoController
                .verifyStateToken('not the correct IP', token)
                .catch(error => {
                    expect(error).to.be.an('object');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_CLIENT);

                    done();
                });
        });

        it('should succeed if the token is valid', function(done) {
            const token = monzoController.getStateToken(clientIp);

            monzoController
                .verifyStateToken(clientIp, token)
                .then(done);
        });
    });

    describe('whoAmI()', function() {
        it('should fail if the Monzo access token is invalid', function(done) {
            const responseBody = {
                code: 'unauthorized',
                message: 'User authentication required'
            };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED, body: responseBody }, responseBody);

            monzoController
                .whoAmI('not a valid token, bub.')
                .catch(error => {
                    expect(error).to.be.an('object');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_MONZO_TOKEN);

                    done();
                });
        });

        it('should succeed if the token is valid', function(done) {
            const responseBody = {
                authenticated: true,
                client_id: 'hello dave',
                user_id: 'yay, I am you!'
            };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .whoAmI('I have a good feeling this time...')
                .then(result => {
                    expect(result).to.be.an('object');
                    expect(result).to.have.property('authenticated');
                    expect(result.authenticated).to.be.true;
                    expect(result).to.have.property('client_id');
                    expect(result.client_id).to.be.a('string');
                    expect(result).to.have.property('user_id');
                    expect(result.user_id).to.be.a('string');

                    done();
                });
        });
    });
});
