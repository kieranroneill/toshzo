'use strict';

const route = strings.endpoints.API + strings.endpoints.TEAPOT;

describe('/teapot', () => {
    before(function() {
        this.app = server.app;
    });

    describe('get a teapot!', function() {
        it('should return a teapot errors', function(done) {
            supertest(this.app)
                .get(route)
                .expect(httpCodes.IM_A_TEAPOT)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.TEAPOT_ERROR);

                    done();
                });
        });
    });
});
