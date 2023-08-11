import { HttpStatus } from '../../lib';
import { SyError } from '../SyError';
import { ErrorCategory, ErrorCodes } from '../enums';

/**
 * Represents an HTTP 502 Bad Gateway server error.
 * The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.
 */
export class BadGatewayError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.BAD_GATEWAY,
      ErrorCategory.SERVER,
      ErrorCodes.BAD_GATEWAY,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 504 Gateway Timeout server error.
 * The server, while acting as a gateway or proxy, did not get a response in time from the upstream server that it needed in order to complete the request.
 */
export class GatewayTimeoutError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.GATEWAY_TIMEOUT,
      ErrorCategory.SERVER,
      ErrorCodes.GATEWAY_TIMEOUT,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 500 Internal Server Error.
 * The server encountered an unexpected condition that prevented it from fulfilling the request.
 */
export class InternalServerError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCategory.SERVER,
      ErrorCodes.INTERNAL_SERVER,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 503 Service Unavailable server error.
 * The server is not ready to handle the request. This can be due to a temporary overloading or maintenance of the server.
 */
export class ServiceUnavailableError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.SERVICE_UNAVAILABLE,
      ErrorCategory.SERVER,
      ErrorCodes.SERVICE_UNAVAILABLE,
      message,
      details,
      internalErrorCode
    );
  }
}
