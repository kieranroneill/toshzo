import { ReferencesActions } from '../actions/index';
import initialState from '../config/state';

function ReferencesReducer(state = initialState.references, action) {
    switch (action.type) {
        case ReferencesActions.GET_REFERENCES_SUCCESS:
            if(action.references) {
                return { ...action.references };
            }

            return state;
    }

    return state;
}

export default ReferencesReducer;
