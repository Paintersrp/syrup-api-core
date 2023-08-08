import {
  EventManager,
  GroupManager,
  MemoryManager,
  MiddlewareManager,
  WildcardManager,
} from './managers';

import { ConditionFunction, EventData, EventListener, EventMiddleware } from './types';

/**
 * Class responsible for event emission, registration, and management.
 */
export class Emitter {
  private eventManager: EventManager;
  private middlewareManager: MiddlewareManager;
  private groupManager: GroupManager;
  private memoryManager: MemoryManager;
  private wildcardManager: WildcardManager;

  constructor() {
    this.initiateServices();
  }

  /**
   * Initialize all the service instances.
   */
  private initiateServices(): void {
    this.eventManager = new EventManager();
    this.middlewareManager = new MiddlewareManager();
    this.groupManager = new GroupManager(this.eventManager);
    this.memoryManager = new MemoryManager(this.eventManager);
    this.wildcardManager = new WildcardManager();
  }

  /**
   * Register a middleware to the middleware service.
   *
   * @see {MiddlewareManager#use}
   */
  public use(middleware: EventMiddleware): this {
    this.middlewareManager.use(middleware);
    return this;
  }

  /**
   * Register an event listener.
   *
   * @see {EmitOperationsService#on}
   * @see {WildcardManager#on}
   */
  public on(
    event: string,
    listener: EventListener,
    priority: number = 0,
    metadata?: Record<string, any>,
    condition: ConditionFunction = () => true
  ): this {
    if (event === '*') {
      this.wildcardManager.on(listener);
      return this;
    }

    this.eventManager.on(event, listener, priority, metadata, condition);
    return this;
  }

  /**
   * Remove a registered event listener.
   *
   * @see {EmitOperationsService#off}
   * @see {WildcardManager#off}
   */
  public off(event: string, listener: EventListener): this {
    if (event === '*') {
      this.wildcardManager.off(listener);
      return this;
    }

    this.eventManager.off(event, listener);
    return this;
  }

  /**
   * Emit an event.
   *
   * @see {MiddlewareManager#applyMiddleware}
   * @see {WildcardManager#emit}
   * @see {EmitOperationsService#emit}
   */
  public emit(event: string, ...args: any[]): boolean {
    if (!this.middlewareManager.process(event, ...args)) {
      return false;
    }

    this.wildcardManager.emit(event, ...args);

    return this.eventManager.emit(event, ...args);
  }

  /**
   * Retrieve the map of all registered events.
   *
   * @see {EmitOperationsService#getEvents}
   */
  public getEvents(): Map<string, EventData[]> {
    return this.eventManager.getEvents();
  }

  /**
   * Set a hierarchy of events.
   *
   * @see {EmitOperationsService#setHierarchy}
   */
  public setHierarchy(event: string, parentEvents: string[]): this {
    this.eventManager.setHierarchy(event, parentEvents);
    return this;
  }

  /**
   * Add an event to a specific group.
   *
   * @see {GroupManager#setGroup}
   */
  public setGroup(groupName: string, eventName: string): this {
    this.groupManager.setGroup(groupName, eventName);
    return this;
  }

  /**
   * Emit all events associated with a specific group.
   *
   * @see {GroupManager#emitGroup}
   */
  public emitGroup(groupName: string, ...args: any[]): void {
    this.groupManager.emitGroup(groupName, ...args);
  }

  /**
   * Remove all listeners associated with a specific group.
   *
   * @see {GroupManager#removeAllListenersFromGroup}
   */
  public removeAllListenersFromGroup(groupName: string): this {
    this.groupManager.removeAllListenersFromGroup(groupName);
    return this;
  }

  /**
   * Remove event listeners that are considered stale.
   *
   * @see {MemoryManager#removeStaleListeners}
   */
  public removeStaleListeners(): this {
    this.memoryManager.removeStaleListeners();
    return this;
  }

  /**
   * Set the duration after which listeners are considered stale.
   *
   * @see {MemoryManager#setStaleDuration}
   */
  public setStaleDuration(duration: number): this {
    this.memoryManager.setStaleDuration(duration);
    return this;
  }
}
