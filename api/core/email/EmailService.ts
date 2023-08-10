import { EmailClientFactory } from './EmailClientFactory';
import { EmailBackend, EmailBackendConfig, EmailOptions } from './types';

/**
 * Service class for handling email operations.
 */
export class EmailService {
  private backend: EmailBackend;

  /**
   * Initializes the email service with a specific backend.
   * @param backendIdentifier - The unique identifier for the backend.
   * @param config - Optional configuration for the backend.
   */
  constructor(backendIdentifier: string, config?: EmailBackendConfig) {
    this.backend = EmailClientFactory.getBackend(backendIdentifier, config);
  }

  /**
   * Sends an email with the given options.
   * @param options - The email options including recipients, subject, body, etc.
   * @returns A promise that resolves once the email has been sent.
   * @throws {Error} If there is an error sending the email.
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.backend.sendEmail(options);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
