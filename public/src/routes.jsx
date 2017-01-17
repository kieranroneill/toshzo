import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './components/App/App';
import AboutPage from './components/AboutPage/AboutPage';
import HomePage from './components/HomePage/HomePage';

const onEnter = store => {
    const state = store.getState();

    console.log('hello');
};


const onLeave = store => {
    const state = store.getState();
};

const Routes = props => (
    <Router {...props}>
        <Route path="/" component={App} onEnter={onEnter(props.store)} onLeave={onLeave(props.store)}>
            <IndexRoute component={HomePage} />
            <Route path="about" component={AboutPage} />
        </Route>
    </Router>
);

Routes.propTypes = {
    store: React.PropTypes.object
};

export default Routes;
