import { EmitterMiddleware } from '../types';

/**
 * Manager responsible for handling and applying middleware functions.
 */
export class MiddlewareManager {
  /**
   * Collection of middleware functions.
   */
  private middleware: EmitterMiddleware[] = [];

  /**
   * Register a new middleware function.
   *
   * @param middleware - The middleware function to be added.
   */
  public use(middleware: EmitterMiddleware): void {
    this.middleware.push(middleware);
  }

  /**
   * Apply all registered middleware functions for a given event.
   * If any middleware function returns `false`, the chain is broken, and the function returns `false`.
   *
   * @param event - The event name.
   * @param args - The arguments to be passed to the middleware functions.
   * @returns `true` if all middleware functions pass, `false` otherwise.
   */
  public process(event: string, ...args: any[]): boolean {
    for (const mw of this.middleware) {
      const proceed = mw(event, ...args);
      if (proceed === false) {
        return false;
      }
    }
    return true;
  }
}
