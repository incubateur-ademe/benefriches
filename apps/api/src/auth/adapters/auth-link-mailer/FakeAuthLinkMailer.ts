import { AuthLinkMailer } from "src/auth/core/sendAuthLink.usecase";

interface SentAuthLinkEmail {
  email: string;
  authLinkUrl: string;
  sentAt: Date;
}

export class FakeAuthLinkMailer implements AuthLinkMailer {
  sentEmails: SentAuthLinkEmail[] = [];
  private shouldThrowError = false;
  private errorMessage = "Failed to send email";

  sendAuthLink(email: string, authLinkUrl: string): Promise<void> {
    if (this.shouldThrowError) {
      throw new Error(this.errorMessage);
    }

    const sentEmail: SentAuthLinkEmail = {
      email,
      authLinkUrl,
      sentAt: new Date(),
    };

    this.sentEmails.push(sentEmail);

    return Promise.resolve();
  }

  simulateEmailFailure(message: string): void {
    this.shouldThrowError = true;
    this.errorMessage = message;
  }
}
