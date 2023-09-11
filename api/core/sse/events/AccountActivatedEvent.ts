import { EventPayload, EventType, IEventStrategy, AccountActivatedPayload } from '../types';

export class AccountActivatedEvent implements IEventStrategy {
  handle(payload: AccountActivatedPayload): EventPayload {
    return {
      type: EventType.AccountActivated,
      data: payload,
    };
  }
}
