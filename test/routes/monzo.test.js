'use strict';

const chai = require('chai');
const httpCodes = require('http-codes');
const request = require('supertest');
const requestClient = require('request');
const sinon = require('sinon');

const config = require('../../config/default.json');
const errors = require('../../config/errors.json');

const expect = chai.expect;
const route = config.ENDPOINTS.API + config.ENDPOINTS.MONZO;

describe('/monzo', () => {
    before(() => this.app = server.app);

    beforeEach(() => {
        this.requestClientPostStub = sinon.stub(requestClient, 'post');
    });

    afterEach(() => {
        this.requestClientPostStub.restore();
    });

    describe('creates a Monzo access token', () => {
        it('should fail if the body is invalid', done => {
            const url = route + config.ENDPOINTS.AUTH;

            request(this.app)
                .post(url)
                .expect(httpCodes.BAD_REQUEST)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.REQUIRED_AUTHORIZATION_CODE);

                    done();
                });
        });

        it('should fail if the authorization code is invalid', done => {
            const url = route + config.ENDPOINTS.AUTH;
            const body = {
                authorizationCode: 'Yeah... this is not a valid code.'
            };

            this.requestClientPostStub
                .callsArgWith(1, null, { statusCode: httpCodes.BAD_REQUEST });

            request(this.app)
                .post(url)
                .send(body)
                .expect(httpCodes.BAD_REQUEST)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.INVALID_AUTHORIZATION_CODE);

                    done();
                });
        });
    });
});
