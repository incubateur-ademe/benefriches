import type { LifecycleEmailMessage, Mailer } from "src/notifications/core/gateways/Mailer";

export class FakeMailer implements Mailer {
  sentEmails: LifecycleEmailMessage[] = [];
  private shouldThrowError = false;
  private errorMessage = "Failed to send email";

  send(message: LifecycleEmailMessage): Promise<void> {
    if (this.shouldThrowError) {
      throw new Error(this.errorMessage);
    }

    this.sentEmails.push(message);

    return Promise.resolve();
  }

  simulateFailure(message: string): void {
    this.shouldThrowError = true;
    this.errorMessage = message;
  }

  // Test helper: resets sent emails and any simulated failure. Useful when the same
  // FakeMailer instance is shared across multiple tests against a single NestJS app.
  _reset(): void {
    this.sentEmails = [];
    this.shouldThrowError = false;
    this.errorMessage = "Failed to send email";
  }
}
