/**
 * MailInbox backed by the MailCatcher of the docker e2e stack, which catches every email
 * sent by the API.
 */

import { request } from "@playwright/test";

import type { MailInbox } from "./mail-inbox";

type MailCatcherMessage = {
  id: number;
  sender: string;
  recipients: string[];
  subject: string;
  size: string;
  created_at: string;
};

const DEFAULT_TIMEOUT_MS = 5000;
const POLLING_INTERVAL_MS = 100;

export class MailCatcherInbox implements MailInbox {
  private readonly mailCatcherUrl: string;

  constructor(mailCatcherUrl: string) {
    this.mailCatcherUrl = mailCatcherUrl;
  }

  create(prefix: string): Promise<string> {
    return Promise.resolve(`e2e-tests-${prefix}-${crypto.randomUUID()}@mail.com`);
  }

  /**
   * Polls MailCatcher until an email matching the recipient and exact subject is found,
   * and returns the plain-text body of the newest match.
   *
   * MailCatcher is never purged between tests, and a single registration can produce
   * more than one email to the same recipient (e.g. the welcome email alongside a login
   * link email). A recipient-only lookup could therefore return a stale or unrelated
   * message, so the exact subject is required and the newest match (highest MailCatcher
   * id) is returned.
   */
  async waitForEmail(
    address: string,
    subject: string,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  ): Promise<string> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const messages = await this.getMessages();
      const matches = messages.filter(
        (msg) => msg.subject === subject && msg.recipients.some((r) => r.includes(address)),
      );

      if (matches.length > 0) {
        const newest = matches.reduce((acc, msg) => (msg.id > acc.id ? msg : acc));
        return this.getMessagePlainText(newest.id);
      }

      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS));
    }

    throw new Error(
      `Timeout waiting for email to ${address} with subject "${subject}" after ${timeoutMs}ms`,
    );
  }

  private async getMessages(): Promise<MailCatcherMessage[]> {
    const apiContext = await request.newContext({ baseURL: this.mailCatcherUrl });
    const response = await apiContext.get("/messages");
    const messages = (await response.json()) as MailCatcherMessage[];
    await apiContext.dispose();
    return messages;
  }

  private async getMessagePlainText(messageId: number): Promise<string> {
    const apiContext = await request.newContext({ baseURL: this.mailCatcherUrl });
    const response = await apiContext.get(`/messages/${messageId}.plain`);
    const plainText = await response.text();
    await apiContext.dispose();
    return plainText;
  }
}
