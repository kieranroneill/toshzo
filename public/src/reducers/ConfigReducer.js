import _ from 'underscore';

import { ConfigActions } from '../actions/index';
import { ConfigState as initialConfigState } from '../states/index';

function ConfigReducer(state = initialConfigState, action) {
    let pageTitle, snackBar;

    switch (action.type) {
        case ConfigActions.HIDE_LOADER:
            return Object.assign({}, state, { isLoading: false });

        case ConfigActions.OPEN_SNACK_BAR:
            snackBar = _.clone(state.snackBar); // Copy, don't reference!!!

            // Only non-empty strings to be used.
            if(!_.isEmpty(action.value) && _.isString(action.value)) {
                snackBar.isOpen = true;
                snackBar.message = action.value;
            }

            return Object.assign({}, state, { snackBar: snackBar });

        case ConfigActions.RESET_SNACK_BAR:
            // Use the initial state.
            return Object.assign({}, state, { snackBar: initialConfigState.snackBar });

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
