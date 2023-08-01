import { APP_LOGGER } from '../../../../settings';

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
    APP_LOGGER.info(`Execution Time of ${propertyKey} (${executionTime}ms)`);

    return result;
  };

  return descriptor;
}
