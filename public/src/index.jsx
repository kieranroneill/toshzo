import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import configureStore from './config/store';
import Routes from './Routes';

// Load CSS/SASS.
import './stylesheets/index.scss';

const store = configureStore();

// Needed for onTouchTap: http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDom.render(
    <Provider store={store}>
        <Routes history={browserHistory} store={store} />
    </Provider>,
    document.getElementById('root')
);
