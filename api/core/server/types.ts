import Koa, { DefaultContext, ParameterizedContext } from 'koa';
import compose from 'koa-compose';
import Router from 'koa-router';

import { SyLFUCache } from '../cache/clients/lfu/SyLFUCache';
import { SyLRUCache } from '../cache/clients/lru/SyLRUCache';
import { SyDatabase } from '../database/SyDatabase';
import { SyLogger } from '../logging/SyLogger';
import { RouteConstructor } from './managers/routes/types';

/**
 * Interface defining resource thresholds for server health monitoring.
 */
export interface ServerResourceThresholds {
  /** Memory usage threshold (0 to 1). */
  memoryUsageThreshold: number;

  /** CPU usage threshold (0 to 1). */
  cpuUsageThreshold: number;

  /** Disk space usage threshold (0 to 1). */
  diskSpaceThreshold: number;
}

export type ComposedMiddlewares = compose.ComposedMiddleware<
  ParameterizedContext<{}, DefaultContext, any>
>;

/**
 * Interface defining the options for configuring the SyServer instance.
 */
export interface SyServerOptions {
  /** The Koa application instance to be used for the server. */
  app: Koa;

  /** The port on which the server will listen for incoming connections. */
  port: number;

  /** The logger instance used for logging server-related information. */
  logger: SyLogger;

  /** The cache implementation used for server caching. */
  cache: SyLFUCache<any> | SyLRUCache<any>;

  /** The database connection instance used for server database operations. */
  ORM: SyDatabase;

  /** Optional resource thresholds for server health monitoring. */
  resourceThresholds?: ServerResourceThresholds;

  /** Optional middleware to be used by the server. */
  middleware?: ComposedMiddlewares;

  /** Optional array of RouteConstructor instances to register routes on the server. */
  routes?: RouteConstructor[];

  /** Optional version information for the server. */
  version?: string;

  /** Optional SSR Router, auto generated if SSR is configured. */
  ssrRouter?: Router;

  /** Optional distribution path for the frontend build for serving through SSR. */
  distPath?: string;

  /** Option to enable server clustering. */
  clustering?: boolean;
}
