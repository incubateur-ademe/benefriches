import assert from "node:assert/strict";
import { describe, it } from "node:test";
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
      assert.deepStrictEqual(impact?.details, "security");
      assert.ok((impact?.total ?? 0) < 0);
      assert.deepStrictEqual(impact?.detailsByYear[0], -11600);
      const detailsByYear = impact?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        assert.ok(Math.abs(detailsByYear[i] ?? 0) < Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = impact?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        assert.ok(Math.abs(cumulativeByYear[i] ?? 0) > Math.abs(cumulativeByYear[i - 1] ?? 0));
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
      assert.deepStrictEqual(impact?.details, "illegalDumpingCost");
      assert.ok((impact?.total ?? 0) < 0);
      assert.deepStrictEqual(impact?.detailsByYear[0], -500);
      const detailsByYear = impact?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        assert.ok(Math.abs(detailsByYear[i] ?? 0) < Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = impact?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        assert.ok(Math.abs(cumulativeByYear[i] ?? 0) > Math.abs(cumulativeByYear[i - 1] ?? 0));
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

      assert.strictEqual(result.economicImpacts.details.length, 0);
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

    assert.deepStrictEqual(
      result.impactMetrics.find((d) => d.name === "contaminatedSurface")?.total,
      5000,
    );
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

    assert.strictEqual(
      result.impactMetrics.find((d) => d.name === "contaminatedSurface"),
      undefined,
    );
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

      assert.deepStrictEqual(
        result.impactMetrics.find((d) => d.name === "fricheAccidentsDeaths")?.total,
        1,
      );
      assert.deepStrictEqual(
        result.impactMetrics.find((d) => d.name === "fricheAccidentsMinorInjuries")?.total,
        3,
      );
      assert.deepStrictEqual(
        result.impactMetrics.find((d) => d.name === "fricheAccidentsSevereInjuries")?.total,
        2,
      );
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

      assert.strictEqual(
        result.impactMetrics.find((d) => d.name === "fricheAccidentsDeaths"),
        undefined,
      );
      assert.strictEqual(
        result.impactMetrics.find((d) => d.name === "fricheAccidentsMinorInjuries"),
        undefined,
      );
      assert.strictEqual(
        result.impactMetrics.find((d) => d.name === "fricheAccidentsSevereInjuries"),
        undefined,
      );
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

      assert.deepStrictEqual(
        result.impactMetrics.find((d) => d.name === "operationsFullTimeJobs")?.total,
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

      assert.strictEqual(
        result.impactMetrics.find((d) => d.name === "operationsFullTimeJobs"),
        undefined,
      );
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

      assert.strictEqual(
        result.economicImpacts.details.filter((d) => d.name === "taxesIncome").length,
        1,
      );
      const impact = result.economicImpacts.details.find((d) => d.name === "taxesIncome");
      assert.deepStrictEqual(impact?.details, "taxes");
      assert.ok((impact?.total ?? 0) > 0);
      assert.ok((impact?.detailsByYear[0] ?? 0) > 1200);
      const detailsByYear = impact?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        assert.ok((detailsByYear[i] ?? 0) < (detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = impact?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        assert.ok((cumulativeByYear[i] ?? 0) > (cumulativeByYear[i - 1] ?? 0));
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

      assert.strictEqual(taxeImpacts.length, 2);
      assert.deepStrictEqual(taxeImpacts[0]?.details, "taxes");
      assert.deepStrictEqual(taxeImpacts[1]?.details, "operationsTaxes");
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
      assert.ok((impact?.total ?? 0) < 0);
      assert.deepStrictEqual(impact?.detailsByYear[0], impact?.cumulativeByYear[0]);
      const detailsByYear = impact?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        assert.ok(Math.abs(detailsByYear[i] ?? 0) < Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = impact?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        assert.ok(Math.abs(cumulativeByYear[i] ?? 0) > Math.abs(cumulativeByYear[i - 1] ?? 0));
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

      assert.strictEqual(
        result.economicImpacts.details.find((d) => d.name === "waterRegulation"),
        undefined,
      );
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
      assert.deepStrictEqual(storedCo2Eq?.total, 550000);
      assert.deepStrictEqual(storedCo2Eq?.detailsByYear, [550000, 0, 0, 0, 0]);
      assert.deepStrictEqual(
        storedCo2Eq?.cumulativeByYear,
        [550000, 550000, 550000, 550000, 550000],
      );

      assert.ok(
        Math.abs((result.impactMetrics.find((d) => d.name === "storedCo2Eq")?.total ?? 0) - 3667) <
          0.5,
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
      assert.ok((natureRelatedWelnessAndLeisure?.total ?? 0) > 0);
      assert.deepStrictEqual(
        natureRelatedWelnessAndLeisure?.detailsByYear[0],
        natureRelatedWelnessAndLeisure?.cumulativeByYear[0],
      );
      const detailsByYear = natureRelatedWelnessAndLeisure?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        assert.ok(Math.abs(detailsByYear[i] ?? 0) < Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = natureRelatedWelnessAndLeisure?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        assert.ok(Math.abs(cumulativeByYear[i] ?? 0) > Math.abs(cumulativeByYear[i - 1] ?? 0));
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

      assert.ok((forestRelatedProduct?.total ?? 0) > 0);
      assert.deepStrictEqual(
        forestRelatedProduct?.detailsByYear[0],
        forestRelatedProduct?.cumulativeByYear[0],
      );
      const detailsByYear = forestRelatedProduct?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        assert.ok(Math.abs(detailsByYear[i] ?? 0) < Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = forestRelatedProduct?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        assert.ok(Math.abs(cumulativeByYear[i] ?? 0) > Math.abs(cumulativeByYear[i - 1] ?? 0));
      }
    });

    it("computes pollination", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: ecologicalSiteData,
        sumOnEvolutionPeriodService: makeSumService(),
      });

      const pollination = result.economicImpacts.details.find((d) => d.name === "pollination");

      assert.ok((pollination?.total ?? 0) > 0);
      assert.deepStrictEqual(pollination?.detailsByYear[0], pollination?.cumulativeByYear[0]);
      const detailsByYear = pollination?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        assert.ok(Math.abs(detailsByYear[i] ?? 0) < Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = pollination?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        assert.ok(Math.abs(cumulativeByYear[i] ?? 0) > Math.abs(cumulativeByYear[i - 1] ?? 0));
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

      assert.strictEqual(
        result.economicImpacts.details.find((d) => d.name === "pollination"),
        undefined,
      );
      assert.strictEqual(
        result.economicImpacts.details.find((d) => d.name === "forestRelatedProduct"),
        undefined,
      );
    });

    it("includes permeableSurface metrics impacts", () => {
      const result = getSiteStatuQuoIndirectsImpacts({
        siteData: {
          nature: "FRICHE",
          yearlyExpenses: [],
          yearlyIncomes: [],
          soilsDistribution: { BUILDINGS: 5000, FOREST_CONIFER: 4000, MINERAL_SOIL: 1000 },
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
          agriculturalOperationActivity: undefined,
          isSiteOperated: false,
          surfaceArea: 1500,
        },
        sumOnEvolutionPeriodService: makeSumService(),
      });
      assert.deepStrictEqual(
        result.impactMetrics.find((d) => d.name === "permeableGreenSurface")?.total,
        4000,
      );

      assert.deepStrictEqual(
        result.impactMetrics.find((d) => d.name === "permeableMineralSurface")?.total,
        1000,
      );
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

      assert.strictEqual(
        result.impactMetrics.find((d) => d.name === "permeableGreenSurface"),
        undefined,
      );
      assert.strictEqual(
        result.impactMetrics.find((d) => d.name === "permeableMineralSurface"),
        undefined,
      );
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

      assert.ok((impact?.total ?? 0) > 0);
      assert.deepStrictEqual(impact?.detailsByYear[0], 54000);
      assert.deepStrictEqual(impact?.cumulativeByYear[0], 54000);
      const detailsByYear = impact?.detailsByYear ?? [];
      for (let i = 1; i < detailsByYear.length; i++) {
        assert.ok(Math.abs(detailsByYear[i] ?? 0) < Math.abs(detailsByYear[i - 1] ?? 0));
      }

      const cumulativeByYear = impact?.cumulativeByYear ?? [];
      for (let i = 1; i < cumulativeByYear.length; i++) {
        assert.ok(Math.abs(cumulativeByYear[i] ?? 0) > Math.abs(cumulativeByYear[i - 1] ?? 0));
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
    assert.strictEqual(result.economicImpacts.total, Math.round(manualSum));
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

    assert.strictEqual(result.economicImpacts.total, 0);
    assert.strictEqual(result.economicImpacts.details.length, 0);
    assert.strictEqual(result.impactMetrics.length, 0);
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
    assert.strictEqual(d.cumulativeByYear.length, evaluationPeriodInYears);
  });
});
