import { SSEManager } from './SSEManager';
import { EventPayload, EventType, IEventHandler, IEventStrategy } from './types';

export class SSEHandler implements IEventHandler {
  private strategies: Map<EventType, IEventStrategy>;

  constructor(private sseManager: SSEManager, strategies: Map<EventType, IEventStrategy>) {
    this.strategies = strategies;
  }

  handleEvent(event: EventPayload) {
    const strategy = this.strategies.get(event.type);
    if (strategy) {
      const channel = this.getChannel(event.type, event.data);
      const message = strategy.handle(event.data);
      this.sseManager.sendToChannel(channel, message);
    }
  }

  private getChannel(eventType: EventType, payload: any): string {
    if (eventType === EventType.AccountActivated) {
      return `user-${payload.userId}`;
    }
    return 'user-notifications';
  }
}
