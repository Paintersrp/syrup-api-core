export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  retryTimes?: number;
}

export type EmailBackendConfig = SMTPConfig | undefined;

export interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  body: string;
  isHtml?: boolean;
  attachments?: { filename: string; path: string }[];
  priority?: 'high' | 'normal' | 'low';
  receipt?: boolean;
}

export interface EmailBackend {
  sendEmail(options: EmailOptions): Promise<void>;
}
