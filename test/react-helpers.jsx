import { mount, shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// States.
import createServices from '../public/src/services/index';

// States.
import { ConfigState, InfoState, ReferencesState, SessionState } from '../public/src/states/index';

const muiTheme = getMuiTheme({ userAgent: 'all' });
const mockStore = configureMockStore([thunk]);
const state = {
    config: ConfigState,
    info: InfoState,
    references: ReferencesState,
    session: SessionState
};

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
    const store = getMockStore(state);

    return {
        dispatch: stub(),
        location: {
            query: {}
        },
        router: {
            push: stub()
        },
        services: createServices(store),
        store: store,
        ...state
    };
}

export function getMockStore() {
    return mockStore(state);
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
