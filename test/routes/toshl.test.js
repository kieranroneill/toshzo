'use strict';

const route = config.ENDPOINTS.API + config.ENDPOINTS.TOSHL;

describe('/toshl', () => {
    before(function() {
        this.app = server.app;
    });

    beforeEach(function() {
        this.requestGetStub = stub(request, 'get');
    });

    afterEach(function() {
        this.requestGetStub.restore();
    });

    describe('/token', function() {
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
                        .to.include(errors.REQUIRED_TOSHL_TOKEN);

                    done();
                });
        });

        it('should fail if the Toshl personal token is invalid', function(done) {
            let url = route + config.ENDPOINTS.TOKEN;

            url += '?token=invalid_token';

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
                        .to.include(errors.INVALID_TOSHL_TOKEN);

                    done();
                });
        });

        it('should succeed if the Toshl personal token is valid', function(done) {
            const responseBody = {
                id: '123-Yo',
                email: 'kieranroneill@googlemail.com',
                first_name: 'Kieran',
                last_name: 'O\'Neill',
                currency: {
                    main: 'GBP'
                }
            };
            let url = route + config.ENDPOINTS.TOKEN;

            url += '?token=valid_token';

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
