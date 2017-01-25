import _ from 'underscore';

import { InfoActions } from '../actions/index';
import { InfoState as initialInfoState } from '../states/index';

function InfoReducer(state = initialInfoState, action) {
    let info, keys;

    switch (action.type) {
        case InfoActions.SET_INFO:
            info = state;

            if(action.value) {
                keys = _.keys(state);
                info = _.pick(action.value, keys); // Filter only the valid keys.
            }

            return Object.assign({}, state, info);

        default:
            return state;
    }
}

export default InfoReducer;
