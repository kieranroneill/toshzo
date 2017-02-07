import authMiddleware from './auth.middleware';

import { sessionController } from '../controllers/index';

import { errorsUtil } from '../utilities/index';

describe('middleware/auth', () => {
    const decodedSession = {
        clientIp: 'http://i.am.a.client',
        monzoToken: 'a_monzo_token',
        toshlToken: 'a_toshl_token'
    };

    beforeEach(function() {
        this.request = {
            headers: {
                'host': 'localhost:1337',
                'connection': 'keep-alive',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko)' +
                'Chrome/54.0.2840.98 Safari/537.36',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'accept-encoding': 'gzip, deflate, sdch, br',
                'accept-language': 'en-GB,en-US;q=0.8,en;q=0.6'
            }
        };

        this.nextSpy = spy();
        this.verifySessionTokenStub = stub(sessionController, 'verifySessionToken');
    });

    afterEach(function() {
        delete this.request;

        this.nextSpy.reset();
        this.verifySessionTokenStub.restore();
    });

    describe('isAuthenticated()', function() {
        it('should fail if there is no session token', function() {
            let errorArgs;

            authMiddleware.isAuthenticated(this.request, {}, this.nextSpy);
            ;
            errorArgs = this.nextSpy.getCall(0).args[0];

            expect(errorArgs).to.be.an('error');
            expect(errorArgs).to.have.property('status')
                .to.be.a('number')
                .to.equal(httpCodes.UNAUTHORIZED);
            expect(errorArgs).to.have.property('errors')
                .to.be.an('array')
                .to.include(errors.REQUIRED_SESSION_TOKEN);
        });

        it('should fail if the session token is invalid', function(done) {
            let errorArgs;

            this.request.headers[strings.headers.SESSION_TOKEN] = 'so terribly invalid';
            this.verifySessionTokenStub.rejects(errorsUtil.createRequestError(httpCodes.UNAUTHORIZED, []));

            authMiddleware
                .isAuthenticated(this.request, {}, this.nextSpy)
                .then(() => {
                    errorArgs = this.nextSpy.getCall(0).args[0];

                    expect(errorArgs).to.be.an('error');
                    expect(errorArgs).to.have.property('status')
                        .to.be.a('number')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(errorArgs).to.have.property('errors')
                        .to.be.an('array');

                    done();
                });
        });

        it('should succeed without errors', function(done) {
            // Add valid token to header.
            this.request.headers[strings.headers.SESSION_TOKEN] = 'a lovely valid token';

            this.verifySessionTokenStub.resolves(decodedSession);

            authMiddleware
                .isAuthenticated(this.request, {}, this.nextSpy)
                .then(() => {
                    assert.calledWith(this.nextSpy, null, decodedSession);

                    done();
                });
        });
    });

    describe('isAuthenticatedAsPromised()', function() {
        it('should fail if there is no session token', function(done) {
            authMiddleware
                .isAuthenticatedAsPromised('http://who.am.i')
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.be.a('number')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.REQUIRED_SESSION_TOKEN);

                    done();
                });
        });

        it('should fail if the session token is invalid', function(done) {
            this.request.headers[strings.headers.SESSION_TOKEN] = 'so terribly invalid';
            this.verifySessionTokenStub.rejects(errorsUtil.createRequestError(httpCodes.UNAUTHORIZED, []));

            authMiddleware
                .isAuthenticatedAsPromised('http://who.am.i', 'so terribly invalid')
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.be.a('number')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array');

                    done();
                });
        });

        it('should succeed without errors', function(done) {
            this.verifySessionTokenStub.resolves(decodedSession);

            authMiddleware
                .isAuthenticatedAsPromised('http://who.am.i', 'a lovely valid token')
                .then(result => {
                    expect(result).to.deep.equal(decodedSession);

                    done();
                });
        });
    });
});
