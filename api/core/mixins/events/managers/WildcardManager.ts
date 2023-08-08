import { EventListener } from '../types';

/**
 * Manager responsible for managing and emitting wildcard events.
 * Wildcard events are events that are not tied to a specific event name but are invoked for every emitted event.
 */
export class WildcardManager {
  /**
   * Collection of event listeners registered for wildcard events.
   */
  private wildcardListeners: EventListener[] = [];

  /**
   * Register a new listener for wildcard events.
   *
   * @param listener - The listener function to be added.
   */
  public on(listener: EventListener): void {
    this.wildcardListeners.push(listener);
  }

  /**
   * Remove a previously registered listener for wildcard events.
   *
   * @param listener - The listener function to be removed.
   */
  public off(listener: EventListener): void {
    const index = this.wildcardListeners.indexOf(listener);
    if (index > -1) {
      this.wildcardListeners.splice(index, 1);
    }
  }

  /**
   * Emit a wildcard event to all registered wildcard listeners.
   *
   * @param event - The event name.
   * @param args - The arguments to be passed to the wildcard listeners.
   */
  public emit(event: string, ...args: any[]): void {
    this.wildcardListeners.forEach((listener) => {
      listener(event, ...args);
    });
  }
}
