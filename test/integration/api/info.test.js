'use strict';

const packageJson = require('../../../package.json');

const route = strings.endpoints.API + strings.endpoints.INFO;

describe('/info', () => {
    before(function() {
        this.app = server.app;
    });

    describe('get the information', function() {
        it('should get the information', function(done) {
            supertest(this.app)
                .get(route)
                .expect(httpCodes.OK)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');

                    expect(response.body).to.have.property('author');
                    expect(response.body.author).to.equal(packageJson.author.name);

                    expect(response.body).to.have.property('description');
                    expect(response.body.description).to.equal(packageJson.description);

                    expect(response.body).to.have.property('source');
                    expect(response.body.source).to.equal(packageJson.repository.url);

                    expect(response.body).to.have.property('version');
                    expect(response.body.version).to.equal(packageJson.version);

                    done();
                });
        });
    });
});
