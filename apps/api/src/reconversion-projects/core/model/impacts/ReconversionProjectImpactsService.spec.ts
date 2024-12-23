/* eslint-disable @typescript-eslint/dot-notation */
import { v4 as uuid } from "uuid";

import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";

import { FakeGetSoilsCarbonStorageService } from "../../gateways/FakeGetSoilsCarbonStorageService";
import {
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
} from "../../usecases/computeReconversionProjectImpacts.usecase";
import { ReconversionProjectImpactsService } from "./ReconversionProjectImpactsService";

const reconversionProjectImpactDataView: ReconversionProjectImpactsDataView = {
  id: uuid(),
  name: "Project with big impacts",
  relatedSiteId: uuid(),
  isExpressProject: false,
  soilsDistribution: {
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
    PRAIRIE_TREES: 20000,
    BUILDINGS: 20000,
    MINERAL_SOIL: 20000,
    IMPERMEABLE_SOILS: 30000,
  },
  conversionSchedule: {
    startDate: new Date("2025-07-01"),
    endDate: new Date("2026-07-01"),
  },
  reinstatementSchedule: {
    startDate: new Date("2025-01-01"),
    endDate: new Date("2026-01-01"),
  },
  futureOperatorName: "Mairie de Blajan",
  futureSiteOwnerName: "Mairie de Blajan",
  reinstatementContractOwnerName: "Mairie de Blajan",
  sitePurchaseTotalAmount: 150000,
  reinstatementCosts: [{ amount: 500000, purpose: "demolition" }],
  developmentPlanInstallationCosts: [{ amount: 200000, purpose: "installation_works" }],
  developmentPlanFeatures: {
    surfaceArea: 5000,
    electricalPowerKWc: 53,
    contractDuration: 20,
    expectedAnnualProduction: 4679,
  },
  developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
  developmentPlanDeveloperName: "Mairie de Blajan",
  financialAssistanceRevenues: [{ amount: 150000, source: "public_subsidies" }],
  yearlyProjectedCosts: [
    { amount: 1000, purpose: "taxes" },
    { amount: 10000, purpose: "maintenance" },
  ],
  yearlyProjectedRevenues: [
    { amount: 10000, source: "rent" },
    { amount: 1000, source: "other" },
  ],
  sitePurchasePropertyTransferDutiesAmount: 5432,
  operationsFirstYear: 2025,
  decontaminatedSoilSurface: 20000,
} as const;

const site: Required<SiteImpactsDataView> = {
  id: reconversionProjectImpactDataView.relatedSiteId,
  contaminatedSoilSurface: 5000,
  name: "My base site",
  isFriche: true,
  fricheActivity: "AGRICULTURAL",
  surfaceArea: 20000,
  soilsDistribution: {
    PRAIRIE_TREES: 0,
    IMPERMEABLE_SOILS: 10000,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
  },
  addressCityCode: "69000",
  addressLabel: "Lyon",
  ownerName: "Current owner",
  ownerStructureType: "company",
  tenantName: "Current tenant",
  hasAccidents: true,
  accidentsDeaths: 0,
  accidentsMinorInjuries: 1,
  accidentsSevereInjuries: 2,
  yearlyCosts: [
    { amount: 54000, bearer: "tenant", purpose: "rent" },
    { amount: 11600, bearer: "tenant", purpose: "security" },
    { amount: 1500, bearer: "tenant", purpose: "illegalDumpingCost" },
    { amount: 500, bearer: "owner", purpose: "taxes" },
  ],
} as const;

describe("ReconversionProjectImpactsService: computes common impacts for all kind of project", () => {
  let dateProvider: DateProvider;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
  });

  describe("Rental income", () => {
    it("returns no impact when no current or future rental income", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: { ...reconversionProjectImpactDataView, yearlyProjectedCosts: [] },
        relatedSite: { ...site, yearlyCosts: [], ownerName: "Current owner", isFriche: false },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["rentImpacts"]).toEqual([]);
    });

    it("returns rental income impact over 10 years for future site owner when the site is not currently rented but will be", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: {
          ...reconversionProjectImpactDataView,
          yearlyProjectedCosts: [{ amount: 30000, purpose: "rent" }],
          futureSiteOwnerName: "Mairie de Paris",
        },
        relatedSite: { ...site, yearlyCosts: [], ownerName: "Current owner", isFriche: false },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["rentImpacts"]).toEqual([
        {
          actor: "Mairie de Paris",
          amount: 300000,
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
      ]);
    });

    it("returns rental income negative impact over 10 years for current site owner when the site is rented but won't be anymore", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: { ...reconversionProjectImpactDataView, yearlyProjectedCosts: [] },
        relatedSite: {
          ...site,
          yearlyCosts: [{ amount: 20000, purpose: "rent", bearer: "" }],
          ownerName: "Current owner",
          isFriche: false,
        },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["rentImpacts"]).toEqual([
        {
          actor: "Current owner",
          amount: -200000,
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
      ]);
    });
    it("returns cumulated rental income positive impact over 10 years for site owner when the site is currently rented and will be rented for a higher rent", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: {
          ...reconversionProjectImpactDataView,
          yearlyProjectedCosts: [{ amount: 10000, purpose: "rent" }],
          futureSiteOwnerName: undefined,
        },
        relatedSite: {
          ...site,
          yearlyCosts: [{ amount: 5000, purpose: "rent", bearer: "Mairie de Blajan" }],
          isFriche: false,
        },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["rentImpacts"]).toEqual([
        {
          actor: "Current owner",
          amount: 50000,
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
      ]);
    });

    it("returns rental income impact over 10 years for site owner and future site owner when the site is currently rented and will be but owner will change", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: {
          ...reconversionProjectImpactDataView,
          futureSiteOwnerName: "New owner",
          yearlyProjectedCosts: [{ amount: 10000, purpose: "rent" }],
        },
        relatedSite: {
          ...site,
          yearlyCosts: [{ amount: 5000, purpose: "rent", bearer: "" }],
          ownerName: "Current owner",
          isFriche: false,
        },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["rentImpacts"]).toEqual([
        {
          actor: "New owner",
          amount: 100000,
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
        {
          actor: "Current owner",
          amount: 50000,
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
      ]);
    });
  });

  describe("Avoided friche costs", () => {
    it("returns no impact when no current friche costs", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: { ...reconversionProjectImpactDataView, yearlyProjectedCosts: [] },
        relatedSite: { ...site, yearlyCosts: [], ownerName: "Current owner", isFriche: false },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["avoidedFricheCosts"]).toEqual([]);
    });

    it("returns avoided friche costs for current tenant over 10 years when friche costs", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: { ...reconversionProjectImpactDataView, yearlyProjectedCosts: [] },
        relatedSite: {
          ...site,
          yearlyCosts: [
            {
              amount: 14000,
              purpose: "security",
              bearer: "Current tenant",
            },
            {
              amount: 1000,
              purpose: "maintenance",
              bearer: "Current tenant",
            },
            {
              amount: 1500,
              purpose: "illegalDumpingCost",
              bearer: "Current tenant",
            },
            {
              amount: 1500,
              purpose: "accidentsCost",
              bearer: "Current tenant",
            },
            {
              amount: 5000,
              purpose: "otherSecuringCosts",
              bearer: "Current tenant",
            },
            {
              amount: 500000000,
              purpose: "non-relevant-cost",
              bearer: "Current tenant",
            },
          ],
          ownerName: "Current owner",
          tenantName: "Current tenant",
          isFriche: true,
        },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["avoidedFricheCosts"]).toEqual([
        {
          actor: "Current tenant",
          amount: 230000,
          impact: "avoided_friche_costs",
          impactCategory: "economic_direct",
          details: [
            { amount: 140000, impact: "avoided_security_costs" },
            { amount: 10000, impact: "avoided_maintenance_costs" },
            { amount: 15000, impact: "avoided_illegal_dumping_costs" },
            { amount: 15000, impact: "avoided_accidents_costs" },
            { amount: 50000, impact: "avoided_other_securing_costs" },
          ],
        },
      ]);
    });

    it("returns avoided friche costs for current owner over 10 years when friche costs but no tenant", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: { ...reconversionProjectImpactDataView, yearlyProjectedCosts: [] },
        relatedSite: {
          ...site,
          yearlyCosts: [
            {
              amount: 14000,
              purpose: "security",
              bearer: "Current owner",
            },
            {
              amount: 1500,
              purpose: "illegalDumpingCost",
              bearer: "Current owner",
            },
            {
              amount: 500000000,
              purpose: "non-relevant-cost",
              bearer: "Current owner",
            },
          ],
          ownerName: "Current owner",
          tenantName: undefined,
          isFriche: true,
        },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["avoidedFricheCosts"]).toEqual([
        {
          actor: "Current owner",
          amount: 155000,
          impact: "avoided_friche_costs",
          impactCategory: "economic_direct",
          details: [
            { amount: 140000, impact: "avoided_security_costs" },
            { amount: 15000, impact: "avoided_illegal_dumping_costs" },
          ],
        },
      ]);
    });

    it("returns no avoided friche costs if site is not friche", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: { ...reconversionProjectImpactDataView, yearlyProjectedCosts: [] },
        relatedSite: {
          ...site,
          yearlyCosts: [
            {
              amount: 14000,
              purpose: "maintenance",
              bearer: "Current owner",
            },
          ],
          ownerName: "Current owner",
          tenantName: undefined,
          isFriche: false,
        },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["avoidedFricheCosts"]).toEqual([]);
    });
  });

  describe("Taxes income", () => {
    it("returns no impact when no current taxes costs", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: {
          ...reconversionProjectImpactDataView,
          yearlyProjectedCosts: [],
          sitePurchasePropertyTransferDutiesAmount: undefined,
        },
        relatedSite: {
          ...site,
          yearlyCosts: [],
          ownerName: "Current owner",
          isFriche: false,
        },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["taxesImpacts"]).toEqual([]);
    });

    it("returns taxes income impact as difference between projected and current taxes amounts", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: {
          ...reconversionProjectImpactDataView,
          yearlyProjectedCosts: [{ amount: 20000, purpose: "taxes" }],
          sitePurchasePropertyTransferDutiesAmount: undefined,
        },
        relatedSite: {
          ...site,
          yearlyCosts: [{ amount: 12000, purpose: "taxes", bearer: "Current owner" }],
          ownerName: "Current owner",
          isFriche: false,
        },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["taxesImpacts"]).toEqual([
        {
          actor: "community",
          amount: 80000,
          impact: "taxes_income",
          impactCategory: "economic_indirect",
        },
      ]);
    });

    it("returns taxes income impact when only current taxes amount provided", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: {
          ...reconversionProjectImpactDataView,
          yearlyProjectedCosts: [],
          sitePurchasePropertyTransferDutiesAmount: undefined,
        },
        relatedSite: {
          ...site,
          yearlyCosts: [{ amount: 12000, purpose: "taxes", bearer: "Current owner" }],
          ownerName: "Current owner",
          isFriche: false,
        },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["taxesImpacts"]).toEqual([
        {
          actor: "community",
          amount: -120000,
          impact: "taxes_income",
          impactCategory: "economic_indirect",
        },
      ]);
    });

    it("returns taxes income impact when only projected taxes amount provided", () => {
      const projectImpactsService = new ReconversionProjectImpactsService({
        reconversionProject: {
          ...reconversionProjectImpactDataView,
          yearlyProjectedCosts: [{ amount: 1234, purpose: "taxes" }],
          sitePurchasePropertyTransferDutiesAmount: undefined,
        },
        relatedSite: {
          ...site,
          yearlyCosts: [],
          ownerName: "Current owner",
          isFriche: false,
        },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      });
      expect(projectImpactsService["taxesImpacts"]).toEqual([
        {
          actor: "community",
          amount: 12340,
          impact: "taxes_income",
          impactCategory: "economic_indirect",
        },
      ]);
    });

    describe("Property transfer duties income", () => {
      it("returns no impact when no property transfer duties", () => {
        const projectImpactsService = new ReconversionProjectImpactsService({
          reconversionProject: {
            ...reconversionProjectImpactDataView,
            yearlyProjectedCosts: [],
            sitePurchasePropertyTransferDutiesAmount: undefined,
          },
          relatedSite: {
            ...site,
            yearlyCosts: [],
            isFriche: false,
          },
          evaluationPeriodInYears: 10,
          dateProvider: dateProvider,
          getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
        });
        expect(projectImpactsService["taxesImpacts"]).toEqual([]);
      });

      it("returns property transfer duties income impact for community", () => {
        const projectImpactsService = new ReconversionProjectImpactsService({
          reconversionProject: {
            ...reconversionProjectImpactDataView,
            sitePurchasePropertyTransferDutiesAmount: 5000,
          },
          relatedSite: {
            ...site,
            yearlyCosts: [],
            isFriche: false,
          },
          evaluationPeriodInYears: 10,
          dateProvider: dateProvider,
          getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
        });
        expect(projectImpactsService["taxesImpacts"]).toContainEqual({
          actor: "community",
          amount: 5000,
          impact: "property_transfer_duties_income",
          impactCategory: "economic_direct",
        });
      });
    });
  });

  it("computes accidents impact", () => {
    const projectImpactsService = new ReconversionProjectImpactsService({
      reconversionProject: reconversionProjectImpactDataView,
      relatedSite: site,
      evaluationPeriodInYears: 10,
      dateProvider: dateProvider,
      getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
    });

    expect(projectImpactsService["accidentsImpact"]).toEqual({
      current: 3,
      forecast: 0,
      deaths: {
        current: 0,
        forecast: 0,
      },
      severeInjuries: {
        current: 2,
        forecast: 0,
      },
      minorInjuries: {
        current: 1,
        forecast: 0,
      },
    });
  });

  it("format impacts as ReconversionProjectImpacts object", async () => {
    const projectImpactsService = new ReconversionProjectImpactsService({
      reconversionProject: reconversionProjectImpactDataView,
      relatedSite: site,
      evaluationPeriodInYears: 10,
      dateProvider: dateProvider,
      getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
    });

    const result = await projectImpactsService.formatImpacts();

    const soilsRelatedSocioEconomicImpacts =
      await projectImpactsService["getEnvironmentalSoilsRelatedImpacts"]();

    expect(result.socioeconomic.impacts).toEqual([
      ...projectImpactsService["rentImpacts"],
      ...projectImpactsService["avoidedFricheCosts"],
      ...projectImpactsService["taxesImpacts"],
      ...soilsRelatedSocioEconomicImpacts.socioEconomicList,
    ]);
    expect(result.social).toEqual({
      fullTimeJobs: projectImpactsService["fullTimeJobsImpact"],
      accidents: projectImpactsService["accidentsImpact"],
    });
    expect(result.environmental).toEqual(soilsRelatedSocioEconomicImpacts.environmental);
    expect(result.economicBalance).toEqual(projectImpactsService["economicBalance"]);
  });
});
