'use strict';

const chai = require('chai');
const httpCodes = require('http-codes');
const sinon = require('sinon');

const authMiddleware = require('../../middleware/index').auth;

const config = require('../../config/default.json');
const errors = require('../../config/errors.json');

const expect = chai.expect;

describe('controllers/toshl', () => {
    beforeEach(() => {
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

        this.nextSpy = sinon.spy();
    });

    afterEach(() => {
        delete this.request;

        this.nextSpy.reset();
    });

    describe('isAuthenticated()', () => {
        it('should fail if the super secret does not match', () => {
            let errorArgs;

            authMiddleware.isAuthenticated(this.request, {}, this.nextSpy);

            errorArgs = this.nextSpy.getCall(0).args[0];

            expect(errorArgs).to.be.an('object');
            expect(errorArgs).to.have.property('status')
                .to.be.a('number')
                .to.equal(httpCodes.UNAUTHORIZED);
            expect(errorArgs).to.have.property('error')
                .to.be.an('array')
                .to.include(errors.INVALID_SUPER_SECRET);
        });

        it('should succeed without errors', () => {
            // Add valid token to header.
            this.request.headers[config.HEADERS.TOSHL_TOKEN] = process.env.SUPER_SECRET;

            authMiddleware.isAuthenticated(this.request, {}, this.nextSpy);

            sinon.assert.calledWith(this.nextSpy);
        });
    });
});
