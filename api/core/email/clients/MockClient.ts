import { EmailBackend, EmailOptions } from '../types';

/**
 * MockClient class for simulating email operations
 */
export class MockClient implements EmailBackend {
  public sentEmails: EmailOptions[] = [];

  /**
   * Simulates the sending of an email by adding it to the sentEmails array
   * @param options - Email options including to, cc, bcc, subject, body, attachments, and priority
   */
  public async sendEmail(options: EmailOptions): Promise<void> {
    this.sentEmails.push(options);
  }
}
