import * as SessionActionCreators from './SessionActionCreators';
import { SessionActions } from '../actions/index';

describe('session actions', () => {
    it('should create an action to set the session token', () => {
        const token = 'Tokenize time';
        const expectedAction = { type: SessionActions.SET_SESSION_TOKEN, value: token };

        expect(SessionActionCreators.setSessionToken(token)).to.deep.equal(expectedAction);
    });

    it('should create an action to set the authenticated state', () => {
        const isLoggedIn = false;
        const expectedAction = { type: SessionActions.SET_AUTHENTICATION_STATE, value: isLoggedIn };

        expect(SessionActionCreators.setAuthenticationState(isLoggedIn)).to.deep.equal(expectedAction);
    });
});
