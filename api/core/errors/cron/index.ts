import { HttpStatus } from '../../lib';
import { SyError } from '../SyError';
import { ErrorCategory, ErrorCodes } from '../enums';

//doc
export class JobCronError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.JOB_CRON_ERROR,
      ErrorCategory.CRON,
      ErrorCodes.JOB_CRON_ERROR,
      message,
      details,
      internalErrorCode
    );
  }
}

//doc
export class JobNotFoundError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.JOB_NOT_FOUND,
      ErrorCategory.CRON,
      ErrorCodes.JOB_NOT_FOUND,
      message,
      details,
      internalErrorCode
    );
  }
}

//doc
export class JobDuplicationError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.JOB_DUPLICATION,
      ErrorCategory.CRON,
      ErrorCodes.JOB_DUPLICATION,
      message,
      details,
      internalErrorCode
    );
  }
}
