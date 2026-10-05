import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  urbanProjectDevelopmentScoreMock,
  urbanProjectImpactMockMeta,
  type FricheActivity,
  type GetReconversionProjectImpactsResultDto,
  type SiteNature,
} from "shared";

import { InMemoryLifecycleEmailDeliveryQuery } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryQuery";
import { InMemoryLifecycleEmailDeliveryRepository } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryRepository";
import { InMemoryLifecycleEmailProjectQuery } from "src/notifications/adapters/secondary/lifecycle-email-project/InMemoryLifecycleEmailProjectQuery";
import { InMemoryLifecycleEmailRecipientQuery } from "src/notifications/adapters/secondary/lifecycle-email-recipient/InMemoryLifecycleEmailRecipientQuery";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { FakeProjectImpactsCalculator } from "src/notifications/adapters/secondary/project-impacts/FakeProjectImpactsCalculator";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import type { LifecycleEmailProject } from "src/notifications/core/gateways/LifecycleEmailProjectQuery";
import type { LifecycleEmailMessage } from "src/notifications/core/gateways/Mailer";
import type { LifecycleEmailDelivery } from "src/notifications/core/models/lifecycleEmail";
import { LifecycleEmailSender } from "src/notifications/core/services/lifecycleEmailSender";
import {
  buildProjectImpactsSummaryEmail,
  type ProjectImpactsSummaryContent,
} from "src/notifications/core/templates/projectImpactsSummaryEmail";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import { SpyLogger } from "src/shared-kernel/adapters/logger/SpyLogger";

import { SendProjectImpactsSummaryEmailUseCase } from "./sendProjectImpactsSummaryEmail.usecase";

const fakeNow = new Date("2026-06-15T10:00:05.000Z");
const webappUrl = "http://localhost:3001";
const unsubscribeTokenService = new HmacUnsubscribeTokenService("unsubscribe-secret-for-tests");

const project = {
  id: "project-1",
  name: "Habitation, école et commerce",
  siteName: "Ancienne carrière d’argile de Blajan",
  createdAt: new Date("2026-06-15T10:00:00.000Z"),
} satisfies LifecycleEmailProject;

// A computed impacts result reduced to what the derivation reads: `years` projection years from
// 2026, the break-even year, and one tax income per year (none when 0). The owner is a company, so
// no avoided friche costs indicator.
const buildImpactsResult = ({
  siteNature = "FRICHE",
  fricheActivity = "INDUSTRY",
  developmentPlanType = "URBAN_PROJECT",
  years = 50,
  breakEvenYear,
  taxesIncomePerYear = 0,
}: {
  siteNature?: SiteNature;
  fricheActivity?: FricheActivity | undefined;
  developmentPlanType?: "URBAN_PROJECT" | "PHOTOVOLTAIC_POWER_PLANT";
  years?: number;
  breakEvenYear: string | undefined;
  taxesIncomePerYear?: number;
}): GetReconversionProjectImpactsResultDto => {
  const projectionYears = Array.from({ length: years }, (_, index) => String(2026 + index));
  const taxesIncomeByYear = projectionYears.map(() => taxesIncomePerYear);
  const taxesIncomeTotal = taxesIncomePerYear * years;
  const { fricheActivity: _mockFricheActivity, ...contextMeta } = urbanProjectImpactMockMeta;
  return {
    contextData: {
      ...contextMeta,
      projectId: "project-1",
      siteNature,
      ...(fricheActivity ? { fricheActivity } : {}),
      projectDevelopmentPlan:
        developmentPlanType === "PHOTOVOLTAIC_POWER_PLANT"
          ? {
              type: "PHOTOVOLTAIC_POWER_PLANT",
              installationElectricalPowerKWc: 1000,
              installationSurfaceArea: 10000,
            }
          : urbanProjectImpactMockMeta.projectDevelopmentPlan,
    },
    developmentScore: urbanProjectDevelopmentScoreMock,
    impacts: {
      projectionYears,
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
        breakEvenYear,
        cumulativeBalanceByYear: [],
        cumulativeEconomicBalanceByYear: [],
        cumulativeIndirectEconomicImpactsByYear: [],
        indirectEconomicImpacts:
          taxesIncomePerYear === 0
            ? { total: 0, details: [] }
            : {
                total: taxesIncomeTotal,
                details: [
                  {
                    name: "projectNewHousesTaxesIncome",
                    total: taxesIncomeTotal,
                    detailsByYear: taxesIncomeByYear,
                    cumulativeByYear: taxesIncomeByYear.map(
                      (_, index) => taxesIncomePerYear * (index + 1),
                    ),
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
};

// The message the author must receive for these (literal) derived values.
const expectedMessage = (
  content: Omit<ProjectImpactsSummaryContent, "project">,
): LifecycleEmailMessage => ({
  to: "gregoire.bailleux@example.fr",
  ...buildProjectImpactsSummaryEmail({
    project,
    ...content,
    webappUrl,
    unsubscribeUrl: buildUnsubscribeUrl(webappUrl, unsubscribeTokenService.sign("user-1")),
  }),
});

const zanComplianceOnIndustrialFriche = {
  name: "zanCompliance",
  isSuccess: true,
  value: {
    isAgriculturalFriche: false,
    permeableSurfaceAreaDifference: undefined,
    artificializedSurfaceArea: 0,
  },
} as const;

const setup = (
  options: {
    isEnabled?: boolean;
    deliveries?: LifecycleEmailDelivery[];
    unsubscribedAt?: Date | null;
    projects?: LifecycleEmailProject[];
  } = {},
) => {
  const deliveries = options.deliveries ?? [];
  const recipientQuery = new InMemoryLifecycleEmailRecipientQuery();
  recipientQuery._setRecipients([
    {
      id: "user-1",
      email: "gregoire.bailleux@example.fr",
      firstName: "Grégoire",
      lastName: "Bailleux",
      unsubscribedAt: options.unsubscribedAt ?? null,
    },
  ]);
  const projectQuery = new InMemoryLifecycleEmailProjectQuery();
  projectQuery._setProjects(options.projects ?? [project]);
  const calculator = new FakeProjectImpactsCalculator();
  const mailer = new FakeMailer();
  const uidGenerator = new DeterministicUuidGenerator();
  uidGenerator.nextUuids("delivery-1");
  const logger = new SpyLogger();
  const sender = new LifecycleEmailSender(
    new InMemoryLifecycleEmailDeliveryRepository(deliveries),
    new InMemoryLifecycleEmailDeliveryQuery(deliveries),
    recipientQuery,
    mailer,
    new DeterministicDateProvider(fakeNow),
    uidGenerator,
    options.isEnabled ?? true,
  );
  const useCase = new SendProjectImpactsSummaryEmailUseCase(
    sender,
    projectQuery,
    calculator,
    webappUrl,
    unsubscribeTokenService,
    logger,
  );
  return { useCase, deliveries, calculator, mailer, logger };
};

const sentSummaryDelivery = (projectId: string): LifecycleEmailDelivery => ({
  id: "existing-delivery",
  userId: "user-1",
  emailType: "project-impacts-summary",
  relatedEntityId: projectId,
  status: "sent",
  createdAt: new Date("2026-06-01T10:00:00.000Z"),
  sentAt: new Date("2026-06-01T10:00:00.000Z"),
  errorMessage: null,
  attempts: 1,
  lastAttemptedAt: new Date("2026-06-01T10:00:00.000Z"),
});

describe("SendProjectImpactsSummaryEmail UseCase", () => {
  it("sends the summary to the project's author and records a delivery scoped to the project", async () => {
    const { useCase, deliveries, calculator, mailer } = setup();
    calculator._setResult(
      "project-1",
      buildImpactsResult({
        siteNature: "FRICHE",
        fricheActivity: "INDUSTRY",
        years: 50,
        breakEvenYear: "2052",
        taxesIncomePerYear: 1000,
      }),
    );

    const result = await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.ok(result.isSuccess());
    assert.deepStrictEqual(result.getData(), { outcome: "sent" });
    assert.deepStrictEqual(mailer.sentEmails, [
      expectedMessage({
        evaluationPeriodInYears: 50,
        zanCompliance: zanComplianceOnIndustrialFriche,
        breakEvenHorizon: { status: "compensated", breakEvenYear: "2052", yearsToBreakEven: 26 },
        mainImpactIndicator: { name: "taxesIncomesImpact", isSuccess: true, value: 50000 },
      }),
    ]);
    assert.deepStrictEqual(deliveries, [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "project-impacts-summary",
        relatedEntityId: "project-1",
        status: "sent",
        createdAt: fakeNow,
        sentAt: fakeNow,
        errorMessage: null,
        attempts: 1,
        lastAttemptedAt: fakeNow,
      },
    ] satisfies LifecycleEmailDelivery[]);
  });

  it("derives a photovoltaic plant's headlines over 30 years, as the app does", async () => {
    const { useCase, calculator, mailer } = setup();
    calculator._setResult(
      "project-1",
      buildImpactsResult({
        developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
        years: 50,
        // Year index 35: after the 30 years a photovoltaic plant is judged over.
        breakEvenYear: "2061",
        taxesIncomePerYear: 1000,
      }),
    );

    await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.deepStrictEqual(mailer.sentEmails, [
      expectedMessage({
        evaluationPeriodInYears: 30,
        zanCompliance: zanComplianceOnIndustrialFriche,
        breakEvenHorizon: { status: "notCompensatedWithinPeriod", breakEvenYear: "2061" },
        mainImpactIndicator: { name: "taxesIncomesImpact", isSuccess: true, value: 30000 },
      }),
    ]);
  });

  it("states the operation's cost is not compensated when the impacts never compensate it", async () => {
    const { useCase, calculator, mailer } = setup();
    calculator._setResult(
      "project-1",
      buildImpactsResult({ breakEvenYear: undefined, taxesIncomePerYear: 1000 }),
    );

    await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.deepStrictEqual(mailer.sentEmails, [
      expectedMessage({
        evaluationPeriodInYears: 50,
        zanCompliance: zanComplianceOnIndustrialFriche,
        breakEvenHorizon: { status: "notCompensatedWithinPeriod", breakEvenYear: undefined },
        mainImpactIndicator: { name: "taxesIncomesImpact", isSuccess: true, value: 50000 },
      }),
    ]);
  });

  it("sends the unfavourable ZAN card for a project on a non-friche site", async () => {
    const { useCase, calculator, mailer } = setup();
    calculator._setResult(
      "project-1",
      buildImpactsResult({
        siteNature: "AGRICULTURAL_OPERATION",
        fricheActivity: undefined,
        breakEvenYear: "2052",
        taxesIncomePerYear: 1000,
      }),
    );

    await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.deepStrictEqual(mailer.sentEmails, [
      expectedMessage({
        evaluationPeriodInYears: 50,
        zanCompliance: {
          name: "zanCompliance",
          isSuccess: false,
          value: { permeableSurfaceAreaDifference: undefined, artificializedSurfaceArea: 0 },
        },
        breakEvenHorizon: { status: "compensated", breakEvenYear: "2052", yearsToBreakEven: 26 },
        mainImpactIndicator: { name: "taxesIncomesImpact", isSuccess: true, value: 50000 },
      }),
    ]);
  });

  it("sends the losses card when the main indicator is unfavourable", async () => {
    const { useCase, calculator, mailer } = setup();
    calculator._setResult(
      "project-1",
      buildImpactsResult({ breakEvenYear: "2052", taxesIncomePerYear: -100 }),
    );

    await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.deepStrictEqual(mailer.sentEmails, [
      expectedMessage({
        evaluationPeriodInYears: 50,
        zanCompliance: zanComplianceOnIndustrialFriche,
        breakEvenHorizon: { status: "compensated", breakEvenYear: "2052", yearsToBreakEven: 26 },
        mainImpactIndicator: { name: "taxesIncomesImpact", isSuccess: false, value: -5000 },
      }),
    ]);
  });

  it("sends no third card when no main indicator applies", async () => {
    const { useCase, calculator, mailer } = setup();
    calculator._setResult(
      "project-1",
      buildImpactsResult({ breakEvenYear: "2052", taxesIncomePerYear: 0 }),
    );

    await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.deepStrictEqual(mailer.sentEmails, [
      expectedMessage({
        evaluationPeriodInYears: 50,
        zanCompliance: zanComplianceOnIndustrialFriche,
        breakEvenHorizon: { status: "compensated", breakEvenYear: "2052", yearsToBreakEven: 26 },
        mainImpactIndicator: undefined,
      }),
    ]);
  });

  it("records a failed delivery when the mailer throws", async () => {
    const { useCase, deliveries, calculator, mailer } = setup();
    calculator._setResult(
      "project-1",
      buildImpactsResult({ breakEvenYear: "2052", taxesIncomePerYear: 1000 }),
    );
    mailer.simulateFailure("SMTP unreachable");

    const result = await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.ok(result.isFailure());
    assert.strictEqual(result.getError(), "DeliveryFailed");
    assert.deepStrictEqual(deliveries, [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "project-impacts-summary",
        relatedEntityId: "project-1",
        status: "failed",
        createdAt: fakeNow,
        sentAt: null,
        errorMessage: "SMTP unreachable",
        attempts: 1,
        lastAttemptedAt: fakeNow,
      },
    ] satisfies LifecycleEmailDelivery[]);
  });

  it("records a failed delivery and logs the cause when the impacts cannot be computed", async () => {
    const { useCase, deliveries, calculator, mailer, logger } = setup();
    calculator._simulateFailure("SiteNotFound");

    const result = await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.ok(result.isFailure());
    assert.strictEqual(result.getError(), "DeliveryFailed");
    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "project-impacts-summary",
        relatedEntityId: "project-1",
        status: "failed",
        createdAt: fakeNow,
        sentAt: null,
        errorMessage: "Project impacts could not be computed for project project-1: SiteNotFound",
        attempts: 1,
        lastAttemptedAt: fakeNow,
      },
    ] satisfies LifecycleEmailDelivery[]);
    assert.deepStrictEqual(
      logger._error.map(({ message, error }) => ({
        message,
        errorMessage: error instanceof Error ? error.message : error,
      })),
      [
        {
          message: "Project impacts summary could not be rendered for project project-1",
          errorMessage: "Project impacts could not be computed for project project-1: SiteNotFound",
        },
      ],
    );
  });

  it("records a failed delivery when the project no longer exists", async () => {
    const { useCase, deliveries, calculator, mailer } = setup({ projects: [] });

    const result = await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.ok(result.isFailure());
    assert.strictEqual(result.getError(), "DeliveryFailed");
    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "project-impacts-summary",
        relatedEntityId: "project-1",
        status: "failed",
        createdAt: fakeNow,
        sentAt: null,
        errorMessage: "Reconversion project project-1 not found",
        attempts: 1,
        lastAttemptedAt: fakeNow,
      },
    ] satisfies LifecycleEmailDelivery[]);
    assert.deepStrictEqual(calculator._requests, []);
  });

  it("sends nothing and computes nothing when the author already received this project's summary", async () => {
    const existing = sentSummaryDelivery("project-1");
    const { useCase, deliveries, calculator, mailer } = setup({ deliveries: [existing] });
    calculator._setResult(
      "project-1",
      buildImpactsResult({ breakEvenYear: "2052", taxesIncomePerYear: 1000 }),
    );

    const result = await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.ok(result.isSuccess());
    assert.deepStrictEqual(result.getData(), { outcome: "skipped-already-sent" });
    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, [sentSummaryDelivery("project-1")]);
    assert.deepStrictEqual(calculator._requests, []);
  });

  it("sends nothing and computes nothing when the author has unsubscribed", async () => {
    const { useCase, deliveries, calculator, mailer } = setup({
      unsubscribedAt: new Date("2026-06-01T00:00:00.000Z"),
    });
    calculator._setResult(
      "project-1",
      buildImpactsResult({ breakEvenYear: "2052", taxesIncomePerYear: 1000 }),
    );

    const result = await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.ok(result.isSuccess());
    assert.deepStrictEqual(result.getData(), { outcome: "skipped-unsubscribed" });
    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, []);
    assert.deepStrictEqual(calculator._requests, []);
  });

  it("sends nothing and writes nothing when the kill switch is off", async () => {
    const { useCase, deliveries, calculator, mailer } = setup({ isEnabled: false });
    calculator._setResult(
      "project-1",
      buildImpactsResult({ breakEvenYear: "2052", taxesIncomePerYear: 1000 }),
    );

    const result = await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.ok(result.isSuccess());
    assert.deepStrictEqual(result.getData(), { outcome: "skipped-disabled" });
    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, []);
    assert.deepStrictEqual(calculator._requests, []);
  });

  it("sends the summary of a second project to the same author", async () => {
    const { useCase, deliveries, calculator, mailer } = setup({
      deliveries: [sentSummaryDelivery("project-0")],
    });
    calculator._setResult(
      "project-1",
      buildImpactsResult({ breakEvenYear: "2052", taxesIncomePerYear: 1000 }),
    );

    const result = await useCase.execute({ reconversionProjectId: "project-1", userId: "user-1" });

    assert.ok(result.isSuccess());
    assert.deepStrictEqual(result.getData(), { outcome: "sent" });
    assert.strictEqual(mailer.sentEmails.length, 1);
    assert.deepStrictEqual(deliveries, [
      sentSummaryDelivery("project-0"),
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "project-impacts-summary",
        relatedEntityId: "project-1",
        status: "sent",
        createdAt: fakeNow,
        sentAt: fakeNow,
        errorMessage: null,
        attempts: 1,
        lastAttemptedAt: fakeNow,
      },
    ] satisfies LifecycleEmailDelivery[]);
  });
});
