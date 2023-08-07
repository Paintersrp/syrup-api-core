export class SMTPClient implements EmailBackend {
  constructor(private smtpConfig: { host: string; port: number; user: string; pass: string }) {}

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    //
  }
}
