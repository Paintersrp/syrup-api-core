/**
 * @todo Better Config
 * @todo Log Rotation / Log Separation (Separate Error Log, etc)
 * @todo
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
  port: 4000,
  logger: settings.logger,
  cache: settings.cache,
  ORM: settings.ORM,
  middleware: settings.APP_MIDDLEWARES,
  routes: settings.ROUTES,
  version: '0.05',
});
