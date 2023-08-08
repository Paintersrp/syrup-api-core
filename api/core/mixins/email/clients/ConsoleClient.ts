export class ConsoleClient implements EmailBackend {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`Email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
  }
}
