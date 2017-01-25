import { combineReducers } from 'redux';

// Reducers.
import ConfigReducer from './ConfigReducer';
import InfoReducer from './InfoReducer';
import ReferencesReducer from './ReferencesReducer';

/**
 * Combine the reducers and map them to lowercase.
 */
export default combineReducers({
    config: ConfigReducer,
    info: InfoReducer,
    references: ReferencesReducer
});
