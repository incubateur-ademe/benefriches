import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import type {
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
  UrbanSprawlImpactsComparisonResultDto,
} from "shared";
import { v4 as uuid } from "uuid";

import { InMemoryReconversionProjectImpactsQuery } from "src/reconversion-projects/adapters/secondary/queries/reconversion-project-impacts/InMemoryReconversionProjectImpactsQuery";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import type { SuccessResult, FailureResult } from "src/shared-kernel/result";
import { InMemorySiteImpactsQuery } from "src/sites/adapters/secondary/site-impacts/InMemorySiteImpactsQuery";
import { InMemoryCityRuralityQuery } from "src/territory/adapters/secondary/city-rurality-query/InMemoryCityRuralityQuery";
import { InMemoryCityStatsQuery } from "src/territory/adapters/secondary/city-stats-query/InMemoryCityStatsQuery";

import { FakeGetSoilsCarbonStorageService } from "../gateways/FakeGetSoilsCarbonStorageService";
import type { Schedule } from "../model/reconversionProject";
import { ComputeProjectUrbanSprawlImpactsComparisonUseCase } from "./computeProjectUrbanSprawlImpactsComparison.usecase";
import type { ApiReconversionProjectImpactsDataView } from "./computeReconversionProjectImpacts.usecase";

const projectData: ReconversionProjectImpactsDataView<Schedule> = {
  id: "bf8a7d1d-a9d2-4a66-b2bc-3b8d682f9932",
  name: "Centralité urbaine",
  involvesReinstatement: true,
  isExpressProject: true,
  decontaminatedSoilSurface: 10000,
  operationsFirstYear: 2027,
  developmentPlan: {
    installationCosts: [
      { amount: 90000, purpose: "technical_studies" },
      { amount: 810000, purpose: "development_works" },
      { amount: 81000, purpose: "other" },
    ],
    developerName: "Mairie de Blajan",
    developerStructureType: "municipality",
    installationSchedule: {
      startDate: new Date("2025-06-17"),
      endDate: new Date("2026-06-17"),
    },
    type: "URBAN_PROJECT",
    features: {
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 7440,
        LOCAL_STORE: 240,
        OFFICES: 480,
        LOCAL_SERVICES: 960,
        ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 240,
        PUBLIC_FACILITIES: 240,
      },
    },
  },
  soilsDistribution: [
    {
      soilType: "IMPERMEABLE_SOILS",
      spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
      surfaceArea: 500,
    },
    {
      soilType: "MINERAL_SOIL",
      spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
      surfaceArea: 250,
    },
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
      surfaceArea: 3500,
    },
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      spaceCategory: "PUBLIC_SPACE",
      surfaceArea: 500,
    },
    {
      soilType: "IMPERMEABLE_SOILS",
      spaceCategory: "PUBLIC_SPACE",
      surfaceArea: 1500,
    },
    {
      soilType: "MINERAL_SOIL",
      spaceCategory: "PUBLIC_SPACE",
      surfaceArea: 750,
    },
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      spaceCategory: "PUBLIC_GREEN_SPACE",
      surfaceArea: 3000,
    },
    { soilType: "BUILDINGS", spaceCategory: "LIVING_AND_ACTIVITY_SPACE", surfaceArea: 4000 },
  ],
  yearlyProjectedExpenses: [{ amount: 15000, purpose: "rent" }],
  yearlyProjectedRevenues: [],
  sitePurchaseTotalAmount: 1800000,
  sitePurchasePropertyTransferDutiesAmount: 17400,
  relatedSiteId: "",
  reinstatementExpenses: [{ purpose: "asbestos_removal", amount: 10000 }],
  financialAssistanceRevenues: [],
  reinstatementContractOwnerName: "Mairie de Blajan",
  futureSiteOwnerStructureType: "company",
  futureSiteOwnerName: "Futur proprio",
};

const friche = {
  id: projectData.relatedSiteId,
  description: "Description",
  contaminatedSoilSurface: 20000,
  name: "My base site",
  nature: "FRICHE",
  fricheActivity: "AGRICULTURE",
  surfaceArea: 14000,
  soilsDistribution: {
    MINERAL_SOIL: 1000,
    BUILDINGS: 2000,
    IMPERMEABLE_SOILS: 10000,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 2000,
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
    { amount: 6000, bearer: "tenant", purpose: "rent" },
    { amount: 11600, bearer: "tenant", purpose: "security" },
    { amount: 1500, bearer: "tenant", purpose: "illegalDumpingCost" },
    { amount: 500, bearer: "owner", purpose: "propertyTaxes" },
  ],
} as const satisfies Required<
  Omit<SiteImpactsDataView, "agriculturalOperationActivity" | "isSiteOperated" | "naturalAreaType">
>;

describe("ComputeProjectUrbanSprawlImpactsComparisonUseCase", () => {
  let dateProvider: DateProvider;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
  });

  describe("Error cases", () => {
    it("throws error when reconversion project does not exist", async () => {
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      const siteQuery = new InMemorySiteImpactsQuery();

      const usecase = new ComputeProjectUrbanSprawlImpactsComparisonUseCase(
        projectQuery,
        siteQuery,
        new InMemoryCityStatsQuery(),
        new InMemoryCityRuralityQuery(),
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
      );

      const reconversionProjectId = uuid();
      const evaluationPeriodInYears = 10;
      const result = await usecase.execute({
        reconversionProjectId,
        evaluationPeriodInYears,
        comparisonSiteNature: "AGRICULTURAL_OPERATION",
      });

      assert.strictEqual(result.isFailure(), true);
      assert.strictEqual((result as FailureResult).getError(), "ReconversionProjectNotFound");
    });

    it("throws error when reconversion project development plan does not exist", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      projectQuery._setData({
        id: reconversionProjectId,
        involvesReinstatement: true,
        isExpressProject: false,
        name: "Test reconversion project",
        relatedSiteId: siteId,
        soilsDistribution: [],
        sitePurchaseTotalAmount: 0,
        reinstatementExpenses: [],
        developmentPlan: undefined,
        financialAssistanceRevenues: [],
        yearlyProjectedExpenses: [],
        yearlyProjectedRevenues: [],
      });
      const siteQuery = new InMemorySiteImpactsQuery();
      const usecase = new ComputeProjectUrbanSprawlImpactsComparisonUseCase(
        projectQuery,
        siteQuery,
        new InMemoryCityStatsQuery(),
        new InMemoryCityRuralityQuery(),
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
      );
      const evaluationPeriodInYears = 10;
      const result = await usecase.execute({
        reconversionProjectId,
        evaluationPeriodInYears,
        comparisonSiteNature: "AGRICULTURAL_OPERATION",
      });

      assert.strictEqual(result.isFailure(), true);
      assert.strictEqual((result as FailureResult).getError(), "NoDevelopmentPlanType");
    });

    it("throws error when reconversion project related site does not exist", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      projectQuery._setData({
        id: reconversionProjectId,
        involvesReinstatement: true,
        isExpressProject: false,
        name: "Test reconversion project",
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
        relatedSiteId: siteId,
        soilsDistribution: [],
        sitePurchaseTotalAmount: 0,
        reinstatementExpenses: [],
        financialAssistanceRevenues: [],
        yearlyProjectedExpenses: [],
        yearlyProjectedRevenues: [],
      });
      const siteQuery = new InMemorySiteImpactsQuery();
      const usecase = new ComputeProjectUrbanSprawlImpactsComparisonUseCase(
        projectQuery,
        siteQuery,
        new InMemoryCityStatsQuery(),
        new InMemoryCityRuralityQuery(),
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
      );

      const evaluationPeriodInYears = 10;
      const result = await usecase.execute({
        reconversionProjectId,
        evaluationPeriodInYears,
        comparisonSiteNature: "AGRICULTURAL_OPERATION",
      });

      assert.strictEqual(result.isFailure(), true);
      assert.strictEqual((result as FailureResult).getError(), "SiteNotFound");
    });
  });

  it("compares project on friche with project on agricultural site", async () => {
    const evaluationPeriodInYears = 10;
    const projectQuery = new InMemoryReconversionProjectImpactsQuery();
    projectQuery._setData(projectData);
    const siteQuery = new InMemorySiteImpactsQuery();
    siteQuery._setData(friche);

    const usecase = new ComputeProjectUrbanSprawlImpactsComparisonUseCase(
      projectQuery,
      siteQuery,
      new InMemoryCityStatsQuery(),
      new InMemoryCityRuralityQuery(),
      new FakeGetSoilsCarbonStorageService(),
      dateProvider,
    );
    const result = await usecase.execute({
      reconversionProjectId: projectData.id,
      evaluationPeriodInYears,
      comparisonSiteNature: "AGRICULTURAL_OPERATION",
    });

    assert.strictEqual(result.isSuccess(), true);
    const data = (result as SuccessResult<UrbanSprawlImpactsComparisonResultDto>).getData();

    assert.ok(data.cumulativeBalanceByYear !== undefined);
    assert.ok(data.operationsFirstYear !== undefined);
    assert.ok(data.projectEconomicBalance !== undefined);
    assert.ok(data.projectOnSimulationSiteImpactsData !== undefined);
    assert.ok(data.projectionYears !== undefined);
    assert.ok(data.simulationSiteData !== undefined);
    assert.ok(data.simulationSiteStatuQuoImpactsData !== undefined);
    assert.ok(data.stakeholders !== undefined);

    assert.strictEqual(
      data.simulationSiteStatuQuoImpactsData.details.find(
        ({ name }) => name === "fricheMaintenanceAndSecuringCostsForOwner",
      ),
      undefined,
    );

    const rentalIncomeTotal = data.simulationSiteStatuQuoImpactsData.details.find(
      ({ name }) => name === "rentalIncome",
    )?.total;
    assert.ok(rentalIncomeTotal !== undefined && Math.abs(rentalIncomeTotal - 1505) < 0.5);

    const projectedRentalIncomeTotal = data.projectOnSimulationSiteImpactsData.details.find(
      ({ name }) => name === "projectedRentalIncome",
    )?.total;
    assert.ok(
      projectedRentalIncomeTotal !== undefined &&
        Math.abs(projectedRentalIncomeTotal - 124032) < 0.5,
    );

    assert.deepStrictEqual(data.stakeholders.current.owner, {
      structureType: "municipality",
      structureName: "Mairie de Blajan",
    });

    assert.deepStrictEqual(data.stakeholders.future.owner, {
      structureType: "company",
      structureName: "Futur proprio",
    });

    const projectNewHousesTaxesIncomeTotal = data.projectOnSimulationSiteImpactsData.details.find(
      ({ name }) => name === "projectNewHousesTaxesIncome",
    )?.total;
    assert.ok(
      projectNewHousesTaxesIncomeTotal !== undefined &&
        Math.abs(projectNewHousesTaxesIncomeTotal - 194032) < 0.5,
    );

    const projectNewCompanyTaxationIncomeTotal =
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "projectNewCompanyTaxationIncome",
      )?.total;
    assert.ok(
      projectNewCompanyTaxationIncomeTotal !== undefined &&
        Math.abs(projectNewCompanyTaxationIncomeTotal - 595807) < 0.5,
    );

    const taxesIncomeTotal = data.simulationSiteStatuQuoImpactsData.details.find(
      ({ name }) => name === "taxesIncome",
    )?.total;
    assert.ok(taxesIncomeTotal !== undefined && Math.abs(taxesIncomeTotal - 258) < 0.5);

    const waterRegulationProject = data.projectOnSimulationSiteImpactsData.details.find(
      ({ name }) => name === "waterRegulation",
    )?.total;
    const waterRegulationStatuQuo =
      data.simulationSiteStatuQuoImpactsData.details.find(({ name }) => name === "waterRegulation")
        ?.total ?? 0;
    assert.ok(
      waterRegulationProject !== undefined && waterRegulationProject < waterRegulationStatuQuo,
    );

    const invasiveSpeciesProject =
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "invasiveSpeciesRegulation",
      )?.total ?? 0;
    const invasiveSpeciesStatuQuo =
      data.simulationSiteStatuQuoImpactsData.details.find(
        ({ name }) => name === "invasiveSpeciesRegulation",
      )?.total ?? 0;
    assert.ok(invasiveSpeciesProject < invasiveSpeciesStatuQuo);

    const avoidedRoadsConstructionTotal = data.projectOnSimulationSiteImpactsData.details.find(
      ({ name }) => name === "avoidedRoadsAndUtilitiesConstructionExpenses",
    )?.total;
    assert.ok(
      avoidedRoadsConstructionTotal !== undefined &&
        Math.abs(avoidedRoadsConstructionTotal - -120805) < 0.5,
    );

    const avoidedRoadsMaintenanceTotal = data.projectOnSimulationSiteImpactsData.details.find(
      ({ name }) => name === "avoidedRoadsAndUtilitiesMaintenanceExpenses",
    )?.total;
    assert.ok(
      avoidedRoadsMaintenanceTotal !== undefined &&
        Math.abs(avoidedRoadsMaintenanceTotal - -203038) < 0.5,
    );

    assert.strictEqual(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "fricheRoadsAndUtilitiesExpenses",
      ),
      undefined,
    );
  });

  it("returns impacts with no errors when soils carbon storage cannot be computed", async () => {
    const evaluationPeriodInYears = 10;
    const projectQuery = new InMemoryReconversionProjectImpactsQuery();
    projectQuery._setData(projectData);
    const siteQuery = new InMemorySiteImpactsQuery();
    siteQuery._setData(friche);

    const soilsCarbonStorageService = new FakeGetSoilsCarbonStorageService();
    soilsCarbonStorageService.shouldFailOnExecute();

    const usecase = new ComputeProjectUrbanSprawlImpactsComparisonUseCase(
      projectQuery,
      siteQuery,
      new InMemoryCityStatsQuery(),
      new InMemoryCityRuralityQuery(),
      soilsCarbonStorageService,
      dateProvider,
    );
    const result = await usecase.execute({
      reconversionProjectId: projectData.id,
      evaluationPeriodInYears,
      comparisonSiteNature: "NATURAL_AREA",
    });

    assert.strictEqual(result.isSuccess(), true);
    const data = (result as SuccessResult<UrbanSprawlImpactsComparisonResultDto>).getData();

    assert.ok(data.projectOnSimulationSiteImpactsData.details.length > 0);
    assert.strictEqual(
      data.projectOnSimulationSiteImpactsData.details.find(({ name }) => name === "newStoredCo2Eq"),
      undefined,
    );
    assert.ok(data.simulationSiteStatuQuoImpactsData);
  });

  it("compares photovoltaic project on agricultural site with project on friche", async () => {
    const evaluationPeriodInYears = 10;
    const reconversionProjectImpactDataView = {
      id: uuid(),
      name: "Project with big impacts",
      relatedSiteId: uuid(),
      involvesReinstatement: true,
      isExpressProject: false,
      soilsDistribution: [
        {
          soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          surfaceArea: 10000,
        },
        {
          soilType: "PRAIRIE_TREES",
          surfaceArea: 20000,
        },
        { soilType: "BUILDINGS", surfaceArea: 20000 },
        {
          soilType: "MINERAL_SOIL",
          surfaceArea: 20000,
        },
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
      reinstatementContractOwnerName: "Mairie de Blajan",
      sitePurchaseTotalAmount: 150000,
      reinstatementExpenses: [{ amount: 500000, purpose: "demolition" }],
      developmentPlan: {
        developerName: "Mairie de Blajan",
        developerStructureType: "municipality",
        type: "PHOTOVOLTAIC_POWER_PLANT",
        features: {
          electricalPowerKWc: 258,
          surfaceArea: 20000,
          contractDuration: 30,
          expectedAnnualProduction: 4679,
        },
        installationCosts: [{ amount: 200000, purpose: "installation_works" }],
      },
      financialAssistanceRevenues: [{ amount: 150000, source: "public_subsidies" }],
      yearlyProjectedExpenses: [
        { amount: 10000, purpose: "rent" },
        { amount: 1000, purpose: "taxes" },
        { amount: 10000, purpose: "maintenance" },
      ],
      yearlyProjectedRevenues: [{ amount: 1000, source: "other" }],
      sitePurchasePropertyTransferDutiesAmount: 5432,
      operationsFirstYear: 2025,
      decontaminatedSoilSurface: 20000,
    } as const satisfies ApiReconversionProjectImpactsDataView;

    const site: SiteImpactsDataView = {
      id: reconversionProjectImpactDataView.relatedSiteId,
      contaminatedSoilSurface: 20000,
      name: "My base site",
      nature: "AGRICULTURAL_OPERATION",
      agriculturalOperationActivity: "CATTLE_FARMING",
      isSiteOperated: true,
      surfaceArea: 50000,
      soilsDistribution: {
        BUILDINGS: 20000,
        MINERAL_SOIL: 20000,
        PRAIRIE_TREES: 0,
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
      ownerName: "Mairie de Blajan",
      ownerStructureType: "company",
      tenantName: "Current tenant",
      yearlyExpenses: [
        { amount: 54000, bearer: "tenant", purpose: "rent" },
        { amount: 11600, bearer: "tenant", purpose: "otherOperationsCosts" },
        { amount: 500, bearer: "tenant", purpose: "taxes" },
      ],
      yearlyIncomes: [],
      isExpressSite: false,
    } as const;

    const projectQuery = new InMemoryReconversionProjectImpactsQuery();
    projectQuery._setData({ ...reconversionProjectImpactDataView, reinstatementExpenses: [] });
    const siteQuery = new InMemorySiteImpactsQuery();
    siteQuery._setData(site);

    const usecase = new ComputeProjectUrbanSprawlImpactsComparisonUseCase(
      projectQuery,
      siteQuery,
      new InMemoryCityStatsQuery(),
      new InMemoryCityRuralityQuery(),
      new FakeGetSoilsCarbonStorageService(),
      dateProvider,
    );
    const result = await usecase.execute({
      reconversionProjectId: reconversionProjectImpactDataView.id,
      evaluationPeriodInYears,
      comparisonSiteNature: "FRICHE",
    });

    assert.strictEqual(result.isSuccess(), true);
    const data = (result as SuccessResult<UrbanSprawlImpactsComparisonResultDto>).getData();

    assert.ok(
      data.projectEconomicBalance.details.find(({ name }) => name === "siteReinstatement") !==
        undefined,
    );

    const avoidedRoadsConstructionTotal = data.projectOnSimulationSiteImpactsData.details.find(
      ({ name }) => name === "avoidedRoadsAndUtilitiesConstructionExpenses",
    )?.total;
    assert.ok(avoidedRoadsConstructionTotal !== undefined && avoidedRoadsConstructionTotal > 0);

    const avoidedRoadsMaintenanceTotal = data.projectOnSimulationSiteImpactsData.details.find(
      ({ name }) => name === "avoidedRoadsAndUtilitiesMaintenanceExpenses",
    )?.total;
    assert.ok(avoidedRoadsMaintenanceTotal !== undefined && avoidedRoadsMaintenanceTotal > 0);

    assert.strictEqual(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "fricheRoadsAndUtilitiesExpenses",
      ),
      undefined,
    );

    const projectedRentalIncomeTotal = data.projectOnSimulationSiteImpactsData.details.find(
      ({ name }) => name === "projectedRentalIncome",
    )?.total;
    assert.ok(
      projectedRentalIncomeTotal !== undefined &&
        Math.abs(projectedRentalIncomeTotal - 82688) < 0.5,
    );
  });
});
