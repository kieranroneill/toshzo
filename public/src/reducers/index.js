import { combineReducers } from 'redux';

import LoaderReducer from './LoaderReducer';
import ReferencesReducer from './ReferencesReducer';

export default combineReducers({
    loader: LoaderReducer,
    references: ReferencesReducer
});
