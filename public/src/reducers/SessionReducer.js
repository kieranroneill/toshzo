import _ from 'underscore';

import { SessionActions } from '../actions/index';
import { SessionState as initialSessionState } from '../states/index';

function SessionReducer(state = initialSessionState, action) {
    let isLoggedIn, token;

    switch (action.type) {
        case SessionActions.RESET_SESSION_STATE:
            return Object.assign({}, state, { isLoggedIn: false, token: null });

        case SessionActions.SET_AUTHENTICATION_STATE:
            isLoggedIn = state.isLoggedIn;

            if(_.isBoolean(action.value)) {
                isLoggedIn = action.value;
            }

            return Object.assign({}, state, { isLoggedIn: isLoggedIn });

        case SessionActions.SET_SESSION_TOKEN:
            token = state.token;

            // Only non-empty strings to be used.
            if(!_.isEmpty(action.value) && _.isString(action.value)) {
                token = action.value;
            }

            return Object.assign({}, state, { token: token });

        default:
            return state;
    }
}

export default SessionReducer;
