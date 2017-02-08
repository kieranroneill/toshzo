import Promise from 'bluebird';
import jwt from 'jsonwebtoken';

import { monzoController, sessionController, toshlController } from '../../lib/controllers';

import { errorsUtil } from '../../lib/utilities/index';

describe('controllers/session', () => {
    const clientIp = 'http://i.am.a.client';
    const monzoToken = 'a_monzo_token';
    const toshlToken = 'a_toshl_token';

    beforeEach(function() {
        this.monzoWhoAmIStub = stub(monzoController, 'whoAmI');
        this.toshlMeStub = stub(toshlController, 'me');
    });

    afterEach(function() {
        this.monzoWhoAmIStub.restore();
        this.toshlMeStub.restore();
    });

    describe('createSessionToken()', () => {
        it('should return an error if the token secret is incorrect', function(done) {
            const token = sessionController.createSessionToken('http://127.0.0.1');

            jwt.verify(token, 'this is not the correct secret', error => {
                expect(error.name).to.equal('JsonWebTokenError');

                done();
            });
        });

        it('should return a token signed with the client IP address', function(done) {
            const token = sessionController.createSessionToken(clientIp, monzoToken, toshlToken);

            jwt.verify(token, process.env.SUPER_SECRET, (error, decoded) => {
                expect(error).to.be.null;
                expect(decoded).to.have.property('clientIp');
                expect(decoded.clientIp).to.equal(clientIp);


                done();
            });
        });

        it('should return a token that expires in the default time', function(done) {
            const token = sessionController.createSessionToken(clientIp, monzoToken, toshlToken);

            jwt.verify(token, process.env.SUPER_SECRET, (error, decoded) => {
                expect(error).to.be.null;
                expect(decoded.exp - decoded.iat).to.equal(7200); // Default time difference should be 2 hour.

                done();
            });
        });

        it('should return a token that expires in a specified time', function(done) {
            const token = sessionController.createSessionToken(clientIp, monzoToken, toshlToken, 300);

            jwt.verify(token, process.env.SUPER_SECRET, (error, decoded) => {
                expect(error).to.be.null;
                expect(decoded.exp - decoded.iat).to.equal(300);

                done();
            });
        });
    });

    describe('verifySessionToken()', function() {
        it('should fail if the token has expired', function(done) {
            const token = sessionController.createSessionToken(clientIp, monzoToken, toshlToken, 1);

            Promise
                .delay(2000) // Delay for 2 seconds.
                .then(() => sessionController.verifySessionToken(clientIp, token))
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.TOKEN_HAS_EXPIRED);

                    done();
                });
        });

        it('should fail if the client IP address is incorrect', function(done) {
            const token = sessionController.createSessionToken(clientIp, monzoToken, toshlToken, 1);

            sessionController
                .verifySessionToken('not the correct IP', token)
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_CLIENT);

                    done();
                });
        });

        it('should fail if the Monzo access token is invalid', function(done) {
            const token = sessionController.createSessionToken(clientIp, monzoToken, toshlToken, 1);

            this.monzoWhoAmIStub.rejects(errorsUtil.createMonzoError(httpCodes.UNAUTHORIZED));
            this.toshlMeStub.resolves();

            sessionController
                .verifySessionToken(clientIp, token)
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_MONZO_TOKEN);

                    done();
                });
        });

        it('should fail if the Toshl personal token is invalid', function(done) {
            const token = sessionController.createSessionToken(clientIp, monzoToken, toshlToken, 1);

            this.monzoWhoAmIStub.resolves();
            this.toshlMeStub.rejects(errorsUtil.createToshlError(httpCodes.UNAUTHORIZED));

            sessionController
                .verifySessionToken(clientIp, token)
                .catch(error => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('status')
                        .to.equal(httpCodes.UNAUTHORIZED);
                    expect(error).to.have.property('errors')
                        .to.be.an('array')
                        .to.include(errors.INVALID_TOSHL_TOKEN);

                    done();
                });
        });

        it('should succeed if the token is valid', function(done) {
            const token = sessionController.createSessionToken(clientIp, monzoToken, toshlToken, 1);

            this.monzoWhoAmIStub.resolves();
            this.toshlMeStub.resolves();

            sessionController
                .verifySessionToken(clientIp, token)
                .then(result => {
                    expect(result).to.have.property('clientIp');
                    expect(result.clientIp).to.equal(clientIp);

                    expect(result).to.have.property('monzoToken');
                    expect(result.monzoToken).to.equal(monzoToken);

                    expect(result).to.have.property('toshlToken');
                    expect(result.toshlToken).to.equal(toshlToken);

                    done();
                });
        });
    });
});
