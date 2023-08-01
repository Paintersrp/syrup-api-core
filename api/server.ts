/**
 * @todo Better Config
 * @todo Log Rotation / Log Separation (Separate Error Log, etc)
 * @todo Add optional support for SSL/TLS encryption
 * @todo Cache health check status endpoint
 * 
import https from 'https';
import fs from 'fs';

// get ssl options
const sslOptions = {
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.pem')
};

// Create the https server
const server = https.createServer(sslOptions, app.callback());

// Start the server
server.listen(3000);

 *
 * Koa Server
 *
 * This file initializes and starts a Koa server with middlewares and views.
 * It establishes a connection to the database and handles starting the server.
 */

import Koa from 'koa';

import * as settings from './settings';
import { SyServer } from './core/server/SyServer';
import { RequestLogAnalyzer } from './core/mixins/analyzer/requests/RequestLogAnalyzer';

export const server = new SyServer({
  app: new Koa(),
  port: 4000, // env
  logger: settings.APP_LOGGER,
  cache: settings.cache,
  ORM: settings.ORM,
  middleware: settings.MIDDLEWARES,
  routes: settings.ROUTES,
  version: settings.CURRENT_VERSION,
});

const analyzer = new RequestLogAnalyzer();

analyzer
  .loadLog('./logs/app.log')
  .then(() => {
    const report = analyzer.analyzeLogs();
    // console.log(report);
  })
  .catch((err) => {
    console.error(`An error occurred: ${err.message}`);
  });
