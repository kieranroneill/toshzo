import Promise from 'bluebird';

import { monzoController } from '../../lib/controllers/index';

const route = config.ENDPOINTS.API + config.ENDPOINTS.MONZO;

describe('/monzo', function() {
    before(function() {
        this.app = server.app;
    });

    beforeEach(function() {
        this.requestGetStub = stub(request, 'get');
        this.requestPostStub = stub(request, 'post');
        this.verifyStateTokenStub = stub(monzoController, 'verifyStateToken');
    });

    afterEach(function() {
        this.requestGetStub.restore();
        this.requestPostStub.restore();
        this.verifyStateTokenStub.restore();
    });

    describe('creates a Monzo access token', function() {
        it('should fail if the query parameters are missing', function(done) {
            const url = route + config.ENDPOINTS.AUTH;

            supertest(this.app)
                .get(url)
                .expect(httpCodes.BAD_REQUEST)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.REQUIRED_AUTHORIZATION_CODE);

                    done();
                });
        });

        it('should redirect to /auth if the authorisation code is invalid', function(done) {
            const url = route + config.ENDPOINTS.AUTH + '?authorisationCode=invalid&state=' + process.env.SUPER_SECRET;

            this.requestPostStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED });

            supertest(this.app)
                .get(url)
                .expect(httpCodes.FOUND)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.redirect).to.be.true;
                    expect(response.headers.location).to.equal(config.ROUTE.AUTH);

                    done();
                });
        });

        it('should redirect to /complete if it was successful', function(done) {
            const url = route + config.ENDPOINTS.AUTH + '?authorisationCode=valid&state=' + process.env.SUPER_SECRET;
            const responseBody = {
                access_token: 'access_token',
                client_id: 'client_id',
                expires_in: 21600,
                refresh_token: 'refresh_token',
                token_type: 'Bearer',
                user_id: 'user_id'
            };

            this.requestPostStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            supertest(this.app)
                .get(url)
                .expect(httpCodes.FOUND)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.redirect).to.be.true;
                    expect(response.headers.location).to.equal(config.ROUTE.ACCOUNTS);

                    done();
                });
        });
    });

    describe('creates a Monzo state token', function() {
        it('should return a token used for Monzo authorisation', function(done) {
            const url = route + config.ENDPOINTS.TOKEN;

            supertest(this.app)
                .post(url)
                .expect(httpCodes.OK)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('token')
                        .to.be.an('string');

                    done();
                });
        });
    });

    describe('checks the validity of the Monzo access token', function() {
        it('should fail if the query parameters are missing', function(done) {
            const url = route + config.ENDPOINTS.TOKEN;

            supertest(this.app)
                .get(url)
                .expect(httpCodes.BAD_REQUEST)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.REQUIRED_STATE_TOKEN)
                        .to.include(errors.REQUIRED_MONZO_TOKEN);

                    done();
                });
        });

        it('should fail if the token is invalid', function(done) {
            let url = route + config.ENDPOINTS.TOKEN + '?';

            url += 'accessToken=a_token_yeah&';
            url += 'stateToken=not_a_valid_token';

            this.verifyStateTokenStub.restore();

            supertest(this.app)
                .get(url)
                .expect(httpCodes.UNAUTHORIZED)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_STATE_TOKEN);

                    done();
                });
        });

        it('should fail if the token has expired', function(done) {
            const token = monzoController.getStateToken('', 1);
            let url = route + config.ENDPOINTS.TOKEN + '?';

            url += 'accessToken=a_token_yeah&';
            url += 'stateToken=' + token;

            this.verifyStateTokenStub.restore();

            // Delay for 2 seconds.
            Promise
                .delay(2000)
                .then(() => {
                    supertest(this.app)
                        .get(url)
                        .expect(httpCodes.UNAUTHORIZED)
                        .end((error, response) => {
                            expect(error).to.equal(null);
                            expect(response.body).to.be.an('object');
                            expect(response.body).to.have.property('errors')
                                .to.be.an('array')
                                .to.include(errors.TOKEN_HAS_EXPIRED);

                            done();
                        });
                });
        });

        it('should fail if the client IP addresses do not match', function(done) {
            const token = monzoController.getStateToken('not the localhost');
            let url = route + config.ENDPOINTS.TOKEN + '?';

            url += 'accessToken=a_token_yeah&';
            url += 'stateToken=' + token;

            this.verifyStateTokenStub.restore();

            supertest(this.app)
                .get(url)
                .expect(httpCodes.UNAUTHORIZED)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_CLIENT);

                    done();
                });
        });

        it('should fail if the Monzo access token is invalid', function(done) {
            let url = route + config.ENDPOINTS.TOKEN + '?';

            url += 'accessToken=invalid_token&';
            url += 'stateToken=valid_token';

            this.verifyStateTokenStub.resolves();
            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED });

            supertest(this.app)
                .get(url)
                .expect(httpCodes.UNAUTHORIZED)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_MONZO_TOKEN);

                    done();
                });
        });

        it('should succeed if the both tokens are valid', function(done) {
            const responseBody = {
                user: {
                    id: 'a monzo user id'
                }
            };
            let url = route + config.ENDPOINTS.TOKEN + '?';

            url += 'accessToken=valid_token&';
            url += 'stateToken=valid_token';

            this.verifyStateTokenStub.resolves();
            this.requestGetStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            supertest(this.app)
                .get(url)
                .expect(httpCodes.OK)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('user');
                    expect(response.body.user).to.have.property('id');

                    done();
                });
        });
    });
});
