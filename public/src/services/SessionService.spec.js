import _ from 'underscore';

import SessionService from './SessionService';

// ActionCreators.
import { SessionActionCreators } from '../action-creators/index';

import configureStore from '../config/store';

import { getMockStore } from '../../../test/react-helpers';

describe('session service', () => {
    beforeEach(function() {
        this.unsubscribe = _.noop();

        this.httpGetStub = stub(SessionService.prototype, 'httpGet');
    });

    afterEach(function() {
        if(this.unsubscribe) {
            // Clean up.
            this.unsubscribe();
        }

        this.httpGetStub.restore();
    });

    describe('verifySessionToken()', function() {
        it('should dispatch actions if the session token returns unauthorised', function(done) {
            const store = getMockStore();
            const sessionService = new SessionService(store);
            const dispatchSpy = spy(store, 'dispatch');

            this.httpGetStub.rejects({ status: httpCodes.UNAUTHORIZED, errors: [errors.INVALID_SESSION_TOKEN] });

            sessionService
                .verifySessionToken('you will not get anything out of me!')
                .catch(() => {
                    assert.calledWith(dispatchSpy, SessionActionCreators.resetSessionState());

                    done();
                });
        });

        it('should update the authentication state if the session token returns unauthorised', function(done) {
            const store = configureStore();
            const sessionService = new SessionService(store);

            this.httpGetStub.rejects({ status: httpCodes.UNAUTHORIZED, errors: [errors.INVALID_SESSION_TOKEN] });

            this.unsubscribe = store.subscribe(() => {
                expect(store.getState().session.token).to.be.null;
                expect(store.getState().session.isLoggedIn).to.be.false;

                done();
            });

            sessionService.verifySessionToken('you will not get anything out of me!');
        });

        it('should send a dispatch to update the authentication state', function(done) {
            const store = getMockStore();
            const sessionService = new SessionService(store);
            const dispatchSpy = spy(store, 'dispatch');

            this.httpGetStub.resolves();

            sessionService
                .verifySessionToken('validate me!!!!!')
                .then(() => {
                    assert.calledWith(dispatchSpy, SessionActionCreators.setAuthenticationState(true));

                    done();
                });
        });

        it('should update the authentication state once the user has successfully verified the session', function(done) {
            const store = configureStore();
            const sessionService = new SessionService(store);

            this.httpGetStub.resolves();

            this.unsubscribe = store.subscribe(() => {
                expect(store.getState().session.isLoggedIn).to.be.true;

                done();
            });

            sessionService.verifySessionToken('validate me!!!!!');
        });
    });
});
