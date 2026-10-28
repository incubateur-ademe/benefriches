/**
 * MailInbox for targets where no email can be read yet: it hands out unique addresses so
 * flows that register a user still run, and fails any test that waits for an email.
 */

import type { MailInbox } from "./mail-inbox";

export class UnavailableMailInbox implements MailInbox {
  create(prefix: string): Promise<string> {
    return Promise.resolve(`e2e-tests-${prefix}-${crypto.randomUUID()}@mail.com`);
  }

  waitForEmail(address: string, subject: string): Promise<string> {
    return Promise.reject(
      new Error(
        `Cannot read the email "${subject}" sent to ${address}: no mail inbox is available on this E2E_TARGET_ENV`,
      ),
    );
  }
}
