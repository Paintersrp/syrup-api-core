import { AccountActivatedEvent } from './events/AccountActivatedEvent';
import { SystemAlertEvent } from './events/SystemAlertEvent';
import { WelcomeEvent } from './events/WelcomeEvent';
import { EventType, IEventStrategy } from './types';

export const strategies = new Map<EventType, IEventStrategy>();
strategies.set(EventType.Welcome, new WelcomeEvent());
strategies.set(EventType.AccountActivated, new AccountActivatedEvent());
strategies.set(EventType.SystemAlert, new SystemAlertEvent());
