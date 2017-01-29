import SessionReducer from './SessionReducer';
import { SessionActions } from '../actions/index';
import { SessionState as initialSessionState } from '../states/index';

describe('session reducers', () => {
    beforeEach(function() {
        this.initialState = initialSessionState;
    });

    afterEach(function() {
        delete this.initialState;
    });

    describe('when checking the initial state', function() {
        it('should return the initial state', function() {
            const state = SessionReducer(this.initialState, {});

            expect(state).to.deep.equal(this.initialState);
        });
    });

    describe('when setting the session token', function() {
        it('should use the default state if the session token is null', function() {
            const state = SessionReducer(this.initialState, { type: SessionActions.SET_SESSION_TOKEN, value: null });

            expect(state.token).to.equal(this.initialState.token);
        });

        it('should use the default state if the session token is not a string', function() {
            const state = SessionReducer(this.initialState, { type: SessionActions.SET_SESSION_TOKEN, value: 42 });

            expect(state.token).to.equal(this.initialState.token);
        });

        it('should use the default state if the page title is an empty string', function() {
            const state = SessionReducer(this.initialState, { type: SessionActions.SET_SESSION_TOKEN, value: '' });

            expect(state.token).to.equal(this.initialState.token);
        });

        it('should change the page title to the specified string', function() {
            const token = 'Please please add me!!!';
            const state = SessionReducer(this.initialState, { type: SessionActions.SET_SESSION_TOKEN, value: token });

            expect(state.token).to.equal(token);
        });
    });
});
