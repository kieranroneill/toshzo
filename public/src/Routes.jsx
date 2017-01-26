import Promise from 'bluebird';
import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

// Components.
import App from './components/App/App';
import AboutPage from './components/AboutPage/AboutPage';
import AuthPage from './components/AuthPage/AuthPage';
import ErrorPage from './components/ErrorPage/ErrorPage';
import HomePage from './components/HomePage/HomePage';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';

// Services.
import { InfoService, ReferencesService } from './services/index';

// ActionCreators.
import { InfoActionCreators, ReferencesActionCreators } from './action-creators/index';

// Strings.
import strings from './config/strings.json';

export function onAppEnter(props, nextState, replaceState, callback) {
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

            callback(null);
        })
        .catch(error => {
            // Redirect to the error page.
            replaceState('/' + strings.routes.ERROR);

            // Callback for testing.
            callback(error);
        });
}

export default function Routes(props) {
    return (
        <Router {...props}>
            <Route path="/" component={ App } onEnter={ onAppEnter.bind(this, props) } >
                <IndexRoute component={ HomePage } />
                <Route path={ strings.routes.ABOUT } component={ AboutPage } />
                <Route path={ strings.routes.AUTH } component={ AuthPage } />
            </Route>
            <Route path={ strings.routes.ERROR } component={ ErrorPage } />
            <Route path="*" component={ NotFoundPage } />
        </Router>
    );
}
