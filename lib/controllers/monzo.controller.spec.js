import jwt from 'jsonwebtoken';
import Promise from 'bluebird';

import { monzoAccounts } from '../../test/helpers';

import { monzoController } from '../../lib/controllers/index';

function invalidAccessTokenTest(functionName, argumentArray, requestStub, done) {
    const responseBody = {
        code: 'unauthorized',
        message: 'User authentication required'
    };

    requestStub
        .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED, body: responseBody }, responseBody);

    monzoController[functionName].apply(null, argumentArray)
        .catch(error => {
            expect(error).to.be.an('error');
            expect(error).to.have.property('status')
                .to.equal(httpCodes.UNAUTHORIZED);
            expect(error).to.have.property('errors')
                .to.be.an('array')
                .to.include(errors.INVALID_MONZO_TOKEN);

            done();
        });
}

describe('controllers/monzo', () => {
    const invalidAccessToken = 'not a valid token, bub.';
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

    describe('createStateToken()', () => {
        it('should return an error if the token secret is incorrect', function(done) {
            const token = monzoController.createStateToken('http://127.0.0.1');

            jwt.verify(token, 'this is not the correct secret', error => {
                expect(error.name).to.equal('JsonWebTokenError');

                done();
            });
        });

        it('should return a token signed with the client IP address', function(done) {
            const token = monzoController.createStateToken(clientIp);

            jwt.verify(token, process.env.SUPER_SECRET, (error, decoded) => {
                expect(error).to.be.null;
                expect(decoded).to.have.property('clientIp');
                expect(decoded.clientIp).to.equal(clientIp);


                done();
            });
        });

        it('should return a token that expires in the default time', function(done) {
            const token = monzoController.createStateToken(clientIp);

            jwt.verify(token, process.env.SUPER_SECRET, (error, decoded) => {
                expect(error).to.be.null;
                expect(decoded.exp - decoded.iat).to.equal(3600); // Default time difference should be 1 hour.

                done();
            });
        });

        it('should return a token that expires in a specified time', function(done) {
            const token = monzoController.createStateToken(clientIp, 300);

            jwt.verify(token, process.env.SUPER_SECRET, (error, decoded) => {
                expect(error).to.be.null;
                expect(decoded.exp - decoded.iat).to.equal(300);

                done();
            });
        });
    });

    describe('getAccessToken()', function() {
        it('should fail if the authorisation code is invalid', function(done) {
            invalidAccessTokenTest(
                'getAccessToken',
                ['not a valid code, bub.', 'http://the.right.way'],
                this.requestPostStub,
                done
            );
        });

        it('should fail if the redirect uri is invalid', function(done) {
            const responseBody = {
                code: 'invalid_request',
                message: 'The redirect uri supplied does not match the original redirect uri'
            };

            this.requestPostStub
                .callsArgWith(1, null, { statusCode: httpCodes.BAD_REQUEST, body: responseBody }, responseBody);

            monzoController
                .getAccessToken('Let us try that again', 'misdirection!!')
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.BAD_REQUEST);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_REQUEST);

                    done();
                });
        });

        it('should succeed if the token is valid', function(done) {
            const responseBody = {
                access_token: 'Oh what a lovely token',
                client_id: 'hello dave',
                expires_in: 21600,
                refresh_token: 'refresh_token',
                token_type: 'Bearer',
                user_id: 'yay, I am you!'
            };

            this.requestPostStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .getAccessToken('I have a good feeling this time...', 'http://the.right.way')
                .then(result => {
                    expect(result).to.be.an('object');
                    expect(result).to.have.property('access_token');
                    expect(result.access_token).to.be.a('string');

                    done();
                });
        });
    });

    describe('getAccounts()', function() {
        it('should fail if the access token is invalid', function(done) {
            invalidAccessTokenTest('getAccounts', [invalidAccessToken], this.requestGetStub, done);
        });

        it('should return the accounts if the access token is valid', function(done) {
            const accessToken = 'I am a valid token.... ftw!';
            const responseBody = { accounts: monzoAccounts };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            monzoController
                .getAccounts(accessToken)
                .then(result => {
                    expect(result).to.be.an('array');

                    done();
                });
        });
    });

    describe('getWebhooks()', function() {
        it('should fail if the access token is invalid', function(done) {
            invalidAccessTokenTest('getWebhooks', [invalidAccessToken], this.requestGetStub, done);
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

    describe('registerWebhook()', function() {
        it('should fail if the access token is invalid', function(done) {
            invalidAccessTokenTest(
                'registerWebhook',
                [invalidAccessToken, accountId, webhookUrl],
                this.requestPostStub,
                done
            );
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
            const token = monzoController.createStateToken(clientIp, 1);

            Promise
                .delay(2000) // Delay for 2 seconds.
                .then(() => monzoController.verifyStateToken(clientIp, token))
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.TOKEN_HAS_EXPIRED);

                    done();
                });
        });

        it('should fail if the client IP address is incorrect', function(done) {
            const token = monzoController.createStateToken(clientIp);

            monzoController
                .verifyStateToken('not the correct IP', token)
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_CLIENT);

                    done();
                });
        });

        it('should succeed if the token is valid', function(done) {
            const token = monzoController.createStateToken(clientIp);

            monzoController
                .verifyStateToken(clientIp, token)
                .then(done);
        });
    });

    describe('whoAmI()', function() {
        it('should fail if the access token is invalid', function(done) {
            invalidAccessTokenTest('whoAmI', [invalidAccessToken], this.requestGetStub, done);
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
