'use strict';

const route = config.ENDPOINTS.API + config.ENDPOINTS.SESSION;

describe('/session', () => {
    before(function() {
        this.app = server.app;
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
    });
});
