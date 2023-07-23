import Koa from 'koa';
import { ValidationError } from 'sequelize';
import { HttpStatus } from '../core/lib';
import { SyError } from '../core/errors/SyError';
import { ErrorResponse } from '../core/types/error';

/**
 * Koa middleware to handle errors. Catches any errors that occur during
 * request processing and sends an appropriate error response.
 *
 * @param ctx - Koa context object.
 * @param next - Next middleware function.
 */
export const errorMiddleware: Koa.Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof SyError) {
      const errorResponse: ErrorResponse = error.toResponse();
      ctx.status = errorResponse.status;
      ctx.body = errorResponse;
      ctx.logger.error(errorResponse);
    } else if (error instanceof ValidationError) {
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body = { error: error.message };
      ctx.logger.error(error.message, { error });
    } else {
      ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        status: ctx.status,
        message: 'Internal server error',
      };
      ctx.logger.error(error);
    }
  }
};
