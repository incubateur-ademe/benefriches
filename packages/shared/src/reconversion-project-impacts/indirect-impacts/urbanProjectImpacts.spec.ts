import assert from "node:assert/strict";
import { describe, it, beforeEach, mock } from "node:test";
import {
  BuildingsUseDistribution,
  DevelopmentPlanFeatures,
  ProjectOnSiteImpactMetric,
  ReconversionProjectOnSiteIndirectEconomicImpact,
} from "shared";

import type { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { InputReconversionProjectData, InputSiteData } from "./projectIndirectImpacts";
import { getUrbanProjectImpacts, getNewUsagesTaxesIncomeImpact } from "./urbanProjectImpacts";

const baseSiteCityData = {
  citySquareMetersSurfaceArea: 10_000_000,
  cityPopulation: 100_000,
  cityPropertyValuePerSquareMeter: 3_000,
};

const baseRelatedSite: InputSiteData = {
  nature: "FRICHE" as const,
  yearlyExpenses: [],
  yearlyIncomes: [],
  ownerName: "Mairie de Blajan",
  soilsDistribution: {
    IMPERMEABLE_SOILS: 20_000,
  },
  surfaceArea: 20_000,
};

const buildUrbanProject = (
  buildingsFloorAreaDistribution: BuildingsUseDistribution = { RESIDENTIAL: 20_000 },
  soilsDistribution: InputReconversionProjectData["soilsDistribution"] = [
    { soilType: "BUILDINGS", surfaceArea: 2_000, spaceCategory: "LIVING_AND_ACTIVITY_SPACE" },
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      surfaceArea: 18_000,
      spaceCategory: "PUBLIC_GREEN_SPACE",
    },
  ],
): InputReconversionProjectData & {
  developmentPlan: Extract<DevelopmentPlanFeatures, { type: "URBAN_PROJECT" }>;
} => ({
  operationsFirstYear: 2025,
  soilsDistribution,
  decontaminatedSoilSurface: 0,
  yearlyProjectedExpenses: [],
  developmentPlan: {
    type: "URBAN_PROJECT" as const,
    features: {
      buildingsFloorAreaDistribution,
    },
  },
  reinstatementExpenses: [],
});

describe("getNewUsagesTaxesIncomeImpact", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof mock.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = mock.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  it("returns empty array if no RESIDENTIAL or OFFICES surfaces", () => {
    const result = getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { RECREATIONAL_FACILITY: 500 },
      sumOnEvolutionPeriodService: mockService,
    });
    assert.strictEqual(result.length, 0);
  });

  it("returns projectNewHousesTaxesIncome > 0 if no RESIDENTIAL > 0", () => {
    const result = getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { RESIDENTIAL: 2_000 },
      sumOnEvolutionPeriodService: mockService,
    });

    const housesImpact = result.find((r) => r.name === "projectNewHousesTaxesIncome");
    assert.ok(housesImpact !== undefined);
    assert.ok(housesImpact.total > 0);
  });

  it("excludes projectNewHousesTaxesIncome if no RESIDENTIAL === 0", () => {
    const result = getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { RESIDENTIAL: 0 },
      sumOnEvolutionPeriodService: mockService,
    });
    assert.strictEqual(
      result.find((r) => r.name === "projectNewHousesTaxesIncome"),
      undefined,
    );
  });

  it("returns projectNewCompanyTaxationIncome if OFFICES > 0", () => {
    const result = getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { OFFICES: 1_000 },
      sumOnEvolutionPeriodService: mockService,
    });

    const officeImpact = result.find((r) => r.name === "projectNewCompanyTaxationIncome");
    assert.ok(officeImpact !== undefined);
    assert.ok(officeImpact.total > 0);
  });

  it("computes right taxes for new offices surfaces", () => {
    getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { OFFICES: 15 },
      sumOnEvolutionPeriodService: mockService,
    });

    const firstArg = getWeightedYearlyValuesSpy.mock.calls[0]?.arguments[0] as number;
    const secondArg = getWeightedYearlyValuesSpy.mock.calls[0]?.arguments[1];
    assert.ok(Math.abs(firstArg - 2_018) < 0.5);
    assert.deepStrictEqual(secondArg, ["gdp_evolution", "discount"]);
  });

  it("returns two entries if RESIDENTIAL > 0 and OFFICES > 0", () => {
    const result = getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { RESIDENTIAL: 1_000, OFFICES: 500 },
      sumOnEvolutionPeriodService: mockService,
    });
    assert.strictEqual(result.length, 2);
  });

  it("computes coherent values for cumulativeByYear", () => {
    const result = getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { RESIDENTIAL: 1_000 },
      sumOnEvolutionPeriodService: mockService,
    });
    const [item] = result;
    assert.ok(item !== undefined);
    assert.ok((item.cumulativeByYear[0] ?? 0) < (item.cumulativeByYear[1] ?? 0));
    assert.ok((item.cumulativeByYear[1] ?? 0) < (item.cumulativeByYear[2] ?? 0));
  });
});

// ---------------------------------------------------------------------------

describe("getUrbanProjectImpacts", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof mock.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = mock.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  describe("UrbanFreshnessRelatedImpacts", () => {
    it("adds avoided air conditioning impacts if has urban freshness effect", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({
          RESIDENTIAL: 500,
          LOCAL_STORE: 100,
        }),
        relatedSite: { ...baseRelatedSite, surfaceArea: 15_000 },
        siteCityData: {
          cityPropertyValuePerSquareMeter: 2000,
          citySquareMetersSurfaceArea: 15000000,
          cityPopulation: 18000,
        },
        sumOnEvolutionPeriodService: mockService,
      });

      const acImpact = result.economicImpacts.find(
        (r) => r.name === "avoidedAirConditioningExpenses",
      );
      assert.ok(acImpact !== undefined);
      assert.ok(
        result.impactMetrics.find((r) => r.name === "avoidedAirConditioningCo2eqEmissions") !==
          undefined,
      );
      assert.ok(
        result.economicImpacts.find((r) => r.name === "avoidedAirConditioningCo2eqEmissions") !==
          undefined,
      );
      if (acImpact) {
        assert.ok(acImpact.total !== undefined);
      }
    });

    it("excludes avoided air conditioning impacts if site is not friche has urban freshness effect", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({ RESIDENTIAL: 5_000 }),
        relatedSite: { ...baseRelatedSite, nature: "AGRICULTURAL_OPERATION", surfaceArea: 10_000 },
        siteCityData: baseSiteCityData,
        sumOnEvolutionPeriodService: mockService,
      });
      assert.strictEqual(
        result.economicImpacts.find((r) => r.name === "avoidedAirConditioningExpenses"),
        undefined,
      );
      assert.strictEqual(
        result.economicImpacts.find((r) => r.name === "avoidedAirConditioningCo2eqEmissions"),
        undefined,
      );
      assert.strictEqual(
        result.impactMetrics.find((r) => r.name === "avoidedAirConditioningCo2eqEmissions"),
        undefined,
      );
    });
  });

  describe("TravelRelatedImpacts", () => {
    it("returns travel related impacts for urban project on friche", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({
          RESIDENTIAL: 1600000000,
          OFFICES: 1500,
          LOCAL_STORE: 500,
          ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 200,
        }),
        relatedSite: { ...baseRelatedSite, surfaceArea: 100_000 },
        siteCityData: {
          citySquareMetersSurfaceArea: 6000000000,
          cityPopulation: 300000,
          cityPropertyValuePerSquareMeter: 2000,
        },
        sumOnEvolutionPeriodService: mockService,
      });

      const travelEconomicImpactNames: ReconversionProjectOnSiteIndirectEconomicImpact["name"][] = [
        "avoidedPropertyDamageExpenses",
        "avoidedCarRelatedExpenses",
        "travelTimeSavedPerTravelerExpenses",
        "avoidedTrafficCo2EqEmissions",
        "avoidedAirPollutionHealthExpenses",
        "avoidedAccidentsMinorInjuriesExpenses",
        "avoidedAccidentsSevereInjuriesExpenses",
        "avoidedAccidentsDeathsExpenses",
      ] as const;

      travelEconomicImpactNames.forEach((name) => {
        assert.ok(result.economicImpacts.find((r) => r.name === name) !== undefined);
      });

      const travelImpactMetricNames: ProjectOnSiteImpactMetric["name"][] = [
        "avoidedVehiculeKilometers",
        "avoidedTrafficAccidentsMinorInjuries",
        "avoidedTrafficAccidentsSevereInjuries",
        "avoidedTrafficAccidentsDeaths",
        "avoidedVehiculeKilometers",
        "timeTravelSavedInHours",
      ] as const;

      travelImpactMetricNames.forEach((name) => {
        assert.ok(result.impactMetrics.find((r) => r.name === name) !== undefined);
      });

      const resultNames = new Set(result.economicImpacts.map((r) => r.name));
      const found = travelEconomicImpactNames.filter((n) => resultNames.has(n));
      assert.ok(found.length >= 0);
    });

    it("doesn't return travel related impacts for urban project on non friche site", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({ RESIDENTIAL: 10_000 }),
        relatedSite: { ...baseRelatedSite, nature: "AGRICULTURAL_OPERATION", surfaceArea: 10_000 },
        siteCityData: baseSiteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      const travelImpactNames = [
        "avoidedPropertyDamageExpenses",
        "avoidedCarRelatedExpenses",
        "travelTimeSavedPerTravelerExpenses",
        "avoidedTrafficCo2EqEmissions",
        "avoidedAirPollutionHealthExpenses",
        "avoidedAccidentsMinorInjuriesExpenses",
        "avoidedAccidentsSevereInjuriesExpenses",
        "avoidedAccidentsDeathsExpenses",
      ] as const;

      travelImpactNames.forEach((name) => {
        assert.strictEqual(
          result.economicImpacts.find((r) => r.name === name),
          undefined,
        );
      });

      [
        "avoidedVehiculeKilometers",
        "avoidedTrafficAccidentsMinorInjuries",
        "avoidedTrafficAccidentsSevereInjuries",
        "avoidedTrafficAccidentsDeaths",
        "avoidedVehiculeKilometers",
        "timeTravelSavedInHours",
      ].forEach((name) => {
        assert.strictEqual(
          result.impactMetrics.find((r) => r.name === name),
          undefined,
        );
      });
    });
  });

  describe("projectNewHousesTaxesIncome", () => {
    it("adds taxes on new RESIDENTIAL surfaces", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({ RESIDENTIAL: 3_000 }),
        relatedSite: baseRelatedSite,
        siteCityData: baseSiteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      assert.ok(
        result.economicImpacts.find((r) => r.name === "projectNewHousesTaxesIncome") !== undefined,
      );
    });

    it("adds taxes on new OFFICES surfaces", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({ OFFICES: 2_000 }),
        relatedSite: baseRelatedSite,
        siteCityData: baseSiteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      assert.ok(
        result.economicImpacts.find((r) => r.name === "projectNewCompanyTaxationIncome") !==
          undefined,
      );
    });
  });

  describe("localPropertyValueIncrease", () => {
    it("doesn't add localPropertyValueIncrease impacts if site is not friche", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({ OFFICES: 2_000 }),
        relatedSite: { ...baseRelatedSite, nature: "AGRICULTURAL_OPERATION" },
        siteCityData: baseSiteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      assert.strictEqual(
        result.economicImpacts.find((d) => d.name === "localPropertyValueIncrease"),
        undefined,
      );
    });

    it("add localPropertyValueIncrease for urban project on friche", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({ OFFICES: 2_000 }),
        relatedSite: baseRelatedSite,
        siteCityData: baseSiteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      assert.ok(
        result.economicImpacts.find((d) => d.name === "localPropertyValueIncrease") !== undefined,
      );
    });
  });

  describe("fricheRoadsAndUtilitiesExpenses", () => {
    it("doesn't add fricheRoadsAndUtilitiesExpenses impacts if site is not friche", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({ OFFICES: 2_000 }),
        relatedSite: { ...baseRelatedSite, nature: "AGRICULTURAL_OPERATION" },
        siteCityData: baseSiteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      assert.strictEqual(
        result.economicImpacts.find((d) => d.name === "fricheRoadsAndUtilitiesExpenses"),
        undefined,
      );
    });

    it("add fricheRoadsAndUtilitiesExpenses for urban project on friche", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({ OFFICES: 2_000 }),
        relatedSite: baseRelatedSite,
        siteCityData: baseSiteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      assert.ok(
        result.economicImpacts.find((d) => d.name === "fricheRoadsAndUtilitiesExpenses") !==
          undefined,
      );
    });
  });

  describe("fullTimeJobs impact metrics", () => {
    it("returns impact over 10 years for full-time jobs in operations over 9 months", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: {
          ...buildUrbanProject({
            RESIDENTIAL: 10000,
            LOCAL_STORE: 20000,
          }),
          conversionSchedule: {
            startDate: new Date("2024-01-01"),
            endDate: new Date("2024-09-31"),
          },
        },
        relatedSite: baseRelatedSite,
        siteCityData: baseSiteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      assert.strictEqual(
        result.impactMetrics.find((d) => d.name === "conversionFullTimeJobs")?.total,
        undefined,
      );

      assert.deepStrictEqual(
        result.impactMetrics.find((d) => d.name === "operationsFullTimeJobs")?.total,
        880,
      );
    });
  });
});
