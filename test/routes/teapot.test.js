'use strict';

const chai = require('chai');
const httpCodes = require('http-codes');
const request = require('supertest');

const config = require('../../config/default.json');
const errors = require('../../config/errors.json');

const expect = chai.expect;
const route = config.ROUTE.TEAPOT_ENDPOINT;

describe('/teapot', () => {
    before(() => this.app = server.app);

    describe('get the teapot', () => {
        it('should fail with a teapot!', done => {
            request(this.app)
                .get(route)
                .expect(httpCodes.IM_A_TEAPOT)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.TEAPOT_ERROR);

                    done();
                });
        });
    });
});
