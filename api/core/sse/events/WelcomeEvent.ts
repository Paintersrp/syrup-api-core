import { EventPayload, EventType, IEventStrategy, WelcomePayload } from '../types';

export class WelcomeEvent implements IEventStrategy {
  handle(payload: WelcomePayload): EventPayload {
    return {
      type: EventType.Welcome,
      data: { username: payload.username },
    };
  }
}
