'use strict';

const route = config.ENDPOINTS.API + config.ENDPOINTS.REFERENCE;

describe('/reference', () => {
    before(function() {
        this.app = server.app;
    });

    describe('get the references', function() {
        it('should get the references', function(done) {
            supertest(this.app)
                .get(route)
                .expect(httpCodes.OK)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');

                    expect(response.body).to.have.property('monzo');
                    expect(response.body.monzo).to.have.property('clientId');

                    done();
                });
        });
    });
});
