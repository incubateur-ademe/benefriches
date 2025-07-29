import { ReconversionProjectImpactsDataView, SiteImpactsDataView } from "shared";
import { v4 as uuid } from "uuid";

import { InMemoryCityStatsQuery } from "src/reconversion-projects/adapters/secondary/queries/city-stats/InMemoryCityStatsQuery";
import { InMemoryReconversionProjectImpactsQuery } from "src/reconversion-projects/adapters/secondary/queries/reconversion-project-impacts/InMemoryReconversionProjectImpactsQuery";
import { InMemorySiteImpactsQuery } from "src/reconversion-projects/adapters/secondary/queries/site-impacts/InMemorySiteImpactsQuery";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

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
    installationSchedule: {
      startDate: new Date("2025-06-17"),
      endDate: new Date("2026-06-17"),
    },
    type: "URBAN_PROJECT",
    features: {
      spacesDistribution: {
        BUILDINGS_FOOTPRINT: 4387.5,
        PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 487.5,
        PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: 487.5,
        PRIVATE_GARDEN_AND_GRASS_ALLEYS: 4387.5,
        PUBLIC_GREEN_SPACES: 2250,
        PUBLIC_PARKING_LOT: 1350,
        PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: 150,
        PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: 750,
        PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: 750,
      },
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
  soilsDistribution: {
    BUILDINGS: 4000,
    IMPERMEABLE_SOILS: 2000,
    MINERAL_SOIL: 1000,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 7000,
  },
  yearlyProjectedExpenses: [{ amount: 15000, purpose: "rent" }],
  yearlyProjectedRevenues: [],
  sitePurchaseTotalAmount: 1800000,
  sitePurchasePropertyTransferDutiesAmount: 17400,
  relatedSiteId: "",
  reinstatementExpenses: [{ purpose: "asbestos_removal", amount: 10000 }],
  financialAssistanceRevenues: [],
  reinstatementContractOwnerName: "Mairie de Blajan",
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
    ...projectData.soilsDistribution,
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
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
      );

      const reconversionProjectId = uuid();
      const evaluationPeriodInYears = 10;
      await expect(
        usecase.execute({
          reconversionProjectId,
          evaluationPeriodInYears,
          comparisonSiteNature: "AGRICULTURAL_OPERATION",
        }),
      ).rejects.toThrow(`ReconversionProject with id ${reconversionProjectId} not found`);
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
        soilsDistribution: {},
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
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
      );
      const evaluationPeriodInYears = 10;
      await expect(
        usecase.execute({
          reconversionProjectId,
          evaluationPeriodInYears,
          comparisonSiteNature: "AGRICULTURAL_OPERATION",
        }),
      ).rejects.toThrow(
        `ComputeProjectUrbanSprawlImpactsComparisonUsecase: ReconversionProject with id ${reconversionProjectId} has no development plan`,
      );
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
        soilsDistribution: {},
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
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
      );

      const evaluationPeriodInYears = 10;
      await expect(
        usecase.execute({
          reconversionProjectId,
          evaluationPeriodInYears,
          comparisonSiteNature: "AGRICULTURAL_OPERATION",
        }),
      ).rejects.toThrow(`Site with id ${siteId} not found`);
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
      new FakeGetSoilsCarbonStorageService(),
      dateProvider,
    );
    const result = await usecase.execute({
      reconversionProjectId: projectData.id,
      evaluationPeriodInYears,
      comparisonSiteNature: "AGRICULTURAL_OPERATION",
    });

    expect(result.baseCase.projectImpacts).toBeDefined();
    expect(result.baseCase.statuQuoSiteImpacts).toBeDefined();
    expect(result.comparisonCase.projectImpacts).toBeDefined();
    expect(result.comparisonCase.statuQuoSiteImpacts).toBeDefined();
    expect(result.projectData).toEqual(projectData);

    expect(result.baseCase.comparisonImpacts.economicBalance).toEqual(
      result.baseCase.projectImpacts.economicBalance,
    );
    expect(result.comparisonCase.comparisonImpacts.economicBalance).toEqual(
      result.comparisonCase.projectImpacts.economicBalance,
    );

    expect(result.baseCase.comparisonImpacts.economicBalance.costs.siteReinstatement).toBeDefined();
    expect(
      result.comparisonCase.comparisonImpacts.economicBalance.costs.siteReinstatement,
    ).toBeUndefined();

    // SOCIAL
    expect(result.baseCase.comparisonImpacts.social.accidents).toEqual(
      result.baseCase.projectImpacts.social.accidents,
    );
    expect(result.baseCase.comparisonImpacts.social.avoidedVehiculeKilometers).toEqual(
      result.baseCase.projectImpacts.social.avoidedVehiculeKilometers,
    );
    expect(result.baseCase.comparisonImpacts.social.avoidedTrafficAccidents).toEqual(
      result.baseCase.projectImpacts.social.avoidedTrafficAccidents,
    );
    expect(result.baseCase.comparisonImpacts.social.householdsPoweredByRenewableEnergy).toEqual(
      result.baseCase.projectImpacts.social.householdsPoweredByRenewableEnergy,
    );
    expect(result.baseCase.comparisonImpacts.social.travelTimeSaved).toEqual(
      result.baseCase.projectImpacts.social.travelTimeSaved,
    );
    expect(result.comparisonCase.comparisonImpacts.social.avoidedVehiculeKilometers).toEqual(
      result.comparisonCase.projectImpacts.social.avoidedVehiculeKilometers,
    );
    expect(result.comparisonCase.comparisonImpacts.social.avoidedTrafficAccidents).toEqual(
      result.comparisonCase.projectImpacts.social.avoidedTrafficAccidents,
    );
    expect(
      result.comparisonCase.comparisonImpacts.social.householdsPoweredByRenewableEnergy,
    ).toEqual(result.comparisonCase.projectImpacts.social.householdsPoweredByRenewableEnergy);
    expect(result.comparisonCase.comparisonImpacts.social.travelTimeSaved).toEqual(
      result.comparisonCase.projectImpacts.social.travelTimeSaved,
    );
    expect(result.comparisonCase.comparisonImpacts.social.accidents).toEqual({
      base: 3,
      forecast: 3,
      difference: 0,
      deaths: {
        base: 0,
        difference: 0,
        forecast: 0,
      },
      minorInjuries: {
        base: 1,
        forecast: 1,
        difference: 0,
      },
      severeInjuries: {
        base: 2,
        forecast: 2,
        difference: 0,
      },
    });

    expect(result.comparisonCase.comparisonImpacts.social.fullTimeJobs).toEqual(
      result.comparisonCase.projectImpacts.social.fullTimeJobs,
    );
    // ENVIRONMENTAL
    expect(result.baseCase.comparisonImpacts.environmental.nonContaminatedSurfaceArea).toEqual(
      result.baseCase.projectImpacts.environmental.nonContaminatedSurfaceArea,
    );
    expect(result.baseCase.comparisonImpacts.environmental.avoidedCo2eqEmissions).toEqual(
      result.baseCase.projectImpacts.environmental.avoidedCo2eqEmissions,
    );
    expect(result.baseCase.comparisonImpacts.environmental.permeableSurfaceArea).toEqual({
      base:
        2000 + 1000 + result.baseCase.statuQuoSiteImpacts.environmental.permeableSurfaceArea.total,
      forecast: 8000 + result.baseCase.statuQuoSiteImpacts.environmental.permeableSurfaceArea.total,
      difference: result.baseCase.projectImpacts.environmental.permeableSurfaceArea.difference,
      mineralSoil: {
        base:
          1000 + result.baseCase.statuQuoSiteImpacts.environmental.permeableSurfaceArea.mineralSoil,
        forecast:
          1000 + result.baseCase.statuQuoSiteImpacts.environmental.permeableSurfaceArea.mineralSoil,
        difference:
          result.baseCase.projectImpacts.environmental.permeableSurfaceArea.mineralSoil.difference,
      },
      greenSoil: {
        base:
          2000 + result.baseCase.statuQuoSiteImpacts.environmental.permeableSurfaceArea.greenSoil,
        forecast:
          7000 + result.baseCase.statuQuoSiteImpacts.environmental.permeableSurfaceArea.greenSoil,
        difference:
          result.baseCase.projectImpacts.environmental.permeableSurfaceArea.greenSoil.difference,
      },
    });
    expect(
      result.baseCase.comparisonImpacts.environmental.soilsCarbonStorage?.forecast,
    ).toBeGreaterThan(
      result.baseCase.projectImpacts.environmental.soilsCarbonStorage?.forecast ?? 0,
    );
    expect(
      result.baseCase.comparisonImpacts.environmental.soilsCo2eqStorage?.forecast,
    ).toBeGreaterThan(
      result.baseCase.projectImpacts.environmental.soilsCo2eqStorage?.forecast ?? 0,
    );

    expect(
      result.comparisonCase.comparisonImpacts.environmental.nonContaminatedSurfaceArea?.forecast,
    ).toBeLessThan(
      result.comparisonCase.projectImpacts.environmental.nonContaminatedSurfaceArea?.forecast ?? 0,
    );

    expect(result.comparisonCase.comparisonImpacts.environmental.avoidedCo2eqEmissions).toEqual(
      result.comparisonCase.projectImpacts.environmental.avoidedCo2eqEmissions,
    );
    expect(result.comparisonCase.comparisonImpacts.environmental.permeableSurfaceArea).toEqual({
      base:
        2000 + 1000 + result.baseCase.statuQuoSiteImpacts.environmental.permeableSurfaceArea.total,
      forecast:
        8000 + result.comparisonCase.statuQuoSiteImpacts.environmental.permeableSurfaceArea.total,
      difference:
        result.comparisonCase.projectImpacts.environmental.permeableSurfaceArea.difference,
      mineralSoil: {
        base:
          1000 + result.baseCase.statuQuoSiteImpacts.environmental.permeableSurfaceArea.mineralSoil,
        forecast:
          1000 +
          result.comparisonCase.statuQuoSiteImpacts.environmental.permeableSurfaceArea.mineralSoil,
        difference:
          result.comparisonCase.projectImpacts.environmental.permeableSurfaceArea.mineralSoil
            .difference,
      },
      greenSoil: {
        base:
          2000 + result.baseCase.statuQuoSiteImpacts.environmental.permeableSurfaceArea.greenSoil,
        forecast:
          7000 +
          result.comparisonCase.statuQuoSiteImpacts.environmental.permeableSurfaceArea.greenSoil,
        difference:
          result.comparisonCase.projectImpacts.environmental.permeableSurfaceArea.greenSoil
            .difference,
      },
    });
    expect(
      result.comparisonCase.comparisonImpacts.environmental.soilsCarbonStorage?.forecast,
    ).toBeGreaterThan(
      result.comparisonCase.projectImpacts.environmental.soilsCarbonStorage?.forecast ?? 0,
    );
    expect(
      result.comparisonCase.comparisonImpacts.environmental.soilsCo2eqStorage?.forecast,
    ).toBeGreaterThan(
      result.comparisonCase.projectImpacts.environmental.soilsCo2eqStorage?.forecast ?? 0,
    );
    // SOCIO ECONOMIC
    expect(result.baseCase.comparisonImpacts.socioeconomic.impacts.length).toBeGreaterThanOrEqual(
      result.comparisonCase.projectImpacts.socioeconomic.impacts.length,
    );
    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "avoided_friche_costs",
      ),
    ).toEqual(
      result.baseCase.projectImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "avoided_friche_costs",
      ),
    );
    expect(
      result.comparisonCase.comparisonImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "avoided_friche_costs",
      ),
    ).toEqual(
      result.comparisonCase.projectImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "avoided_friche_costs",
      ),
    );

    expect(
      result.comparisonCase.comparisonImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "statu_quo_friche_costs",
      ),
    ).toBeDefined();

    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "rental_income",
      ),
    ).toEqual([
      {
        actor: "Current owner",
        amount: 74419,
        details: [
          {
            amount: 74419,
            impact: "project_rental_income",
          },
        ],
        impact: "rental_income",
        impactCategory: "economic_direct",
      },
      {
        actor: "Mairie de Blajan",
        amount: 1505,
        details: [
          {
            amount: 1505,
            impact: "site_statu_quo_rental_income",
          },
        ],
        impact: "rental_income",
        impactCategory: "economic_direct",
      },
    ]);
    expect(
      result.comparisonCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "rental_income",
      ),
    ).toEqual([
      {
        actor: "Mairie de Blajan",
        amount: 122527,
        details: [
          {
            amount: 122527,
            impact: "project_rental_income",
          },
        ],
        impact: "rental_income",
        impactCategory: "economic_direct",
      },
      {
        actor: "Current owner",
        amount: 49613,
        details: [
          {
            amount: 49613,
            impact: "site_statu_quo_rental_income",
          },
        ],
        impact: "rental_income",
        impactCategory: "economic_direct",
      },
    ]);

    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "taxes_income",
      ),
    ).toEqual({
      actor: "community",
      amount: 790088,
      details: [
        {
          amount: 194032,
          impact: "project_new_houses_taxes_income",
        },
        {
          amount: 595807,
          impact: "project_new_company_taxation_income",
        },
        {
          amount: 249,
          impact: "site_statu_quo_taxes",
        },
      ],
      impact: "taxes_income",
      impactCategory: "economic_indirect",
    });

    expect(
      result.comparisonCase.comparisonImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "taxes_income",
      ),
    ).toEqual({
      actor: "community",
      amount: 794290,
      details: [
        {
          amount: 194032,
          impact: "project_new_houses_taxes_income",
        },
        {
          amount: 595807,
          impact: "project_new_company_taxation_income",
        },
        {
          amount: 4451,
          impact: "site_statu_quo_property_taxes",
        },
      ],
      impact: "taxes_income",
      impactCategory: "economic_indirect",
    });

    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "water_regulation",
      )?.amount,
    ).toEqual(
      result.baseCase.projectImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "water_regulation",
      )?.amount ?? 0,
    );

    expect(
      result.comparisonCase.comparisonImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "water_regulation",
      )?.amount,
    ).toBeLessThan(
      result.comparisonCase.projectImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "water_regulation",
      )?.amount ?? 0,
    );

    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "ecosystem_services",
      )?.amount,
    ).toBeGreaterThan(
      result.baseCase.projectImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "ecosystem_services",
      )?.amount ?? 0,
    );

    expect(
      result.comparisonCase.comparisonImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "ecosystem_services",
      )?.amount,
    ).toBeGreaterThan(
      result.comparisonCase.projectImpacts.socioeconomic.impacts.find(
        ({ impact }) => impact === "ecosystem_services",
      )?.amount ?? 0,
    );

    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "avoided_roads_and_utilities_construction_expenses",
      ),
    ).toEqual([
      {
        actor: "Mairie de Blajan",
        amount: 120805,
        impact: "avoided_roads_and_utilities_construction_expenses",
        impactCategory: "economic_direct",
      },
    ]);

    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "avoided_roads_and_utilities_maintenance_expenses",
      ),
    ).toEqual([
      {
        actor: "community",
        amount: 203038,
        impact: "avoided_roads_and_utilities_maintenance_expenses",
        impactCategory: "economic_indirect",
      },
    ]);

    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "roads_and_utilities_construction_expenses",
      ),
    ).toEqual([]);
    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "roads_and_utilities_maintenance_expenses",
      ),
    ).toEqual([]);

    expect(
      result.comparisonCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "roads_and_utilities_construction_expenses",
      ),
    ).toEqual([
      {
        actor: "Mairie de Blajan",
        amount: -120805,
        impact: "roads_and_utilities_construction_expenses",
        impactCategory: "economic_direct",
      },
    ]);

    expect(
      result.comparisonCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "roads_and_utilities_maintenance_expenses",
      ),
    ).toEqual([
      {
        actor: "community",
        amount: -203038,
        impact: "roads_and_utilities_maintenance_expenses",
        impactCategory: "economic_indirect",
      },
    ]);

    expect(
      result.comparisonCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "avoided_roads_and_utilities_construction_expenses",
      ),
    ).toEqual([]);
    expect(
      result.comparisonCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "avoided_roads_and_utilities_maintenance_expenses",
      ),
    ).toEqual([]);
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
      soilsCarbonStorageService,
      dateProvider,
    );
    const result = await usecase.execute({
      reconversionProjectId: projectData.id,
      evaluationPeriodInYears,
      comparisonSiteNature: "NATURAL_AREA",
    });
    expect(result.projectData.id).toEqual(projectData.id);
    expect(result.baseCase.projectImpacts.environmental.soilsCo2eqStorage).toEqual(undefined);
    expect(result.baseCase.comparisonImpacts.environmental.soilsCo2eqStorage).toEqual(undefined);
    expect(result.comparisonCase.projectImpacts.environmental.soilsCo2eqStorage).toEqual(undefined);
    expect(result.comparisonCase.comparisonImpacts.environmental.soilsCo2eqStorage).toEqual(
      undefined,
    );
    expect(result.comparisonCase.comparisonImpacts.socioeconomic.impacts.length > 0).toBeTruthy();
  });

  it("compares photovoltaic project on agricultural site with project on friche", async () => {
    const evaluationPeriodInYears = 10;
    const reconversionProjectImpactDataView = {
      id: uuid(),
      name: "Project with big impacts",
      relatedSiteId: uuid(),
      isExpressProject: false,
      soilsDistribution: {
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
        PRAIRIE_TREES: 20000,
        BUILDINGS: 20000,
        MINERAL_SOIL: 20000,
        IMPERMEABLE_SOILS: 30000,
      },
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
        ...reconversionProjectImpactDataView.soilsDistribution,
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
      new FakeGetSoilsCarbonStorageService(),
      dateProvider,
    );
    const result = await usecase.execute({
      reconversionProjectId: reconversionProjectImpactDataView.id,
      evaluationPeriodInYears,
      comparisonSiteNature: "FRICHE",
    });

    expect(
      result.baseCase.comparisonImpacts.economicBalance.costs.siteReinstatement,
    ).toBeUndefined();
    expect(
      result.comparisonCase.comparisonImpacts.economicBalance.costs.siteReinstatement,
    ).toBeDefined();

    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "roads_and_utilities_construction_expenses",
      ),
    ).toEqual([
      {
        actor: "Mairie de Blajan",
        amount: -431445,
        impact: "roads_and_utilities_construction_expenses",
        impactCategory: "economic_direct",
      },
    ]);

    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "roads_and_utilities_maintenance_expenses",
      ),
    ).toEqual([
      {
        actor: "community",
        amount: -725135,
        impact: "roads_and_utilities_maintenance_expenses",
        impactCategory: "economic_indirect",
      },
    ]);

    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "avoided_roads_and_utilities_construction_expenses",
      ),
    ).toEqual([]);
    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "avoided_roads_and_utilities_maintenance_expenses",
      ),
    ).toEqual([]);

    expect(
      result.baseCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "rental_income",
      ),
    ).toEqual([
      {
        actor: "Mairie de Blajan",
        amount: -363827,
        details: [
          {
            amount: -363827,
            impact: "project_rental_income",
          },
        ],
        impact: "rental_income",
        impactCategory: "economic_direct",
      },
    ]);

    expect(
      result.comparisonCase.comparisonImpacts.socioeconomic.impacts.filter(
        ({ impact }) => impact === "rental_income",
      ),
    ).toEqual([
      {
        actor: "Mairie de Blajan",
        amount: 446515,
        details: [
          {
            amount: 446515,
            impact: "site_statu_quo_rental_income",
          },
        ],
        impact: "rental_income",
        impactCategory: "economic_direct",
      },
    ]);
  });
});
