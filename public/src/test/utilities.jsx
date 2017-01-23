import { mount, shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { ConfigState, ReferencesState } from '../states/index';

const muiTheme = getMuiTheme({ userAgent: 'all' });

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
