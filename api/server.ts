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

// Testing purposes

import { RequestReportGenerator } from './core/reports/request/RequestReportGenerator';
import { AnomalyDetector } from './core/mixins/anomaly';
import { StreamManager } from './core/mixins/streams/StreamManager';
import { TrafficStream } from './core/mixins/streams/sub/TrafficStream';
import { QueryReportGenerator } from './core/reports/query/QueryReportGenerator';

const anomalyDetector = new AnomalyDetector(settings.APP_LOGGER);
const trafficStream = new TrafficStream('traffic', anomalyDetector);

const streamManager = StreamManager.getInstance();
streamManager.on('streamAdded', (name) => {
  console.log(`Stream "${name}" was added.`);
});

streamManager.addStream('websiteTraffic', trafficStream);
trafficStream.onData((visits) => {
  console.log('Website visits:', visits);
});

streamManager.startAll();

const analyzer = new QueryReportGenerator();

analyzer
  .loadLog('./logs/queries.log')
  .then(() => {
    const report = analyzer.analyzeLogs();
    console.log(report);
  })
  .catch((err) => {
    console.error(`An error occurred: ${err.message}`);
  });
