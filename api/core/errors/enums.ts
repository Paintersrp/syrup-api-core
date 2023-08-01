/**
 * Enum for error codes.
 *
 * @enum {string}
 */
export enum ErrorCodes {
  BAD_GATEWAY = 'BAD_GATEWAY',
  BAD_REQUEST = 'BAD_REQUEST',
  CACHE_INPUT_FAIL = 'CACHE_INPUT FAIL',
  CACHE_OPERATIONS_FAIL = 'CACHE_INPUT FAIL',
  CONFLICT = 'CONFLICT',
  EXPECTATION_FAILED = 'EXPECTATION_FAILED',
  FORBIDDEN = 'FORBIDDEN',
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',
  GONE = 'GONE',
  INTERNAL_SERVER = 'INTERNAL_SERVER_ERROR',
  NO_CONTENT = 'NO_CONTENT',
  NOT_FOUND = 'NOT_FOUND',
  REQUEST_ENTITY_TOO_LARGE = 'REQUEST_ENTITY_TOO_LARGE',
  REQUEST_TIMEOUT = 'REQUEST_TIMEOUT',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  VALIDATION = 'VALIDATION',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE',
}

/**
 * Enum for error categories.
 *
 * @enum {string}
 */
export enum ErrorCategory {
  CACHE = 'CacheError',
  CLIENT = 'ClientError',
  SERVER = 'ServerError',
  NETWORK = 'NetworkError',
}
