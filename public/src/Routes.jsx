import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './components/App/App';
import AboutPage from './components/AboutPage/AboutPage';
import AuthPage from './components/AuthPage/AuthPage';
import HomePage from './components/HomePage/HomePage';

const Routes = props => (
    <Router {...props}>
        <Route path="/" component={ App }>
            <IndexRoute component={ HomePage } />
            <Route path="about" component={ AboutPage } />
            <Route path="auth" component={ AuthPage } />
        </Route>
    </Router>
);

Routes.propTypes = {
    store: React.PropTypes.object
};

export default Routes;
