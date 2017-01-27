import Promise from 'bluebird';
import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

// Components.
import App from './components/App/App';
import AboutPage from './components/AboutPage/AboutPage';
import AuthPage from './components/AuthPage/AuthPage';
import DashboardPage from './components/DashboardPage/DashboardPage';
import ErrorPage from './components/ErrorPage/ErrorPage';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import TeapotPage from './components/TeapotPage/TeapotPage';

// Services.
import { InfoService, SessionService, ReferencesService } from './services/index';

// ActionCreators.
import { InfoActionCreators, ReferencesActionCreators } from './action-creators/index';

// Strings.
import strings from './config/strings.json';

/**
 * Checks if the user has authorised with Toshzo.
 * @param props the app state
 * @param nextState the next route state
 * @param replaceState a function for altering the route state
 * @param callback a callback function
 */
export function isAuthorised(props, nextState, replaceState, callback) {
    const store = props.store.getState();

    // If there is no session token, redirect to the auth page.
    if(!store.config.sessionToken) {
        replaceState('/' + strings.routes.AUTH);

        return callback(null);
    }

    SessionService
        .verifySessionToken(store.config.sessionToken)
        .then(() => callback(null))
        .catch(() => {
            replaceState('/' + strings.routes.AUTH);

            callback(null);
        });
}

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

export function onAuthEnter(props, nextState, replaceState, callback) {
    const store = props.store.getState();

    if(!store.config.sessionToken) {
        return callback(null);
    }

    SessionService
        .verifySessionToken(store.config.sessionToken)
        .then(() => {
            // Redirect to the dashboard page.
            replaceState('/' + strings.routes.DASHBOARD);
            callback(null);
        })
        .catch(() => callback(null));
}

export default function Routes(props) {
    return (
        <Router { ...props }>
            <Route
                path="/"
                component={ App }
                onEnter={ onAppEnter.bind(this, props) } >
                <IndexRedirect
                    to={ '/' + strings.routes.DASHBOARD } />
                <Route
                    path={ strings.routes.ABOUT }
                    component={ AboutPage } />
                <Route
                    path={ strings.routes.AUTH }
                    component={ AuthPage } />
                <Route
                    path={ strings.routes.DASHBOARD }
                    component={ DashboardPage }
                    onEnter={ isAuthorised.bind(this, props) } />
            </Route>
            <Route
                path={ strings.routes.ERROR }
                component={ ErrorPage } />
            <Route
                path={ strings.routes.TEAPOT }
                component={ TeapotPage } />
            <Route
                path="*"
                component={ NotFoundPage } />
        </Router>
    );
}
