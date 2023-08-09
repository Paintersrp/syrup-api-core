import { Interval } from '../../lib';
import { EventManager } from './EventManager';

/**
 * Manager responsible for managing memory by removing stale event listeners.
 */
export class MemoryManager {
  /**
   * The duration after which listeners are considered stale.
   */
  private staleDuration: number = Interval.Hourly;

  /**
   * The service responsible for emitting operations.
   */
  private operationService: EventManager;

  /**
   * Create a new MemoryService instance.
   * @param operationService - The service responsible for emitting operations.
   */
  constructor(operationService: EventManager) {
    this.operationService = operationService;
  }

  /**
   * Remove event listeners that are considered stale based on the set duration.
   */
  public removeStaleListeners(): void {
    const currentTime = Date.now();
    const events = this.operationService.getEvents();

    for (const [eventName, eventData] of events.entries()) {
      for (let i = eventData.length - 1; i >= 0; i--) {
        if (currentTime - eventData[i].lastTriggered > this.staleDuration) {
          eventData.splice(i, 1);
        }
      }

      if (eventData.length === 0) {
        events.delete(eventName);
      }
    }
  }

  /**
   * Set the duration after which listeners are considered stale.
   *
   * @param duration - The duration in milliseconds.
   */
  public setStaleDuration(duration: number): void {
    this.staleDuration = duration;
  }
}
