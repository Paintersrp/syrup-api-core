import { ConsoleClient, MockClient, SMTPClient } from './clients';
import { EmailBackend, EmailBackendConfig } from './types';

/**
 * Factory class for creating email client backends.
 */
export class EmailClientFactory {
  private static backends: { [key: string]: (config?: EmailBackendConfig) => EmailBackend } = {
    'syrup.mail.console': () => new ConsoleClient(),
    'syrup.mail.smtp': (config) => {
      if (!config) {
        throw new Error('SMTP configuration required for SMTP Email Backend');
      }
      return new SMTPClient(config);
    },
    'syrup.mail.mock': () => new MockClient(),
  };

  /**
   * Registers a new email backend with the factory.
   * @param identifier - The unique identifier for the backend.
   * @param factory - The factory function to create the backend.
   */
  static registerBackend(
    identifier: string,
    factory: (config?: EmailBackendConfig) => EmailBackend
  ) {
    this.backends[identifier] = factory;
  }

  /**
   * Retrieves an email backend based on the identifier.
   * @param backendIdentifier - The unique identifier for the backend.
   * @param config - Optional configuration for the backend.
   * @returns The email backend instance.
   * @throws {Error} If the backend identifier is unsupported.
   */
  static getBackend(backendIdentifier: string, config?: EmailBackendConfig): EmailBackend {
    const factory = this.backends[backendIdentifier];

    if (!factory) {
      throw new Error(`Unsupported email backend: ${backendIdentifier}`);
    }

    return factory(config);
  }
}
