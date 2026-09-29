import { ConfigService } from "@nestjs/config";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";

import { readLifecycleEmailContact } from "./readLifecycleEmailContact";

describe("readLifecycleEmailContact", () => {
  it("returns the contact when all five variables are set", () => {
    const configService = new ConfigService({
      LIFECYCLE_EMAILS_CONTACT_FIRST_NAME: "Mathilde",
      LIFECYCLE_EMAILS_CONTACT_LAST_NAME: "Lefèvre",
      LIFECYCLE_EMAILS_CONTACT_ROLE: "Chargée de déploiement",
      LIFECYCLE_EMAILS_CONTACT_PHONE: "01 23 45 67 89",
      LIFECYCLE_EMAILS_CONTACT_EMAIL: "mathilde.lefevre@example.com",
    });

    const contact = readLifecycleEmailContact(configService);

    assert.deepStrictEqual(contact, {
      firstName: "Mathilde",
      lastName: "Lefèvre",
      role: "Chargée de déploiement",
      phone: "01 23 45 67 89",
      email: "mathilde.lefevre@example.com",
    } satisfies LifecycleEmailContact);
  });

  it("returns undefined when one variable is empty", () => {
    const configService = new ConfigService({
      LIFECYCLE_EMAILS_CONTACT_FIRST_NAME: "Mathilde",
      LIFECYCLE_EMAILS_CONTACT_LAST_NAME: "Lefèvre",
      LIFECYCLE_EMAILS_CONTACT_ROLE: "Chargée de déploiement",
      LIFECYCLE_EMAILS_CONTACT_PHONE: "",
      LIFECYCLE_EMAILS_CONTACT_EMAIL: "mathilde.lefevre@example.com",
    });

    assert.strictEqual(readLifecycleEmailContact(configService), undefined);
  });

  it("returns undefined when none is set", () => {
    const configService = new ConfigService({});

    assert.strictEqual(readLifecycleEmailContact(configService), undefined);
  });

  it("returns undefined when the email is not an email address", () => {
    const configService = new ConfigService({
      LIFECYCLE_EMAILS_CONTACT_FIRST_NAME: "Mathilde",
      LIFECYCLE_EMAILS_CONTACT_LAST_NAME: "Lefèvre",
      LIFECYCLE_EMAILS_CONTACT_ROLE: "Chargée de déploiement",
      LIFECYCLE_EMAILS_CONTACT_PHONE: "01 23 45 67 89",
      LIFECYCLE_EMAILS_CONTACT_EMAIL: "mathilde",
    });

    assert.strictEqual(readLifecycleEmailContact(configService), undefined);
  });
});
