import nodemailer, { SendMailOptions } from 'nodemailer';
import { EmailBackend, EmailOptions, SMTPConfig } from '../types';

/**
 * SMTPClient class for handling email operations with an SMTP server
 */
export class SMTPClient implements EmailBackend {
  private transporter: nodemailer.Transporter;
  private retryTimes: number;

  /**
   * Initialize SMTPClient with the given SMTP configuration
   * @param smtpConfig - SMTP server configuration
   */
  constructor(private smtpConfig: SMTPConfig) {
    this.transporter = nodemailer.createTransport({
      host: this.smtpConfig.host,
      port: this.smtpConfig.port,
      auth: {
        user: this.smtpConfig.user,
        pass: this.smtpConfig.pass,
      },
    });

    this.retryTimes = this.smtpConfig.retryTimes || 3;
  }

  /**
   * Verifies the SMTP connection.
   */
  public async checkConnection(): Promise<void> {
    try {
      await this.transporter.verify();
    } catch (error) {
      console.error('Error when connecting to SMTP Server:', error);
    }
  }

  /**
   * Sends an email with the given options.
   * @param options - Email options including to, cc, bcc, subject, body, attachments, and priority
   */
  public async sendEmail(options: EmailOptions): Promise<void> {
    await this.checkConnection();

    let mailOptions: SendMailOptions = {
      from: this.smtpConfig.user,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      attachments: options.attachments,
      priority: options.priority,
    };

    if (options.isHtml) {
      mailOptions.html = options.body;
    } else {
      mailOptions.text = options.body;
    }

    for (let i = 0; i < this.retryTimes; i++) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return;
      } catch (error) {
        console.error(`Error occurred when sending email: ${error}. Attempt: ${i + 1}`);
        if (i === this.retryTimes - 1) throw error;
      }
    }
  }
}
