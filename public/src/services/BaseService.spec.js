import axios from 'axios';

import BaseService from './BaseService';

describe('base service', () => {
    const testUrl = 'http://to.infinity.and.beyond';
    const testBody = {
        id: 'something..something...id'
    };

    beforeEach(function() {
        this.axiosGetStub = stub(axios, 'get');
        this.axiosPostStub = stub(axios, 'post');
    });

    afterEach(function() {
        this.axiosGetStub.restore();
        this.axiosPostStub.restore();
    });

    describe('httpGet()', function() {
        it('should make a get request', function(done) {
            this.axiosGetStub.resolves();

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
            this.axiosPostStub.resolves();

            BaseService
                .httpPost(testUrl, testBody)
                .then(() => {
                    assert.calledWith(this.axiosPostStub, testUrl, testBody);

                    done();
                });
        });
    });
});
