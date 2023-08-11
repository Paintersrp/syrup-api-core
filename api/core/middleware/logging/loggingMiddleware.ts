import Koa from 'koa';
import _ from 'lodash';
import { RequestLogObject } from '../../logging/objects/RequestLogObject';

/**
 * Koa middleware to handle logging requests. Logs the method, path, and user (role).
 * If an error occurs while processing the request, it logs the error and rethrows it.
 *
 * @param ctx - The Koa context object, which includes request and response details.
 * @param next - The next middleware function in the Koa middleware stack.
 */
export const loggingMiddleware: Koa.Middleware = async (ctx, next) => {
  const startTime = process.hrtime.bigint();

  try {
    await next();
  } catch (err) {
    if (err instanceof Error) {
      ctx.logger.error(RequestLogObject.generate(ctx, startTime, err));
    }
    throw err;
  } finally {
    ctx.logger.logRequest(RequestLogObject.generate(ctx, startTime));
  }
};
