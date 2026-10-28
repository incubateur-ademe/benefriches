/**
 * How tests read the emails sent by the app, whatever the target environment.
 */

import type { MailStrategy } from "../../target-environment";
import { MailCatcherInbox } from "./mail-catcher-inbox";
import { UnavailableMailInbox } from "./unavailable-mail-inbox";

export interface MailInbox {
  /** Returns a new recipient address, unique to this call, that the inbox can read. */
  create(prefix: string): Promise<string>;
  /** Waits for an email sent to `address` with this exact subject; returns its plain-text body. */
  waitForEmail(address: string, subject: string): Promise<string>;
}

export function createMailInbox(mail: MailStrategy): MailInbox {
  switch (mail.kind) {
    case "mail-catcher":
      return new MailCatcherInbox(mail.url);
    case "unavailable":
      return new UnavailableMailInbox();
  }
}
