import { HttpStatus } from '../../lib';
import { SyError } from '../SyError';
import { ErrorCategory, ErrorCodes } from '../enums';

//doc
export class StreamExistsError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.STREAM_ALREADY_EXISTS,
      ErrorCategory.STREAM,
      ErrorCodes.STREAM_ALREADY_EXISTS,
      message,
      details,
      internalErrorCode
    );
  }
}

//doc
export class StreamNotFoundError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.STREAM_NOT_FOUND,
      ErrorCategory.STREAM,
      ErrorCodes.STREAM_NOT_FOUND,
      message,
      details,
      internalErrorCode
    );
  }
}
