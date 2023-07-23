import Koa from 'koa';
import { Server } from 'http';
import { Logger } from 'pino';

import { SyCache } from '../cache/SyCache';
import { SyDatabase } from '../database/SyDatabase';

import { SyServerOptions } from './types';
import { SyHealthMixin } from './mixins/SyHealthMixin';

/**
 * The SyServer class represents a Koa-based server with built-in functionalities like
 * health monitoring, graceful shutdown, and support for middleware and routes.
 */
export class SyServer {
  /** The Koa application instance used by the server. */
  app: Koa;

  /** The port on which the server is listening for incoming connections. */
  port: number;

  /** The logger instance used for logging server-related information. */
  logger: Logger;

  /** The cache implementation used for server caching. */
  cache: SyCache<any>;

  /** The database connection instance used for server database operations. */
  ORM: SyDatabase;

  /** The HTTP server instance used by Koa. */
  server?: Server;

  /** An instance of the SyHealthMixin used for health monitoring endpoints. */
  healthCheck: SyHealthMixin;

  /** Optional version information for the server. */
  version?: string;

  /**
   * Creates an instance of SyServer.
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
  }: SyServerOptions) {
    this.port = port;
    this.logger = logger;
    this.cache = cache;
    this.ORM = ORM;
    this.version = version;

    // Attach the logger to the Koa context to enable logging in middleware and routes.
    app.context.logger = this.logger;

    // Apply optional middleware if provided.
    if (middleware) {
      app.use(middleware);
    }

    // Register routes if provided.
    if (routes) {
      routes.forEach((RouteSet) => {
        new RouteSet(app);
      });
    }

    // Attaches the application with applied routes and middlewares to the Koa Server
    this.app = app;
    this.healthCheck = new SyHealthMixin(this, resourceThresholds);

    this.start();
  }

  /**
   * Internal method to start the server by initializing the database and cache,
   * and starting the HTTP server to listen on the specified port.
   */
  protected async start() {
    try {
      await this.ORM.startDatabase();
      await this.cache.start();

      this.server = this.app.listen(this.port, () => {
        this.logger.info(`Server running on http://localhost:${this.port}`);
      });
    } catch (error) {
      this.logger.error('Error starting server:', error);
      process.exit(1);
    }

    this.initEventHandlers();
  }

  /**
   * Internal method to initialize event handlers for unhandled rejections, uncaught exceptions,
   * SIGTERM, and SIGINT signals for graceful shutdown.
   */
  protected initEventHandlers() {
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      this.logger.error('Uncaught Exception thrown:', error);
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
   * Internal method to gracefully shut down the server, close the cache,
   * and handle any cleanup before exiting the process.
   */
  private async gracefulShutdown() {
    this.logger.info('Server is shutting down...');
    await this.cache.close();

    this.server?.close((error) => {
      if (error) {
        this.logger.error('Error while closing the server:', error);
        process.exit(1);
      } else {
        this.logger.info('Graceful shutdown complete.');
        process.exit(1);
      }
    });
  }
}
