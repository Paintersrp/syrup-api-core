import { Context, Next } from 'koa';

/**
 * Debounce is a decorator that ensures that a certain amount of time has passed before the decorated function
 * will be invoked. It can be useful to ensure that a function does not execute too often.
 *
 * @param {number} wait - The number of milliseconds to delay before invoking the decorated function.
 *
 * @example
 *
 * @Debounce(1000)
 * async someFunction(ctx: Context, next: Next) {
 *   // Implementation goes here.
 * }
 */
export function Debounce(wait: number) {
  let timeout: NodeJS.Timeout;

  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context, next: Next) {
      clearTimeout(timeout);
      timeout = setTimeout(async () => await originalMethod.call(this, ctx, next), wait);
    };

    return descriptor;
  };
}
