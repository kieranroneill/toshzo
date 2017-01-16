import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import configureStore from './store';
import Routes from './routes';

// Load CSS/SASS.
import './stylesheets/index.scss';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDom.render(
    <Provider store={configureStore()}>
        <Routes history={browserHistory} />
    </Provider>,
    document.getElementById('root')
);
