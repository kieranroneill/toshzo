'use strict';

const route = config.ENDPOINTS.API + config.ENDPOINTS.MONZO;

describe('/monzo', function() {
    before(function() {
        this.app = server.app;
    });

    beforeEach(function() {
        this.requestPostStub = stub(request, 'post');
    });

    afterEach(function() {
        this.requestPostStub.restore();
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
                    expect(response.body).to.have.property('error')
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
});
