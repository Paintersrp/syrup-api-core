import { Server } from 'http';

import Koa from 'koa';
import Router from 'koa-router';

import { ComposedMiddlewares, SyServerOptions } from './types';
import { ServerHealthMixin } from './mixins/ServerHealthMixin';

import { SyLFUCache } from '../cache/clients/lfu/SyLFUCache';
import { SyLRUCache } from '../cache/clients/lru/SyLRUCache';
import { SyDatabase } from '../database/SyDatabase';
import { SyLogger } from '../logging/SyLogger';
import {
  CacheManager,
  ClusterManager,
  DatabaseManager,
  EventManager,
  LifecycleManager,
  MiddlewareManager,
  RouteManager,
  SessionManager,
  SSRManager,
} from './managers';
import { RouteConstructor } from '../../types';

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

  protected lifecycleManager: LifecycleManager;
  protected sessionManager: SessionManager;
  protected middlewareManager: MiddlewareManager;
  protected routeManager: RouteManager;
  protected ssrManager: SSRManager;
  protected eventManager: EventManager;
  protected cacheManager: CacheManager;
  protected databaseManager: DatabaseManager;
  protected clusterManager: ClusterManager;

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
    clustering = false,
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

    this.initializeManagers(app, middleware, distPath, routes);

    this.app = app;
    this.health = new ServerHealthMixin(this, resourceThresholds);

    if (clustering) {
      this.clusterManager.startWithClustering();
    } else {
      this.lifecycleManager.start();
    }
  }

  /**
   * Attaches the logger to the Koa context to enable logging in middleware and routes.
   * @param {Koa} app - The Koa application instance.
   */
  private initializeManagers(
    app: Koa,
    middleware?: ComposedMiddlewares | undefined,
    distPath?: string,
    routes?: RouteConstructor[]
  ) {
    this.cacheManager = new CacheManager(this.cache);
    this.databaseManager = new DatabaseManager(this.ORM);
    this.lifecycleManager = new LifecycleManager(
      app,
      this.port,
      this.logger,
      this.cacheManager,
      this.databaseManager
    );

    this.sessionManager = new SessionManager(app);
    this.middlewareManager = new MiddlewareManager(app, middleware);
    this.ssrManager = new SSRManager(app, this.router, distPath);
    this.routeManager = new RouteManager(app, this.router, this.lifecycleManager, routes);
    this.eventManager = new EventManager(this.logger, this.lifecycleManager);
    this.clusterManager = new ClusterManager(this.logger, this.lifecycleManager.start.bind(this));
  }

  /**
   * Start the server by initializing the database and cache,
   * and starting the HTTP server to listen on the specified port.
   * @public
   * @returns {Promise<void>}
   */
  public async start(): Promise<void> {
    await this.lifecycleManager.start();
  }

  /**
   * The entry point of your application when using clustering.
   * This will either create workers if this is the master process,
   * or initialize the server if it's a worker process.
   */
  public async startWithClustering(): Promise<void> {
    await this.clusterManager.startWithClustering();
  }
}

// Shutdown?
// Restart?
