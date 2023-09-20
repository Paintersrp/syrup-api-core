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
import serve from 'koa-static';

import * as fs from 'fs';
import * as path from 'path';
import * as parser from '@babel/parser';
import prettier from 'prettier';
import crypto from 'crypto';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { JSXOpeningElement, JSXIdentifier } from '@babel/types';
import * as t from '@babel/types';
import { parse as parseCSS, Rule } from 'css';
import chokidar from 'chokidar';

import * as internal from './settings';
import { SyServer } from './core/server/SyServer';
import { SETTINGS } from './settings/settings';
import { APP_CACHE } from './settings/internal/cache'; // After other internal, after ORM
import { InlineStylesProcessor } from './core/server/managers/generation/inline-styles/InlineStylesProcessor';

const koa = new Koa();
koa.use(serve('../web/test/dist'));

export const server = new SyServer({
  app: koa,
  port: 4000, // env
  logger: internal.APP_LOGGER,
  cache: APP_CACHE,
  ORM: internal.ORM,
  middleware: SETTINGS.MIDDLEWARES,
  routes: SETTINGS.ROUTES,
  version: SETTINGS.CURRENT_VERSION,
});

let isProcessing = false;

const fileProcessor = new InlineStylesProcessor();

const watcher = chokidar.watch(['../web/test/src/components', '../web/test/src/pages'], {
  persistent: true,
});

watcher
  .on('add', async (path) => {
    if (isProcessing) return;
    isProcessing = true;
    await fileProcessor.processFile(path);
    isProcessing = false;
  })
  .on('change', async (path) => {
    if (isProcessing) return;
    isProcessing = true;
    await fileProcessor.processFile(path);
    isProcessing = false;
  });

console.log('Watching for changes...');
