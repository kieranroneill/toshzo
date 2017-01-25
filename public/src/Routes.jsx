import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

// Components.
import App from './components/App/App';
import AboutPage from './components/AboutPage/AboutPage';
import AuthPage from './components/AuthPage/AuthPage';
import HomePage from './components/HomePage/HomePage';

import { InfoService } from './services/index';

// Strings.
import strings from './config/strings.json';

function onAppEnter(props, nextState, replace, callback) {
    InfoService
        .getInfo()
        .then(result => {
            callback();
        })
        .catch(() => {
            callback();
        });
}

const Routes = props => (
    <Router {...props}>
        <Route path="/" component={ App } onEnter={ onAppEnter.bind(this, props) } >
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
