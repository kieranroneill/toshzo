import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './components/App/App';
import AboutPage from './components/AboutPage/AboutPage';
import AuthPage from './components/AuthPage/AuthPage';
import HomePage from './components/HomePage/HomePage';

// Strings.
import strings from './config/strings.json';

const Routes = props => (
    <Router {...props}>
        <Route path="/" component={ App }>
            <IndexRoute component={ HomePage } />
            <Route path={ strings.routes.ABOUT } component={ AboutPage } />
            <Route path={ strings.routes.AUTH } component={ AuthPage } />
        </Route>
    </Router>
);

Routes.propTypes = {
    store: React.PropTypes.object
};

export default Routes;
