import { LoaderActions } from '../actions/index';
import initialState from '../config/state';

function LoaderReducer(state = initialState.loader, action) {
    switch (action.type) {
        case LoaderActions.HIDE_LOADER:
            return false;
        case LoaderActions.SHOW_LOADER:
            return true;
        default:
            return state;
    }
}

export default LoaderReducer;
