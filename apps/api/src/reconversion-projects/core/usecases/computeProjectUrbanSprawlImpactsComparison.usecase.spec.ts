import {
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
  UrbanSprawlImpactsComparisonResultDto,
} from "shared";
import { v4 as uuid } from "uuid";

import { InMemoryReconversionProjectImpactsQuery } from "src/reconversion-projects/adapters/secondary/queries/reconversion-project-impacts/InMemoryReconversionProjectImpactsQuery";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { SuccessResult, FailureResult } from "src/shared-kernel/result";
import { InMemorySiteImpactsQuery } from "src/sites/adapters/secondary/site-impacts/InMemorySiteImpactsQuery";
import { InMemoryCityRuralityQuery } from "src/territory/adapters/secondary/city-rurality-query/InMemoryCityRuralityQuery";
import { InMemoryCityStatsQuery } from "src/territory/adapters/secondary/city-stats-query/InMemoryCityStatsQuery";

import { FakeGetSoilsCarbonStorageService } from "../gateways/FakeGetSoilsCarbonStorageService";
import { Schedule } from "../model/reconversionProject";
import { ComputeProjectUrbanSprawlImpactsComparisonUseCase } from "./computeProjectUrbanSprawlImpactsComparison.usecase";
import { ApiReconversionProjectImpactsDataView } from "./computeReconversionProjectImpacts.usecase";

const projectData: ReconversionProjectImpactsDataView<Schedule> = {
  id: "bf8a7d1d-a9d2-4a66-b2bc-3b8d682f9932",
  name: "Centralité urbaine",
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

      expect(result.isFailure()).toBe(true);
      expect((result as FailureResult).getError()).toBe("ReconversionProjectNotFound");
    });

    it("throws error when reconversion project development plan does not exist", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      projectQuery._setData({
        id: reconversionProjectId,
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

      expect(result.isFailure()).toBe(true);
      expect((result as FailureResult).getError()).toBe("NoDevelopmentPlanType");
    });

    it("throws error when reconversion project related site does not exist", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      projectQuery._setData({
        id: reconversionProjectId,
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

      expect(result.isFailure()).toBe(true);
      expect((result as FailureResult).getError()).toBe("SiteNotFound");
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

    expect(result.isSuccess()).toBe(true);
    const data = (result as SuccessResult<UrbanSprawlImpactsComparisonResultDto>).getData();

    expect(data.cumulativeBalanceByYear).toBeDefined();
    expect(data.operationsFirstYear).toBeDefined();
    expect(data.projectEconomicBalance).toBeDefined();
    expect(data.projectOnSimulationSiteImpactsData).toBeDefined();
    expect(data.projectionYears).toBeDefined();
    expect(data.simulationSiteData).toBeDefined();
    expect(data.simulationSiteStatuQuoImpactsData).toBeDefined();
    expect(data.stakeholders).toBeDefined();

    expect(
      data.simulationSiteStatuQuoImpactsData.details.find(
        ({ name }) => name === "fricheMaintenanceAndSecuringCostsForOwner",
      ),
    ).toBeUndefined();

    expect(
      data.simulationSiteStatuQuoImpactsData.details.find(({ name }) => name === "rentalIncome")
        ?.total,
    ).toBeCloseTo(1505, 0);

    expect(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "projectedRentalIncome",
      )?.total,
    ).toBeCloseTo(124032, 0);

    expect(data.stakeholders.current.owner).toEqual({
      structureType: "municipality",
      structureName: "Mairie de Blajan",
    });

    expect(data.stakeholders.future.owner).toEqual({
      structureType: "company",
      structureName: "Futur proprio",
    });

    expect(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "projectNewHousesTaxesIncome",
      )?.total,
    ).toBeCloseTo(194032, 0);

    expect(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "projectNewCompanyTaxationIncome",
      )?.total,
    ).toBeCloseTo(595807, 0);

    expect(
      data.simulationSiteStatuQuoImpactsData.details.find(({ name }) => name === "taxesIncome")
        ?.total,
    ).toBeCloseTo(258, 0);

    expect(
      data.projectOnSimulationSiteImpactsData.details.find(({ name }) => name === "waterRegulation")
        ?.total,
    ).toBeLessThan(
      data.simulationSiteStatuQuoImpactsData.details.find(({ name }) => name === "waterRegulation")
        ?.total ?? 0,
    );

    expect(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "invasiveSpeciesRegulation",
      )?.total ?? 0,
    ).toBeLessThan(
      data.simulationSiteStatuQuoImpactsData.details.find(
        ({ name }) => name === "invasiveSpeciesRegulation",
      )?.total ?? 0,
    );

    expect(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "avoidedRoadsAndUtilitiesConstructionExpenses",
      )?.total,
    ).toBeCloseTo(-120805, 0);

    expect(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "avoidedRoadsAndUtilitiesMaintenanceExpenses",
      )?.total,
    ).toBeCloseTo(-203038, 0);

    expect(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "fricheRoadsAndUtilitiesExpenses",
      ),
    ).toBeUndefined();
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

    expect(result.isSuccess()).toBe(true);
    const data = (result as SuccessResult<UrbanSprawlImpactsComparisonResultDto>).getData();

    expect(data.projectOnSimulationSiteImpactsData.details.length > 0).toBeTruthy();
    expect(
      data.projectOnSimulationSiteImpactsData.details.find(({ name }) => name === "newStoredCo2Eq"),
    ).toEqual(undefined);
    expect(data.simulationSiteStatuQuoImpactsData).toBeDefined();
  });

  it("compares photovoltaic project on agricultural site with project on friche", async () => {
    const evaluationPeriodInYears = 10;
    const reconversionProjectImpactDataView = {
      id: uuid(),
      name: "Project with big impacts",
      relatedSiteId: uuid(),
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

    expect(result.isSuccess()).toBe(true);
    const data = (result as SuccessResult<UrbanSprawlImpactsComparisonResultDto>).getData();

    expect(
      data.projectEconomicBalance.details.find(({ name }) => name === "siteReinstatement"),
    ).toBeDefined();

    expect(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "avoidedRoadsAndUtilitiesConstructionExpenses",
      )?.total,
    ).toBeGreaterThan(0);

    expect(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "avoidedRoadsAndUtilitiesMaintenanceExpenses",
      )?.total,
    ).toBeGreaterThan(0);

    expect(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "fricheRoadsAndUtilitiesExpenses",
      ),
    ).toBeUndefined();

    expect(
      data.projectOnSimulationSiteImpactsData.details.find(
        ({ name }) => name === "projectedRentalIncome",
      )?.total,
    ).toBeCloseTo(82688, 0);
  });
});
