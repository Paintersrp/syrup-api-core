import Koa from 'koa';
import { User } from '../models';

/**
 * Koa middleware to handle logging requests. Logs the method, path, and user (role).
 *
 * @param ctx - Koa context object.
 * @param next - Next middleware function.
 */
export const loggingMiddleware: Koa.Middleware = async (ctx, next) => {
  const startTime = Date.now();

  try {
    await next();
  } finally {
    const duration = Date.now() - startTime;
    const user: User | string = ctx.state.user?.username || 'Anonymous';
    const role: string = ctx.state.user?.role || 'Unknown';

    ctx.logger.info({
      event: 'request',
      method: ctx.method,
      path: ctx.path,
      duration,
      user,
      role,
      status: ctx.status,
    });
  }
};
