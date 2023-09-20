import * as Middleware from '../middleware';
import { RouteConstructor } from '../core/server/managers/routes/types';
import {
  AuthConfig,
  CacheConfig,
  DatabaseConfig,
  DatabasesConfig,
  EmailConfig,
  JobConfig,
  LoggerConfig,
} from '../types';
import drizzleConfig from './drizzle';
import { ComposedMiddleware } from 'koa-compose';

// Jobs?
// Health Checks?
// AuditLogging?
// Reports?
// More DB Clients
// Redis
// Docs

import fs from 'fs';
import path from 'path';

function findProjectRoot(startPath: string): string | null {
  let currentPath = startPath;

  while (currentPath !== '/') {
    if (fs.existsSync(path.join(currentPath, 'package.json'))) {
      return path.dirname(currentPath);
    }
    currentPath = path.dirname(currentPath);
  }

  return null;
}
export const SETTINGS = {
  ROOT_DIR: findProjectRoot(__dirname),
  DEBUG: process.env.DEBUG === 'true',
  SESSION_SECRET: process.env.SECRET_KEY || 'your_session_secret_key',
  CURRENT_VERSION: '0.07',
  STATIC_DIR: 'public',

  /**
   * User Database Configuration
   */
  DATABASES: {
    DEFAULT: {
      PATH: '../dev.sqlite3',
      TYPE: 'sqlite',
      POOL: {
        max: 5,
        min: 0,
        idle: 10000,
        acquire: 30000,
        evict: 5000,
      },
      DIALECT_OPTIONS: {
        connectTimeout: 60000,
      },
      RETRY: {
        max: 5,
        backoffBase: 100,
        backoffExponent: 1.1,
      },
      SLOW_QUERY_THRESHOLD: 2000,
    } as DatabaseConfig,
  } as DatabasesConfig,

  // Email configuration
  EMAIL: {
    EMAIL_BACKEND: 'syrup.mail.console',
  } as EmailConfig,

  // Cache configuration
  CACHE: {
    TYPE: 'in-memory',
    OPTIONS: {
      defaultTTL: 30000,
      maxCacheSize: 200,
      evictInterval: 30000,
      earlyExpirationProbablity: 0.5,
      earlyExpirationWindow: 0.2,
    },
    ALERTS: {
      minHitRatio: 0.8,
      maxEvictions: 100,
    },
  } as CacheConfig,

  // Logger configurations (is this internal?)
  LOGGERS: {
    MAX_LOG_FILE_SIZE: 5, // MBs
  } as LoggerConfig,

  // Maintenance mode configuration
  MAINTENANCE: {
    MODE: false,
    STATUS: 503,
    MESSAGE: 'We are upgrading our system. Please try again later.',
    END_ESTIMATE: undefined,
  },

  // Middleware configurations
  MIDDLEWARES: Middleware.compose([
    Middleware.cors(),
    // Middleware.circuitBreakerMiddleware,
    Middleware.nonceMiddleware,
    Middleware.helmetMiddleware,
    Middleware.bodyParser({
      jsonLimit: '2mb',
    }),
    Middleware.rateLimitMiddleware,
    Middleware.maintenanceMiddleware,
    Middleware.serve('public'),
  ]) as ComposedMiddleware<any>,

  // Route configurations
  ROUTES: [] as RouteConstructor[],

  // Authentication configuration
  AUTH: {
    ADMIN_ROLES: ['super', 'admin'],
    STRATEGY: 'jwt',
    // JWT_SECRET: 'your-jwt-secret',
    JWT_SECRET: 'your_jwt_secret_key',
  } as AuthConfig,

  // Job processing configuration
  JOBS: {
    ENGINE: 'bull',
    CONCURRENCY: 5,
  } as JobConfig,

  RESOURCE_THRESHOLDS: {
    memoryUsage: 0.1,
    cpuUsage: 0.8,
    diskUsage: 0.8,
  },

  DRIZZLE: drizzleConfig,
};
