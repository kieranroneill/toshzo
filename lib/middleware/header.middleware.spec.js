'use strict';

import { headerMiddleware } from '../../lib/middleware';

describe('middleware/header', () => {
    beforeEach(function() {
        this.response = httpMocks.createResponse();

        this.nextSpy = spy();
    });

    afterEach(function() {
        delete this.response;

        this.nextSpy.reset();
    });

    describe('addResponseHeaders()', function() {
        it('should add a new "X-Powered-By" header', function() {
            headerMiddleware.addResponseHeaders({}, this.response, this.nextSpy);

            expect(this.response.getHeader(config.HEADERS.POWERED_BY)).to.equal('Unicorns!');

            assert.calledWith(this.nextSpy);
        });
    });

    describe('addStaticResponseHeaders()', function() {
        it('should add a new "X-Powered-By" header', function() {
            headerMiddleware.addStaticResponseHeaders(this.response);

            expect(this.response.getHeader(config.HEADERS.POWERED_BY)).to.equal('Unicorns!');
        });
    });
});