import SessionService from './SessionService';

import { SessionActionCreators } from '../action-creators/index';

import configureStore from '../config/store';

import { getMockStore } from '../../../test/react-helpers';

describe('session service', () => {
    beforeEach(function() {
        delete this.unsubscribe;

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
