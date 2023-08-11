import { HttpStatus } from '../../lib';
import { SyError } from '../SyError';
import { ErrorCategory, ErrorCodes } from '../enums';

/**
 * Represents an HTTP 400 Bad Request error.
 */
export class BadRequestError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.BAD_REQUEST,
      ErrorCategory.CLIENT,
      ErrorCodes.BAD_REQUEST,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 409 Conflict client error.
 * This response is sent when a request conflicts with the current state of the server.
 */
export class ConflictError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.CONFLICT,
      ErrorCategory.CLIENT,
      ErrorCodes.CONFLICT,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 417 Expectation Failed client error.
 * The expectation given in the Expect request-header field could not be met by this server.
 */
export class ExpectationFailedError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.EXPECTATION_FAILED,
      ErrorCategory.CLIENT,
      ErrorCodes.EXPECTATION_FAILED,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 403 Forbidden client error.
 * The client does not have access rights to the content.
 */
export class ForbiddenError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.FORBIDDEN,
      ErrorCategory.CLIENT,
      ErrorCodes.FORBIDDEN,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 410 Gone client error.
 * The requested content has been permanently deleted from server.
 */
export class GoneError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.GONE,
      ErrorCategory.CLIENT,
      ErrorCodes.GONE,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 204 No Content client error.
 * The server has successfully fulfilled the request and there is no additional content to send in the response payload body.
 */
export class NoContentError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.NO_CONTENT,
      ErrorCategory.CLIENT,
      ErrorCodes.NO_CONTENT,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 404 Not Found client error.
 * The server can not find the requested resource.
 */
export class NotFoundError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.NOT_FOUND,
      ErrorCategory.CLIENT,
      ErrorCodes.NOT_FOUND,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 408 Request Timeout client error.
 * The server would like to shut down this unused connection.
 */
export class RequestTimeoutError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.REQUEST_TIMEOUT,
      ErrorCategory.CLIENT,
      ErrorCodes.REQUEST_TIMEOUT,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 429 Too Many Requests client error.
 * The user has sent too many requests in a given amount of time ("rate limiting").
 */
export class TooManyRequestsError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.TOO_MANY_REQUESTS,
      ErrorCategory.CLIENT,
      ErrorCodes.TOO_MANY_REQUESTS,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 400 Unauthorized client error.
 * The request has not been applied because it lacks valid authentication credentials for the target resource.
 */
export class ValidationError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.BAD_REQUEST,
      ErrorCategory.CLIENT,
      ErrorCodes.BAD_REQUEST,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 401 Unauthorized client error.
 * The request has not been applied because it lacks valid authentication credentials for the target resource.
 */
export class UnauthorizedError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.UNAUTHORIZED,
      ErrorCategory.CLIENT,
      ErrorCodes.UNAUTHORIZED,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Represents an HTTP 415 Unsupported Media Type client error.
 * The media format of the requested data is not supported by the server.
 */
export class UnsupportedMediaError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      ErrorCategory.CLIENT,
      ErrorCodes.UNSUPPORTED_MEDIA_TYPE,
      message,
      details,
      internalErrorCode
    );
  }
}
