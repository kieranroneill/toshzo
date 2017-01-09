'use strict';

const chai = require('chai');
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');

const headerMiddleware = require('../../middleware/index').header;

const config = require('../../config/default.json');

const expect = chai.expect;

describe('middleware/header', () => {
    beforeEach(() => {
        this.response = httpMocks.createResponse();

        this.nextSpy = sinon.spy();
    });

    afterEach(() => {
        delete this.response;

        this.nextSpy.reset();
    });

    describe('addResponseHeaders()', () => {
        it('should add a new "X-Powered-By" header', () => {
            headerMiddleware.addResponseHeaders({}, this.response, this.nextSpy);

            expect(this.response.getHeader(config.HEADERS.POWERED_BY)).to.equal('Unicorns!');

            sinon.assert.calledWith(this.nextSpy);
        });
    });

    describe('addStaticResponseHeaders()', () => {
        it('should add a new "X-Powered-By" header', () => {
            headerMiddleware.addStaticResponseHeaders(this.response);

            expect(this.response.getHeader(config.HEADERS.POWERED_BY)).to.equal('Unicorns!');
        });
    });
});
