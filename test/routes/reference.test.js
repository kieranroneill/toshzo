'use strict';

const chai = require('chai');
const httpCodes = require('http-codes');
const request = require('supertest');

const config = require('../../config/default.json');

const expect = chai.expect;
const route = config.ENDPOINTS.API + config.ENDPOINTS.REFERENCE;

describe('/reference', () => {
    before(() => this.app = server.app);

    describe('get the references', () => {
        it('should get the references', done => {
            request(this.app)
                .get(route)
                .expect(httpCodes.OK)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');

                    expect(response.body).to.have.property('monzo');
                    expect(response.body.monzo).to.have.property('clientId');
                    expect(response.body.monzo).to.have.property('redirectUri');

                    done();
                });
        });
    });
});
