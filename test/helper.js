'use strict';

import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import httpCodes from 'http-codes';
import httpMocks from 'node-mocks-http';
import { jsdom } from 'jsdom';
import React from 'react';
import request from 'request';
import { assert, spy, stub } from 'sinon';
import supertest from 'supertest';

import config from '../lib/config/default.json';
import errors from '../lib/config/errors.json';
import server from '../server.js';

// General globals.
global.assert = assert;
global.config = config;
global.errors = errors;
global.expect = expect;
global.spy = spy;
global.stub = stub;

// Server globals.
global.httpCodes = httpCodes;
global.httpMocks = httpMocks;
global.request = request;
global.server = server;
global.supertest = supertest;

// Client globals.
global.mount = mount;
global.React = React;
global.shallow = shallow;
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = {
    userAgent: 'node.js'
};

Object.keys(document.defaultView)
    .forEach(property => {
        if (typeof global[property] === 'undefined') {
            global[property] = document.defaultView[property];
        }
    });
