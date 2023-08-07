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

import path from 'path';
import fs from 'fs-extra';
import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';

import * as settings from './settings';
import { SyServer } from './core/server/SyServer';
import { fetchProfiles, fetchUsers } from './fetch';

const koa = new Koa();
koa.use(serve('../web/test/dist'));

export const server = new SyServer({
  app: koa,
  port: 4000, // env
  logger: settings.APP_LOGGER,
  cache: settings.cache,
  ORM: settings.ORM,
  middleware: settings.MIDDLEWARES,
  routes: settings.ROUTES,
  version: settings.CURRENT_VERSION,
});

const router = new Router();

// handle dynamically
const fetchRoutes = [
  {
    path: '/app/users',
    fetchData: fetchUsers,
  },
  {
    path: '/app/profiles',
    fetchData: fetchProfiles,
  },
];

// better vite integration / ssr integration
// encapsulate in syserver, ssr client
// add configuration options
router.get('*', async (ctx) => {
  let initialData = null;
  let matchedRoute = null;

  for (const route of fetchRoutes) {
    if (ctx.path === route.path) {
      matchedRoute = route;
      break;
    }
  }

  if (matchedRoute && matchedRoute.fetchData) {
    initialData = await matchedRoute.fetchData();
  }

  const htmlContent = fs.readFileSync(
    path.resolve(__dirname, '../web/test/dist/index.html'),
    'utf-8'
  );

  const withPreloadedData = htmlContent.replace(
    '<script',
    `<script>window.__PRELOADED_DATA__ = ${JSON.stringify(initialData)};</script><script`
  );

  ctx.type = 'text/html';
  ctx.body = withPreloadedData;
});

koa.use(router.routes());
koa.use(router.allowedMethods());
