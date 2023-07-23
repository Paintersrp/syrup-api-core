/**
 * Before is a decorator that takes a method as an argument and executes it before the method it is decorating.
 * The method passed in should be a method that accepts a Koa context and next method.
 *
 * @param {string} methodName - The method to be executed before the decorated method.
 *
 * @example
 * @Before(someOtherFunction)
 * async someFunction(ctx: Context, next: Next) {}
 */
export function Before(methodName: string) {
  return function (target: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      await target[methodName].apply(this, args);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
