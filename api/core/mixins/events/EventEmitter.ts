import { Context, Next } from 'koa';

/**
 * @class EventEmitter
 */
export class EventEmitter {
  /**
   * Object storing arrays of listener functions keyed by event name.
   * @private
   */
  private events: { [key: string]: Function[] } = {};

  /**
   * Registers a new listener for a given event.
   * @param {string} event - Name of the event to listen for.
   * @param {Function} listener - Callback function to be invoked when the event is emitted.
   */
  public on(event: string, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  /**
   * Emits a named event to all registered listeners asynchronously.
   *
   * @param {string} event - Name of the event to emit.
   * @param {any} args - Argument to pass to the listener function.
   */
  public emit(event: string, args?: any): void {
    if (this.events[event]) {
      this.events[event].forEach((listener) => {
        Promise.resolve().then(() => listener(args));
      });
    }
  }
}
