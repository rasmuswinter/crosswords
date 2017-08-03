require('babel-register');
require('babel-polyfill');

// Set up logging transports
require('../src/logger');

// start the server
require('../src/server');

global.SERVER = true;
