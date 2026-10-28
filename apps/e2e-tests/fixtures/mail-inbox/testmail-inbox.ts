/**
 * MailInbox backed by a hosted testmail.app namespace, for targets that send real emails
 * (e.g. staging through Brevo). Each address gets its own tag:
 * `<namespace>.<tag>@inbox.testmail.app`.
 *
 * @see https://testmail.app/docs/
 */

import type { MailInbox } from "./mail-inbox";

type TestmailEmail = {
  subject: string;
  text: string;
  tag: string;
  timestamp: number;
};

type TestmailResponse =
  { result: "success"; emails: TestmailEmail[] } | { result: "fail"; message: string | null };

const API_URL = "https://api.testmail.app/api/json";
const INBOX_DOMAIN = "inbox.testmail.app";
// Below the one-minute live query redirect of the API: plain polling is enough.
const DEFAULT_TIMEOUT_MS = 45_000;
const POLLING_INTERVAL_MS = 2_000;

export class TestmailInbox implements MailInbox {
  private readonly namespace: string;
  private readonly apiKey: string;

  constructor(namespace: string, apiKey: string) {
    this.namespace = namespace;
    this.apiKey = apiKey;
  }

  create(prefix: string): Promise<string> {
    const tag = `e2e-${prefix}-${crypto.randomUUID()}`.toLowerCase();
    return Promise.resolve(`${this.namespace}.${tag}@${INBOX_DOMAIN}`);
  }

  /**
   * Polls the testmail.app API until an email with this exact subject is found in the
   * address's tag, and returns the plain-text body of the newest match.
   */
  async waitForEmail(
    address: string,
    subject: string,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  ): Promise<string> {
    const tag = this.tagOf(address);
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const matches = (await this.getEmails(tag)).filter((email) => email.subject === subject);

      if (matches.length > 0) {
        const newest = matches.reduce((acc, email) =>
          email.timestamp > acc.timestamp ? email : acc,
        );
        return newest.text;
      }

      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS));
    }

    throw new Error(
      `Timeout waiting for email to ${address} with subject "${subject}" after ${timeoutMs}ms`,
    );
  }

  private tagOf(address: string): string {
    const prefix = `${this.namespace}.`;
    const suffix = `@${INBOX_DOMAIN}`;
    if (!address.startsWith(prefix) || !address.endsWith(suffix)) {
      throw new Error(
        `${address} is not a testmail.app address of namespace "${this.namespace}": create it with mailInbox.create()`,
      );
    }
    return address.slice(prefix.length, -suffix.length);
  }

  private async getEmails(tag: string): Promise<TestmailEmail[]> {
    const url = new URL(API_URL);
    url.searchParams.set("apikey", this.apiKey);
    url.searchParams.set("namespace", this.namespace);
    url.searchParams.set("tag", tag);

    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) {
      throw new Error(`testmail.app API responded ${response.status} ${response.statusText}`);
    }
    const body = (await response.json()) as TestmailResponse;
    if (body.result === "fail") {
      throw new Error(`testmail.app API query failed: ${body.message ?? "no message"}`);
    }
    return body.emails;
  }
}
