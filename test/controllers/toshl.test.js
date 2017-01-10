'use strict';

import { toshlController } from '../../controllers';

describe('controllers/toshl', () => {
    beforeEach(function() {
        this.requestGetStub = stub(request, 'get');
    });

    afterEach(function() {
        this.requestGetStub.restore();
    });

    describe('getToshlAccounts()', function() {
        it('should fail if the access token is invalid', function(done) {
            const accessToken = 'So terribly invalid';
            const responseBody = {
                error_id: 'error.authorization.token_invalid',
                description: 'Token is invalid.'
            };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED, body: responseBody }, responseBody);

            toshlController
                .getToshlAccounts(accessToken)
                .catch(error => {
                    expect(error).to.be.an('object');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.INVALID_TOSHL_TOKEN);

                    done();
                });
        });

        it('should fail if there are too many requests to Toshl', function(done) {
            const accessToken = 'Adventure time!';
            const responseBody = {
                description: 'Have we DDoS-ed?'
            };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.TOO_MANY_REQUESTS, body: responseBody }, responseBody);

            toshlController
                .getToshlAccounts(accessToken)
                .catch(error => {
                    expect(error).to.be.an('object');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.TOO_MANY_REQUESTS);
                    expect(error).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.TOO_MANY_REQUESTS);

                    done();
                });
        });

        it('should return the accounts if the access token is valid', function(done) {
            const accessToken = 'I am a valid token.... ftw!';
            const responseBody = [
                {
                    id: '42',
                    name: 'Tesla model S',
                    balance: 3000,
                    initial_balance: 3000,
                    currency: {
                        code: 'USD',
                        rate: 1,
                        fixed: false
                    },
                    status: 'active',
                    order: 0,
                    modified: '2012-09-04T13:55:15Z'
                }
            ];

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            toshlController
                .getToshlAccounts(accessToken)
                .then(result => {
                    expect(result).to.be.an('array');
                    expect(result).to.be.lengthOf(1);

                    done();
                });
        });

        it('should return only active account', function(done) {
            const accessToken = 'I am a valid token.... ftw!';
            const responseBody = [
                {
                    id: '42',
                    name: 'Tesla model S',
                    balance: 3000,
                    initial_balance: 3000,
                    currency: {
                        code: 'USD',
                        rate: 1,
                        fixed: false
                    },
                    status: 'active',
                    order: 0,
                    modified: '2012-09-04T13:55:15Z'
                },
                {
                    id: '42',
                    name: 'Tesla model P',
                    balance: 200,
                    initial_balance: 7000,
                    currency: {
                        code: 'USD',
                        rate: 1,
                        fixed: false
                    },
                    status: 'inactive',
                    order: 0,
                    modified: '2012-09-04T13:55:15Z'
                }
            ];

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            toshlController
                .getToshlAccounts(accessToken)
                .then(result => {
                    expect(result).to.be.an('array');
                    expect(result).to.be.lengthOf(1);

                    done();
                });
        });
    });
});
