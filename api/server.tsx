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
import { paths } from './paths';
import { Emitter } from './core/emitter/Emitter';

import { ErrorReportGenerator } from './core/reports/error/ErrorReportGenerator';
import { QueryReportGenerator } from './core/reports/query/QueryReportGenerator';
import { AuditReportGenerator } from './core/reports/audit/AuditReportGenerator';
import { AccessReportGenerator } from './core/reports/access/AccessReportGenerator';
import { RequestReportGenerator } from './core/reports/request/RequestReportGenerator';

import { testAllStructures } from './core/structures/checkAll';

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

const emitter = new Emitter();

emitter.on('testEvent', () => {
  console.log('Default priority (0) listener');
});

emitter.on(
  'testEvent',
  () => {
    console.log('Higher priority (5) listener');
  },
  5
);

emitter.on(
  'testEvent',
  () => {
    console.log('Lower priority (-5) listener');
  },
  -5,
  { source: 'core' }
);

emitter.emit('testEvent');

const router = new Router();

// Dynamic config reading
const dynamicImport = async (filePath: string) => {
  return import(filePath);
};

const generatePageConfigs = async () => {
  const pagesDir = paths.web.test.src.pages;

  if (!pagesDir) {
    return;
  }

  const directories = fs
    .readdirSync(pagesDir)
    .filter((dir) => fs.statSync(path.join(pagesDir, dir)).isDirectory());

  const pageConfigs = [];

  for (const dir of directories) {
    const configFilePath = path.join(pagesDir, dir, 'config.ts');

    if (fs.existsSync(configFilePath)) {
      const configFile = await dynamicImport(configFilePath);
      const config = configFile.default;

      if (!config) {
        settings.APP_LOGGER.warn(`No default export found in ${configFilePath}`);
        continue;
      }

      if (!config.path) {
        settings.APP_LOGGER.warn(`Missing path in ${configFilePath}`);
        continue;
      }

      if (!config.fetchData) {
        settings.APP_LOGGER.warn(`Missing fetchData in ${configFilePath}`);
        continue;
      }

      if (!config.seo) {
        settings.APP_LOGGER.warn(`Missing SEO data in ${configFilePath}`);
      }

      pageConfigs.push({
        path: config.path,
        seoData: config.seo,
        fetchData: config.fetchData,
      });
    }
  }
  return pageConfigs;
};

// better vite integration / ssr integration
// encapsulate in syserver, ssr client
// add configuration options
router.get('*', async (ctx) => {
  const pageConfigs = await generatePageConfigs();

  if (!pageConfigs) {
    return;
  }

  let initialData = null;
  let matchedPage = null;

  for (const config of pageConfigs) {
    if (ctx.path === config.path) {
      matchedPage = config;
      break;
    }
  }

  if (matchedPage && matchedPage.fetchData) {
    initialData = await matchedPage.fetchData();
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

const genny = new RequestReportGenerator('./logs/app.log');

async function runGenny() {
  const test = await genny.analyzeLogs();
  console.log(test);

  // const test2 = await genny.exportReport(test, 'csv', { dir: './logs', fileName: 'tom' });
  // console.log('test2', test2);
}

// runGenny();
// testAllStructures();
