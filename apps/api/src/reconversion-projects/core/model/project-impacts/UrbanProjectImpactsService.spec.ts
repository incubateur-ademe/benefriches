/* oxlint-disable typescript/dot-notation */
import assert from "node:assert/strict";
import { before, beforeEach, describe, it } from "node:test";
import type { AvoidedCO2EqEmissions } from "shared";

import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

import type {
  InputFricheData,
  InputReconversionProjectData,
} from "./ReconversionProjectImpactsService";
import { UrbanProjectImpactsService } from "./UrbanProjectImpactsService";

const reconversionProjectImpactDataView = {
  involvesReinstatement: true,
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
    buildingsFloorAreaDistribution: { RESIDENTIAL: 11000 },
  },
  developmentPlanType: "URBAN_PROJECT",
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
} as const satisfies InputReconversionProjectData;

const site = {
  contaminatedSoilSurface: 5000,
  nature: "FRICHE",
  surfaceArea: 15000,
  soilsDistribution: {
    PRAIRIE_TREES: 0,
    IMPERMEABLE_SOILS: 5000,
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

const commonSocioEconomicImpacts = [
  "rental_income",
  "avoided_friche_costs",
  "property_transfer_duties_income",
  "ecosystem_services",
  "water_regulation",
] as const;

const urbanProjectSocioEconomicImpacts = [
  "avoided_car_related_expenses",
  "avoided_air_conditioning_expenses",
  "roads_and_utilities_maintenance_expenses",
  "travel_time_saved",
  "avoided_traffic_accidents",
  "avoided_co2_eq_emissions",
  "avoided_air_pollution",
  "avoided_property_damages_expenses",
  "local_property_value_increase",
  "local_transfer_duties_increase",
  "taxes_income",
  "ecosystem_services",
  "water_regulation",
] as const;

describe("UrbanProjectImpactsService", () => {
  let dateProvider: DateProvider;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
  });

  it("returns socioeconomic impacts related to local property value increase for friche", () => {
    const urbanProjectImpactsService = new UrbanProjectImpactsService({
      reconversionProject: reconversionProjectImpactDataView,
      relatedSite: site,
      evaluationPeriodInYears: 10,
      dateProvider: dateProvider,
      siteCityData: {
        siteIsFriche: true,
        cityPopulation: 150000,
        citySquareMetersSurfaceArea: 1500000000,
        cityPropertyValuePerSquareMeter: 2500,
      },
    });

    const result = urbanProjectImpactsService.formatImpacts();

    {
      const found = result.socioeconomic.impacts.find((i) => {
        try {
          assert.deepStrictEqual(i, {
            actor: "local_people",
            amount: i.amount,
            impact: "local_property_value_increase",
            impactCategory: "economic_indirect",
          });
          return true;
        } catch {
          return false;
        }
      });
      assert.ok(found !== undefined, "expected local_property_value_increase impact");
      assert.ok(typeof found.amount === "number", "amount should be a number");
    }

    {
      const found = result.socioeconomic.impacts.find((i) => {
        try {
          assert.deepStrictEqual(i, {
            actor: "community",
            amount: i.amount,
            impact: "local_transfer_duties_increase",
            impactCategory: "economic_indirect",
          });
          return true;
        } catch {
          return false;
        }
      });
      assert.ok(found !== undefined, "expected local_transfer_duties_increase impact");
      assert.ok(typeof found.amount === "number", "amount should be a number");
    }
  });

  it("returns no impacts related to local property value increase for non friche", () => {
    const urbanProjectImpactsService = new UrbanProjectImpactsService({
      reconversionProject: reconversionProjectImpactDataView,
      relatedSite: {
        ...site,
        nature: "AGRICULTURAL_OPERATION",
        yearlyIncomes: [{ source: "operations", amount: 10000 }],
      },
      evaluationPeriodInYears: 10,
      dateProvider: dateProvider,
      siteCityData: {
        siteIsFriche: false,
        cityPopulation: 150000,
        citySquareMetersSurfaceArea: 1500000000,
      },
    });

    const result = urbanProjectImpactsService.formatImpacts();

    assert.strictEqual(
      result.socioeconomic.impacts.some(({ impact }) => impact === "local_property_value_increase"),
      false,
    );
    assert.strictEqual(
      result.socioeconomic.impacts.some(
        ({ impact }) => impact === "local_transfer_duties_increase",
      ),
      false,
    );
  });

  describe("TaxesIncomeImpact", () => {
    it("returns taxes income impact when new houses planned in project", () => {
      const projectImpactsService = new UrbanProjectImpactsService({
        reconversionProject: reconversionProjectImpactDataView,
        relatedSite: site,
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        siteCityData: {
          siteIsFriche: true,
          cityPopulation: 150000,
          citySquareMetersSurfaceArea: 1500000000,
          cityPropertyValuePerSquareMeter: 2500,
        },
      });
      assert.deepStrictEqual(projectImpactsService["taxesIncomeImpact"], [
        {
          actor: "community",
          amount: 280115,
          impact: "taxes_income",
          impactCategory: "economic_indirect",
          details: [
            {
              impact: "project_new_houses_taxes_income",
              amount: 280115,
            },
          ],
        },
      ]);
    });

    it("returns taxes income impact when economic activity places planned in project", () => {
      const projectImpactsService = new UrbanProjectImpactsService({
        reconversionProject: {
          ...reconversionProjectImpactDataView,
          developmentPlanFeatures: {
            buildingsFloorAreaDistribution: { LOCAL_STORE: 500, OFFICES: 500 },
          },
        },
        relatedSite: site,
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        siteCityData: {
          siteIsFriche: true,
          cityPopulation: 150000,
          citySquareMetersSurfaceArea: 1500000000,
          cityPropertyValuePerSquareMeter: 2500,
        },
      });
      assert.deepStrictEqual(projectImpactsService["taxesIncomeImpact"], [
        {
          actor: "community",
          amount: 606001,
          impact: "taxes_income",
          impactCategory: "economic_indirect",
          details: [
            {
              impact: "project_new_company_taxation_income",
              amount: 606001,
            },
          ],
        },
      ]);
    });
  });

  describe("urban project impacts", () => {
    let urbanProjectImpactsService: UrbanProjectImpactsService;
    before(() => {
      urbanProjectImpactsService = new UrbanProjectImpactsService({
        reconversionProject: {
          ...reconversionProjectImpactDataView,
          developmentPlanFeatures: {
            buildingsFloorAreaDistribution: {
              RESIDENTIAL: 160000000,
              LOCAL_STORE: 1000,
              OFFICES: 1000,
              OTHER_CULTURAL_PLACE: 500,
              SPORTS_FACILITIES: 1000,
            },
          },
        },
        relatedSite: site,
        evaluationPeriodInYears: 10,
        dateProvider: new DeterministicDateProvider(new Date("2024-01-05T13:00:00")),
        siteCityData: {
          siteIsFriche: true,
          cityPopulation: 300000,
          citySquareMetersSurfaceArea: 6000000000,
          cityPropertyValuePerSquareMeter: 2500,
        },
      });
    });

    for (const impactName of commonSocioEconomicImpacts) {
      it(`inherit common socio economic impact : ${impactName}`, () => {
        const result = urbanProjectImpactsService.formatImpacts();
        assert.strictEqual(
          result.socioeconomic.impacts.some(({ impact }) => impact === impactName),
          true,
        );
      });
    }

    for (const impactName of urbanProjectSocioEconomicImpacts) {
      it(`has urban project socio economic impact : ${impactName}`, () => {
        const result = urbanProjectImpactsService.formatImpacts();
        assert.strictEqual(
          result.socioeconomic.impacts.some(({ impact }) => impact === impactName),
          true,
        );
      });
    }

    it("has urban project avoided_co2_eq_emissions socio economic impact with traffic and air conditioning", () => {
      const result = urbanProjectImpactsService.formatImpacts();

      const avoidedCo2Emissions = result.socioeconomic.impacts.find(
        ({ impact }) => impact === "avoided_co2_eq_emissions",
      ) as AvoidedCO2EqEmissions | undefined;

      {
        const found = avoidedCo2Emissions?.details?.find((d) => {
          try {
            assert.deepStrictEqual(d, {
              amount: d.amount,
              impact: "avoided_traffic_co2_eq_emissions",
            });
            return true;
          } catch {
            return false;
          }
        });
        assert.ok(found !== undefined, "expected avoided_traffic_co2_eq_emissions detail");
        assert.ok(typeof found.amount === "number", "amount should be a number");
      }

      {
        const found = avoidedCo2Emissions?.details?.find((d) => {
          try {
            assert.deepStrictEqual(d, {
              amount: d.amount,
              impact: "avoided_air_conditioning_co2_eq_emissions",
            });
            return true;
          } catch {
            return false;
          }
        });
        assert.ok(found !== undefined, "expected avoided_air_conditioning_co2_eq_emissions detail");
        assert.ok(typeof found.amount === "number", "amount should be a number");
      }
    });

    it("returns urban project social impacts", () => {
      const result = urbanProjectImpactsService.formatImpacts();

      assert.deepStrictEqual(result.social, {
        accidents: urbanProjectImpactsService["accidentsImpact"],
        fullTimeJobs: urbanProjectImpactsService["fullTimeJobsImpact"],
        avoidedVehiculeKilometers:
          urbanProjectImpactsService[
            "travelRelatedImpactsService"
          ].getAvoidedKilometersPerVehicule(),
        travelTimeSaved:
          urbanProjectImpactsService["travelRelatedImpactsService"].getTravelTimeSavedPerTraveler(),
        avoidedTrafficAccidents:
          urbanProjectImpactsService["travelRelatedImpactsService"].getAvoidedTrafficAccidents(),
      });
    });

    it("returns urban project environmental impacts on friche", () => {
      const result = urbanProjectImpactsService.formatImpacts();

      assert.ok(result.environmental.nonContaminatedSurfaceArea !== undefined);
      assert.ok(result.environmental.permeableSurfaceArea !== undefined);
      assert.ok(result.environmental.soilsCo2eqStorage !== undefined);
      assert.ok(result.environmental.soilsCarbonStorage !== undefined);
      assert.strictEqual(
        result.environmental.avoidedCo2eqEmissions?.withCarTrafficDiminution,
        urbanProjectImpactsService["travelRelatedImpactsService"].getAvoidedTrafficCO2Emissions()
          ?.inTons,
      );
      assert.strictEqual(
        result.environmental.avoidedCo2eqEmissions?.withAirConditioningDiminution,
        urbanProjectImpactsService[
          "urbanFreshnessImpactsService"
        ].getAvoidedAirConditioningCo2Emissions()?.inTons,
      );
    });

    it("returns urban project environmental impacts on agricultural site", () => {
      const result = new UrbanProjectImpactsService({
        reconversionProject: {
          ...reconversionProjectImpactDataView,
          developmentPlanFeatures: {
            buildingsFloorAreaDistribution: {
              RESIDENTIAL: 160000000,
              LOCAL_STORE: 1000,
              OFFICES: 1000,
              OTHER_CULTURAL_PLACE: 500,
              SPORTS_FACILITIES: 1000,
            },
          },
        },
        relatedSite: {
          ...site,
          nature: "AGRICULTURAL_OPERATION",
          yearlyIncomes: [{ source: "operations", amount: 10000 }],
        },
        evaluationPeriodInYears: 10,
        dateProvider: new DeterministicDateProvider(new Date("2024-01-05T13:00:00")),
        siteCityData: {
          siteIsFriche: false,
          cityPopulation: 300000,
          citySquareMetersSurfaceArea: 6000000000,
        },
      }).formatImpacts();

      assert.strictEqual(result.environmental.nonContaminatedSurfaceArea, undefined);
      assert.ok(result.environmental.permeableSurfaceArea !== undefined);
      assert.ok(result.environmental.soilsCo2eqStorage !== undefined);
      assert.ok(result.environmental.soilsCarbonStorage !== undefined);
      assert.strictEqual(result.environmental.avoidedCo2eqEmissions, undefined);
    });
  });
});
