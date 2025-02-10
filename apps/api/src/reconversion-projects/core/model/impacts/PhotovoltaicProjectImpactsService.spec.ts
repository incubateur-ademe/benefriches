/* eslint-disable @typescript-eslint/dot-notation */
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

import { FakeGetSoilsCarbonStorageService } from "../../gateways/FakeGetSoilsCarbonStorageService";
import { PhotovoltaicProjectImpactsService } from "./PhotovoltaicProjectImpactsService";
import { InputReconversionProjectData, InputSiteData } from "./ReconversionProjectImpactsService";

const reconversionProjectImpactDataView: InputReconversionProjectData = {
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
  reinstatementExpenses: [{ amount: 500000, purpose: "demolition" }],
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
  yearlyProjectedExpenses: [
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

const site = {
  contaminatedSoilSurface: 5000,
  isFriche: true,
  surfaceArea: 20000,
  soilsDistribution: {
    PRAIRIE_TREES: 0,
    IMPERMEABLE_SOILS: 10000,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
  },
  addressCityCode: "69000",
  ownerName: "Current owner",
  tenantName: "Current tenant",
  accidentsDeaths: 0,
  accidentsMinorInjuries: 1,
  accidentsSevereInjuries: 2,
  yearlyExpenses: [
    { amount: 54000, bearer: "tenant", purpose: "rent" },
    { amount: 11600, bearer: "tenant", purpose: "security" },
    { amount: 1500, bearer: "tenant", purpose: "illegalDumpingCost" },
    { amount: 500, bearer: "owner", purpose: "propertyTaxes" },
  ],
} as const satisfies Required<InputSiteData>;

describe("Photovoltaic power plant specific impacts: Avoided CO2 eq emissions with EnR production", () => {
  let dateProvider: DateProvider;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
  });

  it("returns householdsPoweredByRenewableEnergy, avoidedCO2TonsWithEnergyProduction and socioEconomic avoidedCO2TonsWithEnergyProduction", async () => {
    const photovoltaicProjectImpactsService = new PhotovoltaicProjectImpactsService({
      reconversionProject: reconversionProjectImpactDataView,
      relatedSite: site,
      evaluationPeriodInYears: 10,
      dateProvider: dateProvider,
      getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
    });

    const result = await photovoltaicProjectImpactsService.formatImpacts();

    expect(result.socioeconomic.impacts).toContainEqual({
      amount: expect.any(Number) as number,
      impact: "avoided_co2_eq_emissions",
      impactCategory: "environmental_monetary",
      actor: "human_society",
      details: [
        {
          impact: "avoided_co2_eq_with_enr",
          amount: expect.any(Number) as number,
        },
      ],
    });
    expect(result.environmental.avoidedCO2TonsWithEnergyProduction).toMatchObject({
      current: 0,
      forecast: expect.any(Number) as number,
    });
    expect(result.social.householdsPoweredByRenewableEnergy).toMatchObject({
      current: 0,
      forecast: expect.any(Number) as number,
    });
  });

  it.each([
    "rental_income",
    "avoided_friche_costs",
    "taxes_income",
    "property_transfer_duties_income",
    "ecosystem_services",
    "water_regulation",
  ])("inherit common socio economic impact : %s", async (impactName) => {
    const photovoltaicProjectImpactsService = new PhotovoltaicProjectImpactsService({
      reconversionProject: reconversionProjectImpactDataView,
      relatedSite: site,
      evaluationPeriodInYears: 10,
      dateProvider: dateProvider,
      getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
    });

    const result = await photovoltaicProjectImpactsService.formatImpacts();

    expect(result.socioeconomic.impacts.some(({ impact }) => impact === impactName)).toBe(true);
  });

  it("format impacts as ReconversionProjectImpacts object", async () => {
    const photovoltaicProjectImpactsService = new PhotovoltaicProjectImpactsService({
      reconversionProject: reconversionProjectImpactDataView,
      relatedSite: site,
      evaluationPeriodInYears: 10,
      dateProvider: dateProvider,
      getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
    });

    const result = await photovoltaicProjectImpactsService.formatImpacts();

    const soilsRelatedSocioEconomicImpacts =
      await photovoltaicProjectImpactsService["getEnvironmentalSoilsRelatedImpacts"]();

    expect(result.socioeconomic.impacts).toEqual([
      ...photovoltaicProjectImpactsService["rentImpacts"],
      ...photovoltaicProjectImpactsService["avoidedFricheCosts"],
      ...photovoltaicProjectImpactsService["propertyTransferDutiesIncome"],
      ...soilsRelatedSocioEconomicImpacts.socioEconomicList,
      ...photovoltaicProjectImpactsService["taxesIncomeImpact"],
      ...photovoltaicProjectImpactsService["avoidedCo2EqEmissions"],
    ]);
    expect(result.social).toEqual({
      fullTimeJobs: photovoltaicProjectImpactsService["fullTimeJobsImpact"],
      accidents: photovoltaicProjectImpactsService["accidentsImpact"],
      householdsPoweredByRenewableEnergy:
        photovoltaicProjectImpactsService["householdsPoweredByRenewableEnergy"],
    });
    expect(result.environmental).toEqual({
      ...soilsRelatedSocioEconomicImpacts.environmental,
      avoidedCO2TonsWithEnergyProduction:
        photovoltaicProjectImpactsService["avoidedCO2TonsWithEnergyProduction"],
    });
    expect(result.economicBalance).toEqual(photovoltaicProjectImpactsService["economicBalance"]);
  });
});
