import Koa from 'koa';

import { ValidationError } from 'sequelize';
import { HttpStatus } from '../core/lib';
import { SyError } from '../core/errors/SyError';
import { ErrorResponse } from '../core/errors/types';
import { randomUUID } from 'crypto';

/**
 * Koa middleware to handle errors. Catches any errors that occur during
 * request processing and sends an appropriate error response.
 *
 * @param ctx - Koa context object.
 * @param next - Next middleware function.
 */
export const errorMiddleware: Koa.Middleware = async (ctx, next) => {
  ctx.requestId = randomUUID();

  try {
    await next();
  } catch (error) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details = {};

    if (error instanceof SyError) {
      const errorResponse: ErrorResponse = error.toResponse(ctx);
      status = errorResponse.status;
      message = errorResponse.message;
      details = errorResponse.details;
      error.logError(ctx);
    } else if (error instanceof ValidationError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = error.message;
      ctx.logger.error(message);
    } else {
      ctx.logger.error(error);
      throw error; // rethrow the error after logging
    }

    ctx.status = status;
    ctx.body = {
      status: status,
      message: message,
      details: details,
    };
  }
};
