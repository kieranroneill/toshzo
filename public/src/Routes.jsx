import Promise from 'bluebird';
import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

// Components.
import App from './components/App/App';
import AboutPage from './components/AboutPage/AboutPage';
import AuthPage from './components/AuthPage/AuthPage';
import HomePage from './components/HomePage/HomePage';

// Services.
import { InfoService, ReferencesService } from './services/index';

// ActionCreators.
import { InfoActionCreators, ReferencesActionCreators } from './action-creators/index';

// Strings.
import strings from './config/strings.json';

function onAppEnter(props, nextState, replace, callback) {
    const promises = [
        InfoService.getInfo(),
        ReferencesService.getReferences()
    ];

    // Get app dependencies.
    Promise
        .all(promises)
        .spread((info, references) => {
            props.store.dispatch(InfoActionCreators.setInfo(info));
            props.store.dispatch(ReferencesActionCreators.setReferences(references));

            callback();
        }); // TODO: Add redirection to 500 page on rejection.
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
