import Promise from 'bluebird';

import { monzoController, sessionController, toshlController } from '../../lib/controllers/index';

import { util } from '../../lib/util/index';

const route = config.ENDPOINTS.API + config.ENDPOINTS.SESSION;

describe('/session', () => {
    const clientIp = 'http://i.am.a.client';
    const monzoToken = 'a_monzo_token';
    const toshlToken = 'a_toshl_token';

    before(function() {
        this.app = server.app;
    });

    beforeEach(function() {
        this.monzoWhoAmIStub = stub(monzoController, 'whoAmI');
        this.toshlMeStub = stub(toshlController, 'me');
        this.verifySessionTokenStub = stub(sessionController, 'verifySessionToken');
    });

    afterEach(function() {
        this.monzoWhoAmIStub.restore();
        this.toshlMeStub.restore();
        this.verifySessionTokenStub.restore();
    });

    describe('create session token', function() {
        it('should fail if the query parameters are missing', function(done) {
            supertest(this.app)
                .post(route)
                .send({})
                .expect(httpCodes.BAD_REQUEST)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.REQUIRED_MONZO_TOKEN)
                        .to.include(errors.REQUIRED_TOSHL_TOKEN);

                    done();
                });
        });

        it('should fail if the Monzo access token is invalid', function(done) {
            const body = {
                monzoToken: 'invalid_token',
                toshlToken: 'does it matter if this is valid?'
            };

            this.monzoWhoAmIStub.rejects(util.createMonzoError(httpCodes.UNAUTHORIZED));
            this.toshlMeStub.resolves();

            supertest(this.app)
                .post(route)
                .send(body)
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

        it('should fail if the Toshl personal token is invalid', function(done) {
            const body = {
                monzoToken: 'I am through!!',
                toshlToken: 'invalid_token'
            };

            this.monzoWhoAmIStub.resolves();
            this.toshlMeStub.rejects(util.createToshlError(httpCodes.UNAUTHORIZED));

            supertest(this.app)
                .post(route)
                .send(body)
                .expect(httpCodes.UNAUTHORIZED)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_TOSHL_TOKEN);

                    done();
                });
        });

        it('should return a token that expires in 2 hours', function(done) {
            const body = {
                monzoToken: 'Monzo-yes',
                toshlToken: 'Tish-Toshl'
            };

            this.monzoWhoAmIStub.resolves();
            this.toshlMeStub.resolves();

            supertest(this.app)
                .post(route)
                .send(body)
                .expect(httpCodes.OK)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('token');
                    expect(response.body.token).to.be.a('string');

                    done();
                });
        });
    });

    describe('authenticate a session token', function() {
        it('should fail if the query parameters are missing', function(done) {
            supertest(this.app)
                .get(route)
                .expect(httpCodes.BAD_REQUEST)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.REQUIRED_SESSION_TOKEN);

                    done();
                });
        });

        it('should fail if the token has expired', function(done) {
            const token = sessionController.createSessionToken(clientIp, monzoToken, toshlToken, 1);
            const url = route + '?token=' + token;

            this.verifySessionTokenStub.restore();

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
            const token = sessionController.createSessionToken('not the localhost', monzoToken, toshlToken);
            const url = route + '?token=' + token;

            this.verifySessionTokenStub.restore();

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

        it('should succeed if everything is a-ok', function(done) {
            const url = route + '?token=a_valid_token';

            this.verifySessionTokenStub.resolves();

            supertest(this.app)
                .get(url)
                .expect(httpCodes.OK)
                .end(error => {
                    expect(error).to.equal(null);

                    done();
                });
        });
    });
});
