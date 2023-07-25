/**
 * @todo Better Config
 * @todo Log Rotation / Log Separation (Separate Error Log, etc)
 * @todo Add optional support for SSL/TLS encryption
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
import CentralLogger from './core/logging/SyLogger';

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

const logger = CentralLogger.getInstance();

const testLogger = () => {
  setTimeout(() => {
    logger.trace('This is an app logger trace message');
  }, 300);
  setTimeout(() => {
    logger.debug('This is an app logger debug message');
  }, 300);
  setTimeout(() => {
    logger.info('This is an app logger info message');
  }, 300);
  setTimeout(() => {
    logger.query('This is an query logger query message');
  }, 400);
  setTimeout(() => {
    logger.access('This is an access logger access message');
  }, 500);
  setTimeout(() => {
    logger.audit('This is an audit logger audit message');
  }, 500);
  setTimeout(() => {
    logger.warn('This is an error logger warn message');
  }, 600);
  setTimeout(() => {
    logger.error('This is an error logger error message');
  }, 700);
  setTimeout(() => {
    logger.fatal('This is an error logger fatal message');
  }, 800);
};

testLogger();
