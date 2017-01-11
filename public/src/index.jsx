import React from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';

// Load CSS/SASS.
import './stylesheets/main.scss';

import Routes from './routes';

const rootElement = document.createElement('div');

document.body.appendChild(rootElement);

ReactDom.render(
    <Routes history={browserHistory} />,
    rootElement
);
