import { applyMiddleware, compose, createStore } from 'redux';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';

import reducers from '../reducers/index';

export default function configureStore() {
    const enhancers = [
        applyMiddleware(thunk)
    ];

    // If we have localStorage available, save store states to it.
    if(window.localStorage) {
        enhancers.push(persistState('/', { key: 'toshzo', slicer: () => state => ({ session: state.session }) }));
    }

    return createStore(reducers, compose.apply(null, enhancers));
}
