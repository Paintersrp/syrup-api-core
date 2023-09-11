export enum EventType {
  Welcome,
  AccountActivated,
  AnomalyDetected,
  SystemAlert,
}

export interface WelcomePayload {
  username: string;
}

export interface AccountActivatedPayload {
  userId: number;
}

export interface AnomalyDetectedPayload {
  details: string;
}

export interface SystemAlertPayload {
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export type EventPayloadData =
  | WelcomePayload
  | AccountActivatedPayload
  | AnomalyDetectedPayload
  | SystemAlertPayload;

export type EventPayload = {
  type: EventType;
  data: EventPayloadData;
};

export interface IEventHandler {
  handleEvent(event: EventPayload): void;
}

export interface IEventStrategy {
  handle(payload: any): EventPayload;
}
