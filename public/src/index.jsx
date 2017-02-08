import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import configureStore from './config/store';
import Routes from './Routes';

import createServices from './services/index';

// Load CSS/SASS.
import './stylesheets/index.scss';

const store = configureStore();
const services = createServices(store);

// Needed for onTouchTap: http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDom.render(
    <Provider store={ store }>
        <Routes history={ browserHistory } store={ store } services={ services } />
    </Provider>,
    document.getElementById('root')
);
