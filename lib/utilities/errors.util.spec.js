import errorsUtil from './errors.util';

describe('utilities/errors', () => {
    describe('createMonzoError()', function() {
        it('should return a default error if the code is unrecognised', function() {
            const error = errorsUtil.createMonzoError('What is this??');

            expect(error).to.be.an('error');

            expect(error).to.have.property('status');
            expect(error.status)
                .to.be.a('number')
                .to.equal(httpCodes.INTERNAL_SERVER_ERROR);

            expect(error).to.have.property('errors');
            expect(error.errors)
                .to.be.an('array')
                .to.include(errors.SERVER_ERROR);
        });

        it('should return an error is unauthorized', function() {
            const error = errorsUtil.createMonzoError(httpCodes.UNAUTHORIZED);

            expect(error).to.be.an('error');

            expect(error).to.have.property('status')
                .to.equal(httpCodes.UNAUTHORIZED);

            expect(error).to.have.property('errors')
                .to.be.an('array')
                .to.include(errors.INVALID_MONZO_TOKEN);
        });
    });

    describe('createRequestError()', function() {
        it('should throw throw the default error if nothing is defined', function() {
            const error = errorsUtil.createRequestError();

            expect(error).to.be.an('error');

            expect(error).to.have.property('name');
            expect(error.name)
                .to.be.a('string')
                .to.equal('RequestError');

            expect(error).to.have.property('status');
            expect(error.status)
                .to.be.a('number')
                .to.equal(httpCodes.BAD_REQUEST);

            expect(error).to.have.property('errors');
            expect(error.errors)
                .to.be.an('array')
                .to.be.empty;

            expect(error).to.have.property('message');
            expect(error.message)
                .to.be.a('string')
                .to.be.empty;
        });

        it('should throw a bad request error if the status code is not a valid request error code', function() {
            const error = errorsUtil.createRequestError(123);

            expect(error).to.be.an('error');

            expect(error).to.have.property('status');
            expect(error.status)
                .to.be.a('number')
                .to.equal(httpCodes.BAD_REQUEST);
        });

        it('should throw an error with the correct parameters', function() {
            const message = 'An error occurred while displaying the previous error';
            const error = errorsUtil.createRequestError(httpCodes.UNAUTHORIZED, [message]);

            expect(error).to.be.an('error');

            expect(error).to.have.property('status');
            expect(error.status)
                .to.be.a('number')
                .to.equal(httpCodes.UNAUTHORIZED);

            expect(error).to.have.property('errors');
            expect(error.errors)
                .to.be.an('array')
                .to.include(message);
        });
    });

    describe('createToshlError()', function() {
        it('should return a default error if the code is unrecognised', function() {
            const error = errorsUtil.createToshlError('What is this??');

            expect(error).to.be.an('error');

            expect(error).to.have.property('status');
            expect(error.status)
                .to.be.a('number')
                .to.equal(httpCodes.INTERNAL_SERVER_ERROR);

            expect(error).to.have.property('errors');
            expect(error.errors)
                .to.be.an('array')
                .to.include(errors.SERVER_ERROR);
        });

        it('should return an error is unauthorized', function() {
            const error = errorsUtil.createToshlError(httpCodes.UNAUTHORIZED);

            expect(error).to.be.an('error');

            expect(error).to.have.property('status')
                .to.equal(httpCodes.UNAUTHORIZED);

            expect(error).to.have.property('errors')
                .to.be.an('array')
                .to.include(errors.INVALID_TOSHL_TOKEN);
        });

        it('should return an error when there are too many requests', function() {
            const error = errorsUtil.createToshlError(httpCodes.TOO_MANY_REQUESTS);

            expect(error).to.be.an('error');

            expect(error).to.have.property('status')
                .to.equal(httpCodes.TOO_MANY_REQUESTS);

            expect(error).to.have.property('errors')
                .to.be.an('array')
                .to.include(errors.TOO_MANY_REQUESTS);
        });
    });
});
