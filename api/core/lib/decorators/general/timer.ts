import { APP_LOGGER } from '../../../../settings';

/**
 * Timer is a decorator that times the execution of the decorated function.
 * It logs the time taken to APP_LOGGER in milliseconds.
 *
 * @example
 * *@Timer
 * async someFunction(ctx: Context, next: Next) {}
 */
export function Timer(
  _: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const startHrTime = process.hrtime();

    const result = await originalMethod.apply(this, args);

    const hrTime = process.hrtime(startHrTime);
    const executionTime = hrTime[0] * 1e3 + hrTime[1] / 1e6;
    APP_LOGGER.info(`Execution Time of ${propertyKey}:`, {
      seconds: hrTime[0],
      milliseconds: hrTime[1] / 1e6,
      totalMilliseconds: executionTime,
    });

    return result;
  };

  return descriptor;
}
