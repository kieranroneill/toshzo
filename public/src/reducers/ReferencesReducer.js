import _ from 'underscore';

import { ReferencesActions } from '../actions/index';
import { ReferencesState as initialReferencesState } from '../states/index';

function ReferencesReducer(state = initialReferencesState, action) {
    let references, keys;

    switch (action.type) {
        case ReferencesActions.SET_REFERENCES:
            references = state;

            if(action.value) {
                keys = _.keys(state);
                references = _.pick(action.value, keys); // Filter only the valid keys.
            }

            return Object.assign({}, state, references);

        default:
            return state;
    }
}

export default ReferencesReducer;
