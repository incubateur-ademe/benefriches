/* eslint-disable @typescript-eslint/dot-notation */
import { v4 as uuid } from "uuid";

import { MockLocalDataInseeService } from "src/location-features/adapters/secondary/city-data-provider/LocalDataInseeService.mock";
import { MockDV3FApiService } from "src/location-features/adapters/secondary/city-dv3f-provider/DV3FApiService.mock";
import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";

import { FakeGetSoilsCarbonStorageService } from "../../gateways/FakeGetSoilsCarbonStorageService";
import {
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
} from "../../usecases/computeReconversionProjectImpacts.usecase";
import { UrbanProjectImpactsService } from "./UrbanProjectImpactsService";

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
    buildingsFloorAreaDistribution: { RESIDENTIAL: 11000 },
    spacesDistribution: { BUILDINGS_FOOTPRINT: 1000 },
  },
  developmentPlanType: "URBAN_PROJECT",
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
  surfaceArea: 15000,
  soilsDistribution: {
    PRAIRIE_TREES: 0,
    IMPERMEABLE_SOILS: 5000,
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

const commonSocioEconomicImpacts = [
  "rental_income",
  "avoided_friche_costs",
  "taxes_income",
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
  "avoided_traffic_co2_eq_emissions",
  "avoided_air_conditioning_co2_eq_emissions",
  "avoided_air_pollution",
  "avoided_property_damages_expenses",
  "local_property_value_increase",
  "local_transfer_duties_increase",
  "ecosystem_services",
  "water_regulation",
] as const;

describe("UrbanProjectImpactsService", () => {
  let dateProvider: DateProvider;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
  });

  it("returns socioeconomic impacts related to local property value increase for friche", async () => {
    const urbanProjectImpactsService = new UrbanProjectImpactsService({
      reconversionProject: reconversionProjectImpactDataView,
      relatedSite: site,
      evaluationPeriodInYears: 10,
      dateProvider: dateProvider,
      getCityRelatedDataService: new GetCityRelatedDataService(
        new MockLocalDataInseeService(),
        new MockDV3FApiService(),
      ),
      getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      cityPopulation: 150000,
      citySquareMetersSurfaceArea: 1500000000,
    });

    const result = await urbanProjectImpactsService.formatImpacts();

    expect(result.socioeconomic.impacts).toContainEqual({
      actor: "local_residents",
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

  it("returns no impacts related to local property value increase for non friche", async () => {
    const urbanProjectImpactsService = new UrbanProjectImpactsService({
      reconversionProject: reconversionProjectImpactDataView,
      relatedSite: { ...site, isFriche: false },
      evaluationPeriodInYears: 10,
      dateProvider: dateProvider,
      getCityRelatedDataService: new GetCityRelatedDataService(
        new MockLocalDataInseeService(),
        new MockDV3FApiService(),
      ),
      getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
      cityPopulation: 150000,
      citySquareMetersSurfaceArea: 1500000000,
    });

    const result = await urbanProjectImpactsService.formatImpacts();

    expect(
      result.socioeconomic.impacts.some(({ impact }) => impact === "local_property_value_increase"),
    ).toBe(false);
    expect(
      result.socioeconomic.impacts.some(
        ({ impact }) => impact === "local_transfer_duties_increase",
      ),
    ).toBe(false);
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
              GROUND_FLOOR_RETAIL: 1000,
              TERTIARY_ACTIVITIES: 1000,
              SOCIO_CULTURAL_PLACE: 500,
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
        getCityRelatedDataService: new GetCityRelatedDataService(
          new MockLocalDataInseeService(),
          new MockDV3FApiService(),
        ),
        getSoilsCarbonStorageService: new FakeGetSoilsCarbonStorageService(),
        cityPopulation: 300000,
        citySquareMetersSurfaceArea: 6000000000,
      });
    });

    it.each(commonSocioEconomicImpacts)(
      "inherit common socio economic impact : %s",
      async (impactName) => {
        const result = await urbanProjectImpactsService.formatImpacts();

        expect(result.socioeconomic.impacts.some(({ impact }) => impact === impactName)).toBe(true);
      },
    );

    it.each(urbanProjectSocioEconomicImpacts)(
      "has urban project socio economic impact : %s",
      async (impactName) => {
        const result = await urbanProjectImpactsService.formatImpacts();

        expect(result.socioeconomic.impacts.some(({ impact }) => impact === impactName)).toBe(true);
      },
    );

    it("returns urban project social impacts", async () => {
      const result = await urbanProjectImpactsService.formatImpacts();

      expect(result.social).toEqual({
        accidents: urbanProjectImpactsService["accidentsImpact"],
        fullTimeJobs: urbanProjectImpactsService["fullTimeJobsImpact"],
        avoidedVehiculeKilometers:
          urbanProjectImpactsService["travelRelatedImpacts"]["avoidedVehiculeKilometers"],
        travelTimeSaved: urbanProjectImpactsService["travelRelatedImpacts"]["travelTimeSaved"],
        avoidedTrafficAccidents:
          urbanProjectImpactsService["travelRelatedImpacts"]["avoidedTrafficAccidents"],
      });
    });

    it("returns urban project environmental impacts", async () => {
      const result = await urbanProjectImpactsService.formatImpacts();

      expect(result.environmental.nonContaminatedSurfaceArea).toBeDefined();
      expect(result.environmental.permeableSurfaceArea).toBeDefined();
      expect(result.environmental.soilsCarbonStorage).toBeDefined();
      expect(result.environmental.avoidedCarTrafficCo2EqEmissions).toEqual(
        urbanProjectImpactsService["travelRelatedImpacts"]["avoidedCarTrafficCo2EqEmissions"],
      );
      expect(result.environmental.avoidedAirConditioningCo2EqEmissions).toEqual(
        urbanProjectImpactsService["urbanFreshnessImpacts"]["avoidedAirConditioningCo2EqEmissions"],
      );
    });
  });
});