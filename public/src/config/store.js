import { applyMiddleware, compose, createStore } from 'redux';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';

import reducers from '../reducers/index';

export default function configureStore() {
    return createStore(
        reducers,
        compose(
            applyMiddleware(thunk),
            persistState('/', { key: 'toshzo', slicer: () => state => ({ session: state.session }) })
        )
    );
}
