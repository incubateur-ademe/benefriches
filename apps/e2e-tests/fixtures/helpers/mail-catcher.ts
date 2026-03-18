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
  const messages = await response.json();
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
 * Polls MailCatcher until an email for the given recipient is found.
 * Returns the message when found.
 * @param recipient - Email address to search for in recipients
 * @param timeoutMs - Maximum time to wait (default: 5000ms)
 * @param intervalMs - Polling interval (default: 100ms)
 */
export async function waitForEmail(
  recipient: string,
  timeoutMs = 5000,
  intervalMs = 100,
): Promise<MailCatcherMessage> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const messages = await getMessages();
    const email = messages.find((msg) => msg.recipients.some((r) => r.includes(recipient)));

    if (email) {
      return email;
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Timeout waiting for email to ${recipient} after ${timeoutMs}ms`);
}
