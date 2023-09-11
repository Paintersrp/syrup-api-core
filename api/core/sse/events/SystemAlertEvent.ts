import { EventPayload, EventType, IEventStrategy, SystemAlertPayload } from '../types';

export class SystemAlertEvent implements IEventStrategy {
  handle(payload: SystemAlertPayload): EventPayload {
    return {
      type: EventType.SystemAlert,
      data: payload,
    };
  }
}
