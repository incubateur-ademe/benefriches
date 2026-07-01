import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { SiteImpactsDataView } from "shared";
import { v4 as uuid } from "uuid";

import { computeStatuQuoSiteImpacts } from "./computeStatuQuoSiteImpacts";

const fricheSite = {
  id: uuid(),
  description: "Description",
  contaminatedSoilSurface: 20000,
  name: "My base site",
  nature: "FRICHE",
  fricheActivity: "AGRICULTURE",
  surfaceArea: 50000,
  soilsDistribution: {
    BUILDINGS: 20000,
    MINERAL_SOIL: 20000,
    IMPERMEABLE_SOILS: 10000,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 40000,
  },
  address: {
    cityCode: "23456",
    value: "Blajan",
    banId: "",
    city: "Blajan",
    postCode: "23456",
    long: 0,
    lat: 0,
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
    { amount: 54000, bearer: "tenant", purpose: "rent" },
    { amount: 11600, bearer: "tenant", purpose: "security" },
    { amount: 1500, bearer: "tenant", purpose: "illegalDumpingCost" },
    { amount: 500, bearer: "owner", purpose: "propertyTaxes" },
  ],
} as const satisfies Required<
  Omit<SiteImpactsDataView, "agriculturalOperationActivity" | "isSiteOperated" | "naturalAreaType">
>;

const localAuthoritySite = {
  ...fricheSite,
  id: uuid(),
  name: "Local authority site",
  ownerStructureType: "municipality",
  ownerName: "Commune de Blajan",
  tenantStructureType: "municipality",
  tenantName: "Commune de Blajan",
  isSiteOperated: true,
  yearlyIncomes: [{ amount: 10000, source: "operations" }],
} as const satisfies SiteImpactsDataView;

const BASE_PARAMS = {
  evaluationPeriodInYears: 10,
  operationsFirstYear: 2025,
} as const;

describe("computeStatuQuoSiteImpacts", () => {
  describe("GetSiteImpactsDto", () => {
    it("returns GetSiteImpactsDto format", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: false },
      });

      assert.ok(Array.isArray(result.projectionYears));
      assert.ok(typeof result.economicImpacts === "object" && result.economicImpacts !== null);
      assert.ok(typeof result.impactMetrics === "object" && result.impactMetrics !== null);
      assert.ok(typeof result.stakeholders === "object" && result.stakeholders !== null);
    });

    it("projectionYears has same length as cumulativeByYear", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: false },
      });

      for (let i = 1; i < result.economicImpacts.details.length; i++) {
        assert.strictEqual(
          result.economicImpacts.details[i]?.detailsByYear.length,
          result.projectionYears.length,
        );
        assert.strictEqual(
          result.economicImpacts.details[i]?.cumulativeByYear.length,
          result.projectionYears.length,
        );
      }
    });

    it("projectionYears starts with operationsFirstYear", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: false },
      });

      assert.strictEqual(result.projectionYears[0], String(BASE_PARAMS.operationsFirstYear));
    });
  });

  describe("stakeholders", () => {
    it("use input site owner", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: false },
      });

      assert.partialDeepStrictEqual(result.stakeholders.owner, {
        structureType: fricheSite.ownerStructureType,
        structureName: fricheSite.ownerName,
      });
    });

    it("operator is undefined when isSiteOperated is false", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: false },
      });

      assert.strictEqual(result.stakeholders.operator, undefined);
    });

    it("operator is tenant when isSiteOperated and tenantStructureType is defined", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: true },
      });

      assert.partialDeepStrictEqual(result.stakeholders.operator, {
        structureType: fricheSite.tenantStructureType,
        structureName: fricheSite.tenantName,
      });
    });

    it("operator is owner when isSiteOperated but tenantStructureType is not", () => {
      const siteWithoutTenant = {
        ...fricheSite,
        isSiteOperated: true,
        tenantStructureType: undefined,
        tenantName: undefined,
      } as unknown as SiteImpactsDataView;

      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: siteWithoutTenant,
      });

      assert.partialDeepStrictEqual(result.stakeholders.operator, {
        structureType: fricheSite.ownerStructureType,
        structureName: fricheSite.ownerName,
      });
    });
  });

  describe("operator is local authority", () => {
    it("includes operatingEconomicBalance in economicImpacts", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: localAuthoritySite,
      });

      assert.notStrictEqual(result.economicImpacts.total, 0);

      const hasOperating = result.economicImpacts.details.some(
        (d) => d.name === "operatingEconomicBalance",
      );
      assert.strictEqual(hasOperating, true);
    });

    it("cumulativeBalanceByYear includes operatingEconomicBalance only if operator is company", () => {
      const resultCompany = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: true },
      });

      const hasOperating = resultCompany.economicImpacts.details.some(
        (d) => d.name === "operatingEconomicBalance",
      );
      assert.strictEqual(hasOperating, true);
    });
  });

  describe("with soilsCarbonStorage", () => {
    it("includes storedCo2Eq in indirects impacts", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        evaluationPeriodInYears: 5,
        site: { ...fricheSite, isSiteOperated: false },
        siteSoilsCarbonStorage: { total: 5000 },
      });

      const carbon = result.economicImpacts.details.find((d) => d.name === "storedCo2Eq");
      assert.ok(Math.abs((carbon?.total ?? 0) - 2750000.0000000005) < 0.005);
      assert.deepStrictEqual(carbon?.detailsByYear, [carbon?.total, 0, 0, 0, 0]);
      assert.deepStrictEqual(carbon?.cumulativeByYear, [
        carbon?.total,
        carbon?.total,
        carbon?.total,
        carbon?.total,
        carbon?.total,
      ]);
      assert.ok(
        Math.abs((result.impactMetrics.find((d) => d.name === "storedCo2Eq")?.total ?? 0) - 18333) <
          0.5,
      );
    });

    it("without soilsCarbonStorage, storedCo2Eq is not included", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: false },
      });

      const hasCarbon = result.economicImpacts.details.some((d) => d.name === "storedCo2Eq");
      assert.strictEqual(hasCarbon, false);
      assert.strictEqual(
        result.impactMetrics.some((d) => d.name === "storedCo2Eq"),
        false,
      );
    });
  });
});
