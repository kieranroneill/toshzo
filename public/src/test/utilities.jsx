import getMuiTheme from 'material-ui/styles/getMuiTheme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ConfigState, ReferencesState } from '../states/index';

const mockStore = configureMockStore([ thunk ]);
const muiTheme = getMuiTheme({ userAgent: 'all' });

export function createProps(props) {
    return {
        location: {
            query: {}
        },
        ...props
    };
}

export function createStore() {
    const store = {
        references: ReferencesState,
        config: ConfigState
    };

    return mockStore(store);
}

export function getContext() {
    return {
        context: { muiTheme },
        childContextTypes: { muiTheme: React.PropTypes.object }
    };
}
