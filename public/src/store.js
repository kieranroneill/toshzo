import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import * as reducers from './reducers/index';

export default function configureStore() {
    return createStore(
        combineReducers(reducers),
        applyMiddleware(thunk)
    );
}
