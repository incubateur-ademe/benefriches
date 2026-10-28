/**
 * Target environment fixtures: `targetEnv` describes the target selected by
 * E2E_TARGET_ENV, `mailInbox` reads the emails sent by the app on that target.
 */

import { test as base } from "@playwright/test";

import { TARGET_ENV } from "../playwright.config";
import type { TargetEnv } from "../target-environment";
import { createMailInbox, type MailInbox } from "./mail-inbox/mail-inbox";

type MailInboxFixtures = {
  mailInbox: MailInbox;
};

type TargetEnvWorkerFixtures = {
  targetEnv: TargetEnv;
};

export const test = base.extend<MailInboxFixtures, TargetEnvWorkerFixtures>({
  targetEnv: [TARGET_ENV, { scope: "worker" }],

  mailInbox: async ({ targetEnv }, use) => {
    await use(createMailInbox(targetEnv.mail));
  },
});

export type { MailInbox } from "./mail-inbox/mail-inbox";
