/* eslint-disable @typescript-eslint/dot-notation */
import { AvoidedCO2EqEmissions } from "shared";

import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

import { InputFricheData, InputReconversionProjectData } from "./ReconversionProjectImpactsService";
import { UrbanProjectImpactsService } from "./UrbanProjectImpactsService";

const reconversionProjectImpactDataView = {
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
  developmentPlanInstallationExpenses: [{ amount: 200000, purpose: "installation_works" }],
  developmentPlanFeatures: {
    buildingsFloorAreaDistribution: { RESIDENTIAL: 11000 },
    spacesDistribution: { BUILDINGS_FOOTPRINT: 1000 },
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

    expect(result.socioeconomic.impacts).toContainEqual({
      actor: "local_people",
      amount: expect.any(Number) as number,
      impact: "local_property_value_increase",
      impactCategory: "economic_indirect",
    });
    expect(result.socioeconomic.impacts).toContainEqual({
      actor: "community",
      amount: expect.any(Number) as number,
      impact: "local_transfer_duties_increase",
      impactCategory: "economic_indirect",
    });
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

    expect(
      result.socioeconomic.impacts.some(({ impact }) => impact === "local_property_value_increase"),
    ).toBe(false);
    expect(
      result.socioeconomic.impacts.some(
        ({ impact }) => impact === "local_transfer_duties_increase",
      ),
    ).toBe(false);
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
      expect(projectImpactsService["taxesIncomeImpact"]).toEqual([
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
            spacesDistribution: {
              BUILDINGS_FOOTPRINT: 1000,
            },
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
      expect(projectImpactsService["taxesIncomeImpact"]).toEqual([
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
    beforeAll(() => {
      urbanProjectImpactsService = new UrbanProjectImpactsService({
        reconversionProject: {
          ...reconversionProjectImpactDataView,
          developmentPlanFeatures: {
            buildingsFloorAreaDistribution: {
              RESIDENTIAL: 160000000,
              LOCAL_STORE: 1000,
              OFFICES: 1000,
              CULTURAL_PLACE: 500,
              SPORTS_FACILITIES: 1000,
            },
            spacesDistribution: {
              BUILDINGS_FOOTPRINT: 10000,
              PUBLIC_GREEN_SPACES: 65100,
            },
          },
        },
        relatedSite: site,
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        siteCityData: {
          siteIsFriche: true,
          cityPopulation: 300000,
          citySquareMetersSurfaceArea: 6000000000,
          cityPropertyValuePerSquareMeter: 2500,
        },
      });
    });

    it.each(commonSocioEconomicImpacts)(
      "inherit common socio economic impact : %s",
      (impactName) => {
        const result = urbanProjectImpactsService.formatImpacts();

        expect(result.socioeconomic.impacts.some(({ impact }) => impact === impactName)).toBe(true);
      },
    );

    it.each(urbanProjectSocioEconomicImpacts)(
      "has urban project socio economic impact : %s",
      (impactName) => {
        const result = urbanProjectImpactsService.formatImpacts();

        expect(result.socioeconomic.impacts.some(({ impact }) => impact === impactName)).toBe(true);
      },
    );

    it("has urban project avoided_co2_eq_emissions socio economic impact with traffic and air conditioning", () => {
      const result = urbanProjectImpactsService.formatImpacts();

      const avoidedCo2Emissions = result.socioeconomic.impacts.find(
        ({ impact }) => impact === "avoided_co2_eq_emissions",
      ) as AvoidedCO2EqEmissions | undefined;

      expect(avoidedCo2Emissions?.details).toContainEqual({
        amount: expect.any(Number) as number,
        impact: "avoided_traffic_co2_eq_emissions",
      });
      expect(avoidedCo2Emissions?.details).toContainEqual({
        amount: expect.any(Number) as number,
        impact: "avoided_air_conditioning_co2_eq_emissions",
      });
    });

    it("returns urban project social impacts", () => {
      const result = urbanProjectImpactsService.formatImpacts();

      expect(result.social).toEqual({
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

      expect(result.environmental.nonContaminatedSurfaceArea).toBeDefined();
      expect(result.environmental.permeableSurfaceArea).toBeDefined();
      expect(result.environmental.soilsCo2eqStorage).toBeDefined();
      expect(result.environmental.soilsCarbonStorage).toBeDefined();
      expect(result.environmental.avoidedCo2eqEmissions?.withCarTrafficDiminution).toEqual(
        urbanProjectImpactsService["travelRelatedImpactsService"].getAvoidedTrafficCO2Emissions()
          ?.inTons,
      );
      expect(result.environmental.avoidedCo2eqEmissions?.withAirConditioningDiminution).toEqual(
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
              CULTURAL_PLACE: 500,
              SPORTS_FACILITIES: 1000,
            },
            spacesDistribution: {
              BUILDINGS_FOOTPRINT: 10000,
              PUBLIC_GREEN_SPACES: 65100,
            },
          },
        },
        relatedSite: {
          ...site,
          nature: "AGRICULTURAL_OPERATION",
          yearlyIncomes: [{ source: "operations", amount: 10000 }],
        },
        evaluationPeriodInYears: 10,
        dateProvider: dateProvider,
        siteCityData: {
          siteIsFriche: false,
          cityPopulation: 300000,
          citySquareMetersSurfaceArea: 6000000000,
        },
      }).formatImpacts();

      expect(result.environmental.nonContaminatedSurfaceArea).toBeUndefined();
      expect(result.environmental.permeableSurfaceArea).toBeDefined();
      expect(result.environmental.soilsCo2eqStorage).toBeDefined();
      expect(result.environmental.soilsCarbonStorage).toBeDefined();
      expect(result.environmental.avoidedCo2eqEmissions).toBeUndefined();
    });
  });
});
