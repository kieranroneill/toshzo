import _ from 'underscore';

import { ConfigActions } from '../actions/index';
import { ConfigState } from '../states/index';

function ConfigReducer(state = ConfigState, action) {
    let pageTitle;

    switch (action.type) {
        case ConfigActions.HIDE_LOADER:
            return Object.assign({}, state, { isLoading: false });

        case ConfigActions.SET_PAGE_TITLE:
            pageTitle = state.pageTitle;

            // Only non-empty strings to be used.
            if(!_.isEmpty(action.value) && _.isString(action.value)) {
                pageTitle = action.value;
            }

            return Object.assign({}, state, { pageTitle: pageTitle });

        case ConfigActions.SHOW_LOADER:
            return Object.assign({}, state, { isLoading: true });

        case ConfigActions.TOGGLE_DRAWER:
            return Object.assign({}, state, { isDrawerOpen: !state.isDrawerOpen });

        default:
            return state;
    }
}

export default ConfigReducer;
