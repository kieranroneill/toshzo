import Promise from 'bluebird';

import { monzoController } from '../../lib/controllers/index';

const route = config.ENDPOINTS.API + config.ENDPOINTS.MONZO;

describe('/monzo', function() {
    before(function() {
        this.app = server.app;
    });

    beforeEach(function() {
        this.requestPostStub = stub(request, 'post');
        this.verifyStateTokenStub = stub(monzoController, 'verifyStateToken');
    });

    afterEach(function() {
        this.requestPostStub.restore();
        this.verifyStateTokenStub.restore();
    });

    describe('/token', function() {
        describe('/state', function() {
            it('should return a state token', function(done) {
                const url = route + config.ENDPOINTS.TOKEN + config.ENDPOINTS.STATE;

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

        describe('/access', function() {
            it('should fail if the query parameters are missing', function(done) {
                const url = route + config.ENDPOINTS.TOKEN + config.ENDPOINTS.ACCESS;

                supertest(this.app)
                    .post(url)
                    .expect(httpCodes.BAD_REQUEST)
                    .end((error, response) => {
                        expect(error).to.equal(null);
                        expect(response.body).to.be.an('object');
                        expect(response.body).to.have.property('errors')
                            .to.be.an('array')
                            .to.include(errors.REQUIRED_STATE_TOKEN)
                            .to.include(errors.REQUIRED_AUTHORISATION_CODE);

                        done();
                    });
            });

            it('should fail if the token is invalid', function(done) {
                let url = route + config.ENDPOINTS.TOKEN + config.ENDPOINTS.ACCESS;

                url += '?token=not_a_valid_token';
                url += '&code=respect_my_authoritaa';

                this.verifyStateTokenStub.restore();

                supertest(this.app)
                    .post(url)
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
                const token = monzoController.createStateToken('', 1);
                let url = route + config.ENDPOINTS.TOKEN + config.ENDPOINTS.ACCESS;

                url += '?token=' + token;
                url += '&code=respect_my_authoritaa';

                this.verifyStateTokenStub.restore();

                // Delay for 2 seconds.
                Promise
                    .delay(2000)
                    .then(() => {
                        supertest(this.app)
                            .post(url)
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
                const token = monzoController.createStateToken('not the localhost');
                let url = route + config.ENDPOINTS.TOKEN + config.ENDPOINTS.ACCESS;

                url += '?token=' + token;
                url += '&code=respect_my_authoritaa';

                this.verifyStateTokenStub.restore();

                supertest(this.app)
                    .post(url)
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

            it('should fail if the Monzo authorisation code is invalid', function(done) {
                let url = route + config.ENDPOINTS.TOKEN + config.ENDPOINTS.ACCESS;

                url += '?token=valid_token';
                url += '&code=invalid_code';

                this.verifyStateTokenStub.resolves();
                this.requestPostStub
                    .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED });

                supertest(this.app)
                    .post(url)
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

            it('should return a Monzo access token', function(done) {
                const responseBody = {
                    access_token: 'Oh what a lovely token',
                    client_id: 'hello dave',
                    expires_in: 21600,
                    refresh_token: 'refresh_token',
                    token_type: 'Bearer',
                    user_id: 'yay, I am you!'
                };
                let url = route + config.ENDPOINTS.TOKEN + config.ENDPOINTS.ACCESS;

                url += '?token=valid_token';
                url += '&code=valid_code';

                this.verifyStateTokenStub.resolves();
                this.requestPostStub
                    .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

                supertest(this.app)
                    .post(url)
                    .expect(httpCodes.OK)
                    .end((error, response) => {
                        expect(error).to.equal(null);
                        expect(response.body).to.be.an('object');
                        expect(response.body).to.have.property('token');
                        expect(response.body.token)
                            .to.be.a('string')
                            .to.equal(responseBody.access_token);

                        done();
                    });
            });
        });
    });
});
