import { HttpStatus } from '../lib';
import { ErrorCategory, ErrorCodes } from './enums';
import { SyError } from './SyError';

/**
 * Represents an HTTP 502 Bad Gateway server error.
 * The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.
 */
export const BadGatewayError = SyError.createErrorType(
  HttpStatus.BAD_GATEWAY,
  ErrorCategory.SERVER,
  ErrorCodes.BAD_GATEWAY
);

/**
 * Represents an HTTP 504 Gateway Timeout server error.
 * The server, while acting as a gateway or proxy, did not get a response in time from the upstream server that it needed in order to complete the request.
 */
export const GatewayTimeoutError = SyError.createErrorType(
  HttpStatus.GATEWAY_TIMEOUT,
  ErrorCategory.SERVER,
  ErrorCodes.GATEWAY_TIMEOUT
);

/**
 * Represents an HTTP 500 Internal Server Error.
 * The server encountered an unexpected condition that prevented it from fulfilling the request.
 */
export const InternalServerError = SyError.createErrorType(
  HttpStatus.INTERNAL_SERVER_ERROR,
  ErrorCategory.SERVER,
  ErrorCodes.INTERNAL_SERVER
);

/**
 * Represents an HTTP 503 Service Unavailable server error.
 * The server is not ready to handle the request. This can be due to a temporary overloading or maintenance of the server.
 */
export const ServiceUnavailableError = SyError.createErrorType(
  HttpStatus.SERVICE_UNAVAILABLE,
  ErrorCategory.SERVER,
  ErrorCodes.SERVICE_UNAVAILABLE
);

/**
 * Represents an HTTP 504 Gateway Timeout server error.
 * The server, while acting as a gateway or proxy, did not get a response in time from the upstream server that it needed in order to complete the request.
 */
export const CacheInputError = SyError.createErrorType(
  HttpStatus.CACHE_INPUT_FAIL,
  ErrorCategory.CACHE,
  ErrorCodes.CACHE_INPUT_FAIL
);

/**
 * Represents an HTTP 504 Gateway Timeout server error.
 * The server, while acting as a gateway or proxy, did not get a response in time from the upstream server that it needed in order to complete the request.
 */
export const CacheOperationsError = SyError.createErrorType(
  HttpStatus.CACHE_OPERATIONS_FAIL,
  ErrorCategory.CACHE,
  ErrorCodes.CACHE_OPERATIONS_FAIL
);
