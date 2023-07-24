import { logger } from '../../../../settings';

/**
 * Method decorator to time and log the execution duration of the method.
 *
 * The decorator will measure the execution time in milliseconds of the decorated method
 * and log the result using the provided logger. The log entry includes the name of the
 * method and the execution time in milliseconds.
 *
 * Usage:
 * ```typescript
 *   @Timer
 *   async myMethod() {
 *     // Your code here...
 *   }
 * ```
 *
 * @returns The modified PropertyDescriptor with timing and logging functionality.
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
    logger.info(`Execution Time of ${propertyKey} (${executionTime}ms)`);

    return result;
  };

  return descriptor;
}
