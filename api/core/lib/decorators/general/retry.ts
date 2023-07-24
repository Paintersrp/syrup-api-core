import { Context, Next } from 'koa';
import { logger } from '../../../../settings';

/**
 * Interface for Retry Decorator options
 */
type RetryOptions = {
  retries?: number; // Number of retries
  retryDelay?: number; // Initial delay before retrying in milliseconds
  exponentialBackoff?: boolean; // If true, delay will increase exponentially with each retry
  backoffMultiplier?: number; // Factor by which delay increases with each retry
};

/**
 * Retry Decorator that retries a failed operation with optional exponential backoff.
 *
 * @param options The options for retrying.
 */
export function Retry(options?: RetryOptions) {
  const maxRetries = options?.retries ?? 3;
  let retryDelay = options?.retryDelay ?? 1000;
  const exponentialBackoff = options?.exponentialBackoff ?? false;
  const backoffMultiplier = options?.backoffMultiplier ?? 2;

  // Returns the descriptor for the method that is being decorated
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let currentRetry = 0;

      const koaMiddlewareCheck =
        args.length === 2 &&
        typeof args[1] === 'function' &&
        args[0] !== null &&
        typeof args[0] === 'object' &&
        'request' in args[0] &&
        'response' in args[0];

      // Retry loop
      while (currentRetry < maxRetries) {
        try {
          // If the function is Koa middleware, apply 'this' to the original method and pass context and next as arguments
          if (koaMiddlewareCheck) {
            const [ctx, next] = args as [Context, Next];
            return await originalMethod.call(this, ctx, next);
          }
          // For non-Koa functions, just apply 'this' to the original method and pass all arguments
          else {
            return await originalMethod.apply(this, args);
          }
        } catch (error) {
          // Log error and increase retry count
          logger.error('Error occurred:', error);
          currentRetry++;

          // If we haven't reached max retries, log retry message, wait and increase delay if needed
          if (currentRetry < maxRetries) {
            logger.info(`Retrying in ${retryDelay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));

            if (exponentialBackoff) {
              retryDelay *= backoffMultiplier;
            }
          }
        }
      }

      logger.error('Max retry attempts reached.');
      return false;
    };

    return descriptor;
  };
}
