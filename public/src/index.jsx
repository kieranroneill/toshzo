import React from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Load CSS/SASS.
import './stylesheets/index.scss';

import Routes from './routes';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDom.render(
    <Routes history={browserHistory} />,
    document.getElementById('root')
);
