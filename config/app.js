'use strict';

const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || '';

// in project root try <environment>.env and fallback on '.env'
let dotenvPath = `${path.dirname(__filename)}/../${process.env.NODE_ENV}.env`;
if (process.env.NODE_ENV !== '') {
  try {
    fs.accessSync(dotenvPath, fs.F_OK);
  } catch (e) {
    dotenvPath = `${path.dirname(__filename)}/../.env`;
  }
}

dotenv.load({
  silent: true,
  path: dotenvPath
});

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'production',
  apiURL: process.env.API_URL,
};

if (!config.apiURL) {
  if (config.env === 'development') {
    config.apiURL = `http://localhost:${config.port}`;
  } else {
    config.apiURL = 'https://storyxpress.co';
  }
}

module.exports = config;
