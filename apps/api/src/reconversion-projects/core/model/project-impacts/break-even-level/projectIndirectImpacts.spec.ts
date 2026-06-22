import { sumList } from "shared";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import {
  getProjectMetricsAndEconomicImpacts,
  computeCumulativeByYear,
  InputReconversionProjectData,
  InputSiteData,
} from "./projectIndirectImpacts";

const baseProject: InputReconversionProjectData = {
  operationsFirstYear: 2025,
  soilsDistribution: [],
  decontaminatedSoilSurface: 0,
  yearlyProjectedExpenses: [],
  reinstatementExpenses: [],
  developmentPlan: {
    type: "PHOTOVOLTAIC_POWER_PLANT",
    features: {
      expectedAnnualProduction: 500,
      electricalPowerKWc: 2,
      contractDuration: 25,
      surfaceArea: 10_000,
    },
  },
};

const baseSite: InputSiteData = {
  nature: "NATURAL_AREA",
  isSiteOperated: false,
  yearlyExpenses: [],
  yearlyIncomes: [],
  ownerName: "Propriétaire",
  soilsDistribution: {},
  surfaceArea: 10_000,
};

const siteCityData = {
  citySquareMetersSurfaceArea: 5_000_000,
  cityPopulation: 50_000,
  cityPropertyValuePerSquareMeter: 2_500,
};

describe("computeCumulativeByYear", () => {
  it("returns empty array", () => {
    expect(computeCumulativeByYear([])).toEqual([]);
  });

  it("computes cumulative impacts by year", () => {
    expect(computeCumulativeByYear([10, 20, 30])).toEqual([10, 30, 60]);
  });

  it("computes cumulative impacts by year with negative values", () => {
    expect(computeCumulativeByYear([-100, -100, -100])).toEqual([-100, -200, -300]);
  });

  it("computes cumulative impacts by year with only 1 element in array", () => {
    expect(computeCumulativeByYear([42])).toEqual([42]);
  });

  it("computes cumulative impacts by year with negative and positive values", () => {
    expect(computeCumulativeByYear([100, -50, 30])).toEqual([100, 50, 80]);
  });
});

describe("getProjectMetricsAndEconomicImpacts", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof vi.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = vi.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  describe("minimal project", () => {
    it("returns economicImpacts total rounded as integer", () => {
      const result = getProjectMetricsAndEconomicImpacts({
        reconversionProject: baseProject,
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(Number.isInteger(result.economicImpacts.total)).toBe(true);
    });

    it("returns total and details array", () => {
      const result = getProjectMetricsAndEconomicImpacts({
        reconversionProject: baseProject,
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result.economicImpacts).toHaveProperty("total");
      expect(result.economicImpacts).toHaveProperty("details");
      expect(Array.isArray(result.economicImpacts.details)).toBe(true);
    });
  });

  // ── Droits de mutation ────────────────────────────────────────────────────
  describe("with propertyTransferDutiesIncome", () => {
    it("adds propertyTransferDutiesIncome if there is site purchase or site or buildings resales", () => {
      const result = getProjectMetricsAndEconomicImpacts({
        reconversionProject: {
          ...baseProject,
          sitePurchasePropertyTransferDutiesAmount: 10_000,
        },
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(
        result.economicImpacts.details.find((d) => d.name === "propertyTransferDutiesIncome"),
      ).toBeDefined();

      expect(
        getProjectMetricsAndEconomicImpacts({
          reconversionProject: {
            ...baseProject,
            siteResaleExpectedPropertyTransferDutiesAmount: 10_000,
          },
          relatedSite: baseSite,
          siteCityData,
          sumOnEvolutionPeriodService: mockService,
        }).economicImpacts.details.find((d) => d.name === "propertyTransferDutiesIncome"),
      ).toBeDefined();

      expect(
        getProjectMetricsAndEconomicImpacts({
          reconversionProject: {
            ...baseProject,
            buildingsResaleExpectedPropertyTransferDutiesAmount: 10_000,
          },
          relatedSite: baseSite,
          siteCityData,
          sumOnEvolutionPeriodService: mockService,
        }).economicImpacts.details.find((d) => d.name === "propertyTransferDutiesIncome"),
      ).toBeDefined();
    });

    it("excludes propertyTransferDutiesIncome if there is no site purchase nor site or buildings resales", () => {
      const result = getProjectMetricsAndEconomicImpacts({
        reconversionProject: {
          ...baseProject,
          sitePurchasePropertyTransferDutiesAmount: 0,
          siteResaleExpectedPropertyTransferDutiesAmount: undefined,
        },
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(
        result.economicImpacts.details.find((d) => d.name === "propertyTransferDutiesIncome"),
      ).toBeUndefined();
    });

    it("sums purchase and resale transfer duties income", () => {
      const result = getProjectMetricsAndEconomicImpacts({
        reconversionProject: {
          ...baseProject,
          sitePurchasePropertyTransferDutiesAmount: 5_000,
          siteResaleExpectedPropertyTransferDutiesAmount: 3_000,
          buildingsResaleExpectedPropertyTransferDutiesAmount: 2_000,
        },
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      const dutyCall = getWeightedYearlyValuesSpy.mock.calls.find(
        ([value, _w, opts]) => value === 10_000 && opts?.endYearIndex === 1,
      );
      expect(dutyCall).toBeDefined();
      expect(
        result.economicImpacts.details.find(({ name }) => name === "propertyTransferDutiesIncome")
          ?.total,
      ).toEqual(10_000);
    });
  });

  // ── Projet photovoltaïque ─────────────────────────────────────────────────
  describe("PHOTOVOLTAIC_POWER_PLANT project", () => {
    it("adds avoidedCo2eqWithEnergyProduction if expectedAnnualProduction > 0", () => {
      const result = getProjectMetricsAndEconomicImpacts({
        reconversionProject: baseProject,
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(
        result.economicImpacts.details.find((d) => d.name === "avoidedCo2eqWithEnergyProduction"),
      ).toBeDefined();

      expect(
        result.impactMetrics.find((d) => d.name === "avoidedCO2TonsWithEnergyProduction"),
      ).toBeDefined();
    });
  });

  // ── Projet urbain ──────────────────────────────────────────────────────────
  describe("URBAN_PROJECT project", () => {
    it("adds projectNewHousesTaxesIncome if buildingsFloorAreaDistribution.RESIDENTIAL > 0", () => {
      const result = getProjectMetricsAndEconomicImpacts({
        reconversionProject: {
          ...baseProject,
          developmentPlan: {
            type: "URBAN_PROJECT" as const,
            features: { buildingsFloorAreaDistribution: { RESIDENTIAL: 5_000 } },
          },
        },
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(
        result.economicImpacts.details.find((d) => d.name === "projectNewHousesTaxesIncome"),
      ).toBeDefined();
    });
  });

  describe("fullTimeJobs impact metrics", () => {
    describe("project of friche", () => {
      it("returns impact over 10 years for full-time jobs in operations and full-time jobs for conversion over 9 months", () => {
        const result = getProjectMetricsAndEconomicImpacts({
          reconversionProject: {
            ...baseProject,
            conversionSchedule: {
              startDate: new Date("2024-01-01"),
              endDate: new Date("2024-09-31"),
            },
            developmentPlan: {
              type: "URBAN_PROJECT" as const,
              features: {
                buildingsFloorAreaDistribution: { RESIDENTIAL: 5_000, LOCAL_STORE: 20000 },
              },
            },
          },
          relatedSite: baseSite,
          siteCityData,
          sumOnEvolutionPeriodService: mockService,
        });
        expect(
          result.impactMetrics.find((item) => item.name === "conversionFullTimeJobs")?.total,
        ).toBeUndefined();
        expect(
          result.impactMetrics.find((item) => item.name === "operationsFullTimeJobs")?.total,
        ).toEqual(880);
        expect(
          result.impactMetrics.find((item) => item.name === "reinstatementFullTimeJobs")?.total,
        ).toBeUndefined();
      });

      it("returns only operationsFullTimeJobs if no schedules are provided", () => {
        const result = getProjectMetricsAndEconomicImpacts({
          reconversionProject: {
            ...baseProject,
            reinstatementExpenses: [
              { amount: 2250000, purpose: "asbestos_removal" },
              { purpose: "remediation", amount: 3300000 },
              { purpose: "demolition", amount: 2250000 },
              { purpose: "deimpermeabilization", amount: 498000 },
              { purpose: "sustainable_soils_reinstatement", amount: 2520000 },
            ],
            developmentPlan: {
              type: "PHOTOVOLTAIC_POWER_PLANT" as const,
              features: {
                expectedAnnualProduction: 100,
                contractDuration: 20,
                electricalPowerKWc: 10000,
                surfaceArea: 10000,
              },
            },
          },
          relatedSite: baseSite,
          siteCityData,
          sumOnEvolutionPeriodService: mockService,
        });
        expect(
          result.impactMetrics.find((item) => item.name === "conversionFullTimeJobs")?.total,
        ).toBeUndefined();
        expect(
          result.impactMetrics.find((item) => item.name === "operationsFullTimeJobs")?.total,
        ).toEqual(2);
        expect(
          result.impactMetrics.find((item) => item.name === "reinstatementFullTimeJobs")?.total,
        ).toBeUndefined();
      });

      it("returns impact computed from default values with schedules", () => {
        const result = getProjectMetricsAndEconomicImpacts({
          reconversionProject: {
            ...baseProject,
            conversionSchedule: {
              startDate: new Date("2024-01-01"),
              endDate: new Date("2025-01-01"),
            },
            reinstatementSchedule: {
              startDate: new Date("2024-01-01"),
              endDate: new Date("2024-06-30"),
            },
            reinstatementExpenses: [
              { amount: 2250000, purpose: "asbestos_removal" },
              { purpose: "remediation", amount: 3300000 },
              { purpose: "demolition", amount: 2250000 },
              { purpose: "deimpermeabilization", amount: 498000 },
              { purpose: "sustainable_soils_reinstatement", amount: 2520000 },
            ],
            developmentPlan: {
              type: "PHOTOVOLTAIC_POWER_PLANT" as const,
              features: {
                expectedAnnualProduction: 10000,
                contractDuration: 20,
                electricalPowerKWc: 10000,
                surfaceArea: 10000,
              },
            },
          },
          relatedSite: {
            ...baseSite,
            surfaceArea: 10000,
          },
          siteCityData,
          sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
            evaluationPeriodInYears: 20,
            operationsFirstYear: 2025,
          }),
        });
        expect(
          result.impactMetrics.find((item) => item.name === "conversionFullTimeJobs")?.total,
        ).toBeCloseTo(0.7, 0);
        expect(
          result.impactMetrics.find((item) => item.name === "operationsFullTimeJobs")?.total,
        ).toBeCloseTo(2, 0);
        expect(
          result.impactMetrics.find((item) => item.name === "reinstatementFullTimeJobs")?.total,
        ).toBeCloseTo(2, 0);
      });
    });
  });

  describe("impacts structure and consistency", () => {
    it("chaque impact contient les propriétés requises", () => {
      const result = getProjectMetricsAndEconomicImpacts({
        reconversionProject: {
          ...baseProject,
          developmentPlan: {
            type: "URBAN_PROJECT" as const,
            features: { buildingsFloorAreaDistribution: { RESIDENTIAL: 5_000 } },
          },
        },
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      result.economicImpacts.details.forEach((item) => {
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("total");
        expect(item).toHaveProperty("detailsByYear");
        expect(item).toHaveProperty("cumulativeByYear");
        expect(Array.isArray(item.detailsByYear)).toBe(true);
        expect(Array.isArray(item.cumulativeByYear)).toBe(true);

        expect(item.total).toEqual(sumList(item.detailsByYear));
      });
    });
  });
});
