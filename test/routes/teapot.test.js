'use strict';

const route = config.ENDPOINTS.API + config.ENDPOINTS.TEAPOT;

describe('/teapot', () => {
    before(function() {
        this.app = server.app;
    });

    describe('get the teapot', function() {
        it('should fail with a teapot!', function(done) {
            supertest(this.app)
                .get(route)
                .expect(httpCodes.IM_A_TEAPOT)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.TEAPOT_ERROR);

                    done();
                });
        });
    });
});
