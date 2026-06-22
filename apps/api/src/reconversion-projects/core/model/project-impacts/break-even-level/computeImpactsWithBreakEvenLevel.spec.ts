import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AvoidedFricheCostsIndirectEconomicImpacts,
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
  sumList,
} from "shared";

import { Schedule } from "../../reconversionProject";
import {
  computeProjectImpactsWithBreakEvenLevel,
  computeProjectUrbanSprawlComparisonImpactsBreakdownAndEconomicBalance,
} from "./computeImpactsWithBreakEvenLevel";

const baseProject = {
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
    developerStructureType: "municipality",
    installationSchedule: {
      startDate: new Date("2025-06-17"),
      endDate: new Date("2026-06-17"),
    },
    type: "URBAN_PROJECT",
    features: {
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
  soilsDistribution: [
    {
      soilType: "IMPERMEABLE_SOILS",
      spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
      surfaceArea: 500,
    },
    {
      soilType: "MINERAL_SOIL",
      spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
      surfaceArea: 250,
    },
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
      surfaceArea: 3500,
    },
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      spaceCategory: "PUBLIC_SPACE",
      surfaceArea: 500,
    },
    {
      soilType: "IMPERMEABLE_SOILS",
      spaceCategory: "PUBLIC_SPACE",
      surfaceArea: 1500,
    },
    {
      soilType: "MINERAL_SOIL",
      spaceCategory: "PUBLIC_SPACE",
      surfaceArea: 750,
    },
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      spaceCategory: "PUBLIC_GREEN_SPACE",
      surfaceArea: 3000,
    },
    { soilType: "BUILDINGS", spaceCategory: "LIVING_AND_ACTIVITY_SPACE", surfaceArea: 4000 },
  ],
  yearlyProjectedExpenses: [{ amount: 15000, purpose: "rent" }],
  yearlyProjectedRevenues: [],
  sitePurchaseTotalAmount: 1800000,
  sitePurchasePropertyTransferDutiesAmount: 17400,
  relatedSiteId: "",
  reinstatementExpenses: [{ purpose: "asbestos_removal", amount: 10000 }],
  financialAssistanceRevenues: [],
  reinstatementContractOwnerName: "Mairie de Blajan",
  futureSiteOwnerStructureType: "company",
  futureSiteOwnerName: "Futur proprio",
} as const satisfies ReconversionProjectImpactsDataView<Schedule>;

const baseSite: Omit<SiteImpactsDataView, "address"> = {
  id: "",
  description: "Description",
  contaminatedSoilSurface: 20000,
  name: "My base site",
  nature: "FRICHE",
  fricheActivity: "AGRICULTURE",
  surfaceArea: 14000,
  soilsDistribution: {
    MINERAL_SOIL: 1000,
    BUILDINGS: 2000,
    IMPERMEABLE_SOILS: 10000,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 2000,
  },
  isExpressSite: false,
  yearlyIncomes: [],
  ownerName: "Current owner",
  ownerStructureType: "company",
  tenantName: "Current tenant",
  tenantStructureType: "company",
  accidentsDeaths: 0,
  accidentsMinorInjuries: 1,
  accidentsSevereInjuries: 2,
  yearlyExpenses: [
    { amount: 6000, bearer: "tenant", purpose: "rent" },
    { amount: 11600, bearer: "tenant", purpose: "security" },
    { amount: 1500, bearer: "tenant", purpose: "illegalDumpingCost" },
    { amount: 500, bearer: "owner", purpose: "propertyTaxes" },
  ],
};

const siteCityData = {
  name: "",
  propertyValueMedianPricePerSquareMeters: 2_500,
  population: 50_000,
  surfaceAreaSquareMeters: 5_000_000,
  accuracy: "city",
} as const;

describe("computeProjectImpactsWithBreakEvenLevel", () => {
  // ── Site agricole exploité ───────────────────────────────────────────────────
  describe("with agricultural operation and mode = 'project_impacts'", () => {
    it("adds previousSiteOperationBenefitLoss for AGRICULTURAL_OPERATION and siteIsOperated", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: baseProject,
        relatedSite: {
          ...baseSite,
          nature: "AGRICULTURAL_OPERATION" as const,
          isSiteOperated: true,
          yearlyIncomes: [{ amount: 10_000, source: "operations" }],
          yearlyExpenses: [{ amount: 4_000, purpose: "operationsTaxes", bearer: "tenant" }],
        },
        cityStats: siteCityData,

        evaluationPeriodInYears: 50,
      });

      assert.ok(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          (d) => d.name === "previousSiteOperationBenefitLoss",
        ) !== undefined,
      );
    });

    it("excludes previousSiteOperationBenefitLoss for AGRICULTURAL_OPERATION and site is not operated", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: baseProject,
        relatedSite: {
          ...baseSite,
          nature: "AGRICULTURAL_OPERATION" as const,
          isSiteOperated: false,
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 50,
      });

      assert.strictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          (d) => d.name === "previousSiteOperationBenefitLoss",
        ),
        undefined,
      );
    });

    it("adds oldOperationsFullTimeJobsLoss for AGRICULTURAL_OPERATION and site is operated", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: baseProject,
        relatedSite: {
          ...baseSite,
          nature: "AGRICULTURAL_OPERATION" as const,
          agriculturalOperationActivity: "CATTLE_FARMING",
          isSiteOperated: true,
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 50,
      });

      expect(
        result.aggregatedReconversionImpacts.impactsMetrics.find(
          (d) => d.name === "oldOperationsFullTimeJobsLoss",
        )?.total,
      ).toEqual(-1.5);
    });

    it("doesn't add oldOperationsFullTimeJobsLoss for AGRICULTURAL_OPERATION and site is not operated", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: baseProject,
        relatedSite: {
          ...baseSite,
          nature: "AGRICULTURAL_OPERATION" as const,
          agriculturalOperationActivity: "CATTLE_FARMING",

          isSiteOperated: false,
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 50,
      });

      expect(
        result.aggregatedReconversionImpacts.impactsMetrics.find(
          (d) => d.name === "oldOperationsFullTimeJobsLoss",
        ),
      ).toBeUndefined();
    });
  });

  describe("with project or site rental incomes", () => {
    it("returns empty array without rent", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [{ amount: 1_000, purpose: "taxes" }],
        },
        relatedSite: {
          ...baseSite,
          nature: "AGRICULTURAL_OPERATION" as const,
          isSiteOperated: true,
          yearlyIncomes: [{ amount: 10_000, source: "operations" }],
          yearlyExpenses: [{ amount: 500, purpose: "maintenance", bearer: "owner" }],
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 50,
      });

      assert.strictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          ({ name }) => name === "projectedRentalIncome",
        ),
        undefined,
      );
      assert.strictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          ({ name }) => name === "oldRentalIncomeLoss",
        ),
        undefined,
      );
      assert.strictEqual(
        result.reconversionImpactsBreakdown.projectOnSiteIndirectEconomicImpactsData.details.find(
          ({ name }) => name === "projectedRentalIncome",
        ),
        undefined,
      );
      assert.strictEqual(
        result.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.details.find(
          ({ name }) => name === "rentalIncome",
        ),
        undefined,
      );
    });

    // ── Loyer projeté uniquement (sans loyer actuel) ──────────────────────────
    it("returns projectedRentalIncome with projected rent only", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [{ amount: 2_000, purpose: "rent" }],
        },
        relatedSite: {
          ...baseSite,
          nature: "AGRICULTURAL_OPERATION" as const,
          isSiteOperated: true,
          yearlyIncomes: [{ amount: 10_000, source: "operations" }],
          yearlyExpenses: [{ amount: 500, purpose: "maintenance", bearer: "owner" }],
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 3,
      });

      assert.deepStrictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          ({ name }) => name === "projectedRentalIncome",
        )?.detailsByYear[0],
        2_000,
      );
      assert.strictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          ({ name }) => name === "oldRentalIncomeLoss",
        ),
        undefined,
      );
      assert.deepStrictEqual(
        result.reconversionImpactsBreakdown.projectOnSiteIndirectEconomicImpactsData.details.find(
          ({ name }) => name === "projectedRentalIncome",
        )?.detailsByYear[0],
        2_000,
      );
      assert.strictEqual(
        result.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.details.find(
          ({ name }) => name === "rentalIncome",
        ),
        undefined,
      );
    });

    // ── Loyer projeté + loyer actuel ─────────────────────────────────────────
    it("returns projectedRentalIncome and oldRentalIncomeLoss witch projected rent and current rent", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [{ amount: 3_000, purpose: "rent" }],
        },
        relatedSite: {
          ...baseSite,
          nature: "AGRICULTURAL_OPERATION" as const,
          isSiteOperated: true,
          yearlyIncomes: [{ amount: 10_000, source: "operations" }],
          yearlyExpenses: [
            { amount: 500, purpose: "maintenance", bearer: "owner" },
            {
              amount: 1_000,
              purpose: "rent",
              bearer: "tenant",
            },
          ],
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 3,
      });

      assert.deepStrictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          ({ name }) => name === "projectedRentalIncome",
        )?.detailsByYear[0],
        3_000,
      );
      assert.deepStrictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          ({ name }) => name === "oldRentalIncomeLoss",
        )?.detailsByYear[0],
        -1_000,
      );
      assert.deepStrictEqual(
        result.reconversionImpactsBreakdown.projectOnSiteIndirectEconomicImpactsData.details.find(
          ({ name }) => name === "projectedRentalIncome",
        )?.detailsByYear[0],
        3_000,
      );
      assert.deepStrictEqual(
        result.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.details.find(
          ({ name }) => name === "rentalIncome",
        )?.detailsByYear[0],
        1_000,
      );
    });

    // ── Loyer actuel uniquement ───────────────────────────────────────────────
    it("computes negative oldRentalIncomeLoss with current rent only", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: {
          ...baseProject,
          yearlyProjectedExpenses: [],
        },
        relatedSite: {
          ...baseSite,
          nature: "AGRICULTURAL_OPERATION" as const,
          isSiteOperated: true,
          yearlyIncomes: [{ amount: 10_000, source: "operations" }],
          yearlyExpenses: [{ amount: 1_500, purpose: "rent", bearer: "tenant" }],
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 3,
      });

      assert.strictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          ({ name }) => name === "projectedRentalIncome",
        ),
        undefined,
      );
      assert.deepStrictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          ({ name }) => name === "oldRentalIncomeLoss",
        )?.detailsByYear[0],
        -1_500,
      );
      assert.strictEqual(
        result.reconversionImpactsBreakdown.projectOnSiteIndirectEconomicImpactsData.details.find(
          ({ name }) => name === "projectedRentalIncome",
        ),
        undefined,
      );
      assert.deepStrictEqual(
        result.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.details.find(
          ({ name }) => name === "rentalIncome",
        )?.detailsByYear[0],
        1_500,
      );
    });
  });

  describe("add avoidedFricheMaintenanceAndSecuringCosts impacts", () => {
    it("returns empty array if there is no friche costs", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: baseProject,
        relatedSite: {
          ...baseSite,
          nature: "AGRICULTURAL_OPERATION" as const,
          isSiteOperated: true,
          yearlyIncomes: [{ amount: 10_000, source: "operations" }],
          yearlyExpenses: [],
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 10,
      });

      assert.strictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          ({ name }) => name === "avoidedFricheMaintenanceAndSecuringCostsForOwner",
        ),
        undefined,
      );
      assert.strictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          ({ name }) => name === "avoidedFricheMaintenanceAndSecuringCostsForTenant",
        ),
        undefined,
      );
      assert.strictEqual(
        result.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.details.find(
          ({ name }) => name === "fricheMaintenanceAndSecuringCostsForOwner",
        ),
        undefined,
      );
      assert.strictEqual(
        result.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.details.find(
          ({ name }) => name === "fricheMaintenanceAndSecuringCostsForTenant",
        ),
        undefined,
      );
    });

    it("returns only friche related costs", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: baseProject,
        relatedSite: {
          ...baseSite,
          yearlyExpenses: [
            { amount: 1_000, purpose: "security", bearer: "owner" },
            { amount: 500, purpose: "rent", bearer: "tenant" }, // doit être ignoré
            { amount: 200, purpose: "maintenance", bearer: "owner" },
          ],
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 10,
      });

      const tenantInAggregateResult =
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter(
          (item) => item.name === "avoidedFricheMaintenanceAndSecuringCostsForTenant",
        );
      const ownerInAggregateResult =
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter(
          (item): item is AvoidedFricheCostsIndirectEconomicImpacts =>
            item.name === "avoidedFricheMaintenanceAndSecuringCostsForOwner",
        );
      assert.strictEqual(ownerInAggregateResult.length, 2);
      assert.strictEqual(tenantInAggregateResult.length, 0);
      assert.deepStrictEqual(
        ownerInAggregateResult.map((r) => r.details),
        ["security", "maintenance"],
      );

      assert.ok(ownerInAggregateResult[0]?.detailsByYear !== undefined);
      assert.ok(ownerInAggregateResult[0]?.cumulativeByYear !== undefined);
      assert.deepStrictEqual(ownerInAggregateResult[0]?.cumulativeByYear[0], 1_000);
    });

    it("returns 'avoidedFricheMaintenanceAndSecuringCostsForTenant' for tenant costs", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: baseProject,
        relatedSite: {
          ...baseSite,
          yearlyExpenses: [{ amount: 500, purpose: "illegalDumpingCost", bearer: "tenant" }],
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 10,
      });

      const tenantInAggregateResult =
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter(
          (item): item is AvoidedFricheCostsIndirectEconomicImpacts =>
            item.name === "avoidedFricheMaintenanceAndSecuringCostsForTenant",
        );
      const ownerInAggregateResult =
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter(
          (item): item is AvoidedFricheCostsIndirectEconomicImpacts =>
            item.name === "avoidedFricheMaintenanceAndSecuringCostsForOwner",
        );
      assert.strictEqual(ownerInAggregateResult.length, 0);
      assert.strictEqual(tenantInAggregateResult.length, 1);
      assert.deepStrictEqual(
        tenantInAggregateResult.map((r) => r.details),
        ["illegalDumpingCost"],
      );
    });
  });

  describe("previousSiteOperationBenefitLoss", () => {
    it("does not returns 'previousSiteOperationBenefitLoss' if there is no operations costs or revenus", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: baseProject,
        relatedSite: {
          ...baseSite,
          nature: "AGRICULTURAL_OPERATION" as const,
          isSiteOperated: true,
          yearlyIncomes: [],
          yearlyExpenses: [],
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 10,
      });

      assert.strictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          ({ name }) => name === "previousSiteOperationBenefitLoss",
        ),
        undefined,
      );
      assert.strictEqual(
        result.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.details.find(
          ({ name }) => name === "operatingEconomicBalance",
        ),
        undefined,
      );
    });

    it("computes benefit loss amount total for evaluation period", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: baseProject,
        relatedSite: {
          ...baseSite,
          nature: "AGRICULTURAL_OPERATION" as const,
          isSiteOperated: true,
          yearlyIncomes: [
            { amount: 5_000, source: "operations" },
            { amount: 2_000, source: "product-sales" },
          ],
          yearlyExpenses: [{ amount: 3_000, purpose: "operationsTaxes", bearer: "tenant" }],
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 3,
      });

      assert.strictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          (item) => item.name === "previousSiteOperationBenefitLoss",
        )?.detailsByYear[0],
        -4_000,
      );
      assert.strictEqual(
        result.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.details.filter(
          (item) => item.name === "operatingEconomicBalance",
        ).length,
        3,
      );
    });

    it("returns positive value if incomes are lower than expenses", () => {
      const result = computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: baseProject,
        relatedSite: {
          ...baseSite,
          nature: "AGRICULTURAL_OPERATION" as const,
          isSiteOperated: true,
          yearlyIncomes: [{ amount: 1_000, source: "operations" }],
          yearlyExpenses: [{ amount: 4_000, purpose: "maintenance", bearer: "tenant" }],
        },
        cityStats: siteCityData,
        evaluationPeriodInYears: 3,
      });

      assert.strictEqual(
        result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
          (item) => item.name === "previousSiteOperationBenefitLoss",
        )?.detailsByYear[0],
        3_000,
      );
      assert.strictEqual(
        sumList(
          result.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.details
            .filter((item) => item.name === "operatingEconomicBalance")
            .map((item) => item.detailsByYear[0] ?? 0),
        ),
        -3_000,
      );
    });
  });
  describe("avoidedFricheCosts", () => {
    describe("site_nature is FRICHE", () => {
      it("adds avoidedFricheMaintenanceAndSecuringCosts", () => {
        const result = computeProjectImpactsWithBreakEvenLevel({
          reconversionProject: baseProject,
          relatedSite: {
            ...baseSite,
            yearlyExpenses: [
              { amount: 5_000, purpose: "security", bearer: "owner" },
              { amount: 2_000, purpose: "maintenance", bearer: "tenant" },
            ],
          },
          cityStats: siteCityData,
          evaluationPeriodInYears: 3,
        });

        const avoidedCosts =
          result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter((d) =>
            d.name.startsWith("avoidedFricheMaintenanceAndSecuringCosts"),
          );
        assert.ok(avoidedCosts.length > 0);
      });
    });

    describe("site_nature is not FRICHE and mode is 'urban_sprawl_comparison'", () => {
      it("doesn't add avoidedFricheMaintenanceAndSecuringCosts", () => {
        const result = computeProjectImpactsWithBreakEvenLevel({
          reconversionProject: baseProject,
          relatedSite: {
            ...baseSite,
            nature: "AGRICULTURAL_OPERATION",
          },
          cityStats: siteCityData,
          evaluationPeriodInYears: 3,
        });

        const avoidedCosts =
          result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter((d) =>
            d.name.startsWith("avoidedFricheMaintenanceAndSecuringCosts"),
          );
        assert.deepStrictEqual(avoidedCosts.length, 0);
      });
    });
  });

  describe("avoidedFricheAccidents", () => {
    describe("site_nature is FRICHE", () => {
      it("adds avoidedFricheAccidentsSevereInjuries and avoidedFricheAccidentsMinorInjuries", () => {
        const result = computeProjectImpactsWithBreakEvenLevel({
          reconversionProject: baseProject,
          relatedSite: baseSite,
          cityStats: siteCityData,
          evaluationPeriodInYears: 3,
        });

        expect(
          result.aggregatedReconversionImpacts.impactsMetrics.find(
            (d) => d.name === "avoidedFricheAccidentsMinorInjuries",
          )?.total,
        ).toEqual(1);
        expect(
          result.aggregatedReconversionImpacts.impactsMetrics.find(
            (d) => d.name === "avoidedFricheAccidentsSevereInjuries",
          )?.total,
        ).toEqual(2);

        expect(
          result.aggregatedReconversionImpacts.impactsMetrics.find(
            (d) => d.name === "avoidedFricheAccidentsDeaths",
          ),
        ).toBeUndefined();
      });
    });

    describe("site_nature is not FRICHE and mode is 'urban_sprawl_comparison'", () => {
      it("doesn't add avoidedFricheMaintenanceAndSecuringCosts", () => {
        const result = computeProjectImpactsWithBreakEvenLevel({
          reconversionProject: baseProject,
          relatedSite: {
            ...baseSite,
            nature: "AGRICULTURAL_OPERATION",
          },
          cityStats: siteCityData,
          evaluationPeriodInYears: 3,
        });

        const avoidedCosts =
          result.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter((d) =>
            d.name.startsWith("avoidedFricheMaintenanceAndSecuringCosts"),
          );
        expect(avoidedCosts.length).toEqual(0);
      });
    });
  });

  describe("avoidedRoadsAndUtilitiesConstruction and avoidedRoadsAndUtilitiesMaintenance", () => {
    it("add negative avoidedRoadsAndUtilitiesConstruction and avoidedRoadsAndUtilitiesMaintenance impacts for non friche site with urban sprawl comparison mode", () => {
      const result = computeProjectUrbanSprawlComparisonImpactsBreakdownAndEconomicBalance({
        reconversionProject: baseProject,
        relatedSite: { ...baseSite, nature: "AGRICULTURAL_OPERATION" },
        cityStats: siteCityData,
        evaluationPeriodInYears: 10,
      });

      assert.strictEqual(
        result.projectOnSiteIndirectEconomicImpactsData.details.find(
          (d) => d.name === "fricheRoadsAndUtilitiesExpenses",
        ),
        undefined,
      );
      assert.deepStrictEqual(
        result.projectOnSiteIndirectEconomicImpactsData.details.find(
          (d) => d.name === "avoidedRoadsAndUtilitiesConstructionExpenses",
        )?.total,
        -120805,
      );

      const maintenanceTotal = result.projectOnSiteIndirectEconomicImpactsData.details.find(
        (d) => d.name === "avoidedRoadsAndUtilitiesMaintenanceExpenses",
      )?.total;
      assert.ok(maintenanceTotal !== undefined && Math.abs(maintenanceTotal - -203038) < 0.5);
    });

    it("add positive avoidedRoadsAndUtilitiesConstruction and avoidedRoadsAndUtilitiesMaintenance impacts for friche with urban_sprawl_comparison mode", () => {
      const result = computeProjectUrbanSprawlComparisonImpactsBreakdownAndEconomicBalance({
        reconversionProject: baseProject,
        relatedSite: baseSite,
        cityStats: siteCityData,
        evaluationPeriodInYears: 10,
      });

      assert.deepStrictEqual(
        result.projectOnSiteIndirectEconomicImpactsData.details.find(
          (d) => d.name === "avoidedRoadsAndUtilitiesConstructionExpenses",
        )?.total,
        120805,
      );

      const maintenanceTotal = result.projectOnSiteIndirectEconomicImpactsData.details.find(
        (d) => d.name === "avoidedRoadsAndUtilitiesMaintenanceExpenses",
      )?.total;
      assert.ok(maintenanceTotal !== undefined && Math.abs(maintenanceTotal - 203038) < 0.5);
    });
  });
});
