import { EmailBackend, EmailOptions } from '../types';

/**
 * ConsoleClient class for logging email operations
 */
export class ConsoleClient implements EmailBackend {
  /**
   * Logs the details of the email that would be sent
   * @param options - Email options including to, cc, bcc, subject, body, attachments, and priority
   */
  public async sendEmail(options: EmailOptions): Promise<void> {
    console.log(`To: ${options.to}`);
    if (options.cc) {
      console.log(`CC: ${options.cc}`);
    }
    if (options.bcc) {
      console.log(`BCC: ${options.bcc}`);
    }
    console.log(`Subject: ${options.subject}`);
    if (options.isHtml) {
      console.log(`Body (HTML): ${options.body}`);
    } else {
      console.log(`Body: ${options.body}`);
    }
    if (options.attachments) {
      console.log(`Attachments: ${JSON.stringify(options.attachments, null, 2)}`);
    }
    if (options.priority) {
      console.log(`Priority: ${options.priority}`);
    }
    if (options.receipt) {
      console.log('Read receipt requested.');
    }
  }
}
