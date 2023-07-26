import { HttpStatus } from '../lib';
import { ErrorCategory, ErrorCodes } from './enums';
import { SyError } from './SyError';

/**
 * Represents an HTTP 400 Bad Request client error.
 * The server could not understand the request due to invalid syntax.
 */
export const BadRequestError = SyError.createErrorType(
  HttpStatus.BAD_REQUEST,
  ErrorCategory.CLIENT,
  ErrorCodes.BAD_REQUEST
);

/**
 * Represents an HTTP 409 Conflict client error.
 * This response is sent when a request conflicts with the current state of the server.
 */
export const ConflictError = SyError.createErrorType(
  HttpStatus.CONFLICT,
  ErrorCategory.CLIENT,
  ErrorCodes.CONFLICT
);

/**
 * Represents an HTTP 417 Expectation Failed client error.
 * The expectation given in the Expect request-header field could not be met by this server.
 */
export const ExpectationFailedError = SyError.createErrorType(
  HttpStatus.EXPECTATION_FAILED,
  ErrorCategory.CLIENT,
  ErrorCodes.EXPECTATION_FAILED
);

/**
 * Represents an HTTP 403 Forbidden client error.
 * The client does not have access rights to the content.
 */
export const ForbiddenError = SyError.createErrorType(
  HttpStatus.FORBIDDEN,
  ErrorCategory.CLIENT,
  ErrorCodes.FORBIDDEN
);

/**
 * Represents an HTTP 410 Gone client error.
 * The requested content has been permanently deleted from server.
 */
export const GoneError = SyError.createErrorType(
  HttpStatus.GONE,
  ErrorCategory.CLIENT,
  ErrorCodes.GONE
);

/**
 * Represents an HTTP 204 No Content client error.
 * The server has successfully fulfilled the request and there is no additional content to send in the response payload body.
 */
export const NoContentError = SyError.createErrorType(
  HttpStatus.NO_CONTENT,
  ErrorCategory.CLIENT,
  ErrorCodes.NO_CONTENT
);

/**
 * Represents an HTTP 404 Not Found client error.
 * The server can not find the requested resource.
 */
export const NotFoundError = SyError.createErrorType(
  HttpStatus.NOT_FOUND,
  ErrorCategory.CLIENT,
  ErrorCodes.NOT_FOUND
);

/**
 * Represents an HTTP 408 Request Timeout client error.
 * The server would like to shut down this unused connection.
 */
export const RequestTimeoutError = SyError.createErrorType(
  HttpStatus.REQUEST_TIMEOUT,
  ErrorCategory.CLIENT,
  ErrorCodes.REQUEST_TIMEOUT
);

/**
 * Represents an HTTP 429 Too Many Requests client error.
 * The user has sent too many requests in a given amount of time ("rate limiting").
 */
export const TooManyRequestsError = SyError.createErrorType(
  HttpStatus.TOO_MANY_REQUESTS,
  ErrorCategory.CLIENT,
  ErrorCodes.TOO_MANY_REQUESTS
);

/**
 * Represents an HTTP 401 Unauthorized client error.
 * The request has not been applied because it lacks valid authentication credentials for the target resource.
 */
export const UnauthorizedError = SyError.createErrorType(
  HttpStatus.UNAUTHORIZED,
  ErrorCategory.CLIENT,
  ErrorCodes.UNAUTHORIZED
);

/**
 * Represents an HTTP 415 Unsupported Media Type client error.
 * The media format of the requested data is not supported by the server.
 */
export const UnsupportedMediaError = SyError.createErrorType(
  HttpStatus.UNSUPPORTED_MEDIA_TYPE,
  ErrorCategory.CLIENT,
  ErrorCodes.UNSUPPORTED_MEDIA_TYPE
);
