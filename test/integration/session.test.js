'use strict';

import { monzoController, toshlController } from '../../lib/controllers/index';

import { util } from '../../lib/util/index';

const route = config.ENDPOINTS.API + config.ENDPOINTS.SESSION;

describe('/session', () => {
    before(function() {
        this.app = server.app;
    });

    beforeEach(function() {
        this.monzoWhoAmIStub = stub(monzoController, 'whoAmI');
        this.toshlMeStub = stub(toshlController, 'me');
    });

    afterEach(function() {
        this.monzoWhoAmIStub.restore();
        this.toshlMeStub.restore();
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
    });
});
