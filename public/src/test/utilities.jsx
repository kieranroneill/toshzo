import getMuiTheme from 'material-ui/styles/getMuiTheme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ConfigState, ReferencesState } from '../states/index';

const mockStore = configureMockStore([ thunk ]);
const muiTheme = getMuiTheme({ userAgent: 'all' });

/**
 * Creates a mocked Redux store for testing.
 * @return a mocked Redux store.
 */
export function createStore() {
    const store = {
        references: ReferencesState,
        config: ConfigState
    };

    return mockStore(store);
}

/**
 * Returns a context used for Enzyme mounting.
 * @return a context relevant to the app.
 */
export function getContext() {
    return {
        context: { muiTheme },
        childContextTypes: { muiTheme: React.PropTypes.object }
    };
}

export function getDefaultProps() {
    return {
        location: {
            query: {}
        },
        dispatch: stub()
    };
}
