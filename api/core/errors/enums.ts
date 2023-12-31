/**
 * Enum for error codes.
 *
 * @enum {string}
 */
export enum ErrorCodes {
  BAD_GATEWAY = 'BAD_GATEWAY',
  BAD_REQUEST = 'BAD_REQUEST',
  CACHE_INPUT_FAIL = 'CACHE_INPUT_FAIL',
  CACHE_OPERATIONS_FAIL = 'CACHE_OPERATIONS_FAIL',
  CONFLICT = 'CONFLICT',
  EXPECTATION_FAILED = 'EXPECTATION_FAILED',
  FORBIDDEN = 'FORBIDDEN',
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',
  GONE = 'GONE',
  HEALTH_CHECK_FAIL = 'HEALTH_CHECK_FAIL',
  INTERNAL_SERVER = 'INTERNAL_SERVER_ERROR',
  NO_CONTENT = 'NO_CONTENT',
  NOT_FOUND = 'NOT_FOUND',
  REQUEST_ENTITY_TOO_LARGE = 'REQUEST_ENTITY_TOO_LARGE',
  REQUEST_TIMEOUT = 'REQUEST_TIMEOUT',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  STREAM_ALREADY_EXISTS = 'STREAM_ALREADY_EXISTS',
  STREAM_NOT_FOUND = 'STREAM_NOT_FOUND',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  VALIDATION = 'VALIDATION',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE',
  UPTIME_TRACKER_FAIL = 'UPTIME_TRACKER_FAIL',
  JOB_CRON_ERROR = 'JOB_CRON_ERROR',
  JOB_NOT_FOUND = 'JOB_NOT_FOUND',
  JOB_DUPLICATION = 'JOB_DUPLICATION',
}

/**
 * Enum for error categories.
 *
 * @enum {string}
 */
export enum ErrorCategory {
  CACHE = 'CacheError',
  CLIENT = 'ClientError',
  CRON = 'CronError',
  SERVER = 'ServerError',
  STREAM = 'StreamError',
  NETWORK = 'NetworkError',
  MONITORING = 'MonitoringError',
}
