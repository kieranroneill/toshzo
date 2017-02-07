import { toshlController } from '../../lib/controllers';

describe('controllers/toshl', () => {
    beforeEach(function() {
        this.requestGetStub = stub(request, 'get');
    });

    afterEach(function() {
        this.requestGetStub.restore();
    });

    describe('getAccounts()', function() {
        it('should fail if the access token is invalid', function(done) {
            const personalToken = 'So terribly invalid';
            const responseBody = {
                error_id: 'error.authorization.token_invalid',
                description: 'Token is invalid.'
            };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED, body: responseBody }, responseBody);

            toshlController
                .getAccounts(personalToken)
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_TOSHL_TOKEN);

                    done();
                });
        });

        it('should fail if there are too many requests to Toshl', function(done) {
            const personalToken = 'Adventure time!';
            const responseBody = {
                description: 'Have we DDoS-ed?'
            };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.TOO_MANY_REQUESTS, body: responseBody }, responseBody);

            toshlController
                .getAccounts(personalToken)
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.TOO_MANY_REQUESTS);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.TOO_MANY_REQUESTS);

                    done();
                });
        });

        it('should return the accounts if the access token is valid', function(done) {
            const personalToken = 'I am a valid token.... ftw!';
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
                .getAccounts(personalToken)
                .then(result => {
                    expect(result).to.be.an('array');
                    expect(result).to.be.lengthOf(1);

                    done();
                });
        });

        it('should return only active account', function(done) {
            const personalToken = 'I am a valid token.... ftw!';
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
                .getAccounts(personalToken)
                .then(result => {
                    expect(result).to.be.an('array');
                    expect(result).to.be.lengthOf(1);

                    done();
                });
        });
    });

    describe('me()', function() {
        it('should fail if the Toshl personal token is invalid', function(done) {
            const responseBody = {
                error_id: 'error.authorization.token_invalid',
                description: 'Token is invalid.'
            };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED, body: responseBody }, responseBody);

            toshlController
                .me('not a valid token, bub.')
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_TOSHL_TOKEN);

                    done();
                });
        });

        it('should fail if there are too many requests to Toshl', function(done) {
            const responseBody = {
                description: 'Have we DDoS-ed?'
            };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.TOO_MANY_REQUESTS, body: responseBody }, responseBody);

            toshlController
                .me('Adventure time!')
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.TOO_MANY_REQUESTS);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.TOO_MANY_REQUESTS);

                    done();
                });
        });

        it('should succeed if the token is valid', function(done) {
            const responseBody = {
                id: '123-Yo',
                email: 'kieranroneill@googlemail.com',
                first_name: 'Kieran',
                last_name: 'O\'Neill',
                currency: {
                    main: 'GBP'
                }
            };

            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            toshlController
                .me('I have a good feeling this time...')
                .then(result => {
                    expect(result).to.be.an('object');
                    expect(result).to.have.property('id');
                    expect(result.id).to.be.a('string');
                    expect(result).to.have.property('email');
                    expect(result.id).to.be.a('string');
                    expect(result).to.have.property('first_name');
                    expect(result.id).to.be.a('string');
                    expect(result).to.have.property('last_name');
                    expect(result.id).to.be.a('string');

                    done();
                });
        });
    });
});
