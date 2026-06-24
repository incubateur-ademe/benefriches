import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { GetSiteImpactsDto, SiteImpactsDataView } from "shared";
import { v4 as uuid } from "uuid";

import { FakeGetSoilsCarbonStorageService } from "src/reconversion-projects/core/gateways/FakeGetSoilsCarbonStorageService";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { FailureResult, SuccessResult } from "src/shared-kernel/result";
import { InMemorySiteImpactsQuery } from "src/sites/adapters/secondary/site-impacts/InMemorySiteImpactsQuery";

import { ComputeSiteImpactsUseCase } from "./computeSiteImpacts.usecase";

describe("ComputeSiteImpactsUseCase", () => {
  let dateProvider: DateProvider;
  const fakeNow = new Date("2026-05-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
  });

  describe("Error cases", () => {
    it("fails when site does not exist", async () => {
      const usecase = new ComputeSiteImpactsUseCase(
        new InMemorySiteImpactsQuery(),
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
      );

      const result = await usecase.execute({
        siteId: uuid(),
        operationsFirstYear: 2026,
      });

      assert.strictEqual(result.isFailure(), true);
      assert.strictEqual((result as FailureResult<"SiteNotFound">).getError(), "SiteNotFound");
    });
  });

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
    Omit<
      SiteImpactsDataView,
      "agriculturalOperationActivity" | "isSiteOperated" | "naturalAreaType"
    >
  >;

  const buildUseCase = (siteData: SiteImpactsDataView) => {
    const siteQuery = new InMemorySiteImpactsQuery();
    siteQuery._setData(siteData);

    return new ComputeSiteImpactsUseCase(
      siteQuery,
      new FakeGetSoilsCarbonStorageService(),
      dateProvider,
    );
  };

  describe("Success cases", () => {
    it("succeeds and returns result with default operationFirstYear and evaluationPeriodInYears", async () => {
      const usecase = buildUseCase(fricheSite);
      const result = await usecase.execute({
        siteId: fricheSite.id,
      });

      assert.strictEqual(result.isSuccess(), true);
      const data = (result as SuccessResult<GetSiteImpactsDto>).getData();
      assert.deepStrictEqual(data.projectionYears[0], "2026");
      assert.strictEqual(data.projectionYears.length, 50);
    });

    it("projectionYears has exactly evaluationPeriodInYears entries", async () => {
      const evaluationPeriodInYears = 10;
      const usecase = buildUseCase(fricheSite);
      const result = await usecase.execute({
        siteId: fricheSite.id,
        evaluationPeriodInYears,
      });

      const data = (result as SuccessResult<GetSiteImpactsDto>).getData();
      assert.strictEqual(data.projectionYears.length, evaluationPeriodInYears);
      assert.deepStrictEqual(data.projectionYears, [
        "2026",
        "2027",
        "2028",
        "2029",
        "2030",
        "2031",
        "2032",
        "2033",
        "2034",
        "2035",
      ]);
    });

    it("projectionYears starts at operationsFirstYear", async () => {
      const usecase = buildUseCase(fricheSite);
      const result = await usecase.execute({
        siteId: fricheSite.id,
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2028,
      });

      const data = (result as SuccessResult<GetSiteImpactsDto>).getData();
      assert.strictEqual(data.projectionYears[0], "2028");
    });

    it("stakeholders reflect site data", async () => {
      const usecase = buildUseCase({
        ...fricheSite,
        isSiteOperated: true,
        nature: "AGRICULTURAL_OPERATION",
      });
      const result = await usecase.execute({
        siteId: fricheSite.id,
      });

      const data = (result as SuccessResult<GetSiteImpactsDto>).getData();
      assert.strictEqual(data.stakeholders.owner?.structureType, fricheSite.ownerStructureType);
      assert.strictEqual(data.stakeholders.owner?.structureName, fricheSite.ownerName);
      assert.strictEqual(data.stakeholders.operator?.structureType, fricheSite.tenantStructureType);
      assert.strictEqual(data.stakeholders.operator?.structureName, fricheSite.tenantName);
      assert.strictEqual(data.stakeholders.tenant?.structureType, fricheSite.tenantStructureType);
      assert.strictEqual(data.stakeholders.tenant?.structureName, fricheSite.tenantName);
    });

    it("computes operatingEconomicBalance and indirectEconomicImpacts", async () => {
      const evaluationPeriodInYears = 10;
      const usecase = buildUseCase(fricheSite);
      const result = await usecase.execute({
        siteId: fricheSite.id,
        evaluationPeriodInYears,
      });

      assert.strictEqual(result.isSuccess(), true);
      const data = (result as SuccessResult<GetSiteImpactsDto>).getData();
      assert.ok(data.economicImpacts.total > -700000);
    });
  });
});
