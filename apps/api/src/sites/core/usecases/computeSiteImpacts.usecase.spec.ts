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

      expect(result.isFailure()).toBe(true);
      expect((result as FailureResult<"SiteNotFound">).getError()).toBe("SiteNotFound");
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

      expect(result.isSuccess()).toBe(true);
      const data = (result as SuccessResult<GetSiteImpactsDto>).getData();
      expect(data.projectionYears[0]).toEqual("2026");
      expect(data.projectionYears).toHaveLength(50);
    });

    it("projectionYears has exactly evaluationPeriodInYears entries", async () => {
      const evaluationPeriodInYears = 10;
      const usecase = buildUseCase(fricheSite);
      const result = await usecase.execute({
        siteId: fricheSite.id,
        evaluationPeriodInYears,
      });

      const data = (result as SuccessResult<GetSiteImpactsDto>).getData();
      expect(data.projectionYears).toHaveLength(evaluationPeriodInYears);
      expect(data.projectionYears).toEqual([
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
      expect(data.projectionYears[0]).toBe("2028");
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
      expect(data.stakeholders.owner?.structureType).toBe(fricheSite.ownerStructureType);
      expect(data.stakeholders.owner?.structureName).toBe(fricheSite.ownerName);
      expect(data.stakeholders.operator?.structureType).toBe(fricheSite.tenantStructureType);
      expect(data.stakeholders.operator?.structureName).toBe(fricheSite.tenantName);
      expect(data.stakeholders.tenant?.structureType).toBe(fricheSite.tenantStructureType);
      expect(data.stakeholders.tenant?.structureName).toBe(fricheSite.tenantName);
    });

    it("computes operatingEconomicBalance and indirectEconomicImpacts", async () => {
      const evaluationPeriodInYears = 10;
      const usecase = buildUseCase(fricheSite);
      const result = await usecase.execute({
        siteId: fricheSite.id,
        evaluationPeriodInYears,
      });

      expect(result.isSuccess()).toBe(true);
      const data = (result as SuccessResult<GetSiteImpactsDto>).getData();
      expect(data.operatingEconomicBalance.total).toBeGreaterThan(-700000);
      expect(data.indirectEconomicImpacts.total).toBeGreaterThan(-700000);
    });
  });
});
