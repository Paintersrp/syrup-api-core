import { EventEmitter } from 'events';
import { Context, Next } from 'koa';

/**
 * Emit is a decorator that emits a custom event using a provided EventEmitter after the execution of the decorated function.
 *
 * @param {EventEmitter} eventEmitter - The EventEmitter instance to use for emitting the event.
 */
export function Emit(eventEmitter: EventEmitter) {
  return function (_: any, methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context, next: Next) {
      await originalMethod.call(this, ctx, next);
      eventEmitter.emit(`${ctx.url.slice(1)}-${methodName}`); // Removes / from url
    };

    return descriptor;
  };
}
