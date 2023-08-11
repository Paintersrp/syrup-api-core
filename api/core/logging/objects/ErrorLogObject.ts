import { Context } from 'koa';
import { ValidationError } from 'sequelize';
import { SyError } from '../../errors/SyError';
import { ErrorLogObjectResponse, ErrorResponse } from '../../errors/types';
import { HttpStatus } from '../../lib';

export class ErrorLogObject {
  timestamp: string;
  requestId: string;
  path: string;
  userAgent: string;
  ipAddress: string;
  error: Error;
  stack: string[] | undefined;
  ctx: Context;
  userId: string;
  requestMethod: string;
  responseStatus: number;

  constructor(error: Error, ctx: Context) {
    this.error = error;

    this.ctx = ctx;
    this.timestamp = new Date().toISOString();
    this.requestId = ctx.requestId;
    this.path = ctx.url;
    this.userAgent = ctx.request.get('User-Agent');
    this.ipAddress = ctx.request.ip;
    this.userId = ctx.state.user?.username || 'Anonymous';
    this.requestMethod = ctx.method;
    this.responseStatus = ctx.status;
  }

  public categorizeAndLogError(): ErrorLogObjectResponse {
    if (this.error instanceof SyError) {
      const errorResponse: ErrorResponse = this.error.toResponse(this.ctx);
      this.error.logError(this.ctx, this.ctx.logger);

      return {
        timestamp: this.timestamp,
        status: errorResponse.status,
        message: errorResponse.message,
        details: errorResponse.details,
        requestId: this.requestId,
        path: this.path,
        userAgent: this.userAgent,
        ipAddress: this.ipAddress,
        stack: this.cleanStackTrace(this.error.stack),
        userId: this.userId,
        requestMethod: this.requestMethod,
        responseStatus: this.responseStatus,
      };
    } else if (this.error instanceof ValidationError) {
      this.ctx.logger.error(this.error.message, this.error.stack);

      return {
        timestamp: this.timestamp,
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: this.error.message,
        requestId: this.requestId,
        path: this.path,
        userAgent: this.userAgent,
        ipAddress: this.ipAddress,
        stack: this.cleanStackTrace(this.error.stack),
        userId: this.userId,
        requestMethod: this.requestMethod,
        responseStatus: this.responseStatus,
      };
    } else {
      this.ctx.logger.error(this.error);

      return {
        timestamp: this.timestamp,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        requestId: this.requestId,
        path: this.path,
        userAgent: this.userAgent,
        ipAddress: this.ipAddress,
        stack: this.cleanStackTrace(this.error.stack),
        userId: this.userId,
        requestMethod: this.requestMethod,
        responseStatus: this.responseStatus,
      };
    }
  }

  private cleanStackTrace(stack: string | undefined): string[] | undefined {
    return stack?.split('\n').map((line: string) => line.trim());
  }
}
