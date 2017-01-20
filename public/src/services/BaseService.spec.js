import axios from 'axios';
import httpCodes from 'http-codes';

import BaseService from './BaseService';

describe('base service', () => {
    const testUrl = 'http://to.infinity.and.beyond';
    const testBody = {
        id: 'something..something...id'
    };

    beforeEach(function() {
        this.response = {
            data: testBody,
            status: httpCodes.OK,
            statusText: 'OK',
            headers: {},
            config: {}
        };

        this.axiosGetStub = stub(axios, 'get');
        this.axiosPostStub = stub(axios, 'post');
    });

    afterEach(function() {
        delete this.response;

        this.axiosGetStub.restore();
        this.axiosPostStub.restore();
    });

    describe('handleResponse()', function() {
        it('should return a rejected promise if the HTTP status is 400', function(done) {
            this.response.status = httpCodes.BAD_REQUEST;
            this.response.statusText = 'Bad Request';

            BaseService
                .handleResponse(this.response)
                .catch(result => {
                    expect(result).to.deep.equal(this.response.data);

                    done();
                });
        });

        it('should return a rejected promise if the HTTP status is 401', function(done) {
            this.response.status = httpCodes.UNAUTHORIZED;
            this.response.statusText = 'Unauthorized';

            BaseService
                .handleResponse(this.response)
                .catch(result => {
                    expect(result).to.deep.equal(this.response.data);

                    done();
                });
        });

        it('should return a rejected promise if the HTTP status is 500', function(done) {
            this.response.status = httpCodes.INTERNAL_SERVER_ERROR;
            this.response.statusText = 'Internal Server Error';

            BaseService
                .handleResponse(this.response)
                .catch(result => {
                    expect(result).to.deep.equal(this.response.data);

                    done();
                });
        });

        it('should return a resolved promise and the data if the HTTP status is 200', function(done) {
            BaseService
                .handleResponse(this.response)
                .then(result => {
                    expect(result).to.deep.equal(this.response.data);

                    done();
                });
        });

        it('should return a resolved promise and the data if the HTTP status is 201', function(done) {
            this.response.status = httpCodes.CREATED;
            this.response.statusText = 'Created';

            BaseService
                .handleResponse(this.response)
                .then(result => {
                    expect(result).to.deep.equal(this.response.data);

                    done();
                });
        });
    });

    describe('httpGet()', function() {
        it('should make a get request', function(done) {
            this.axiosGetStub.resolves(this.response);

            BaseService
                .httpGet(testUrl)
                .then(() => {
                    assert.calledWith(this.axiosGetStub, testUrl);

                    done();
                });
        });
    });

    describe('httpPost()', function() {
        it('should make a post request', function(done) {
            this.axiosPostStub.resolves(this.response);

            BaseService
                .httpPost(testUrl, testBody)
                .then(() => {
                    assert.calledWith(this.axiosPostStub, testUrl, testBody);

                    done();
                });
        });
    });
});
