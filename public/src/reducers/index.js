import { combineReducers } from 'redux';

// Reducers.
import ConfigReducer from './ConfigReducer';
import ReferencesReducer from './ReferencesReducer';

/**
 * Combine the reducers and map them to lowercase.
 */
export default combineReducers({
    config: ReferencesReducer,
    references: ReferencesReducer
});
