import { logger } from '../../settings';

import { HttpStatus } from '../lib';
import { ErrorCodes } from './enums';
import { ErrorResponse } from './types';

/**
 * Base class for system errors.
 */
export abstract class SyError extends Error {
  public readonly status: number;
  public readonly message: string;
  public readonly details?: any;
  public readonly errorCode: string;
  public readonly internalErrorCode?: string;
  public readonly timestamp: string;

  /**
   * @param status - HTTP status code of the error.
   * @param errorCode - Specific error code representing the type of error.
   * @param message - Human-readable message providing more details about the error.
   * @param details - Detailed information about the error.
   * @param internalErrorCode - Localized error code to better trace
   */
  constructor(
    status: number,
    errorCode: ErrorCodes,
    message: string,
    details?: any,
    internalErrorCode?: string
  ) {
    super(message);

    this.status = status;
    this.errorCode = errorCode;
    this.message = message;
    this.details = details;
    this.internalErrorCode = internalErrorCode;
    this.timestamp = new Date().toISOString();

    if (new.target !== SyError) {
      Object.setPrototypeOf(this, new.target.prototype);
    }

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Converts the error object into a standard error response format.
   * @returns An error response object.
   */
  public toResponse(): ErrorResponse {
    return {
      status: this.status,
      errorCode: this.errorCode,
      message: this.message,
      details: this.details,
      internalErrorCode: this.internalErrorCode,
      timestamp: this.timestamp,
    };
  }

  /**
   * Logs the error details for debugging and tracing.
   */
  public logError(): void {
    logger.error({
      status: this.status,
      code: this.errorCode,
      message: this.message,
      details: this.details,
      internalErrorCode: this.internalErrorCode,
      timestamp: this.timestamp,
      stack: this.stack,
    });
  }

  /**
   * Returns stringified version of the error for outside usage.
   */
  public toString(): string {
    return (
      `SyError: ${this.status} ${this.errorCode} ${this.message}` +
      (this.internalErrorCode ? ` (${this.internalErrorCode})` : '') +
      (this.details ? `\nDetails: ${JSON.stringify(this.details)}` : '') +
      (this.timestamp ? `\nTimestamp: ${JSON.stringify(this.timestamp)}` : '') +
      (this.stack ? `\nStack trace:\n${this.stack}` : '')
    );
  }
}

/**
 * Class representing bad request errors.
 */
export class BadRequestError extends SyError {
  constructor(message: string, details?: any, internalErrorCode?: string) {
    super(HttpStatus.BAD_REQUEST, ErrorCodes.BAD_REQUEST, message, details, internalErrorCode);
  }
}

/**
 * Class representing forbidden errors.
 */
export class ForbiddenError extends SyError {
  constructor(message: string, details?: any, internalErrorCode?: string) {
    super(HttpStatus.FORBIDDEN, ErrorCodes.FORBIDDEN, message, details, internalErrorCode);
  }
}

/**
 * Class representing internal server errors.
 */
export class InternalServerError extends SyError {
  constructor(message: string, details?: any, internalErrorCode?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.INTERNAL_SERVER,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Class representing no content errors.
 */
export class NoContentError extends SyError {
  constructor(message: string, details?: any, internalErrorCode?: string) {
    super(HttpStatus.NO_CONTENT, ErrorCodes.NO_CONTENT, message, details, internalErrorCode);
  }
}

/**
 * Class representing not found errors.
 */
export class NotFoundError extends SyError {
  constructor(message: string, details?: any, internalErrorCode?: string) {
    super(HttpStatus.NOT_FOUND, ErrorCodes.NOT_FOUND, message, details, internalErrorCode);
  }
}

/**
 * Class representing request timeout errors.
 */
export class RequestTimeoutError extends SyError {
  constructor(message: string, details?: any, internalErrorCode?: string) {
    super(
      HttpStatus.REQUEST_TIMEOUT,
      ErrorCodes.REQUEST_TIMEOUT,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Class representing too many requests errors.
 */
export class TooManyRequestsError extends SyError {
  constructor(message: string, details?: any, internalErrorCode?: string) {
    super(
      HttpStatus.TOO_MANY_REQUESTS,
      ErrorCodes.TOO_MANY_REQUESTS,
      message,
      details,
      internalErrorCode
    );
  }
}

/**
 * Class representing unauthorized errors.
 */
export class UnauthorizedError extends SyError {
  constructor(message: string, details?: any, internalErrorCode?: string) {
    super(HttpStatus.UNAUTHORIZED, ErrorCodes.UNAUTHORIZED, message, details, internalErrorCode);
  }
}

/**
 * Class representing unsupported media type errors.
 */
export class UnsupportedMediaError extends SyError {
  constructor(message: string, details?: any, internalErrorCode?: string) {
    super(
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      ErrorCodes.UNSUPPORTED_MEDIA_TYPE,
      message,
      details,
      internalErrorCode
    );
  }
}
