import { HttpStatus } from '../../lib';
import { SyError } from '../SyError';
import { ErrorCategory, ErrorCodes } from '../enums';

//doc
export class CacheInputError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.CACHE_INPUT_FAIL,
      ErrorCategory.CACHE,
      ErrorCodes.CACHE_INPUT_FAIL,
      message,
      details,
      internalErrorCode
    );
  }
}

//doc
export class CacheOperationsError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.CACHE_OPERATIONS_FAIL,
      ErrorCategory.CACHE,
      ErrorCodes.CACHE_OPERATIONS_FAIL,
      message,
      details,
      internalErrorCode
    );
  }
}
