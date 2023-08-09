import { ConsoleClient, MockClient, SMTPClient } from './clients';
import { EmailBackend } from './types';

export class EmailClientFactory {
  static getBackend(backendIdentifier: string, config?: any): EmailBackend {
    switch (backendIdentifier) {
      case 'syrup.mail.console':
        return new ConsoleClient();
      case 'syrup.mail.smtp':
        if (!config) {
          throw new Error('SMTP configuration required for SMTP Email Backend');
        }
        return new SMTPClient(config);
      case 'syrup.mail.mock':
        return new MockClient();
      default:
        throw new Error(`Unsupported email backend: ${backendIdentifier}`);
    }
  }
}
