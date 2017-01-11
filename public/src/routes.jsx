import React from 'react';
import { Router, Route } from 'react-router';

import App from './components/App/App';
import About from './components/About/About';

const Routes = props => (
    <Router {...props}>
        <Route path="/" component={App} />
        <Route path="/about" component={About} />
    </Router>
);

export default Routes;
