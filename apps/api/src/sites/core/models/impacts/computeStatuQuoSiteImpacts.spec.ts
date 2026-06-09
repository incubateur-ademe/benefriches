import { GetSiteImpactsDto, SiteImpactsDataView } from "shared";
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
  describe("structure de retour", () => {
    it("retourne les clés attendues", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: false },
      });

      expect(result).toMatchObject({
        projectionYears: expect.any(Array) as string[],
        economicImpacts: expect.any(Object) as GetSiteImpactsDto["economicImpacts"],
        stakeholders: expect.any(Object) as GetSiteImpactsDto["stakeholders"],
      });
    });

    it("projectionYears has same length as cumulativeByYear", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: false },
      });

      for (let i = 1; i < result.economicImpacts.details.length; i++) {
        expect(result.economicImpacts.details[i]?.detailsByYear).toHaveLength(
          result.projectionYears.length,
        );
        expect(result.economicImpacts.details[i]?.cumulativeByYear).toHaveLength(
          result.projectionYears.length,
        );
      }
    });

    it("projectionYears starts with operationsFirstYear", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: false },
      });

      expect(result.projectionYears[0]).toBe(String(BASE_PARAMS.operationsFirstYear));
    });
  });

  describe("stakeholders", () => {
    it("use input site owner", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: false },
      });

      expect(result.stakeholders.owner).toMatchObject({
        structureType: fricheSite.ownerStructureType,
        structureName: fricheSite.ownerName,
      });
    });

    it("operator is undefined when isSiteOperated is false", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: false },
      });

      expect(result.stakeholders.operator).toBeUndefined();
    });

    it("operator is tenant when isSiteOperated and tenantStructureType is defined", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: true },
      });

      expect(result.stakeholders.operator).toMatchObject({
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

      expect(result.stakeholders.operator).toMatchObject({
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

      expect(result.economicImpacts.total).not.toBe(0);

      const hasOperating = result.economicImpacts.details.some(
        (d) => d.name === "operatingEconomicBalance",
      );
      expect(hasOperating).toBe(true);
    });

    it("cumulativeBalanceByYear includes operatingEconomicBalance only if operator is company", () => {
      const resultCompany = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: true },
      });

      const hasOperating = resultCompany.economicImpacts.details.some(
        (d) => d.name === "operatingEconomicBalance",
      );
      expect(hasOperating).toBe(true);
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
      expect(carbon?.total).toBeCloseTo(2750000.0000000005);
      expect(carbon?.detailsByYear).toEqual([carbon?.total, 0, 0, 0, 0]);
      expect(carbon?.cumulativeByYear).toEqual([
        carbon?.total,
        carbon?.total,
        carbon?.total,
        carbon?.total,
        carbon?.total,
      ]);
    });

    it("without soilsCarbonStorage, storedCo2Eq is not included", () => {
      const result = computeStatuQuoSiteImpacts({
        ...BASE_PARAMS,
        site: { ...fricheSite, isSiteOperated: false },
      });

      const hasCarbon = result.economicImpacts.details.some((d) => d.name === "storedCo2Eq");
      expect(hasCarbon).toBe(false);
    });
  });
});
