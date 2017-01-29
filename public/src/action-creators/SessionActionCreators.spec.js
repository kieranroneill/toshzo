import * as SessionActionCreators from './SessionActionCreators';
import { SessionActions } from '../actions/index';

describe('session actions', () => {
    it('should create an action to set the session token', () => {
        const token = 'Tokenize time';
        const expectedAction = { type: SessionActions.SET_SESSION_TOKEN, value: token };

        expect(SessionActionCreators.setSessionToken(token)).to.deep.equal(expectedAction);
    });
});
