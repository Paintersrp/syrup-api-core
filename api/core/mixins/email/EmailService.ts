import { EmailClientFactory } from './EmailClientFactory';

export class EmailService {
  private backend: EmailBackend;

  constructor(backendIdentifier: string, config?: any) {
    this.backend = EmailClientFactory.getBackend(backendIdentifier, config);
  }

  sendEmail(to: string, subject: string, body: string): Promise<void> {
    return this.backend.sendEmail(to, subject, body);
  }
}
