import Koa, { DefaultContext, ParameterizedContext } from 'koa';
import compose from 'koa-compose';
import { Logger } from 'pino';
import { RouteConstructor } from '../../types';
import { SyCache } from '../cache/SyCache';
import { SyDatabase } from '../database/SyDatabase';

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

/**
 * Interface defining the options for configuring the SyServer instance.
 */
export interface SyServerOptions {
  /** The Koa application instance to be used for the server. */
  app: Koa;

  /** The port on which the server will listen for incoming connections. */
  port: number;

  /** The logger instance used for logging server-related information. */
  logger: Logger;

  /** The cache implementation used for server caching. */
  cache: SyCache<any>;

  /** The database connection instance used for server database operations. */
  ORM: SyDatabase;

  /** Optional resource thresholds for server health monitoring. */
  resourceThresholds?: ServerResourceThresholds;

  /** Optional middleware to be used by the server. */
  middleware?: compose.ComposedMiddleware<ParameterizedContext<{}, DefaultContext, any>>;

  /** Optional array of RouteConstructor instances to register routes on the server. */
  routes?: RouteConstructor[];

  /** Optional version information for the server. */
  version?: string;
}
