import _ from 'underscore';

import { ConfigActions } from '../actions/index';
import { ConfigState } from '../states/index';

function ConfigReducer(state = ConfigState, action) {
    let pageTitle;

    switch (action.type) {
        case ConfigActions.HIDE_LOADER:
            return _.extendOwn(state, {
                isLoading: false
            });
        case ConfigActions.SET_PAGE_TITLE:
            pageTitle = state.pageTitle;

            // Only non-empty strings to be used.
            if(!_.isEmpty(action.value) && _.isString(action.value)) {
                pageTitle = action.value;
            }

            return _.extendOwn(state, {
                pageTitle: pageTitle
            });
        case ConfigActions.SHOW_LOADER:
            return _.extendOwn(state, {
                isLoading: true
            });
        default:
            return state;
    }
}

export default ConfigReducer;
