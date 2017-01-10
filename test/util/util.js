'use strict';

import { util } from '../../util';

describe('util/util', () => {
    describe('createMonzoError()', function() {
        it('should return a default error if the code is unrecognised', function() {
            const result = util.createMonzoError('What is this??');

            expect(result).to.have.property('status')
                .to.equal(httpCodes.INTERNAL_SERVER_ERROR);
            expect(result).to.have.property('error')
                .to.be.an('array')
                .to.include(errors.SERVER_ERROR);
        });

        it('should return an error is unauthorized', function() {
            const result = util.createMonzoError(httpCodes.UNAUTHORIZED);

            expect(result).to.have.property('status')
                .to.equal(httpCodes.UNAUTHORIZED);
            expect(result).to.have.property('error')
                .to.be.an('array')
                .to.include(errors.INVALID_MONZO_TOKEN);
        });
    });

    describe('createToshlError()', function() {
        it('should return a default error if the code is unrecognised', function() {
            const result = util.createToshlError('What is this??');

            expect(result).to.have.property('status')
                .to.equal(httpCodes.INTERNAL_SERVER_ERROR);
            expect(result).to.have.property('error')
                .to.be.an('array')
                .to.include(errors.SERVER_ERROR);
        });

        it('should return an error is unauthorized', function() {
            const result = util.createToshlError(httpCodes.UNAUTHORIZED);

            expect(result).to.have.property('status')
                .to.equal(httpCodes.UNAUTHORIZED);
            expect(result).to.have.property('error')
                .to.be.an('array')
                .to.include(errors.INVALID_TOSHL_TOKEN);
        });

        it('should return an error when there are too many requests', function() {
            const result = util.createToshlError(httpCodes.TOO_MANY_REQUESTS);

            expect(result).to.have.property('status')
                .to.equal(httpCodes.TOO_MANY_REQUESTS);
            expect(result).to.have.property('error')
                .to.be.an('array')
                .to.include(errors.TOO_MANY_REQUESTS);
        });
    });
});
