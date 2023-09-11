import * as Routes from '../routes';
import * as Middleware from '../middleware';
import { RouteConstructor } from '../core/server/managers/routes/types';
import {
  AuthConfig,
  CacheConfig,
  DatabaseConfig,
  EmailConfig,
  JobConfig,
  LoggerConfig,
} from './types';

// Jobs?
// Anomaly?
// Health Checks?
// AuditLogging?
// Reports?
// Emails ?
// More DB Clients
// Redis
// Docs
//

export const SETTINGS = {
  DEBUG: process.env.DEBUG === 'true',
  SECRET_KEY: process.env.SECRET_KEY || 'your-default-secret-key',
  CURRENT_VERSION: '0.07',

  // Database configuration
  DATABASES: {
    default: {
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
  },

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
    Middleware.circuitBreakerMiddleware,
    Middleware.helmetMiddleware,
    Middleware.bodyParser({
      jsonLimit: '2mb',
    }),
    Middleware.rateLimitMiddleware,
    Middleware.maintenanceMiddleware,
    Middleware.serve('public'), // ?
  ]),

  // Route configurations
  ROUTES: [] as RouteConstructor[],

  // Authentication configuration
  AUTH: {
    ADMIN_ROLES: ['super', 'admin'],
    STRATEGY: 'jwt',
    JWT_SECRET: 'your-jwt-secret',
  } as AuthConfig,

  // Job processing configuration
  JOBS: {
    ENGINE: 'bull',
    CONCURRENCY: 5,
  } as JobConfig,
};
