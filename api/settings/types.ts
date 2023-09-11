export interface SqlPool {
  max: number;
  min: number;
  idle: number;
  acquire: number;
  evict: number;
}

export interface SqlDialectOptions {
  connectTimeout: number;
}

export interface SqlRetryOptions {
  max: number;
  backoffBase: number;
  backoffExponent: number;
}

export interface DatabaseConfig {
  PATH: string;
  TYPE: string;
  POOL?: SqlPool;
  DIALECT_OPTIONS?: SqlDialectOptions;
  RETRY?: SqlRetryOptions;
  SLOW_QUERY_THRESHOLD: number;
}

export interface EmailConfig {
  EMAIL_BACKEND: string;
  EMAIL_HOST?: string;
  EMAIL_PORT?: number;
  EMAIL_USE_TLS?: boolean;
  EMAIL_USE_SSL?: boolean;
  EMAIL_USER?: string;
  EMAIL_PASSWORD?: string;
}

export interface CacheOptions {
  defaultTTL: number;
  maxCacheSize: number;
  evictInterval: number;
  earlyExpirationProbablity: number;
  earlyExpirationWindow: number;
}

export interface CacheAlertOptions {
  minHitRatio: number;
  maxEvictions: number;
}

export interface CacheConfig {
  TYPE: 'in-memory' | 'redis';
  OPTIONS?: CacheOptions;
  ALERTS?: CacheAlertOptions;
}

export interface LoggerOptions {
  ENABLED: boolean;
  LOGLEVEL: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  VERBOSE: boolean;
  LOG_FILE_DESTINATION: string;
}

export interface LoggerConfig {
  // APP: LoggerOptions;
  // QUERY: LoggerOptions;
  // ERROR: LoggerOptions;
  // AUDIT: LoggerOptions;
  // ACCESS: LoggerOptions;
  MAX_LOG_FILE_SIZE: number;
}

export interface RouteConfig {
  BASE_PATH: string;
}

export interface AuthConfig {
  ADMIN_ROLES: string[];
  STRATEGY: 'jwt' | 'oauth2' | 'session';
  JWT_SECRET?: string; // If using JWT
  OAUTH2_CLIENT_ID?: string; // If using OAuth2
  OAUTH2_CLIENT_SECRET?: string; // If using OAuth2
  SESSION_SECRET?: string; // If using session-based auth
}

export interface JobConfig {
  ENGINE: 'bull' | 'agenda' | 'bee';
  CONCURRENCY: number;
}
