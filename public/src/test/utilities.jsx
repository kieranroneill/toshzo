import { mount, shallow } from 'enzyme';
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

export function getDefaultProps() {
    return {
        dispatch: stub(),
        location: {
            query: {}
        },
        router: {
            push: stub()
        }
    };
}

/**
 * Fully renders a node with context.
 * @return the mounted node.
 */
export function mountWithContext(node) {
    return mount(node, {
        context: { muiTheme },
        childContextTypes: { muiTheme: React.PropTypes.object }
    });
}

/**
 * Shallow renders a node with context.
 * @return the mounted node.
 */
export function shallowWithContext(node) {
    return shallow(node, {
        context: { muiTheme },
        childContextTypes: { muiTheme: React.PropTypes.object }
    });
}
