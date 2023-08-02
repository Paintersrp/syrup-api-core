import { APP_LOGGER } from '../../../../settings';

/**
 * A Decorator that applies mixins to a target class. Mixins are classes that provide methods
 * and properties that are intended to be used by other classes, without having to be part of
 * the class hierarchy. It's a form of multiple inheritance, or a way to use aspect-oriented
 * programming. This decorator copies both instance and prototype (method) properties from the
 * mixins to the target class, warning of any naming collisions that occur.
 *
 * @param {...any[]} mixins - The mixin classes to apply to the target class.
 * @returns {Function} - The function that applies the mixins to the target class.
 *
 * @example
 * class CanWalk {
 *   walk() {
 *     return "I can walk.";
 *   }
 * }
 *
 * class CanSwim {
 *   swim() {
 *     return "I can swim.";
 *   }
 * }
 *
 * *@Mixin(CanWalk, CanSwim)
 * class Person { }
 *
 * let person = new Person();
 * console.log(person.walk()); // "I can walk."
 * console.log(person.swim()); // "I can swim."
 *
 */
export function Mixin(...mixins: any[]): Function {
  return function (target: any) {
    mixins.forEach((mixin) => {
      // Copy instance properties
      let mixinInstance = new mixin();

      // Using getOwnPropertyNames to also include non-enumerable properties
      Object.getOwnPropertyNames(mixinInstance).forEach((name) => {
        // Avoid copying the constructor and avoid overwriting existing properties
        if (name !== 'constructor' && !target.prototype.hasOwnProperty(name)) {
          let descriptor = Object.getOwnPropertyDescriptor(mixinInstance, name);
          Object.defineProperty(target.prototype, name, descriptor as PropertyDescriptor);
        } else if (target.prototype.hasOwnProperty(name)) {
          APP_LOGGER.warn(
            `Mixin property "${name}" is already defined in "${target.name}" and will not be overwritten.`
          );
        }
      });

      // Copy prototype properties
      Reflect.ownKeys(mixin.prototype).forEach((name) => {
        // Avoid copying the constructor and avoid overwriting existing properties
        if (name !== 'constructor' && !target.prototype.hasOwnProperty(name)) {
          let descriptor = Object.getOwnPropertyDescriptor(mixin.prototype, name);
          Object.defineProperty(target.prototype, name, descriptor as PropertyDescriptor);
        } else if (target.prototype.hasOwnProperty(name)) {
          APP_LOGGER.warn(
            `Mixin method "${String(name)}" is already defined in "${
              target.name
            }" and will not be overwritten.`
          );
        }
      });
    });
  };
}
