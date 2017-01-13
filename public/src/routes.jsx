import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './components/App/App';
import About from './components/About/About';
import Home from './components/Home/Home';

const Routes = props => (
    <Router {...props}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="about" component={About}/>
        </Route>
    </Router>
);

export default Routes;
