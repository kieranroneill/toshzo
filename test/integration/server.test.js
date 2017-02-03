import strings from '../../config/strings.json';

describe('server', () => {
    const route = '/';

    before(function() {
        this.app = server.app;
    });

    describe('headers', function() {
        it('should return the correct headers for HTML pages', function(done) {
            supertest(this.app)
                .get(route)
                .expect(httpCodes.OK)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.headers).to.have.property(strings.headers.POWERED_BY.toLowerCase());
                    expect(response.headers[strings.headers.POWERED_BY.toLowerCase()]).to.equal('Unicorns!');

                    done();
                });
        });
    });

    describe('serving html', function() {
        it('should serve a HTML document at the base route', function(done) {
            supertest(this.app)
                .get(route)
                .expect(httpCodes.OK)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.type).to.equal('text/html');

                    done();
                });
        });

        it('should not serve a HTML document for valid /api routes', function(done) {
            supertest(this.app)
                .get(strings.endpoints.API + strings.endpoints.INFO)
                .expect(httpCodes.OK)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.type).to.not.equal('text/html');

                    done();
                });
        });
    });
});
