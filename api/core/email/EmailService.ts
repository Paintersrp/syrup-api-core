import { EmailClientFactory } from './EmailClientFactory';
import { EmailBackend, EmailOptions } from './types';

export class EmailService {
  private backend: EmailBackend;

  constructor(backendIdentifier: string, config?: any) {
    this.backend = EmailClientFactory.getBackend(backendIdentifier, config);
  }

  sendEmail(options: EmailOptions): Promise<void> {
    return this.backend.sendEmail(options);
  }
}
