import { combineReducers } from 'redux';

// Reducers.
import ConfigReducer from './ConfigReducer';

/**
 * Combine the reducers and mapping them to lowercase.
 */
export default combineReducers({
    config: ConfigReducer
});
