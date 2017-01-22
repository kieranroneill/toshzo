import { mount, shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import { createMemoryHistory, Router, Route } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

/**
 * Initialises a component ready for testing.
 * @param component the component to initialise.
 * @param location the location of the component.
 * @return returns a wrapped component.
 */
function intitialiseTestComponent(component, location = '/') {
    const store = {
        references: {}
    };

    // Enable onTouchTap()
    injectTapEventPlugin();

    return (
        <Provider store={ mockStore(store) }>
            <MuiThemeProvider muiTheme={ getMuiTheme({ userAgent: 'all' }) }>
                <Router history={ createMemoryHistory(location) } store={ mockStore(store) }>
                    <Route path={ location } component={ component } />
                </Router>
            </MuiThemeProvider>
        </Provider>
    );
}

export function mountTestComponent(component, location) {
    return mount(intitialiseTestComponent(component, location))
        .find(component); // Return the child component.
}

export function shallowTestComponent(component, location) {
    return shallow(intitialiseTestComponent(component, location))
        .find(component);
}
