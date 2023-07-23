import { Context, Next } from 'koa';
import { logger } from '../../../../settings';

export function Retry(options?: { retries?: number; retryDelay?: number }) {
  const maxRetries = options?.retries ?? 3;
  const retryDelay = options?.retryDelay ?? 1000;

  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let currentRetry = 0;

      while (currentRetry < maxRetries) {
        try {
          if (
            args.length === 2 &&
            typeof args[1] === 'function' &&
            args[0] !== null &&
            typeof args[0] === 'object' &&
            'request' in args[0] &&
            'response' in args[0]
          ) {
            const [ctx, next] = args as [Context, Next];
            // logger.info('Running Koa');
            return await originalMethod.call(this, ctx, next);
          } else {
            // logger.info('Running Non-Koa');
            return await originalMethod.apply(this, args);
          }
        } catch (error) {
          logger.error('Error occurred:', error);
          currentRetry++;

          if (currentRetry < maxRetries) {
            logger.info(`Retrying in ${retryDelay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }
      }

      logger.error('Max retry attempts reached.');
      return false;
    };

    return descriptor;
  };
}
