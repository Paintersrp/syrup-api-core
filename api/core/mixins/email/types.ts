interface EmailBackend {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}
