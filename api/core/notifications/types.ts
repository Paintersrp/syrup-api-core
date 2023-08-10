import { NotificationType } from './enums';

export interface NotificationPayload {
  userId: number;
  type: NotificationType;
  templateId: string;
  parameters?: Record<string, string>;

}
