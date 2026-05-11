import { DevelopmentPlanFeatures, sumList } from "shared";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { getPhotovoltaicPowerPlantProjectImpacts } from "../indirect-economic-impacts/photovoltaicRelatedImpacts";
import { InputReconversionProjectData } from "../projectIndirectEconomicImpacts";

type ServiceCall = Parameters<SumOnEvolutionPeriodService["getWeightedYearlyValues"]>;

const basePvDevelopmentPlan = {
  type: "PHOTOVOLTAIC_POWER_PLANT" as const,
  features: {
    expectedAnnualProduction: 1_000, // MWh/an
    surfaceArea: 20_000,
    contractDuration: 20,
    electricalPowerKWc: 50,
  },
};

const baseProject: InputReconversionProjectData & {
  developmentPlan: Extract<DevelopmentPlanFeatures, { type: "PHOTOVOLTAIC_POWER_PLANT" }>;
} = {
  operationsFirstYear: 2025,
  soilsDistribution: [],
  decontaminatedSoilSurface: 0,
  developmentPlan: basePvDevelopmentPlan,
  yearlyProjectedExpenses: [],
  hasSiteOwnerChange: false,
};

describe("getPhotovoltaicPowerPlantProjectImpacts", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof vi.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = vi.fn((value: number, _?: string[]) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  describe("without expectedAnnualProduction", () => {
    it("returns empty array", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          developmentPlan: {
            ...basePvDevelopmentPlan,
            features: { ...basePvDevelopmentPlan.features, expectedAnnualProduction: 0 },
          },
        },
        sumOnEvolutionPeriodService: mockService,
      });
      expect(result).toHaveLength(0);
    });
  });

  // ── Cas : impact CO2 évité ────────────────────────────────────────────────
  describe("with expectedAnnualProduction", () => {
    it("computes avoidedCo2eqWithEnergyProduction impact", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: baseProject,
        sumOnEvolutionPeriodService: mockService,
      });

      const co2Impact = result.find((r) => r.name === "avoidedCo2eqWithEnergyProduction");
      expect(co2Impact).toBeDefined();
    });

    it("computes avoided CO2eq with co2_value and discount factor", () => {
      getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: baseProject,
        sumOnEvolutionPeriodService: mockService,
      });

      const co2Call = (getWeightedYearlyValuesSpy.mock.calls as ServiceCall[]).find(
        ([_v, weights]) => weights.includes("co2_value") && weights.includes("discount"),
      );

      expect(co2Call).toBeDefined();
    });

    it("computes positive avoided co2eq impact", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: baseProject,
        sumOnEvolutionPeriodService: mockService,
      });

      const co2Impact = result.find((r) => r.name === "avoidedCo2eqWithEnergyProduction");
      expect(co2Impact?.total).toBeGreaterThan(0);
    });

    it("computes detailsByYear and cumulativeByYear for each impact", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: baseProject,
        sumOnEvolutionPeriodService: mockService,
      });

      result.forEach((item) => {
        expect(Array.isArray(item.detailsByYear)).toBe(true);
        expect(item.total).toEqual(sumList(item.detailsByYear));
        expect(Array.isArray(item.cumulativeByYear)).toBe(true);
      });
    });
  });

  // ── Taxes photovoltaïques ─────────────────────────────────────────────────
  describe("taxes", () => {
    it("adds projectPhotovoltaicTaxesIncome if taxes are projected in expenses", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [{ amount: 5_000, purpose: "taxes" }],
        },
        sumOnEvolutionPeriodService: mockService,
      });

      const taxesImpact = result.find((r) => r.name === "projectPhotovoltaicTaxesIncome");
      expect(taxesImpact).toBeDefined();
    });

    it("do not add projectPhotovoltaicTaxesIncome if no taxes are projected in expenses", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [{ amount: 1_000, purpose: "maintenance" }],
        },
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result.find((r) => r.name === "projectPhotovoltaicTaxesIncome")).toBeUndefined();
    });

    it("annualize taxes with gdp_evolution and discount", () => {
      getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [{ amount: 3_000, purpose: "taxes" }],
        },
        sumOnEvolutionPeriodService: mockService,
      });

      const taxesCall = (getWeightedYearlyValuesSpy.mock.calls as ServiceCall[]).find(
        ([_v, weights]) => weights.includes("gdp_evolution") && weights.includes("discount"),
      );

      expect(taxesCall).toBeDefined();
    });

    it("computes a positive amount of taxes", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [{ amount: 2_000, purpose: "taxes" }],
        },
        sumOnEvolutionPeriodService: mockService,
      });

      const taxesImpact = result.find((r) => r.name === "projectPhotovoltaicTaxesIncome");
      expect(taxesImpact?.total).toBeGreaterThan(0);
    });
  });

  describe("getPhotovoltaicPowerPlantProjectImpacts returned format", () => {
    it("returns co2 impact without taxes", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: baseProject,
        sumOnEvolutionPeriodService: mockService,
      });
      expect(result).toHaveLength(1);
    });

    it("returs 2 impacts (CO2 + taxes)", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [{ amount: 1_000, purpose: "taxes" }],
        },
        sumOnEvolutionPeriodService: mockService,
      });
      expect(result).toHaveLength(2);
    });
  });
});
