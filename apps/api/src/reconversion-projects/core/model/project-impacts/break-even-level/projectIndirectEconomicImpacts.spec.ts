import { sumList } from "shared";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import {
  getProjectIndirectsEconomicImpacts,
  computeCumulativeByYear,
  InputReconversionProjectData,
  InputSiteData,
} from "./projectIndirectEconomicImpacts";

const baseProject: InputReconversionProjectData = {
  operationsFirstYear: 2025,
  soilsDistribution: [],
  decontaminatedSoilSurface: 0,
  yearlyProjectedExpenses: [],
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

describe("getProjectIndirectsEconomicImpacts", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof vi.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = vi.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  describe("minimal project", () => {
    it("returns total rounded as integer", () => {
      const result = getProjectIndirectsEconomicImpacts({
        reconversionProject: baseProject,
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(Number.isInteger(result.total)).toBe(true);
    });

    it("returns total and details array", () => {
      const result = getProjectIndirectsEconomicImpacts({
        reconversionProject: baseProject,
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("details");
      expect(Array.isArray(result.details)).toBe(true);
    });
  });

  // ── Droits de mutation ────────────────────────────────────────────────────
  describe("with propertyTransferDutiesIncome", () => {
    it("adds propertyTransferDutiesIncome if there is site purchase or site or buildings resales", () => {
      const result = getProjectIndirectsEconomicImpacts({
        reconversionProject: {
          ...baseProject,
          sitePurchasePropertyTransferDutiesAmount: 10_000,
        },
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result.details.find((d) => d.name === "propertyTransferDutiesIncome")).toBeDefined();

      expect(
        getProjectIndirectsEconomicImpacts({
          reconversionProject: {
            ...baseProject,
            siteResaleExpectedPropertyTransferDutiesAmount: 10_000,
          },
          relatedSite: baseSite,
          siteCityData,
          sumOnEvolutionPeriodService: mockService,
        }).details.find((d) => d.name === "propertyTransferDutiesIncome"),
      ).toBeDefined();

      expect(
        getProjectIndirectsEconomicImpacts({
          reconversionProject: {
            ...baseProject,
            buildingsResaleExpectedPropertyTransferDutiesAmount: 10_000,
          },
          relatedSite: baseSite,
          siteCityData,
          sumOnEvolutionPeriodService: mockService,
        }).details.find((d) => d.name === "propertyTransferDutiesIncome"),
      ).toBeDefined();
    });

    it("excludes propertyTransferDutiesIncome if there is no site purchase nor site or buildings resales", () => {
      const result = getProjectIndirectsEconomicImpacts({
        reconversionProject: {
          ...baseProject,
          sitePurchasePropertyTransferDutiesAmount: 0,
          siteResaleExpectedPropertyTransferDutiesAmount: undefined,
        },
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result.details.find((d) => d.name === "propertyTransferDutiesIncome")).toBeUndefined();
    });

    it("sums purchase and resale transfer duties income", () => {
      const result = getProjectIndirectsEconomicImpacts({
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
        result.details.find(({ name }) => name === "propertyTransferDutiesIncome")?.total,
      ).toEqual(10_000);
    });
  });

  // ── Projet photovoltaïque ─────────────────────────────────────────────────
  describe("PHOTOVOLTAIC_POWER_PLANT project", () => {
    it("adds avoidedCo2eqWithEnergyProduction if expectedAnnualProduction > 0", () => {
      const result = getProjectIndirectsEconomicImpacts({
        reconversionProject: baseProject,
        relatedSite: baseSite,
        siteCityData,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(
        result.details.find((d) => d.name === "avoidedCo2eqWithEnergyProduction"),
      ).toBeDefined();
    });
  });

  // ── Projet urbain ──────────────────────────────────────────────────────────
  describe("URBAN_PROJECT project", () => {
    it("adds projectNewHousesTaxesIncome if buildingsFloorAreaDistribution.RESIDENTIAL > 0", () => {
      const result = getProjectIndirectsEconomicImpacts({
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

      expect(result.details.find((d) => d.name === "projectNewHousesTaxesIncome")).toBeDefined();
    });
  });

  describe("impacts structure and consistency", () => {
    it("chaque impact contient les propriétés requises", () => {
      const result = getProjectIndirectsEconomicImpacts({
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

      result.details.forEach((item) => {
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
