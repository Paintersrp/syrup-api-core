const environment = process.env.NODE_ENV || 'development';

let config;
if (environment === 'production') {
  config = require('./prod').SETTINGS;
} else {
  config = require('./dev').SETTINGS;
}

export default config;
