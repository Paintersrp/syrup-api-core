import { ConditionFunction, EventData, EventListener } from '../types';

/**
 * Service responsible for managing and emitting events.
 */
export class EventManager {
  public events: Map<string, EventData[]> = new Map();
  private hierarchy: Map<string, string[]> = new Map();
  private maxListeners: number = 10;

  /**
   * Ensure the event is initialized.
   * @param event - The name of the event.
   */
  private ensureEventInitialized(event: string): EventData[] {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    return this.events.get(event)!;
  }

  /**
   * Register a new event listener.
   * @param event - The name of the event.
   * @param listener - The callback function.
   * @param priority - The priority of the event listener.
   * @param metadata - Metadata associated with the listener.
   * @param condition - Condition under which the listener should be invoked.
   */
  public on(
    event: string,
    listener: EventListener,
    priority: number = 0,
    metadata: Record<string, any> = {},
    condition: ConditionFunction = () => true
  ): void {
    const eventData = this.ensureEventInitialized(event);

    if (eventData.length >= this.maxListeners) {
      console.warn(`Max listeners (${this.maxListeners}) for event "${event}" reached.`);
      return;
    }

    const newEvent: EventData = {
      listener,
      priority,
      metadata,
      condition,
      lastTriggered: Date.now(),
    };

    // Insert based on priority
    const index = eventData.findIndex((e) => e.priority < priority);
    if (index === -1) {
      eventData.push(newEvent);
    } else {
      eventData.splice(index, 0, newEvent);
    }
  }

  /**
   * Remove an event listener.
   * @param event - The name of the event.
   * @param listener - The callback function to remove.
   */
  public off(event: string, listener: EventListener): void {
    const eventData = this.ensureEventInitialized(event);
    const index = eventData.findIndex((e) => e.listener === listener);
    if (index !== -1) {
      eventData.splice(index, 1);
    }
  }

  /**
   * Emit an event.
   * @param event - The name of the event to emit.
   * @param args - Arguments to pass to the event listener.
   */
  public emit(event: string, ...args: any[]): boolean {
    const eventData = this.ensureEventInitialized(event);
    if (!eventData.length && !this.hierarchy.has(event)) {
      return false;
    }

    for (const data of eventData) {
      if (data.condition(...args)) {
        data.listener(event, ...args, data.metadata);
        data.lastTriggered = Date.now();
      }
    }

    this.hierarchy.get(event)?.forEach((parentEvent) => this.emit(parentEvent, ...args));

    return true;
  }

  /**
   * Get all registered events.
   */
  public getEvents(): Map<string, EventData[]> {
    return this.events;
  }

  /**
   * Set hierarchy for an event.
   * @param event - The name of the event.
   * @param parentEvents - Parent events for the given event.
   */
  public setHierarchy(event: string, parentEvents: string[]): void {
    this.hierarchy.set(event, parentEvents);
  }
}
