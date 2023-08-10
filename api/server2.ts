/**
 * @todo Better Config
 * @todo Log Rotation / Log Separation (Separate Error Log, etc)
 * @todo Add optional support for SSL/TLS encryption
 * @todo Shutdown/Restart Endpoints(?)
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
import { AnomalyDetector } from './core/monitoring/anomaly';
import { StreamManager } from './core/streams/StreamManager';
import { TrafficStream } from './core/streams/sub/TrafficStream';
import { QueryReportGenerator } from './core/reports/query/QueryReportGenerator';
import { AuditReportGenerator } from './core/reports/audit/AuditReportGenerator';
import { AccessReportGenerator } from './core/reports/access/AccessReportGenerator';
import { ErrorReportGenerator } from './core/reports/error/ErrorReportGenerator';
import { ReportManager } from './core/reports/ReportManager';
import { EmailService } from './core/email/EmailService';

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

/**
 * These are the report profiles for this instance of the ReportManager.
 * Each profile includes:
 * - `name`: The unique name of the report.
 *
 * - `schedule`: The schedule, in cron format, on which to run the report.
 *   A cron string is a simple way to represent recurring time periods,
 *   and in this case, it's being used to schedule when each report job should run.
 *   The string '30 20 * * *' translates to "at minute 30 of hour 20 (or 8:30 PM),
 *   every day of the month, every month, and every day of the week."
 *   This represents a daily schedule, where the job is executed once a day at 8:30 PM.
 *
 * - `generator`: The ReportGenerator instance used to generate the report.
 *
 * - `hooks`: The lifecycle hooks used to manage the report job.
 */
const reportProfiles = [
  {
    name: 'AccessReport',
    schedule: '30 20 * * *',
    generator: new AccessReportGenerator('./logs/access.log'),
  },
  {
    name: 'ErrorReport',
    schedule: '30 20 * * *',
    generator: new ErrorReportGenerator('./logs/errors.log'),
  },
  {
    name: 'QueryReport',
    schedule: '30 20 * * *',
    generator: new QueryReportGenerator('./logs/queries.log'),
  },
  {
    name: 'AuditReport',
    schedule: '30 20 * * *',
    generator: new AuditReportGenerator(),
    hooks: {
      onInitialize: () => console.log('AccessReport job started'),
      onStart: () => console.log('AccessReport job running'),
      onComplete: () => console.log('AccessReport job completed'),
      onError: (error: any) => console.log('AccessReport job failed with error:', error),
    },
  },
];

// Create a new ReportManager instance with the array of report profiles.
const reportManager = new ReportManager(reportProfiles);

// Define a new report profile for adding to a running instance.
const newReportProfile = {
  name: 'RequestReport',
  schedule: '45 20 * * *',
  generator: new RequestReportGenerator('./logs/app.log'),
  hooks: {
    onInitialize: () => console.log('RequestReport job started'),
    onStart: () => console.log('RequestReport job running'),
    onComplete: () => console.log('RequestReport job completed'),
    onError: (error: any) => console.log('RequestReport job failed with error:', error),
  },
};

// Add the new report profile to the ReportManager instance.
// This will create a new job and add it to the scheduler.
reportManager.addReportProfile(newReportProfile);

const emailService = new EmailService(settings.EMAIL.EMAIL_BACKEND);
// emailService.sendEmail('test@example.com', 'Test Subject', 'Test Body');
