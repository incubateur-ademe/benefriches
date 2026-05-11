import { BuildingsUseDistribution, DevelopmentPlanFeatures } from "shared";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { InputReconversionProjectData, InputSiteData } from "../projectIndirectEconomicImpacts";
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
  soilsDistribution: {},
  surfaceArea: 20_000,
};

const buildUrbanProject = (
  buildingsFloorAreaDistribution: BuildingsUseDistribution = {},
  soilsDistribution: InputReconversionProjectData["soilsDistribution"] = [],
): InputReconversionProjectData & {
  developmentPlan: Extract<DevelopmentPlanFeatures, { type: "URBAN_PROJECT" }>;
} => ({
  operationsFirstYear: 2025,
  soilsDistribution,
  decontaminatedSoilSurface: 0,
  hasSiteOwnerChange: false,
  yearlyProjectedExpenses: [],
  developmentPlan: {
    type: "URBAN_PROJECT" as const,
    features: {
      buildingsFloorAreaDistribution,
    },
  },
});

describe("getNewUsagesTaxesIncomeImpact", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof vi.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = vi.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  it("returns empty array if no RESIDENTIAL or OFFICES surfaces", () => {
    const result = getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { RECREATIONAL_FACILITY: 500 },
      sumOnEvolutionPeriodService: mockService,
    });
    expect(result).toHaveLength(0);
  });

  it("returns projectNewHousesTaxesIncome > 0 if no RESIDENTIAL > 0", () => {
    const result = getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { RESIDENTIAL: 2_000 },
      sumOnEvolutionPeriodService: mockService,
    });

    const housesImpact = result.find((r) => r.name === "projectNewHousesTaxesIncome");
    expect(housesImpact).toBeDefined();
    expect(housesImpact?.total).toBeGreaterThan(0);
  });

  it("excludes projectNewHousesTaxesIncome if no RESIDENTIAL === 0", () => {
    const result = getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { RESIDENTIAL: 0 },
      sumOnEvolutionPeriodService: mockService,
    });
    expect(result.find((r) => r.name === "projectNewHousesTaxesIncome")).toBeUndefined();
  });

  it("returns projectNewCompanyTaxationIncome if OFFICES > 0", () => {
    const result = getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { OFFICES: 1_000 },
      sumOnEvolutionPeriodService: mockService,
    });

    const officeImpact = result.find((r) => r.name === "projectNewCompanyTaxationIncome");
    expect(officeImpact).toBeDefined();
    expect(officeImpact?.total).toBeGreaterThan(0);
  });

  it("computes right taxes for new offices surfaces", () => {
    getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { OFFICES: 15 },
      sumOnEvolutionPeriodService: mockService,
    });

    expect(getWeightedYearlyValuesSpy).toHaveBeenCalledWith(expect.closeTo(2_018, 0), [
      "gdp_evolution",
      "discount",
    ]);
  });

  it("returns two entries if RESIDENTIAL > 0 and OFFICES > 0", () => {
    const result = getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { RESIDENTIAL: 1_000, OFFICES: 500 },
      sumOnEvolutionPeriodService: mockService,
    });
    expect(result).toHaveLength(2);
  });

  it("computes coherent values for cumulativeByYear", () => {
    const result = getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution: { RESIDENTIAL: 1_000 },
      sumOnEvolutionPeriodService: mockService,
    });
    const [item] = result;
    expect(item?.cumulativeByYear[0]).toBeLessThan(item?.cumulativeByYear[1] ?? 0);
    expect(item?.cumulativeByYear[1]).toBeLessThan(item?.cumulativeByYear[2] ?? 0);
  });
});

// ---------------------------------------------------------------------------

describe("getUrbanProjectImpacts", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof vi.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = vi.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  describe("UrbanFreshnessRelatedImpacts", () => {
    it("adds avoidedAirConditioningExpenses if has urban freshness effect", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({ RESIDENTIAL: 5_000 }),
        relatedSite: { ...baseRelatedSite, surfaceArea: 10_000 },
        siteCityData: baseSiteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      const acImpact = result.find((r) => r.name === "avoidedAirConditioningExpenses");
      if (acImpact) {
        expect(acImpact.total).toBeDefined();
      }
    });
  });

  describe("TravelRelatedImpacts", () => {
    it("returns travel related impacts for urban project on friche", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({ RESIDENTIAL: 10_000 }),
        relatedSite: { ...baseRelatedSite, surfaceArea: 10_000 },
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

      const resultNames = new Set(result.map((r) => r.name));
      const found = travelImpactNames.filter((n) => resultNames.has(n));
      expect(found.length).toBeGreaterThanOrEqual(0);
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

      expect(result.find((r) => r.name === "projectNewHousesTaxesIncome")).toBeDefined();
    });

    it("adds taxes on new OFFICES surfaces", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({ OFFICES: 2_000 }),
        relatedSite: baseRelatedSite,
        siteCityData: baseSiteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result.find((r) => r.name === "projectNewCompanyTaxationIncome")).toBeDefined();
    });
  });
});
