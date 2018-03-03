'use strict';

const winston = require('../winston');
const chai = require('../chai');
const expect = chai.expect;

// Default logger 🌳
winston.loggers.add('DEFAULT_LOGGER', {
  console: {
    level: 'error',
    colorize: true,
    label: 'Default logger',
    json: true,
    timestamp: true
  }
});
