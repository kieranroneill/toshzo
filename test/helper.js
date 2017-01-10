'use strict';

import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { jsdom } from 'jsdom';
import React from 'react';
import { assert } from 'sinon';

import config from '../config/default.json';
import server from '../server.js';

// General globals.
global.assert = assert;
global.config = config;
global.expect = expect;
global.server = server;

// Client globals.
global.mount = mount;
global.React = React;
global.shallow = shallow;
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

Object.keys(document.defaultView)
    .forEach((property) => {
        if (typeof global[property] === 'undefined') {
            global[property] = document.defaultView[property];
        }
    });

global.navigator = {
    userAgent: 'node.js'
};

