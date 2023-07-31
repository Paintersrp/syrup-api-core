import { Context, Middleware } from 'koa';
import { ValidationError } from 'sequelize';
import { randomUUID } from 'crypto';

import { HttpStatus } from '../core/lib';
import { SyError } from '../core/errors/SyError';
import { ErrorResponse } from '../core/errors/types';

function categorizeAndLogError(error: any, ctx: Context): ErrorResponse {
  const timestamp = new Date().toISOString();
  if (error instanceof SyError) {
    const errorResponse: ErrorResponse = error.toResponse(ctx);
    error.logError(ctx);

    return {
      timestamp,
      status: errorResponse.status,
      message: errorResponse.message,
      details: errorResponse.details,
    };
  } else if (error instanceof ValidationError) {
    ctx.logger.error(error.message, error.stack);

    return {
      timestamp,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: error.message,
    };
  } else {
    ctx.logger.error(error);

    return {
      timestamp,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };
  }
}

function cleanStackTrace(stack: string | undefined): string[] | undefined {
  return stack?.split('\n').map((line: string) => line.trim());
}

export const errorMiddleware: Middleware = async (ctx, next) => {
  ctx.requestId = randomUUID();

  try {
    await next();
  } catch (error: any) {
    const { status, message, details } = categorizeAndLogError(error, ctx);
    const cleanStack = cleanStackTrace(error.stack);

    ctx.status = status;
    ctx.body = {
      requestId: ctx.requestId,
      path: ctx.url,
      status: status,
      message: message,
      details: details,
      stack: process.env.NODE_ENV === 'development' ? cleanStack : cleanStack,
    };
  }
};
