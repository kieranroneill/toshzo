import { mount, shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ConfigState, ReferencesState } from '../states/index';

const muiTheme = getMuiTheme({ userAgent: 'all' });
const mockStore = configureMockStore([thunk]);

function getContext() {
    return {
        context: { muiTheme },
        childContextTypes: { muiTheme: React.PropTypes.object }
    };
}

/**
 * Returns props that mocks the router and connected components.
 * @return a mocked props object
 */
export function getDefaultProps() {
    const store = {
        references: ReferencesState,
        config: ConfigState
    };

    return {
        dispatch: stub(),
        location: {
            query: {}
        },
        router: {
            push: stub()
        },
        ...store
    };
}

/**
 * Returns props that mocks the router, store and connected components.
 * @return a mocked props object
 */
export function getDefaultPropsWithStore() {
    const store = {
        references: ReferencesState,
        config: ConfigState
    };

    return {
        dispatch: stub(),
        location: {
            query: {}
        },
        router: {
            push: stub()
        },
        store: mockStore(store),
        ...store
    };
}

/**
 * Fully renders a node with context.
 * @return the mounted node.
 */
export function mountWithContext(node) {
    return mount(node, getContext());
}

/**
 * Shallow renders a node with context.
 * @return the mounted node.
 */
export function shallowWithContext(node) {
    return shallow(node, getContext());
}
