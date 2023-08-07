interface SqlPool {
  max: number;
  min: number;
  idle: number;
  acquire: number;
  evict: number;
}

interface SqlDialectOptions {
  connectTimeout: number;
}

interface SqlRetryOptions {
  max: number;
  backoffBase: number;
  backoffExponent: number;
}

interface DatabaseConfig {
  PATH: string;
  TYPE: string;
  POOL?: SqlPool;
  DIALECT_OPTIONS?: SqlDialectOptions;
  RETRY?: SqlRetryOptions;
  SLOW_QUERY_THRESHOLD: number;
}

interface EmailConfig {
  EMAIL_BACKEND: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USE_TLS: boolean;
  EMAIL_USE_SSL: boolean;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
}

interface CacheOptions {
  defaultTTL: number;
  maxCacheSize: number;
  evictInterval: number;
  earlyExpirationProbablity: number;
  earlyExpirationWindow: number;
}

interface CacheAlertOptions {
  minHitRatio: number;
  maxEvictions: number;
}

interface CacheConfig {
  TYPE: 'in-memory' | 'redis';
  OPTIONS?: CacheOptions;
  ALERTS?: CacheAlertOptions;
}

interface LoggerOptions {
  ENABLED: boolean;
  LOGLEVEL: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  VERBOSE: boolean;
  LOG_FILE_DESTINATION: string;
}

interface LoggerConfig {
  APP: LoggerOptions;
  QUERY: LoggerOptions;
  ERROR: LoggerOptions;
  AUDIT: LoggerOptions;
  ACCESS: LoggerOptions;
}

interface RouteConfig {
  BASE_PATH: string;
}

interface AuthConfig {
  ADMIN_ROLES: string[];
  STRATEGY: 'jwt' | 'oauth2' | 'session';
  JWT_SECRET?: string; // If using JWT
  OAUTH2_CLIENT_ID?: string; // If using OAuth2
  OAUTH2_CLIENT_SECRET?: string; // If using OAuth2
  SESSION_SECRET?: string; // If using session-based auth
}

interface JobConfig {
  ENGINE: 'bull' | 'agenda' | 'bee';
  CONCURRENCY: number;
}
