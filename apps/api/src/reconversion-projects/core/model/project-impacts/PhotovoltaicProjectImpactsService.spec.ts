/* oxlint-disable typescript/dot-notation */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

import { PhotovoltaicProjectImpactsService } from "./PhotovoltaicProjectImpactsService";
import type {
  InputFricheData,
  InputReconversionProjectData,
} from "./ReconversionProjectImpactsService";

const reconversionProjectImpactDataView: InputReconversionProjectData = {
  soilsDistribution: [
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      spaceCategory: "PUBLIC_GREEN_SPACE",
      surfaceArea: 10000,
    },
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
      surfaceArea: 20000,
    },
    { soilType: "BUILDINGS", spaceCategory: "LIVING_AND_ACTIVITY_SPACE", surfaceArea: 20000 },
    { soilType: "MINERAL_SOIL", spaceCategory: "LIVING_AND_ACTIVITY_SPACE", surfaceArea: 20000 },
    { soilType: "IMPERMEABLE_SOILS", spaceCategory: "PUBLIC_SPACE", surfaceArea: 30000 },
  ],
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
  developmentPlanInstallationExpenses: [{ amount: 200000, purpose: "installation_works" }],
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
  soilsCarbonStorage: { total: 10, ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10 },
} as const;

const site = {
  contaminatedSoilSurface: 5000,
  nature: "FRICHE",
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
  soilsCarbonStorage: {
    total: 25,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10,
    ARTIFICIAL_TREE_FILLED: 15,
  },
} as const satisfies Required<InputFricheData>;

describe("Photovoltaic power plant specific impacts: Avoided CO2 eq emissions with EnR production", () => {
  let dateProvider: DateProvider;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
  });

  it("returns householdsPoweredByRenewableEnergy, avoidedCO2TonsWithEnergyProduction and socioEconomic avoidedCO2TonsWithEnergyProduction", () => {
    const photovoltaicProjectImpactsService = new PhotovoltaicProjectImpactsService({
      reconversionProject: reconversionProjectImpactDataView,
      relatedSite: site,
      evaluationPeriodInYears: 10,
      dateProvider: dateProvider,
    });

    const result = photovoltaicProjectImpactsService.formatImpacts();

    const avoidedCo2Impact = result.socioeconomic.impacts.find(
      (i) => i.impact === "avoided_co2_eq_emissions",
    );
    assert.ok(avoidedCo2Impact !== undefined);
    assert.ok(typeof avoidedCo2Impact.amount === "number");
    assert.deepStrictEqual(avoidedCo2Impact.impactCategory, "environmental_monetary");
    assert.deepStrictEqual(avoidedCo2Impact.actor, "human_society");
    assert.ok(Array.isArray((avoidedCo2Impact as { details?: unknown[] }).details));
    const details = (avoidedCo2Impact as { details: { impact: string; amount: unknown }[] })
      .details;
    assert.strictEqual(details.length, 1);
    assert.ok(details.some((d) => d.impact === "avoided_co2_eq_with_enr"));
    assert.ok(details.every((d) => typeof d.amount === "number"));

    assert.ok(
      typeof result.environmental.avoidedCo2eqEmissions.withRenewableEnergyProduction === "number",
    );
    const households = result.social.householdsPoweredByRenewableEnergy;
    assert.ok(households !== undefined);
    assert.ok(typeof households.base === "number");
    assert.deepStrictEqual(households.base, 0);
    assert.ok(typeof households.forecast === "number");
  });

  for (const impactName of [
    "rental_income",
    "avoided_friche_costs",
    "taxes_income",
    "property_transfer_duties_income",
    "ecosystem_services",
    "water_regulation",
  ] as const) {
    it(`inherit common socio economic impact : ${impactName}`, () => {
      const photovoltaicProjectImpactsService = new PhotovoltaicProjectImpactsService({
        reconversionProject: reconversionProjectImpactDataView,
        relatedSite: site,
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
      });

      const result = photovoltaicProjectImpactsService.formatImpacts();

      assert.strictEqual(
        result.socioeconomic.impacts.some(({ impact }) => impact === impactName),
        true,
      );
    });
  }

  it("format impacts as ReconversionProjectImpacts object", () => {
    const photovoltaicProjectImpactsService = new PhotovoltaicProjectImpactsService({
      reconversionProject: reconversionProjectImpactDataView,
      relatedSite: site,
      evaluationPeriodInYears: 10,
      dateProvider: dateProvider,
    });

    const result = photovoltaicProjectImpactsService.formatImpacts();

    assert.deepStrictEqual(result.socioeconomic.impacts, [
      ...photovoltaicProjectImpactsService["rentImpacts"],
      ...photovoltaicProjectImpactsService["avoidedFricheCosts"],
      ...photovoltaicProjectImpactsService["propertyTransferDutiesIncome"],
      ...photovoltaicProjectImpactsService["natureConservationSocioEconomicImpacts"],
      ...photovoltaicProjectImpactsService["taxesIncomeImpact"],
      ...photovoltaicProjectImpactsService["avoidedCo2EqEmissionsMonetaryValue"],
    ]);
    assert.deepStrictEqual(result.social, {
      fullTimeJobs: photovoltaicProjectImpactsService["fullTimeJobsImpact"],
      accidents: photovoltaicProjectImpactsService["accidentsImpact"],
      householdsPoweredByRenewableEnergy:
        photovoltaicProjectImpactsService["householdsPoweredByRenewableEnergy"],
    });
    assert.deepStrictEqual(
      result.environmental.nonContaminatedSurfaceArea,
      photovoltaicProjectImpactsService["nonContaminatedSurfaceArea"],
    );
    assert.deepStrictEqual(
      result.environmental.permeableSurfaceArea,
      photovoltaicProjectImpactsService["permeableSurfaceArea"],
    );
    assert.deepStrictEqual(
      result.environmental.soilsCo2eqStorage,
      photovoltaicProjectImpactsService["soilsCo2eqStorage"],
    );
    assert.deepStrictEqual(
      result.environmental.soilsCarbonStorage,
      photovoltaicProjectImpactsService["soilsCarbonStorage"],
    );
    // avoidedCo2eqEmissions.withRenewableEnergyProduction uses closeTo (precision 1)
    const actual = result.environmental.avoidedCo2eqEmissions.withRenewableEnergyProduction ?? 0;
    const expected = photovoltaicProjectImpactsService["avoidedCO2TonsWithEnergyProduction"] ?? 0;
    assert.ok(Math.abs(actual - expected) < Math.pow(10, -1) / 2);
    assert.deepStrictEqual(
      result.economicBalance,
      photovoltaicProjectImpactsService["economicBalance"],
    );
  });
});
