import { applyMiddleware, compose, createStore } from 'redux';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';

import reducers from '../reducers/index';

const slicer = () => {
    return state => {
        const subset = {};

        if(state.config.sessionToken) {
            subset['session'] = state.config.sessionToken;
        }

        return subset;
    };
};

export default function configureStore() {
    return createStore(
        reducers,
        compose(
            applyMiddleware(thunk),
            persistState('/', { key: 'toshzo', slicer: slicer })
        )
    );
}
