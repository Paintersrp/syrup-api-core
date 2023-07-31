/**
 * @description User Database Configuration
 */
export const DATABASE = {
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
  VERBOSE_LOGGING: false, // unimplemented
};
