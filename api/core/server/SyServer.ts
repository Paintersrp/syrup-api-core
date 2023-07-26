import path from 'path';
import fs from 'fs-extra';
import { Server } from 'http';
import { randomUUID } from 'crypto';

import Koa from 'koa';
import Router from 'koa-router';
import session from 'koa-session';
import serve from 'koa-static';

import { ComposedMiddlewares, SyServerOptions } from './types';
import { ServerHealthMixin } from './mixins/ServerHealthMixin';

import { SyLFUCache } from '../cache/SyLFUCache';
import { SyLRUCache } from '../cache/SyLRUCache';
import { SyDatabase } from '../database/SyDatabase';
import { RouteConstructor } from '../../types';
import { SyLogger } from '../logging/SyLogger';

/**
 * @class
 * Represents a Koa-based server with built-in functionalities like
 * health monitoring, graceful shutdown, and support for middleware and routes.
 */
export class SyServer {
  /** @type {Koa} The Koa application instance used by the server. */
  app: Koa;

  /** @type {number} The port on which the server is listening for incoming connections. */
  port: number;

  /** @type {SyLogger} The logger instance used for logging server-related information. */
  logger: SyLogger;

  /** @type {SyLFUCache | SyLRUCache} The cache implementation used for server caching. */
  cache: SyLFUCache<any> | SyLRUCache<any>;

  /** @type {SyDatabase} The database connection instance used for server database operations. */
  ORM: SyDatabase;

  /** @type {Server} The HTTP server instance used by Koa. */
  server?: Server;

  /** @type {SyHealthMixin} An instance of the SyHealthMixin used for monitoring endpoints. */
  health: ServerHealthMixin;

  /** @type {string} Optional version information for the server. */
  version?: string;

  /** @type {Router} Central Router for management endpoints and SSR. */
  router: Router;

  /** @type {string} Optional distribution path for the frontend build for serving through SSR. */
  distPath?: string;

  /** @type {boolean} Boolean state to determine if server is initialized or not started. */
  isInitialized: boolean;

  /** @type {boolean} Boolean state to determine if server is already shutting down */
  isShuttingDown: boolean;

  /**
   * @constructor
   * @param {SyServerOptions} options - Options to configure the SyServer instance.
   */
  constructor({
    app,
    port,
    logger,
    cache,
    ORM,
    resourceThresholds,
    middleware,
    routes,
    version,
    distPath,
  }: SyServerOptions) {
    this.port = port;
    this.logger = logger;
    this.cache = cache;
    this.ORM = ORM;
    this.version = version;
    this.router = new Router();
    this.isInitialized = false;
    this.isShuttingDown = false;
    app.context.logger = this.logger;

    this.initializeLogger(app);
    this.initializeMiddleware(app, middleware);
    this.initializeSSR(app, distPath);
    this.initializeRoutes(app, routes);
    this.initializeSessions(app);
    this.initializeManagementRoutes(app);

    // Attaches the application with applied routes and middlewares to the Koa Server
    this.app = app;
    this.health = new ServerHealthMixin(this, resourceThresholds);

    this.start();
  }

  /**
   * Attaches the logger to the Koa context to enable logging in middleware and routes.
   * @param {Koa} app - The Koa application instance.
   */
  private initializeLogger(app: Koa) {
    app.context.logger = this.logger;
  }

  /**
   * Applies optional middleware if provided.
   * @param {Koa} app - The Koa application instance.
   * @param {Middleware} middleware - The middleware to apply.
   */
  private initializeMiddleware(app: Koa, middleware: ComposedMiddlewares | undefined) {
    if (middleware) {
      app.use(middleware);
    }
  }

  /**
   * Setup SSR if configured.
   * @param {Koa} app - The Koa application instance.
   * @param {string} distPath - The distribution path.
   */
  private initializeSSR(app: Koa, distPath?: string) {
    if (distPath) {
      app.use(serve(distPath));

      this.router.get('*', async (ctx) => {
        ctx.type = 'html';
        ctx.body = fs.createReadStream(path.join(distPath, 'index.html'));
      });

      app.use(this.router.routes()).use(this.router.allowedMethods());
    }
  }

  /**
   * Register routes if provided.
   * @param {Koa} app - The Koa application instance.
   * @param {RouteConstructor[]} routes - The routes to register.
   */
  private initializeRoutes(app: Koa, routes?: RouteConstructor[]) {
    if (routes) {
      routes.forEach((RouteSet) => {
        new RouteSet(app);
      });
    }
  }

  /**
   * Configure Sessions.
   * @param {Koa} app - The Koa application instance.
   */
  private initializeSessions(app: Koa) {
    app.keys = ['some secret hurr'];
    app.use(session({ key: 'syrup:sess' }, app));
  }

  /**
   * Register server management routes.
   */
  private initializeManagementRoutes(app: Koa) {
    this.router.get(`/sys/start`, this.checkAdminRole(), this.start.bind(this));
    this.router.get(`/sys/stop`, this.checkAdminRole(), this.gracefulShutdown.bind(this));

    app.use(this.router.routes());
    app.use(this.router.allowedMethods());
  }

  /**
   * RBAC Middleware for Management Routes
   */
  private checkAdminRole() {
    return async function (ctx: Koa.Context, next: Koa.Next) {
      console.log(ctx.session);
      if (
        ctx.session &&
        ctx.session.user &&
        (ctx.session.user.role === 'admin' || ctx.session.user.role === 'superadmin')
      ) {
        await next();
      } else {
        ctx.status = 403;
        ctx.body = 'Forbidden: You do not have the necessary access rights.';
      }
    };
  }

  /**
   * Start the server by initializing the database and cache,
   * and starting the HTTP server to listen on the specified port.
   * @protected
   * @returns {Promise<void>}
   */
  protected async start(): Promise<void> {
    if (!this.isInitialized) {
      try {
        await this.ORM.startDatabase();
        await this.cache.start();

        this.server = this.app.listen(this.port, () => {
          this.logger.info(`Server running on http://localhost:${this.port}`);
        });
      } catch (error: any) {
        this.logger.error('Error starting server:', error);
        process.exit(1);
      }

      this.initEventHandlers();
      this.isInitialized = true;
    } else {
      this.logger.info('Server is already initialized');
    }
  }

  /**
   * Initializes event handlers for unhandled rejections, uncaught exceptions, SIGTERM, and SIGINT signals for graceful shutdown.
   * @protected
   */
  protected initEventHandlers() {
    process.on('unhandledRejection', (reason, promise) => {
      const errorId = randomUUID();
      this.logger.error('Unhandled Rejection', {
        promise,
        reason,
        errorId,
      });
    });

    process.on('uncaughtException', (error) => {
      const errorId = randomUUID();
      this.logger.error('Uncaught Exception', { error, errorId });
      process.exit(1);
    });

    process.on('SIGTERM', async () => {
      await this.gracefulShutdown();
    });

    process.on('SIGINT', async () => {
      await this.gracefulShutdown();
    });
  }

  /**
   * Gracefully shut down the server, close the cache,
   * and handle any cleanup before exiting the process.
   * @private
   * @returns {Promise<void>}
   */
  private async gracefulShutdown(): Promise<void> {
    if (!this.isShuttingDown) {
      this.isShuttingDown = true;
      this.logger.info('Server is shutting down...');
      await this.cache.close();
      await this.ORM.backupDatabase();

      this.server?.close((error) => {
        if (error) {
          this.logger.error('Error while closing the server:', error);
          process.exit(1);
        } else {
          this.logger.info('Graceful shutdown complete.');
          process.exit(1);
        }
      });
    } else {
      this.logger.info('Server is already shutting down');
    }
  }
}

/**
 * SSL Version
 */

// protected async start() {
//   try {
//     await this.ORM.startDatabase();
//     await this.cache.start();

//     // Read the SSL key and certificate
//     const sslOptions = {
//       key: fs.readFileSync('<path-to-private-key>'),
//       cert: fs.readFileSync('<path-to-certificate>')
//     };

//     // Use http2 to create a secure server
//     this.server = http2.createSecureServer(sslOptions, this.app.callback()).listen(this.port, () => {
//       this.logger.info(`Server running on http://localhost:${this.port}`);
//     });

//     // Use http3 to create a secure server
//     // this.server = http3.createSecureServer(sslOptions, this.app.callback()).listen(this.port, () => {
//     //   this.logger.info(`Server running on http://localhost:${this.port}`);
//     // });

//   } catch (error) {
//     this.logger.error('Error starting server:', error);
//     process.exit(1);
//   }

//   this.initEventHandlers();
// }

/**
 * SSL Auto Updating
 */

// import autoRenewSSL from 'node-auto-renew-ssl';

// // ...

// async updateCertificates() {
//   try {
//     await autoRenewSSL.renewSSL({
//       email: '<your-email>', // replace with your email
//       domains: ['<your-domain>'], // replace with your domain
//       renewWithin: 15, // number of days to renew the certificate within
//       sslDirPath: '<path-to-ssl-dir>' // replace with the path to your ssl directory
//     });
//     this.logger.info('Server certificates have been updated');
//   } catch (error) {
//     this.logger.error('Error updating certificates:', error);
//   }
// }
