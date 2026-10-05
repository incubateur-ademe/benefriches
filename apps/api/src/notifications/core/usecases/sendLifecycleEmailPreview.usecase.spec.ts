import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import {
  urbanProjectDevelopmentScoreMock,
  urbanProjectImpactMockMeta,
  type GetReconversionProjectImpactsResultDto,
} from "shared";

import { InMemoryLifecycleEmailProjectQuery } from "src/notifications/adapters/secondary/lifecycle-email-project/InMemoryLifecycleEmailProjectQuery";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { FakeProjectImpactsCalculator } from "src/notifications/adapters/secondary/project-impacts/FakeProjectImpactsCalculator";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import {
  PREVIEW_SAMPLE_CONTACT,
  PREVIEW_SAMPLE_FAVOURABLE_IMPACTS_SUMMARY,
  PREVIEW_SAMPLE_FRICHE,
  PREVIEW_SAMPLE_NON_FRICHE_SITE,
  PREVIEW_SAMPLE_UNFAVOURABLE_IMPACTS_SUMMARY,
  PREVIEW_SAMPLE_USER,
} from "src/notifications/core/previews/lifecycleEmailPreviewSamples";
import { buildFirstProjectReminderEmail } from "src/notifications/core/templates/firstProjectReminderEmail";
import { buildFirstSiteReminderEmail } from "src/notifications/core/templates/firstSiteReminderEmail";
import { buildProjectImpactsSummaryEmail } from "src/notifications/core/templates/projectImpactsSummaryEmail";
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
  const projectQuery = new InMemoryLifecycleEmailProjectQuery();
  const projectImpactsCalculator = new FakeProjectImpactsCalculator();
  const usecase = new SendLifecycleEmailPreviewUseCase(
    mailer,
    logger,
    webappUrl,
    tokenService,
    options.contact,
    projectQuery,
    projectImpactsCalculator,
  );
  return { usecase, mailer, logger, projectQuery, projectImpactsCalculator };
};

type PreviewResponse = { emailType: string; subjects: string[]; recipients: string[] };

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
      validEmailTypes: [
        "welcome",
        "first-site-reminder",
        "first-project-reminder",
        "project-impacts-summary",
      ],
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
          subjects: string[];
          recipients: string[];
        }>
      ).getData(),
      {
        emailType: "welcome",
        subjects: ["Bienvenue chez Bénéfriches"],
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

  it("sends a friche and a non-friche first project reminder preview to each recipient", async () => {
    const { usecase, mailer } = setup({ contact });
    const unsubscribeUrl = buildUnsubscribeUrl(
      webappUrl,
      tokenService.sign(PREVIEW_SAMPLE_USER.id),
    );

    const result = await usecase.execute({
      emailType: "first-project-reminder",
      recipients: ["relecteur@example.com"],
    });

    const fricheEmail = buildFirstProjectReminderEmail({
      firstName: "Camille",
      lastName: "Durand",
      site: PREVIEW_SAMPLE_FRICHE,
      contact,
      webappUrl,
      unsubscribeUrl,
    });
    const nonFricheEmail = buildFirstProjectReminderEmail({
      firstName: "Camille",
      lastName: "Durand",
      site: PREVIEW_SAMPLE_NON_FRICHE_SITE,
      contact,
      webappUrl,
      unsubscribeUrl,
    });
    assert.deepStrictEqual(mailer.sentEmails, [
      { to: "relecteur@example.com", ...fricheEmail },
      { to: "relecteur@example.com", ...nonFricheEmail },
    ]);
    assert.deepStrictEqual(
      (
        result as SuccessResult<{
          emailType: string;
          subjects: string[];
          recipients: string[];
        }>
      ).getData(),
      {
        emailType: "first-project-reminder",
        subjects: [fricheEmail.subject, nonFricheEmail.subject],
        recipients: ["relecteur@example.com"],
      },
    );
  });

  describe("project impacts summary", () => {
    // A friche project of user-9 over 50 years, compensated in 2052, with 1 000 € of tax income
    // a year.
    const realProject = {
      id: "project-1",
      name: "Logements de la gare",
      siteName: "Friche de la gare",
      createdAt: new Date("2026-05-04T08:00:00.000Z"),
    };
    const impactsResult: GetReconversionProjectImpactsResultDto = {
      contextData: { ...urbanProjectImpactMockMeta, projectId: "project-1" },
      developmentScore: urbanProjectDevelopmentScoreMock,
      impacts: {
        projectionYears: Array.from({ length: 50 }, (_, index) => String(2026 + index)),
        operationsFirstYear: 2026,
        projectEconomicBalance: { total: 0, details: [] },
        stakeholders: {
          current: { owner: { structureType: "company" } },
          future: {},
          project: {
            developer: { structureType: "unknown" },
            reinstatementContractOwner: { structureType: "unknown" },
          },
        },
        aggregatedReconversionImpacts: {
          breakEvenYear: "2052",
          cumulativeBalanceByYear: [],
          cumulativeEconomicBalanceByYear: [],
          cumulativeIndirectEconomicImpactsByYear: [],
          indirectEconomicImpacts: {
            total: 50_000,
            details: [
              {
                name: "projectNewHousesTaxesIncome",
                total: 50_000,
                detailsByYear: Array.from({ length: 50 }, () => 1000),
                cumulativeByYear: Array.from({ length: 50 }, (_, index) => 1000 * (index + 1)),
              },
            ],
          },
          impactsMetrics: [],
        },
        reconversionImpactsBreakdown: {
          siteStatuQuoIndirectEconomicImpactsData: { total: 0, details: [] },
          projectOnSiteIndirectEconomicImpactsData: { total: 0, details: [] },
          projectIndirectImpactMetrics: [],
          siteStatuQuoImpactMetrics: [],
        },
      },
    };

    it("sends a favourable and an unfavourable project impacts summary preview to each recipient", async () => {
      const { usecase, mailer } = setup();
      const unsubscribeUrl = buildUnsubscribeUrl(
        webappUrl,
        tokenService.sign(PREVIEW_SAMPLE_USER.id),
      );

      const result = await usecase.execute({
        emailType: "project-impacts-summary",
        recipients: ["a@ademe.fr", "b@ademe.fr"],
      });

      const favourableEmail = buildProjectImpactsSummaryEmail({
        ...PREVIEW_SAMPLE_FAVOURABLE_IMPACTS_SUMMARY,
        webappUrl,
        unsubscribeUrl,
      });
      const unfavourableEmail = buildProjectImpactsSummaryEmail({
        ...PREVIEW_SAMPLE_UNFAVOURABLE_IMPACTS_SUMMARY,
        webappUrl,
        unsubscribeUrl,
      });
      assert.deepStrictEqual(mailer.sentEmails, [
        { to: "a@ademe.fr", ...favourableEmail },
        { to: "a@ademe.fr", ...unfavourableEmail },
        { to: "b@ademe.fr", ...favourableEmail },
        { to: "b@ademe.fr", ...unfavourableEmail },
      ]);
      assert.deepStrictEqual((result as SuccessResult<PreviewResponse>).getData(), {
        emailType: "project-impacts-summary",
        subjects: [favourableEmail.subject, unfavourableEmail.subject],
        recipients: ["a@ademe.fr", "b@ademe.fr"],
      });
    });

    it("renders a real project's summary when a project id is given, linked to the sample user's unsubscribe page", async () => {
      const { usecase, mailer, logger, projectQuery, projectImpactsCalculator } = setup();
      projectQuery._setProjects([realProject]);
      projectImpactsCalculator._setResult("project-1", impactsResult);

      const result = await usecase.execute({
        emailType: "project-impacts-summary",
        projectId: "project-1",
        recipients: ["relecteur@ademe.fr"],
      });

      const expectedEmail = buildProjectImpactsSummaryEmail({
        project: realProject,
        evaluationPeriodInYears: 50,
        zanCompliance: {
          name: "zanCompliance",
          isSuccess: true,
          value: {
            isAgriculturalFriche: false,
            permeableSurfaceAreaDifference: undefined,
            artificializedSurfaceArea: 0,
          },
        },
        breakEvenHorizon: { status: "compensated", breakEvenYear: "2052", yearsToBreakEven: 26 },
        mainImpactIndicator: { name: "taxesIncomesImpact", isSuccess: true, value: 50_000 },
        webappUrl,
        unsubscribeUrl: buildUnsubscribeUrl(webappUrl, tokenService.sign(PREVIEW_SAMPLE_USER.id)),
      });
      assert.deepStrictEqual(mailer.sentEmails, [{ to: "relecteur@ademe.fr", ...expectedEmail }]);
      assert.deepStrictEqual((result as SuccessResult<PreviewResponse>).getData(), {
        emailType: "project-impacts-summary",
        subjects: [expectedEmail.subject],
        recipients: ["relecteur@ademe.fr"],
      });
      assert.ok(
        logger._info.includes(
          "Lifecycle email preview sent: type=project-impacts-summary, project=project-1, to=relecteur@ademe.fr",
        ),
      );
    });

    it("fails with ReconversionProjectNotFound and sends nothing for an unknown project", async () => {
      const { usecase, mailer } = setup();

      const result = await usecase.execute({
        emailType: "project-impacts-summary",
        projectId: "project-1",
        recipients: ["relecteur@ademe.fr"],
      });

      assert.ok(result.isFailure());
      assert.strictEqual(result.getError(), "ReconversionProjectNotFound");
      assert.deepStrictEqual(mailer.sentEmails, []);
    });

    it("fails with ProjectImpactsNotComputed and sends nothing when the impacts cannot be computed", async () => {
      const { usecase, mailer, logger, projectQuery, projectImpactsCalculator } = setup();
      projectQuery._setProjects([realProject]);
      projectImpactsCalculator._simulateFailure("SiteNotFound");

      const result = await usecase.execute({
        emailType: "project-impacts-summary",
        projectId: "project-1",
        recipients: ["relecteur@ademe.fr"],
      });

      assert.ok(result.isFailure());
      assert.strictEqual(result.getError(), "ProjectImpactsNotComputed");
      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(logger._error, [
        {
          message: "Lifecycle email preview could not load project project-1: SiteNotFound",
          error: undefined,
        },
      ]);
    });

    it("fails with ProjectImpactsNotComputed and logs the error when the computation throws", async () => {
      const { usecase, mailer, logger, projectQuery, projectImpactsCalculator } = setup();
      projectQuery._setProjects([realProject]);
      const computationError = new Error("Error response from OFGL API");
      mock.method(projectImpactsCalculator, "execute", () => Promise.reject(computationError));

      const result = await usecase.execute({
        emailType: "project-impacts-summary",
        projectId: "project-1",
        recipients: ["relecteur@ademe.fr"],
      });

      assert.ok(result.isFailure());
      assert.strictEqual(result.getError(), "ProjectImpactsNotComputed");
      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(logger._error, [
        {
          message: "Lifecycle email preview could not load project project-1",
          error: computationError,
        },
      ]);
    });

    it("fails with ProjectIdNotSupported and sends nothing for another email type", async () => {
      const { usecase, mailer } = setup();

      const result = await usecase.execute({
        emailType: "welcome",
        projectId: "project-1",
        recipients: ["relecteur@ademe.fr"],
      });

      assert.ok(result.isFailure());
      assert.strictEqual(result.getError(), "ProjectIdNotSupported");
      assert.deepStrictEqual(mailer.sentEmails, []);
    });
  });
});
