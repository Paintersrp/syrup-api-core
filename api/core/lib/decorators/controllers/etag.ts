import { Context, Next } from 'koa';
import crypto from 'crypto';

/**
 * ETag is a decorator that sets the 'ETag' header of the response context based on the md5 hash of the response body.
 * It improves caching and optimizes client-server communication.
 *
 * @example
 * *@ETag
 * async someFunction(ctx: Context, next: Next) {}
 */
export function ETag(_: any, __: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (ctx: Context, next: Next) {
    await originalMethod.call(this, ctx, next);

    if (ctx.body) {
      const etag = crypto.createHash('md5').update(JSON.stringify(ctx.body)).digest('hex');
      ctx.set('ETag', etag);
    }

    return ctx.body;
  };
}
