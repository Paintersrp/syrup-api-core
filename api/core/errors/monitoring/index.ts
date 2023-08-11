import { HttpStatus } from '../../lib';
import { SyError } from '../SyError';
import { ErrorCategory, ErrorCodes } from '../enums';

//doc
export class UptimeTrackerError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.UPTIME_TRACKER_FAIL,
      ErrorCategory.MONITORING,
      ErrorCodes.UPTIME_TRACKER_FAIL,
      message,
      details,
      internalErrorCode
    );
  }
}

//doc
export class HealthCheckError extends SyError {
  constructor(message: string, details?: unknown, internalErrorCode?: string) {
    super(
      HttpStatus.HEALTH_CHECK_FAIL,
      ErrorCategory.MONITORING,
      ErrorCodes.HEALTH_CHECK_FAIL,
      message,
      details,
      internalErrorCode
    );
  }
}
