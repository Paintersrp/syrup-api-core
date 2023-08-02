/**
 * Singleton is a decorator that ensures a class has only one instance.
 * It overrides the constructor to return the same instance every time the class is instantiated.
 */
export function Singleton(target: any) {
  let instance: any;

  // Save a reference to the original constructor
  const original = target;

  // a utility function to generate instances of a class
  const constructor = function (...args: any[]) {
    if (!instance) {
      instance = new original(...args);
    }
    return instance;
  };

  // the prototype of the new constructor must be a copy of the original's prototype
  constructor.prototype = original.prototype;

  return constructor as any;
}
