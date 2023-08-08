export class MockClient implements EmailBackend {
  sentEmails: Array<{ to: string; subject: string; body: string }> = [];

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    this.sentEmails.push({ to, subject, body });
  }
}
