import React from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';

// Load CSS/SASS.
import './stylesheets/index.scss';

import Routes from './routes';

ReactDom.render(
    <Routes history={browserHistory} />,
    document.getElementById('root')
);
