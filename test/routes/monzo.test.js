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
        it('should fail if the query parameters are missing', done => {
            const url = route + config.ENDPOINTS.AUTH;

            request(this.app)
                .get(url)
                .expect(httpCodes.BAD_REQUEST)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.REQUIRED_AUTHORIZATION_CODE)
                        .to.include(errors.REQUIRED_SUPER_SECRET);

                    done();
                });
        });

        it('should fail if the super secret is invalid', done => {
            const url = route + config.ENDPOINTS.AUTH + '?code=authorio&state=hahahahaha';

            request(this.app)
                .get(url)
                .expect(httpCodes.BAD_REQUEST)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.INVALID_SUPER_SECRET);

                    done();
                });
        });

        it('should redirect to /auth if the authorisation code is invalid', done => {
            const url = route + config.ENDPOINTS.AUTH + '?code=invalid&state=' + process.env.SUPER_SECRET;

            this.requestClientPostStub
                .callsArgWith(1, null, { statusCode: httpCodes.UNAUTHORIZED });

            request(this.app)
                .get(url)
                .expect(httpCodes.FOUND)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.redirect).to.be.true;
                    expect(response.headers.location).to.equal(config.ROUTE.AUTH);

                    done();
                });
        });

        it('should redirect to /complete if it was successful', done => {
            const url = route + config.ENDPOINTS.AUTH + '?code=valid&state=' + process.env.SUPER_SECRET;
            const responseBody = {
                access_token: 'access_token',
                client_id: 'client_id',
                expires_in: 21600,
                refresh_token: 'refresh_token',
                token_type: 'Bearer',
                user_id: 'user_id'
            };

            this.requestClientPostStub
                .callsArgWith(1, null, { statusCode: httpCodes.OK, body: responseBody }, responseBody);

            request(this.app)
                .get(url)
                .expect(httpCodes.FOUND)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.redirect).to.be.true;
                    expect(response.headers.location).to.equal(config.ROUTE.ACCOUNTS);

                    done();
                });
        });
    });
});
