import { ReferencesActions } from '../actions/index';

const initialState = {
    monzo: {
        clientId: undefined
    }
};

function ReferencesReducer(state = initialState, action) {
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
