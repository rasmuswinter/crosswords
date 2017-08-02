#!/usr/bin/env node
'use strict';

require('babel-register');
require('babel-polyfill');

// Set up logging transports
require('../src/logger');

// start the server
process.env.NODE_ENV = 'development';
require('../src/server');

global.SERVER = true;
