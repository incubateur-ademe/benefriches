import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import {
  PREVIEW_SAMPLE_CONTACT,
  PREVIEW_SAMPLE_USER,
} from "src/notifications/core/previews/lifecycleEmailPreviewSamples";
import { buildFirstSiteReminderEmail } from "src/notifications/core/templates/firstSiteReminderEmail";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
import { SpyLogger } from "src/shared-kernel/adapters/logger/SpyLogger";
import type { FailureResult, SuccessResult } from "src/shared-kernel/result";

import { SendLifecycleEmailPreviewUseCase } from "./sendLifecycleEmailPreview.usecase";

const webappUrl = "http://app.test.benefriches.fr";
const tokenService = new HmacUnsubscribeTokenService("unsubscribe-secret-for-tests");

const contact = {
  firstName: "Mathilde",
  lastName: "Lefèvre",
  role: "Chargée de déploiement",
  phone: "01 23 45 67 89",
  email: "mathilde.lefevre@example.com",
} satisfies LifecycleEmailContact;

const setup = (options: { contact: LifecycleEmailContact | undefined } = { contact }) => {
  const mailer = new FakeMailer();
  const logger = new SpyLogger();
  const usecase = new SendLifecycleEmailPreviewUseCase(
    mailer,
    logger,
    webappUrl,
    tokenService,
    options.contact,
  );
  return { usecase, mailer, logger };
};

describe("SendLifecycleEmailPreview UseCase", () => {
  it("fails with NoRecipient and sends nothing when no recipient is given", async () => {
    const { usecase, mailer } = setup();

    const result = await usecase.execute({ emailType: "welcome", recipients: [] });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual(
      (result as FailureResult<"NoRecipient", { validEmailTypes: string[] }>).getError(),
      "NoRecipient",
    );
    assert.strictEqual(mailer.sentEmails.length, 0);
  });

  it("fails with UnknownEmailType, lists the valid types, and sends nothing", async () => {
    const { usecase, mailer } = setup();

    const result = await usecase.execute({
      emailType: "wlecome",
      recipients: ["alice@example.com"],
    });

    assert.strictEqual(result.isFailure(), true);
    const failure = result as FailureResult<"UnknownEmailType", { validEmailTypes: string[] }>;
    assert.strictEqual(failure.getError(), "UnknownEmailType");
    assert.deepStrictEqual(failure.getIssues(), {
      validEmailTypes: ["welcome", "first-site-reminder"],
    });
    assert.strictEqual(mailer.sentEmails.length, 0);
  });

  it("sends one welcome preview per recipient", async () => {
    const { usecase, mailer } = setup();

    const result = await usecase.execute({
      emailType: "welcome",
      recipients: ["alice@example.com", "bob@example.com"],
    });

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual(
      (
        result as SuccessResult<{
          emailType: string;
          subject: string;
          recipients: string[];
        }>
      ).getData(),
      {
        emailType: "welcome",
        subject: "Bienvenue chez Bénéfriches",
        recipients: ["alice@example.com", "bob@example.com"],
      },
    );
    assert.strictEqual(mailer.sentEmails.length, 2);
    assert.strictEqual(mailer.sentEmails[0]?.to, "alice@example.com");
    assert.strictEqual(mailer.sentEmails[0]?.subject, "Bienvenue chez Bénéfriches");
    assert.strictEqual(mailer.sentEmails[1]?.to, "bob@example.com");
    assert.strictEqual(mailer.sentEmails[1]?.subject, "Bienvenue chez Bénéfriches");
  });

  it("renders the sample login identifier, not the recipient address", async () => {
    const { usecase, mailer } = setup();

    await usecase.execute({ emailType: "welcome", recipients: ["alice@example.com"] });

    assert.ok(
      mailer.sentEmails[0]?.text.includes(
        "Votre identifiant de connexion est camille.durand@example.com",
      ),
    );
    assert.ok(
      mailer.sentEmails[0]?.text.includes("http://app.test.benefriches.fr/creer-site-foncier"),
    );
  });

  it("logs the email type and every recipient address", async () => {
    const { usecase, logger } = setup();

    await usecase.execute({
      emailType: "welcome",
      recipients: ["alice@example.com", "bob@example.com"],
    });

    assert.ok(logger._info.some((l) => l.includes("welcome") && l.includes("alice@example.com")));
    assert.ok(logger._info.some((l) => l.includes("welcome") && l.includes("bob@example.com")));
    assert.ok(logger._info.some((l) => l.includes("summary")));
  });

  it("fails with MailerFailed when the mailer throws", async () => {
    const { usecase, mailer, logger } = setup();
    mailer.simulateFailure("SMTP unreachable");

    const result = await usecase.execute({
      emailType: "welcome",
      recipients: ["alice@example.com"],
    });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual(
      (result as FailureResult<"MailerFailed", { validEmailTypes: string[] }>).getError(),
      "MailerFailed",
    );
    assert.strictEqual(logger._error.length, 1);
  });

  it("links the preview to an unsubscribe URL for the sample user, not the recipient", async () => {
    const { usecase, mailer } = setup();

    await usecase.execute({ emailType: "welcome", recipients: ["reviewer@ademe.fr"] });

    assert.ok(
      mailer.sentEmails[0]?.text.includes(
        buildUnsubscribeUrl(webappUrl, tokenService.sign(PREVIEW_SAMPLE_USER.id)),
      ),
    );
  });
  it("sends a first site reminder preview greeting the sample user and signed by the configured contact", async () => {
    const { usecase, mailer } = setup({ contact });

    await usecase.execute({
      emailType: "first-site-reminder",
      recipients: ["relecteur@example.com"],
    });

    assert.deepStrictEqual(mailer.sentEmails, [
      {
        to: "relecteur@example.com",
        ...buildFirstSiteReminderEmail({
          firstName: "Camille",
          lastName: "Durand",
          contact,
          webappUrl,
          unsubscribeUrl: buildUnsubscribeUrl(webappUrl, tokenService.sign(PREVIEW_SAMPLE_USER.id)),
        }),
      },
    ]);
  });

  it("falls back to the sample contact when none is configured", async () => {
    const { usecase, mailer } = setup({ contact: undefined });

    await usecase.execute({
      emailType: "first-site-reminder",
      recipients: ["relecteur@example.com"],
    });

    assert.deepStrictEqual(mailer.sentEmails, [
      {
        to: "relecteur@example.com",
        ...buildFirstSiteReminderEmail({
          firstName: "Camille",
          lastName: "Durand",
          contact: PREVIEW_SAMPLE_CONTACT,
          webappUrl,
          unsubscribeUrl: buildUnsubscribeUrl(webappUrl, tokenService.sign(PREVIEW_SAMPLE_USER.id)),
        }),
      },
    ]);
  });
});
