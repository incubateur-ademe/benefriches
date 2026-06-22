import assert from "node:assert/strict";
import { describe, it, beforeEach, mock } from "node:test";
import { DevelopmentPlanFeatures, sumList } from "shared";

import { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { InputReconversionProjectData } from "../projectIndirectImpacts";
import { getPhotovoltaicPowerPlantProjectImpacts } from "./photovoltaicRelatedImpacts";

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
  conversionSchedule: undefined,
  reinstatementExpenses: [],
};

describe("getPhotovoltaicPowerPlantProjectImpacts", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof mock.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = mock.fn((value: number, _?: string[]) => [value, value, value]);
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
      assert.strictEqual(result.economicImpacts.length, 0);
      assert.strictEqual(result.impactMetrics.length, 0);
    });
  });

  // ── Cas : impact CO2 évité ────────────────────────────────────────────────
  describe("with expectedAnnualProduction", () => {
    it("computes avoidedCo2eqWithEnergyProduction impact", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: baseProject,
        sumOnEvolutionPeriodService: mockService,
      });

      const co2Impact = result.economicImpacts.find(
        (r) => r.name === "avoidedCo2eqWithEnergyProduction",
      );
      assert.ok(co2Impact !== undefined);
      assert.ok(
        result.impactMetrics.find((r) => r.name === "avoidedCO2TonsWithEnergyProduction") !==
          undefined,
      );
    });

    it("computes avoided CO2eq with co2_value and discount factor", () => {
      getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: baseProject,
        sumOnEvolutionPeriodService: mockService,
      });

      const co2Call = getWeightedYearlyValuesSpy.mock.calls.find((call) => {
        const [_v, weights] = call.arguments as ServiceCall;
        return weights?.includes("co2_value") && weights?.includes("discount");
      });

      assert.ok(co2Call !== undefined);
    });

    it("computes positive avoided co2eq impact", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: baseProject,
        sumOnEvolutionPeriodService: mockService,
      });

      const co2Impact = result.economicImpacts.find(
        (r) => r.name === "avoidedCo2eqWithEnergyProduction",
      );
      assert.ok((co2Impact?.total ?? 0) > 0);
      assert.ok(
        (result.impactMetrics.find((r) => r.name === "avoidedCO2TonsWithEnergyProduction")?.total ??
          0) > 0,
      );
    });

    it("computes householdsPoweredByRenewableEnergy metric impact", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: baseProject,
        sumOnEvolutionPeriodService: mockService,
      });

      assert.ok(
        (result.impactMetrics.find((r) => r.name === "householdsPoweredByRenewableEnergy")?.total ??
          0) > 0,
      );
    });

    it("computes detailsByYear and cumulativeByYear for each impact", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: baseProject,
        sumOnEvolutionPeriodService: mockService,
      });

      result.economicImpacts.forEach((item) => {
        assert.ok(Array.isArray(item.detailsByYear));
        assert.deepStrictEqual(item.total, sumList(item.detailsByYear));
        assert.ok(Array.isArray(item.cumulativeByYear));
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

      const taxesImpact = result.economicImpacts.find(
        (r) => r.name === "projectPhotovoltaicTaxesIncome",
      );
      assert.ok(taxesImpact !== undefined);
    });

    it("do not add projectPhotovoltaicTaxesIncome if no taxes are projected in expenses", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [{ amount: 1_000, purpose: "maintenance" }],
        },
        sumOnEvolutionPeriodService: mockService,
      });

      assert.strictEqual(
        result.economicImpacts.find((r) => r.name === "projectPhotovoltaicTaxesIncome"),
        undefined,
      );
    });

    it("annualize taxes with gdp_evolution and discount", () => {
      getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [{ amount: 3_000, purpose: "taxes" }],
        },
        sumOnEvolutionPeriodService: mockService,
      });

      const taxesCall = getWeightedYearlyValuesSpy.mock.calls.find((call) => {
        const [_v, weights] = call.arguments as ServiceCall;
        return weights?.includes("gdp_evolution") && weights?.includes("discount");
      });

      assert.ok(taxesCall !== undefined);
    });

    it("computes a positive amount of taxes", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [{ amount: 2_000, purpose: "taxes" }],
        },
        sumOnEvolutionPeriodService: mockService,
      });

      const taxesImpact = result.economicImpacts.find(
        (r) => r.name === "projectPhotovoltaicTaxesIncome",
      );
      assert.ok((taxesImpact?.total ?? 0) > 0);
    });
  });

  describe("getPhotovoltaicPowerPlantProjectImpacts returned format", () => {
    it("returns co2 impact without taxes", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: baseProject,
        sumOnEvolutionPeriodService: mockService,
      });
      assert.strictEqual(result.economicImpacts.length, 1);
      assert.strictEqual(result.impactMetrics.length, 2);
    });

    it("returs 2 impacts (CO2 + taxes)", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [{ amount: 1_000, purpose: "taxes" }],
        },
        sumOnEvolutionPeriodService: mockService,
      });

      assert.strictEqual(result.economicImpacts.length, 2);
      assert.strictEqual(result.impactMetrics.length, 2);
    });
  });

  describe("fullTimeJobs impact metrics", () => {
    it("returns impact over 10 years for full-time jobs in operations over 9 months", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          conversionSchedule: {
            startDate: new Date("2024-01-01"),
            endDate: new Date("2024-09-31"),
          },
          developmentPlan: {
            ...baseProject.developmentPlan,
            features: { ...baseProject.developmentPlan.features, electricalPowerKWc: 10000 },
          },
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2025,
        }),
      });

      assert.ok(
        Math.abs(
          (result.impactMetrics.find((d) => d.name === "conversionFullTimeJobs")?.total ?? 0) - 1,
        ) < 0.5,
      );

      assert.deepStrictEqual(
        result.impactMetrics.find((d) => d.name === "operationsFullTimeJobs")?.total,
        2,
      );
    });

    it("returns no jobs impacts if no schedules are provided", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          conversionSchedule: undefined,
          developmentPlan: {
            ...baseProject.developmentPlan,
            features: { ...baseProject.developmentPlan.features, electricalPowerKWc: 10000 },
          },
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2025,
        }),
      });

      assert.strictEqual(
        result.impactMetrics.find((d) => d.name === "conversionFullTimeJobs"),
        undefined,
      );

      assert.deepStrictEqual(
        result.impactMetrics.find((d) => d.name === "operationsFullTimeJobs")?.total,
        2,
      );
    });

    it("returns impact computed from default values with schedules", () => {
      const result = getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...baseProject,
          reinstatementExpenses: [
            { amount: 2250000, purpose: "asbestos_removal" },
            { purpose: "remediation", amount: 3300000 },
            { purpose: "demolition", amount: 2250000 },
            { purpose: "deimpermeabilization", amount: 498000 },
            { purpose: "sustainable_soils_reinstatement", amount: 2520000 },
          ],
          conversionSchedule: {
            startDate: new Date("2024-01-01"),
            endDate: new Date("2025-01-01"),
          },
          reinstatementSchedule: {
            startDate: new Date("2024-01-01"),
            endDate: new Date("2024-06-30"),
          },
          developmentPlan: {
            ...baseProject.developmentPlan,
            features: { ...baseProject.developmentPlan.features, electricalPowerKWc: 10000 },
          },
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 20,
          operationsFirstYear: 2025,
        }),
      });

      assert.ok(
        Math.abs(
          (result.impactMetrics.find((d) => d.name === "conversionFullTimeJobs")?.total ?? 0) - 0.7,
        ) < 0.5,
      );

      assert.ok(
        Math.abs(
          (result.impactMetrics.find((d) => d.name === "operationsFullTimeJobs")?.total ?? 0) - 2,
        ) < 0.5,
      );
    });
  });
});
