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
import { UserResponses } from './core/lib/responses/user';

export const server = new SyServer({
  app: new Koa(),
  port: 4000,
  logger: settings.logger,
  cache: settings.cache,
  ORM: settings.ORM,
  middleware: settings.APP_MIDDLEWARES,
  routes: settings.ROUTES,
  version: '0.05',
});

console.log(UserResponses.ALREADY_EXISTS('Test'));
