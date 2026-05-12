import { SiteImpactsDataView } from "shared";
import { ReconversionProjectImpactsBreakEvenLevel } from "shared";
import { v4 as uuid } from "uuid";

import { InMemoryCityStatsQuery } from "src/reconversion-projects/adapters/secondary/queries/city-stats/InMemoryCityStatsQuery";
import { InMemoryReconversionProjectImpactsQuery } from "src/reconversion-projects/adapters/secondary/queries/reconversion-project-impacts/InMemoryReconversionProjectImpactsQuery";
import { InMemorySiteImpactsQuery } from "src/reconversion-projects/adapters/secondary/queries/site-impacts/InMemorySiteImpactsQuery";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { FailureResult, SuccessResult } from "src/shared-kernel/result";

import { FakeGetSoilsCarbonStorageService } from "../gateways/FakeGetSoilsCarbonStorageService";
import {
  ComputeReconversionProjectBreakEvenLevelUseCase,
  ReconversionProjectImpactsQueryResult,
} from "./computeReconversionProjectBreakEvenLevel.usecase";

describe("ComputeReconversionProjectBreakEvenLevelUseCase", () => {
  let dateProvider: DateProvider;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
  });

  describe("Error cases", () => {
    it("fails when reconversion project does not exist", async () => {
      const usecase = new ComputeReconversionProjectBreakEvenLevelUseCase(
        new InMemoryReconversionProjectImpactsQuery(),
        new InMemorySiteImpactsQuery(),
        new FakeGetSoilsCarbonStorageService(),
        new InMemoryCityStatsQuery(),
        dateProvider,
      );

      const result = await usecase.execute({
        reconversionProjectId: uuid(),
        evaluationPeriodInYears: 10,
      });

      expect(result.isFailure()).toBe(true);
      expect((result as FailureResult<"ReconversionProjectNotFound">).getError()).toBe(
        "ReconversionProjectNotFound",
      );
    });

    it("fails when development plan is missing", async () => {
      const reconversionProjectId = uuid();
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      projectQuery._setData({
        id: reconversionProjectId,
        isExpressProject: false,
        name: "No dev plan",
        relatedSiteId: uuid(),
        soilsDistribution: [],
        sitePurchaseTotalAmount: 0,
        reinstatementExpenses: [],
        developmentPlan: undefined,
        financialAssistanceRevenues: [],
        yearlyProjectedExpenses: [],
        yearlyProjectedRevenues: [],
      });

      const usecase = new ComputeReconversionProjectBreakEvenLevelUseCase(
        projectQuery,
        new InMemorySiteImpactsQuery(),
        new FakeGetSoilsCarbonStorageService(),
        new InMemoryCityStatsQuery(),
        dateProvider,
      );

      const result = await usecase.execute({ reconversionProjectId, evaluationPeriodInYears: 10 });

      expect(result.isFailure()).toBe(true);
      expect((result as FailureResult<"NoDevelopmentPlanType">).getError()).toBe(
        "NoDevelopmentPlanType",
      );
    });

    it("fails when related site does not exist", async () => {
      const reconversionProjectId = uuid();
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      projectQuery._setData({
        id: reconversionProjectId,
        isExpressProject: false,
        name: "Missing site",
        relatedSiteId: uuid(),
        soilsDistribution: [],
        sitePurchaseTotalAmount: 0,
        reinstatementExpenses: [],
        developmentPlan: {
          type: "PHOTOVOLTAIC_POWER_PLANT",
          installationCosts: [],
          features: {
            contractDuration: 20,
            electricalPowerKWc: 100,
            expectedAnnualProduction: 1000,
            surfaceArea: 1000,
          },
        },
        financialAssistanceRevenues: [],
        yearlyProjectedExpenses: [],
        yearlyProjectedRevenues: [],
      });

      const usecase = new ComputeReconversionProjectBreakEvenLevelUseCase(
        projectQuery,
        new InMemorySiteImpactsQuery(),
        new FakeGetSoilsCarbonStorageService(),
        new InMemoryCityStatsQuery(),
        dateProvider,
      );

      const result = await usecase.execute({ reconversionProjectId, evaluationPeriodInYears: 10 });

      expect(result.isFailure()).toBe(true);
      expect((result as FailureResult<"SiteNotFound">).getError()).toBe("SiteNotFound");
    });
  });

  const fricheProjectData = {
    id: uuid(),
    name: "Project with big impacts",
    relatedSiteId: uuid(),
    isExpressProject: false,
    soilsDistribution: [
      { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", surfaceArea: 10000 },
      { soilType: "PRAIRIE_TREES", surfaceArea: 20000 },
      { soilType: "BUILDINGS", surfaceArea: 20000 },
      { soilType: "MINERAL_SOIL", surfaceArea: 20000 },
      { soilType: "IMPERMEABLE_SOILS", surfaceArea: 30000 },
    ],
    conversionSchedule: {
      startDate: new Date("2025-07-01"),
      endDate: new Date("2026-07-01"),
    },
    reinstatementSchedule: {
      startDate: new Date("2025-01-01"),
      endDate: new Date("2026-01-01"),
    },
    futureOperatorName: "Mairie de Blajan",
    futureOperatorStructureType: "municipality",
    futureSiteOwnerName: "Mairie de Blajan",
    futureSiteOwnerStructureType: "municipality",
    reinstatementContractOwnerName: "Mairie de Blajan",
    reinstatementContractOwnerStructureType: "municipality",
    sitePurchaseTotalAmount: 150000,
    sitePurchasePropertyTransferDutiesAmount: 5432,
    reinstatementExpenses: [{ amount: 500000, purpose: "demolition" }],
    developmentPlan: {
      type: "PHOTOVOLTAIC_POWER_PLANT",
      installationCosts: [{ amount: 200000, purpose: "installation_works" }],
      features: {
        electricalPowerKWc: 258,
        surfaceArea: 20000,
        contractDuration: 30,
        expectedAnnualProduction: 4679,
      },
      developerName: "Mairie de Blajan",
      developerStructureType: "municipality",
    },
    financialAssistanceRevenues: [{ amount: 150000, source: "public_subsidies" }],
    buildingsConstructionAndRehabilitationExpenses: [
      {
        amount: 20000,
        purpose: "buildings_construction_works",
      },
    ],
    buildingsResaleExpectedPropertyTransferDutiesAmount: 2000,
    yearlyProjectedExpenses: [
      { amount: 1000, purpose: "taxes" },
      { amount: 10000, purpose: "maintenance" },
    ],
    yearlyProjectedRevenues: [
      { amount: 10000, source: "rent" },
      { amount: 2000, source: "other" },
    ],
    operationsFirstYear: 2025,
    decontaminatedSoilSurface: 20000,
  } as const satisfies ReconversionProjectImpactsQueryResult;

  const fricheSite = {
    id: fricheProjectData.relatedSiteId,
    description: "Description",
    contaminatedSoilSurface: 20000,
    name: "My base site",
    nature: "FRICHE",
    fricheActivity: "AGRICULTURE",
    surfaceArea: 50000,
    soilsDistribution: {
      BUILDINGS: 20000,
      MINERAL_SOIL: 20000,
      IMPERMEABLE_SOILS: 10000,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 40000,
    },
    address: {
      cityCode: "23456",
      value: "Blajan",
      banId: "",
      city: "Blajan",
      postCode: "23456",
      long: 0,
      lat: 0,
    },
    isExpressSite: false,
    yearlyIncomes: [],
    ownerName: "Current owner",
    ownerStructureType: "company",
    tenantName: "Current tenant",
    tenantStructureType: "company",
    accidentsDeaths: 0,
    accidentsMinorInjuries: 1,
    accidentsSevereInjuries: 2,
    yearlyExpenses: [
      { amount: 54000, bearer: "tenant", purpose: "rent" },
      { amount: 11600, bearer: "tenant", purpose: "security" },
      { amount: 1500, bearer: "tenant", purpose: "illegalDumpingCost" },
      { amount: 500, bearer: "owner", purpose: "propertyTaxes" },
    ],
  } as const satisfies Required<
    Omit<
      SiteImpactsDataView,
      "agriculturalOperationActivity" | "isSiteOperated" | "naturalAreaType"
    >
  >;

  const buildUseCase = (
    projectData: ReconversionProjectImpactsQueryResult,
    siteData: SiteImpactsDataView,
  ) => {
    const projectQuery = new InMemoryReconversionProjectImpactsQuery();
    projectQuery._setData(projectData);
    const siteQuery = new InMemorySiteImpactsQuery();
    siteQuery._setData(siteData);

    return new ComputeReconversionProjectBreakEvenLevelUseCase(
      projectQuery,
      siteQuery,
      new FakeGetSoilsCarbonStorageService(),
      new InMemoryCityStatsQuery(),
      dateProvider,
    );
  };

  // ---------------------------------------------------------------------------
  // Success cases — friche project (local-authority operator)
  // ---------------------------------------------------------------------------

  describe("Success cases: friche project (local authority as future operator)", () => {
    it("succeeds and returns a well-formed result", async () => {
      const usecase = buildUseCase(fricheProjectData, fricheSite);
      const result = await usecase.execute({
        reconversionProjectId: fricheProjectData.id,
        evaluationPeriodInYears: 10,
      });

      expect(result.isSuccess()).toBe(true);
    });

    it("projectionYears has exactly evaluationPeriodInYears entries", async () => {
      const evaluationPeriodInYears = 10;
      const usecase = buildUseCase(fricheProjectData, fricheSite);
      const result = await usecase.execute({
        reconversionProjectId: fricheProjectData.id,
        evaluationPeriodInYears,
      });

      const data = (result as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>).getData();
      expect(data.projectionYears).toHaveLength(evaluationPeriodInYears);
      expect(data.cumulativeBalanceByYear).toHaveLength(evaluationPeriodInYears);
    });

    it("projectionYears starts at operationsFirstYear", async () => {
      const usecase = buildUseCase(fricheProjectData, fricheSite);
      const result = await usecase.execute({
        reconversionProjectId: fricheProjectData.id,
        evaluationPeriodInYears: 10,
      });

      const data = (result as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>).getData();
      expect(data.projectionYears[0]).toBe(String(fricheProjectData.operationsFirstYear));
    });

    /**
     * Key invariant: when the future operator is a local authority,
     * the operating balance is merged into indirectEconomicImpacts
     * economicBalance.total must equal the impacts usecase economicBalance.total (-700000).
     */
    it("put operating balance in indirectEconomicImpacts if future operator is local authority", async () => {
      const usecase = buildUseCase(fricheProjectData, fricheSite);
      const result = await usecase.execute({
        reconversionProjectId: fricheProjectData.id,
        evaluationPeriodInYears: 10,
      });

      const data = (result as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>).getData();

      expect(data.economicBalance.total).toBe(-720000);
      expect(data.indirectEconomicImpacts.total).toBe(34143237);
    });

    it("stakeholders reflect site and project data", async () => {
      const usecase = buildUseCase(fricheProjectData, fricheSite);
      const result = await usecase.execute({
        reconversionProjectId: fricheProjectData.id,
        evaluationPeriodInYears: 10,
      });

      const data = (result as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>).getData();
      expect(data.stakeholders.current.owner.structureType).toBe(fricheSite.ownerStructureType);
      expect(data.stakeholders.project.developer.structureType).toBe(
        fricheProjectData.developmentPlan.developerStructureType,
      );
      expect(data.stakeholders.future.operator?.structureType).toBe(
        fricheProjectData.futureOperatorStructureType,
      );
    });

    it("uses DEFAULT_EVALUATION_PERIOD_IN_YEARS (50) when not provided", async () => {
      const usecase = buildUseCase(fricheProjectData, fricheSite);
      const result = await usecase.execute({
        reconversionProjectId: fricheProjectData.id,
      });

      const data = (result as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>).getData();
      expect(data.projectionYears).toHaveLength(50);
    });
  });

  // ---------------------------------------------------------------------------
  // Success cases — developer === future operator
  // (operating balance merged into economicBalance)
  // ---------------------------------------------------------------------------

  describe("Success cases: developer is same as future operator", () => {
    /**
     * Same project but with a private developer who is also the future operator.
     * In this case the operating balance must be merged into economicBalance.
     */
    const privateDevProject: ReconversionProjectImpactsQueryResult = {
      ...fricheProjectData,
      id: uuid(),
      futureOperatorName: "Acme Solar",
      futureOperatorStructureType: "company",
      futureSiteOwnerName: undefined,
      futureSiteOwnerStructureType: undefined,
      developmentPlan: {
        ...fricheProjectData.developmentPlan,
        developerName: "Acme Solar",
        developerStructureType: "company",
      },
    };

    it("economicBalance.total includes operating balance", async () => {
      const evaluationPeriodInYears = 10;
      const usecase = buildUseCase(privateDevProject, fricheSite);
      const result = await usecase.execute({
        reconversionProjectId: privateDevProject.id,
        evaluationPeriodInYears,
      });

      expect(result.isSuccess()).toBe(true);
      const data = (result as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>).getData();

      // economicBalance must be larger than development-only balance (-700000)
      // because operating revenues/costs are now folded in
      expect(data.economicBalance.total).toBeGreaterThan(-700000);
    });

    it("indirectEconomicImpacts does NOT include operating balance", async () => {
      const evaluationPeriodInYears = 10;
      const usecase = buildUseCase(privateDevProject, fricheSite);
      const resultPrivate = await usecase.execute({
        reconversionProjectId: privateDevProject.id,
        evaluationPeriodInYears,
      });

      // Compare with local-authority version where operating IS in indirect
      const usecaseLocalAuth = buildUseCase(fricheProjectData, fricheSite);
      const resultLocalAuth = await usecaseLocalAuth.execute({
        reconversionProjectId: fricheProjectData.id,
        evaluationPeriodInYears,
      });

      const dataPrivate = (
        resultPrivate as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>
      ).getData();
      const dataLocalAuth = (
        resultLocalAuth as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>
      ).getData();

      // Indirect impacts should be smaller when operating balance is NOT merged into it
      expect(dataPrivate.indirectEconomicImpacts.total).toBeLessThan(
        dataLocalAuth.indirectEconomicImpacts.total,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Success cases — future operator is neither local authority nor developer
  // (operating balance is not counted at all)
  // ---------------------------------------------------------------------------

  describe("Success cases: third-party future operator", () => {
    const thirdPartyProject: ReconversionProjectImpactsQueryResult = {
      ...fricheProjectData,
      id: uuid(),
      futureOperatorName: "Third Party Operator",
      futureOperatorStructureType: "company",
      futureSiteOwnerName: undefined,
      futureSiteOwnerStructureType: undefined,
      developmentPlan: {
        ...fricheProjectData.developmentPlan,
        developerName: "Acme Solar",
        developerStructureType: "company",
      },
    };

    it("economicBalance equals development-only balance", async () => {
      const evaluationPeriodInYears = 10;
      const usecase = buildUseCase(thirdPartyProject, fricheSite);
      const result = await usecase.execute({
        reconversionProjectId: thirdPartyProject.id,
        evaluationPeriodInYears,
      });

      const data = (result as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>).getData();

      expect(data.economicBalance.total).toBe(-220000);
    });

    it("indirectEconomicImpacts does not include operating balance", async () => {
      const evaluationPeriodInYears = 10;
      const usecase = buildUseCase(thirdPartyProject, fricheSite);
      const result = await usecase.execute({
        reconversionProjectId: thirdPartyProject.id,
        evaluationPeriodInYears,
      });

      const usecaseLocalAuth = buildUseCase(fricheProjectData, fricheSite);
      const resultLocalAuth = await usecaseLocalAuth.execute({
        reconversionProjectId: fricheProjectData.id,
        evaluationPeriodInYears,
      });

      const data = (result as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>).getData();
      const dataLocalAuth = (
        resultLocalAuth as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>
      ).getData();

      expect(data.indirectEconomicImpacts.total).toBeLessThan(
        dataLocalAuth.indirectEconomicImpacts.total,
      );
    });

    it("breakEvenYear is undefined when the balance never turns positive", async () => {
      // With only 1 year the development costs are unlikely to be recovered
      const usecase = buildUseCase(
        {
          ...fricheProjectData,
          soilsDistribution: [
            {
              soilType: "IMPERMEABLE_SOILS",
              surfaceArea: 50000,
              spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
            },
          ],
        },
        fricheSite,
      );
      const result = await usecase.execute({
        reconversionProjectId: fricheProjectData.id,
      });

      const data = (result as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>).getData();
      // cumulativeBalanceByYear[0] is very negative (development costs dominate)
      expect(data.breakEvenYear).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // Evaluation period sensitivity
  // ---------------------------------------------------------------------------

  describe("Evaluation period sensitivity", () => {
    it("longer period yields more projection years", async () => {
      const usecase10 = buildUseCase(fricheProjectData, fricheSite);
      const result10 = await usecase10.execute({
        reconversionProjectId: fricheProjectData.id,
        evaluationPeriodInYears: 10,
      });

      const usecase30 = buildUseCase(fricheProjectData, fricheSite);
      const result30 = await usecase30.execute({
        reconversionProjectId: fricheProjectData.id,
        evaluationPeriodInYears: 30,
      });

      const data10 = (
        result10 as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>
      ).getData();
      const data30 = (
        result30 as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>
      ).getData();

      expect(data10.projectionYears).toHaveLength(10);
      expect(data30.projectionYears).toHaveLength(30);
    });

    it("longer period yields higher indirectEconomicImpacts.total (more years of impact)", async () => {
      const usecase10 = buildUseCase(fricheProjectData, fricheSite);
      const result10 = await usecase10.execute({
        reconversionProjectId: fricheProjectData.id,
        evaluationPeriodInYears: 10,
      });

      const usecase30 = buildUseCase(fricheProjectData, fricheSite);
      const result30 = await usecase30.execute({
        reconversionProjectId: fricheProjectData.id,
        evaluationPeriodInYears: 30,
      });

      const total10 = (
        result10 as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>
      ).getData().indirectEconomicImpacts.total;

      const total30 = (
        result30 as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>
      ).getData().indirectEconomicImpacts.total;

      expect(total30).toBeGreaterThan(total10);
    });

    it("breakEvenYear is undefined when the balance never turns positive within the period", async () => {
      // With only 1 year the development costs are unlikely to be recovered
      const usecase = buildUseCase(
        {
          ...fricheProjectData,
          soilsDistribution: [
            {
              soilType: "IMPERMEABLE_SOILS",
              surfaceArea: 50000,
              spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
            },
          ],
        },
        fricheSite,
      );
      const result = await usecase.execute({
        reconversionProjectId: fricheProjectData.id,
        evaluationPeriodInYears: 1,
      });

      const data = (result as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>).getData();
      // cumulativeBalanceByYear[0] is very negative (development costs dominate)
      expect(data.breakEvenYear).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // operationsFirstYear fallback
  // ---------------------------------------------------------------------------

  describe("operationsFirstYear fallback", () => {
    it("falls back to current year when operationsFirstYear is not set", async () => {
      const projectWithoutFirstYear: ReconversionProjectImpactsQueryResult = {
        ...fricheProjectData,
        id: uuid(),
        operationsFirstYear: undefined,
      };

      const usecase = buildUseCase(projectWithoutFirstYear, fricheSite);
      const result = await usecase.execute({
        reconversionProjectId: projectWithoutFirstYear.id,
        evaluationPeriodInYears: 10,
      });

      const data = (result as SuccessResult<ReconversionProjectImpactsBreakEvenLevel>).getData();
      // fakeNow is 2024, so the first projection year must be "2024"
      expect(data.projectionYears[0]).toBe("2024");
    });
  });
});
