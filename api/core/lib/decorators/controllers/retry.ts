// Replace with middleware?
import { Context, Next } from 'koa';

/**
 * Retry is a decorator that retries the execution of the decorated function if it throws an error. It retries a specified
 * number of times and waits a specified number of milliseconds before each retry.
 *
 * @param {number} retries - The number of times to retry. Default is 3.
 * @param {number} delay - The number of milliseconds to wait before each retry. Default is 300.
 *
 * @example
 *
 * *@Retry(5, 500)
 * async someFunction(ctx: Context, next: Next) {}
 */
export function Retry(retries: number = 3, delay: number = 300) {
  return function (_: Object, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context, next: Next) {
      for (let i = 0; i <= retries; i++) {
        try {
          return await originalMethod.call(this, ctx, next);
        } catch (error) {
          if (i === retries) {
            throw error;
          }

          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    };
  };
}
