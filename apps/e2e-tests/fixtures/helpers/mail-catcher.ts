/**
 * MailCatcher utilities for E2E tests.
 * Used to verify emails sent during test flows.
 */

import { request } from "@playwright/test";

import { MAIL_CATCHER_URL } from "../../playwright.config";

type MailCatcherMessage = {
  id: number;
  sender: string;
  recipients: string[];
  subject: string;
  size: string;
  created_at: string;
};

/**
 * Fetches all messages from MailCatcher.
 */
async function getMessages(): Promise<MailCatcherMessage[]> {
  const apiContext = await request.newContext({ baseURL: MAIL_CATCHER_URL });
  const response = await apiContext.get("/messages");
  const messages = (await response.json()) as MailCatcherMessage[];
  await apiContext.dispose();
  return messages;
}

/**
 * Fetches the plain text content of a specific email from MailCatcher.
 */
export async function getMessagePlainText(messageId: number): Promise<string> {
  const apiContext = await request.newContext({ baseURL: MAIL_CATCHER_URL });
  const response = await apiContext.get(`/messages/${messageId}.plain`);
  const messageDetails = await response.text();
  await apiContext.dispose();
  return messageDetails;
}

/**
 * Polls MailCatcher until an email matching the given recipient and exact subject is found.
 * Returns the newest matching message when found.
 *
 * MailCatcher is never purged between tests, and a single registration can now produce
 * more than one email to the same recipient (e.g. the welcome email alongside a login
 * link email). A recipient-only lookup can therefore return a stale or unrelated message,
 * so callers must pass the exact subject of the email they expect, and the newest match
 * (highest MailCatcher id) is returned.
 * @param recipient - Email address to search for in recipients
 * @param subject - Exact subject of the email to find
 * @param timeoutMs - Maximum time to wait (default: 5000ms)
 * @param intervalMs - Polling interval (default: 100ms)
 */
export async function waitForEmail(
  recipient: string,
  subject: string,
  timeoutMs = 5000,
  intervalMs = 100,
): Promise<MailCatcherMessage> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const messages = await getMessages();
    const matches = messages.filter(
      (msg) => msg.subject === subject && msg.recipients.some((r) => r.includes(recipient)),
    );

    if (matches.length > 0) {
      return matches.reduce((newest, msg) => (msg.id > newest.id ? msg : newest));
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(
    `Timeout waiting for email to ${recipient} with subject "${subject}" after ${timeoutMs}ms`,
  );
}
