import { EventManager } from './EventManager';

/**
 * Manager responsible for managing and emitting event groups.
 */
export class GroupManager {
  private groups: Map<string, string[]> = new Map();
  private operationService: EventManager;

  /**
   * Create a new GroupService instance.
   * @param operationService - The service responsible for emitting operations.
   */
  constructor(operationService: EventManager) {
    this.operationService = operationService;
  }

  /**
   * Add an event to a specific group.
   * If the group doesn't exist, it's created.
   *
   * @param groupName - The name of the group.
   * @param eventName - The name of the event to be added to the group.
   */
  public setGroup(groupName: string, eventName: string): void {
    if (!this.groups.has(groupName)) {
      this.groups.set(groupName, []);
    }
    this.groups.get(groupName)!.push(eventName);
  }

  /**
   * Emit all events associated with a specific group.
   *
   * @param groupName - The name of the group.
   * @param args - Arguments to pass to the event listeners.
   */
  public emitGroup(groupName: string, ...args: any[]): void {
    const groupEvents = this.groups.get(groupName) || [];
    groupEvents.forEach((event) => this.operationService.emit(event, ...args));
  }

  /**
   * Remove all listeners associated with a specific group.
   *
   * @param groupName - The name of the group.
   */
  public removeAllListenersFromGroup(groupName: string): void {
    const groupEvents = this.groups.get(groupName) || [];
    groupEvents.forEach((event) => {
      this.operationService.getEvents().delete(event);
    });
  }
}
