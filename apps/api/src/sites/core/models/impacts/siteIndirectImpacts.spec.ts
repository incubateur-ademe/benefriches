import { FricheCostsIndirectEconomicImpacts } from "shared";

import { SumOnEvolutionPeriodService } from "src/reconversion-projects/core/model/sum-on-evolution-period/SumOnEvolutionPeriodService";

import { getSiteStatuQuoIndirectsImpacts } from "./siteIndirectImpacts";

const makeSumService = (
  params: { evaluationPeriodInYears: number; operationsFirstYear: number } = BASE_PARAMS,
) => new SumOnEvolutionPeriodService(params);

const BASE_PARAMS = {
  evaluationPeriodInYears: 5,
  operationsFirstYear: 2025,
} as const;

describe("getSiteStatuQuoIndirectsImpacts", () => {
  describe("friche – security costs", () => {
    it("computes fricheMaintenanceAndSecuringCostsForTenant for security with tenant bearer", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "FRICHE",
          yearlyExpenses: [{ amount: 11600, bearer: "tenant", purpose: "security" }],
          yearlyIncomes: [],
          soilsDistribution: {},
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: undefined,
          isSiteOperated: false,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      const impact = result.economicImpacts.details.find(
        (d): d is FricheCostsIndirectEconomicImpacts =>
          d.name === "fricheMaintenanceAndSecuringCostsForTenant",
      );
      expect(impact?.details).toEqual("security");
      expect(impact?.total).toBeLessThan(0);
      expect(impact?.detailsByYear[0]).toEqual(-11600);
      const detailsByYear = impact?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        expect(Math.abs(detailsByYear[i] ?? 0)).toBeLessThan(Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = impact?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        expect(Math.abs(cumulativeByYear[i] ?? 0)).toBeGreaterThan(
          Math.abs(cumulativeByYear[i - 1] ?? 0),
        );
      }
    });

    it("computes fricheMaintenanceAndSecuringCostsForOwner for propertyTaxes with owner bearer", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "FRICHE",
          yearlyExpenses: [{ amount: 500, bearer: "owner", purpose: "illegalDumpingCost" }],
          yearlyIncomes: [],
          soilsDistribution: {},
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: undefined,
          isSiteOperated: false,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      const impact = result.economicImpacts.details.find(
        (d): d is FricheCostsIndirectEconomicImpacts =>
          d.name === "fricheMaintenanceAndSecuringCostsForOwner",
      );
      expect(impact?.details).toEqual("illegalDumpingCost");
      expect(impact?.total).toBeLessThan(0);
      expect(impact?.detailsByYear[0]).toEqual(-500);
      const detailsByYear = impact?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        expect(Math.abs(detailsByYear[i] ?? 0)).toBeLessThan(Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = impact?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        expect(Math.abs(cumulativeByYear[i] ?? 0)).toBeGreaterThan(
          Math.abs(cumulativeByYear[i - 1] ?? 0),
        );
      }
    });

    it("does not include costs with amount === 0", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "FRICHE",
          yearlyExpenses: [{ amount: 0, bearer: "tenant", purpose: "security" }],
          yearlyIncomes: [],
          soilsDistribution: {},
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: undefined,
          isSiteOperated: false,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      expect(result.economicImpacts.details).toHaveLength(0);
    });
  });

  it("includes contaminatedSurface metric impact", () => {
    const result = getSiteStatuQuoIndirectsImpacts({
      siteData: {
        nature: "FRICHE",
        yearlyExpenses: [{ amount: 11600, bearer: "tenant", purpose: "security" }],
        yearlyIncomes: [],
        contaminatedSoilSurface: 5000,
        soilsDistribution: {},
        accidentsDeaths: undefined,
        accidentsSevereInjuries: undefined,
        accidentsMinorInjuries: undefined,
        agriculturalOperationActivity: undefined,
        isSiteOperated: false,
        surfaceArea: 1500,
      },
      sumOnEvolutionPeriodService: makeSumService(),
    });

    expect(result.impactMetrics.find((d) => d.name === "contaminatedSurface")?.total).toEqual(5000);
  });

  it("does not includes contaminatedSurface metric impact", () => {
    const result = getSiteStatuQuoIndirectsImpacts({
      siteData: {
        nature: "FRICHE",
        yearlyExpenses: [{ amount: 11600, bearer: "tenant", purpose: "security" }],
        yearlyIncomes: [],
        soilsDistribution: {},
        accidentsDeaths: undefined,
        accidentsSevereInjuries: undefined,
        accidentsMinorInjuries: undefined,
        agriculturalOperationActivity: undefined,
        isSiteOperated: false,
        surfaceArea: 1500,
      },
      sumOnEvolutionPeriodService: makeSumService(),
    });

    expect(result.impactMetrics.find((d) => d.name === "contaminatedSurface")).toBeUndefined();
  });

  describe("friche accidents", () => {
    it("add friche accidents impacts metrics", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "FRICHE",
          yearlyExpenses: [{ amount: 1200, bearer: "owner", purpose: "taxes" }],
          yearlyIncomes: [],
          soilsDistribution: {},
          accidentsDeaths: 1,
          accidentsSevereInjuries: 2,
          accidentsMinorInjuries: 3,
          agriculturalOperationActivity: undefined,
          isSiteOperated: false,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      expect(result.impactMetrics.find((d) => d.name === "fricheAccidentsDeaths")?.total).toEqual(
        1,
      );
      expect(
        result.impactMetrics.find((d) => d.name === "fricheAccidentsMinorInjuries")?.total,
      ).toEqual(3);
      expect(
        result.impactMetrics.find((d) => d.name === "fricheAccidentsSevereInjuries")?.total,
      ).toEqual(2);
    });

    it("does not add friche accidents impacts metrics", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "AGRICULTURAL_OPERATION",
          yearlyExpenses: [{ amount: 1200, bearer: "owner", purpose: "taxes" }],
          yearlyIncomes: [],
          soilsDistribution: {},
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: "FRUITS_AND_OTHER_PERMANENT_CROPS",
          isSiteOperated: true,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      expect(result.impactMetrics.find((d) => d.name === "fricheAccidentsDeaths")).toBeUndefined();
      expect(
        result.impactMetrics.find((d) => d.name === "fricheAccidentsMinorInjuries"),
      ).toBeUndefined();
      expect(
        result.impactMetrics.find((d) => d.name === "fricheAccidentsSevereInjuries"),
      ).toBeUndefined();
    });
  });

  describe("operationsFullTimeJobs", () => {
    it("add operationsFullTimeJobs impact metric", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "AGRICULTURAL_OPERATION",
          yearlyExpenses: [{ amount: 1200, bearer: "owner", purpose: "taxes" }],
          yearlyIncomes: [],
          soilsDistribution: {},
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: "FRUITS_AND_OTHER_PERMANENT_CROPS",
          isSiteOperated: true,
          surfaceArea: 15000,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      expect(result.impactMetrics.find((d) => d.name === "operationsFullTimeJobs")?.total).toEqual(
        2.5,
      );
    });
    it("does not compute operationsFullTimeJobs impact metric if site is not operated", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "AGRICULTURAL_OPERATION",
          yearlyExpenses: [{ amount: 1200, bearer: "owner", purpose: "taxes" }],
          yearlyIncomes: [],
          soilsDistribution: {},
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: "FRUITS_AND_OTHER_PERMANENT_CROPS",
          isSiteOperated: false,
          surfaceArea: 15000,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      expect(result.impactMetrics.find((d) => d.name === "operationsFullTimeJobs")).toBeUndefined();
    });
  });

  describe("taxesIncome", () => {
    it("computes taxesIncome with one entry", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "AGRICULTURAL_OPERATION",
          yearlyExpenses: [{ amount: 1200, bearer: "owner", purpose: "taxes" }],
          yearlyIncomes: [],
          soilsDistribution: {},
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: "FRUITS_AND_OTHER_PERMANENT_CROPS",
          isSiteOperated: true,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      expect(result.economicImpacts.details.filter((d) => d.name === "taxesIncome")).toHaveLength(
        1,
      );
      const impact = result.economicImpacts.details.find((d) => d.name === "taxesIncome");
      expect(impact?.details).toEqual("taxes");
      expect(impact?.total).toBeGreaterThan(0);
      expect(impact?.detailsByYear[0]).toBeGreaterThan(1200);
      const detailsByYear = impact?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        expect(detailsByYear[i]).toBeLessThan(detailsByYear[i - 1] ?? 0);
      }

      const cumulativeByYear = impact?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        expect(cumulativeByYear[i] ?? 0).toBeGreaterThan(cumulativeByYear[i - 1] ?? 0);
      }
    });

    it("computes taxesIncome with several entries", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "AGRICULTURAL_OPERATION",
          yearlyExpenses: [
            { amount: 1000, bearer: "owner", purpose: "taxes" },
            { amount: 500, bearer: "owner", purpose: "operationsTaxes" },
          ],
          yearlyIncomes: [],
          soilsDistribution: {},
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: "CATTLE_FARMING",
          isSiteOperated: true,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      const taxeImpacts = result.economicImpacts.details.filter((d) => d.name === "taxesIncome");

      expect(taxeImpacts).toHaveLength(2);
      expect(taxeImpacts[0]?.details).toEqual("taxes");
      expect(taxeImpacts[1]?.details).toEqual("operationsTaxes");
    });
  });

  describe("waterRegulation", () => {
    it("computes waterRegulation when contaminatedSoilSurface > 0", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "FRICHE",
          contaminatedSoilSurface: 20000,
          yearlyExpenses: [],
          yearlyIncomes: [],
          soilsDistribution: {},
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: undefined,
          isSiteOperated: false,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      const impact = result.economicImpacts.details.find((d) => d.name === "waterRegulation");
      expect(impact?.total).toBeLessThan(0);
      expect(impact?.detailsByYear[0]).toEqual(impact?.cumulativeByYear[0]);
      const detailsByYear = impact?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        expect(Math.abs(detailsByYear[i] ?? 0)).toBeLessThan(Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = impact?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        expect(Math.abs(cumulativeByYear[i] ?? 0)).toBeGreaterThan(
          Math.abs(cumulativeByYear[i - 1] ?? 0),
        );
      }
    });

    it("does not compute waterRegulation without contaminatedSoilSurface", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "FRICHE",
          yearlyExpenses: [],
          yearlyIncomes: [],
          soilsDistribution: {},
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: undefined,
          isSiteOperated: false,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      expect(
        result.economicImpacts.details.find((d) => d.name === "waterRegulation"),
      ).toBeUndefined();
    });
  });

  describe("storedCo2Eq", () => {
    it("computes storedCo2Eq when soilsCarbonStorage is defined", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "NATURAL_AREA",
          yearlyExpenses: [],
          yearlyIncomes: [],
          soilsDistribution: {},
          soilsCarbonStorage: { total: 1000 },
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: undefined,
          isSiteOperated: false,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      const storedCo2Eq = result.economicImpacts.details.find((d) => d.name === "storedCo2Eq");
      expect(storedCo2Eq?.total).toEqual(550000);
      expect(storedCo2Eq?.detailsByYear).toEqual([550000, 0, 0, 0, 0]);
      expect(storedCo2Eq?.cumulativeByYear).toEqual([550000, 550000, 550000, 550000, 550000]);

      expect(result.impactMetrics.find((d) => d.name === "storedCo2Eq")?.total).toBeCloseTo(
        3667,
        0,
      );
    });
  });

  describe("ecosystem services", () => {
    const ecologicalSiteData = {
      nature: "NATURAL_AREA" as const,
      yearlyExpenses: [],
      yearlyIncomes: [],
      soilsDistribution: {
        FOREST_MIXED: 30000,
        PRAIRIE_GRASS: 10000,
        WET_LAND: 5000,
      },
      accidentsDeaths: undefined,
      accidentsSevereInjuries: undefined,
      accidentsMinorInjuries: undefined,
      agriculturalOperationActivity: undefined,
      isSiteOperated: false,
      surfaceArea: 1500,
    };

    it("computes natureRelatedWelnessAndLeisure for NATURAL_AREA", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: ecologicalSiteData,
        sumOnEvolutionPeriodService: makeSumService(),
      });
      const natureRelatedWelnessAndLeisure = result.economicImpacts.details.find(
        (d) => d.name === "natureRelatedWelnessAndLeisure",
      );
      expect(natureRelatedWelnessAndLeisure?.total).toBeGreaterThan(0);
      expect(natureRelatedWelnessAndLeisure?.detailsByYear[0]).toEqual(
        natureRelatedWelnessAndLeisure?.cumulativeByYear[0],
      );
      const detailsByYear = natureRelatedWelnessAndLeisure?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        expect(Math.abs(detailsByYear[i] ?? 0)).toBeLessThan(Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = natureRelatedWelnessAndLeisure?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        expect(Math.abs(cumulativeByYear[i] ?? 0)).toBeGreaterThan(
          Math.abs(cumulativeByYear[i - 1] ?? 0),
        );
      }
    });

    it("computes forestRelatedProduct for FOREST surface", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: ecologicalSiteData,
        sumOnEvolutionPeriodService: makeSumService(),
      });
      const forestRelatedProduct = result.economicImpacts.details.find(
        (d) => d.name === "forestRelatedProduct",
      );

      expect(forestRelatedProduct?.total).toBeGreaterThan(0);
      expect(forestRelatedProduct?.detailsByYear[0]).toEqual(
        forestRelatedProduct?.cumulativeByYear[0],
      );
      const detailsByYear = forestRelatedProduct?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        expect(Math.abs(detailsByYear[i] ?? 0)).toBeLessThan(Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = forestRelatedProduct?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        expect(Math.abs(cumulativeByYear[i] ?? 0)).toBeGreaterThan(
          Math.abs(cumulativeByYear[i - 1] ?? 0),
        );
      }
    });

    it("computes pollination", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: ecologicalSiteData,
        sumOnEvolutionPeriodService: makeSumService(),
      });

      const pollination = result.economicImpacts.details.find((d) => d.name === "pollination");

      expect(pollination?.total).toBeGreaterThan(0);
      expect(pollination?.detailsByYear[0]).toEqual(pollination?.cumulativeByYear[0]);
      const detailsByYear = pollination?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        expect(Math.abs(detailsByYear[i] ?? 0)).toBeLessThan(Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = pollination?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        expect(Math.abs(cumulativeByYear[i] ?? 0)).toBeGreaterThan(
          Math.abs(cumulativeByYear[i - 1] ?? 0),
        );
      }
    });

    it("does not includes pollination and forestRelatedProduct for site without vegetation", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "FRICHE",
          yearlyExpenses: [],
          yearlyIncomes: [],
          soilsDistribution: { BUILDINGS: 5000, IMPERMEABLE_SOILS: 5000 },
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: undefined,
          isSiteOperated: false,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      expect(result.economicImpacts.details.find((d) => d.name === "pollination")).toBeUndefined();
      expect(
        result.economicImpacts.details.find((d) => d.name === "forestRelatedProduct"),
      ).toBeUndefined();
    });

    it("includes permeableSurface metrics impacts", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "FRICHE",
          yearlyExpenses: [],
          yearlyIncomes: [],
          soilsDistribution: { BUILDINGS: 5000, FOREST_CONIFER: 5000 },
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: undefined,
          isSiteOperated: false,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      expect(result.impactMetrics.find((d) => d.name === "permeableSurface")?.total).toEqual(5000);
    });

    it("does not includes permeableSurface metrics impacts", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "FRICHE",
          yearlyExpenses: [],
          yearlyIncomes: [],
          soilsDistribution: { BUILDINGS: 5000, IMPERMEABLE_SOILS: 5000 },
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: undefined,
          isSiteOperated: false,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      expect(result.impactMetrics.find((d) => d.name === "permeableSurface")).toBeUndefined();
    });
  });

  describe("rentalIncome", () => {
    it("computes rentalIncome when site has rent expense", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "FRICHE",
          yearlyExpenses: [{ amount: 54000, bearer: "tenant", purpose: "rent" }],
          yearlyIncomes: [],
          soilsDistribution: {},
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: undefined,
          isSiteOperated: false,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });

      const impact = result.economicImpacts.details.find((d) => d.name === "rentalIncome");

      expect(impact?.total).toBeGreaterThan(0);
      expect(impact?.detailsByYear[0]).toEqual(54000);
      expect(impact?.cumulativeByYear[0]).toEqual(54000);
      const detailsByYear = impact?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        expect(Math.abs(detailsByYear[i] ?? 0)).toBeLessThan(Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = impact?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        expect(Math.abs(cumulativeByYear[i] ?? 0)).toBeGreaterThan(
          Math.abs(cumulativeByYear[i - 1] ?? 0),
        );
      }
    });
  });

  it("sums details and rounds total as integer", () => {
    const result = getSiteStatuQuoIndirectsImpacts({
      siteData: {
        nature: "FRICHE",
        yearlyExpenses: [
          { amount: 54000, bearer: "tenant", purpose: "rent" },
          { amount: 500, bearer: "owner", purpose: "propertyTaxes" },
        ],
        yearlyIncomes: [],
        soilsDistribution: {},
        accidentsDeaths: undefined,
        accidentsSevereInjuries: undefined,
        accidentsMinorInjuries: undefined,
        agriculturalOperationActivity: undefined,
        isSiteOperated: false,
        surfaceArea: 1500,
      },
      sumOnEvolutionPeriodService: makeSumService(),
    });

    const manualSum = result.economicImpacts.details.reduce((acc, d) => acc + d.total, 0);
    expect(result.economicImpacts.total).toBe(Math.round(manualSum));
  });

  it("returns empty total and details for a site without expenses nor ecological surfaces", () => {
    const result = getSiteStatuQuoIndirectsImpacts({
      siteData: {
        nature: "AGRICULTURAL_OPERATION",
        yearlyExpenses: [],
        yearlyIncomes: [],
        soilsDistribution: {},
        accidentsDeaths: undefined,
        accidentsSevereInjuries: undefined,
        accidentsMinorInjuries: undefined,
        agriculturalOperationActivity: undefined,
        isSiteOperated: false,
        surfaceArea: 1500,
      },
      sumOnEvolutionPeriodService: makeSumService(),
    });

    expect(result.economicImpacts.total).toBe(0);
    expect(result.economicImpacts.details).toHaveLength(0);
    expect(result.impactMetrics).toHaveLength(0);
  });
});

it("each impact has a cumulativeByYear with evaluationPeriodInYears length", () => {
  const evaluationPeriodInYears = 15;
  const result = getSiteStatuQuoIndirectsImpacts({
    siteData: {
      nature: "FRICHE",
      yearlyExpenses: [{ amount: 54000, bearer: "tenant", purpose: "rent" }],
      yearlyIncomes: [],
      soilsDistribution: {},
      accidentsDeaths: undefined,
      accidentsSevereInjuries: undefined,
      accidentsMinorInjuries: undefined,
      agriculturalOperationActivity: undefined,
      isSiteOperated: false,
      surfaceArea: 1500,
    },
    sumOnEvolutionPeriodService: makeSumService({
      evaluationPeriodInYears,
      operationsFirstYear: 2025,
    }),
  });

  result.economicImpacts.details.forEach((d) => {
    expect(d.cumulativeByYear).toHaveLength(evaluationPeriodInYears);
  });
});
