import { Context, Middleware } from 'koa';
import { randomUUID } from 'crypto';

import { ErrorLogObject } from '../core/logging/objects/ErrorLogObject';

export const errorMiddleware: Middleware = async (ctx: Context, next) => {
  ctx.requestId = randomUUID();

  try {
    await next();
  } catch (error: any) {
    const errorLogObject = new ErrorLogObject(error, ctx);
    const errorResponse = errorLogObject.categorizeAndLogError();

    ctx.status = errorResponse.status;
    ctx.body = errorResponse;
  }
};
