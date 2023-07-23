/**
 * After is a decorator that takes a method as an argument and executes it after the method it is decorating.
 * The method passed in should be a method that accepts a Koa context and next method.
 *
 * @param {string} methodName - The method to be executed after the decorated method.
 *
 * @example
 * @After(someOtherFunction)
 * async someFunction(ctx: Context, next: Next) {}
 */
export function After(methodName: string) {
  return function (target: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      await originalMethod.apply(this, args);
      return target[methodName].apply(this, args);
    };

    return descriptor;
  };
}
