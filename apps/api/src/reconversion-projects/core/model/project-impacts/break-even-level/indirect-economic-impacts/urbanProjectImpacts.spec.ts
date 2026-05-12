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

      const acImpact = result.find((r) => r.name === "avoidedAirConditioningExpenses");
      expect(acImpact).toBeDefined();
      expect(result.find((r) => r.name === "avoidedAirConditioningCo2eqEmissions")).toBeDefined();
      if (acImpact) {
        expect(acImpact.total).toBeDefined();
      }
    });

    it("excludes avoidedAirConditioningExpenses if site is not friche has urban freshness effect", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({ RESIDENTIAL: 5_000 }),
        relatedSite: { ...baseRelatedSite, nature: "AGRICULTURAL_OPERATION", surfaceArea: 10_000 },
        siteCityData: baseSiteCityData,
        sumOnEvolutionPeriodService: mockService,
      });
      expect(result.find((r) => r.name === "avoidedAirConditioningExpenses")).toBeUndefined();
      expect(result.find((r) => r.name === "avoidedAirConditioningCo2eqEmissions")).toBeUndefined();
    });
  });

  describe("TravelRelatedImpacts", () => {
    it("returns travel related impacts for urban project on friche", () => {
      const result = getUrbanProjectImpacts({
        reconversionProject: buildUrbanProject({
          RESIDENTIAL: 160000000,
          OFFICES: 1500,
          LOCAL_STORE: 500,
          ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 200,
        }),
        relatedSite: { ...baseRelatedSite, surfaceArea: 10_000 },
        siteCityData: {
          citySquareMetersSurfaceArea: 6000000000,
          cityPopulation: 300000,
          cityPropertyValuePerSquareMeter: 2000,
        },
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
        expect(result.find((r) => r.name === name)).toBeDefined();
      });

      const resultNames = new Set(result.map((r) => r.name));
      const found = travelImpactNames.filter((n) => resultNames.has(n));
      expect(found.length).toBeGreaterThanOrEqual(0);
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
        expect(result.find((r) => r.name === name)).toBeUndefined();
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
