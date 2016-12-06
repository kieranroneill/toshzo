'use strict';

const chai = require('chai');
const httpCodes = require('http-codes');
const request = require('supertest');

const config = require('../../config/default.json');
const errors = require('../../config/errors.json');

const expect = chai.expect;
const route = config.ROUTE.UNICORN_ENDPOINT;

describe('/unicorn', () => {
    before(() => this.app = server.app);

    describe('deletes a unicorn', () => {
        it('should delete a unicorn', done => {
            const url = route + '/a-unique-id';

            request(this.app)
                .delete(url)
                .expect(httpCodes.OK)
                .end((error) => {
                    expect(error).to.equal(null);

                    done();
                });
        });
    });

    describe('create a unicorn', () => {
        it('should fail if the required body properties are missing', done => {
            request(this.app)
                .post(route)
                .send({})
                .expect(httpCodes.BAD_REQUEST)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.REQUIRED_COLOUR);

                    done();
                });
        });

        it('should fail if the colour is invalid', done => {
            request(this.app)
                .post(route)
                .send({ colour: 'brown' })
                .expect(httpCodes.BAD_REQUEST)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('error')
                        .to.be.an('array')
                        .to.include(errors.INVALID_COLOUR);

                    done();
                });
        });

        it('should create a user', done => {
            request(this.app)
                .post(route)
                .send({ colour: 'white' })
                .expect(httpCodes.CREATED)
                .end(error => {
                    expect(error).to.equal(null);

                    done();
                });
        });
    });

    describe('gets the unicorns', () => {
        it('should return a list of unicorns', done => {
            request(this.app)
                .get(route)
                .expect(httpCodes.OK)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('array');

                    done();
                });
        });
    });

    describe('get a unicorn', () => {
        it('should get a unicorn', done => {
            const url = route + '/a-unique-id';

            request(this.app)
                .get(url)
                .expect(httpCodes.OK)
                .end((error, response) => {
                    expect(error).to.equal(null);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('colour');

                    done();
                });
        });
    });

    describe('updates a unicorn', () => {
        it('should update a unicorn', done => {
            const url = route + '/a-unique-id';

            request(this.app)
                .patch(url)
                .expect(httpCodes.OK)
                .end((error) => {
                    expect(error).to.equal(null);

                    done();
                });
        });
    });
});
