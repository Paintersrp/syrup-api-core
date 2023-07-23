import { Context, Next } from 'koa';

/**
 * @todo Redirect to endpoint route instead of url?
 */

/**
 * Redirect is a decorator that redirects the client to a specified URL after the execution of the decorated function.
 *
 * @param {string} url - The URL to redirect to.
 *
 * @example
 * *@Redirect('https://example.com')
 * async someFunction(ctx: Context, next: Next) {}
 */
export function Redirect(url: string) {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context, next: Next) {
      await originalMethod.call(this, ctx, next);
      ctx.redirect(url);
    };
  };
}
