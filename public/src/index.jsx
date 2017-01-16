import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import configureStore from './store';
import Routes from './routes';
import { ReferencesActions } from './actions/index';

// Load CSS/SASS.
import './stylesheets/index.scss';

const store = configureStore();

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Grab the references.
store.dispatch(ReferencesActions.getReferences());

ReactDom.render(
    <Provider store={store}>
        <Routes history={browserHistory} />
    </Provider>,
    document.getElementById('root')
);
