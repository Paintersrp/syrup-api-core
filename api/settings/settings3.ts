import { SyrupConfigBuilder } from '../core/utils/ServerConfigBuilder/ServerConfigBuilder';

import * as Middleware from '../middleware';

export const config = new SyrupConfigBuilder()
  .debug(process.env.DEBUG === 'true')
  .secretKey(process.env.SECRET_KEY || 'your-default-secret-key')
  .currentVersion('0.07')
  .database({
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
  })
  .email({ EMAIL_BACKEND: 'syrup.mail.console' })
  .cache({
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
  })
  .loggers({})
  .maintenance({
    MODE: false,
    STATUS: 503,
    MESSAGE: 'We are upgrading our system. Please try again later.',
    END_ESTIMATE: undefined,
  })
  .middlewares([
    Middleware.cors(),
    Middleware.circuitBreakerMiddleware,
    Middleware.helmetMiddleware,
    Middleware.bodyParser({
      jsonLimit: '2mb',
    }),
    Middleware.rateLimitMiddleware,
    Middleware.maintenanceMiddleware,
    Middleware.serve('public'),
  ])
  .routes([])
  .auth({
    ADMIN_ROLES: ['super', 'admin'],
    STRATEGY: 'jwt',
    JWT_SECRET: 'your-jwt-secret',
  })
  .jobs({ ENGINE: 'bull', CONCURRENCY: 5 })
  .build();
