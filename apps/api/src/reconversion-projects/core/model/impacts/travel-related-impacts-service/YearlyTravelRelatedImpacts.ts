import {
  BuildingsUseDistribution,
  BUILDINGS_ECONOMIC_ACTIVITY_USE,
  filterObjectWithKeys,
  sumObjectValues,
} from "shared";

import { InfluenceAreaService } from "../influence-area-service/InfluenceAreaService";

const AVOIDED_KILOMETER_FOR_TRAVELERS = 1.2;
const PERCENT_OF_PEOPLE_IMPACTED = 0.5;
const PEOPLE_PER_VEHICULE = 1.45;
const AVERAGE_TIME_SAVED_IN_HOURS = 2 / 60;
const DAYS_IMPACTED_PER_YEAR_FOR_INHABITANTS = 365;
const DAYS_IMPACTED_PER_YEAR_FOR_WORKERS = 220;

type Props = {
  siteSquareMetersSurfaceArea: number;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
  buildingsFloorAreaDistribution: BuildingsUseDistribution;
};

export class YearlyTravelRelatedImpacts extends InfluenceAreaService {
  private readonly projectHousingSurfaceArea: number;
  private readonly projectOfficesSurface: number;
  private readonly projectOtherEconomicActivitySurface: number;
  private readonly publicCulturalAndSportsFacilitiesSurface: number;

  constructor({
    buildingsFloorAreaDistribution,
    siteSquareMetersSurfaceArea,
    citySquareMetersSurfaceArea,
    cityPopulation,
  }: Props) {
    super({
      siteSquareMetersSurfaceArea,
      citySquareMetersSurfaceArea,
      cityPopulation,
    });
    const {
      RESIDENTIAL = 0,
      OFFICES = 0,
      CULTURAL_PLACE = 0,
      SPORTS_FACILITIES = 0,
    } = buildingsFloorAreaDistribution;
    this.projectHousingSurfaceArea = RESIDENTIAL;
    this.projectOfficesSurface = OFFICES;

    const economicActivityBuildings = filterObjectWithKeys(
      buildingsFloorAreaDistribution,
      BUILDINGS_ECONOMIC_ACTIVITY_USE.filter((use) => use !== "OFFICES"),
    );

    this.projectOtherEconomicActivitySurface = sumObjectValues(economicActivityBuildings);
    this.publicCulturalAndSportsFacilitiesSurface = SPORTS_FACILITIES + CULTURAL_PLACE;

    this.influenceRadius = this.travelInfluenceRadius;
  }

  protected get travelInfluenceRadius() {
    if (
      this.economicActivityBuildingSurface === 0 &&
      this.publicCulturalAndSportsFacilitiesSurface === 0
    ) {
      return 0;
    }

    if (
      this.economicActivityBuildingSurface < 151 &&
      this.publicCulturalAndSportsFacilitiesSurface === 0
    ) {
      return 100;
    }

    if (
      this.economicActivityBuildingSurface < 300 &&
      this.publicCulturalAndSportsFacilitiesSurface === 0
    ) {
      return 200;
    }

    return 500;
  }

  protected get economicActivityBuildingSurface() {
    return this.projectOfficesSurface + this.projectOtherEconomicActivitySurface;
  }

  protected get impactedInhabitants() {
    return InfluenceAreaService.getInhabitantsFromHousingSurface(
      this.projectHousingSurfaceArea + this.getInfluenceAreaSquareMetersHousingSurface(),
    );
  }

  protected get impactedTertiaryActivityEmployees() {
    return this.projectOfficesSurface / 15;
  }

  protected get impactedOtherActivityEmployees() {
    return this.projectOtherEconomicActivitySurface / 70;
  }

  protected get avoidedKilometersPerInhabitantTraveler() {
    return (
      AVOIDED_KILOMETER_FOR_TRAVELERS *
      this.impactedInhabitants *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_INHABITANTS
    );
  }

  protected get avoidedKilometersPerTertiaryActivityEmployeeTraveler() {
    return (
      AVOIDED_KILOMETER_FOR_TRAVELERS *
      this.impactedTertiaryActivityEmployees *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_WORKERS
    );
  }

  protected get avoidedKilometersPerOtherActivityEmployeeTraveler() {
    return (
      AVOIDED_KILOMETER_FOR_TRAVELERS *
      this.impactedOtherActivityEmployees *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_WORKERS
    );
  }

  protected get avoidedKilometersPerTravelerPerYear() {
    return (
      this.avoidedKilometersPerInhabitantTraveler +
      this.avoidedKilometersPerOtherActivityEmployeeTraveler +
      this.avoidedKilometersPerTertiaryActivityEmployeeTraveler
    );
  }

  protected get avoidedKilometersPerWorkerVehiculePerYear() {
    return (
      (this.avoidedKilometersPerOtherActivityEmployeeTraveler +
        this.avoidedKilometersPerTertiaryActivityEmployeeTraveler) /
      PEOPLE_PER_VEHICULE
    );
  }

  protected get avoidedKilometersPerResidentVehiculePerYear() {
    return this.avoidedKilometersPerInhabitantTraveler / PEOPLE_PER_VEHICULE;
  }

  protected get avoidedKilometersPerVehiculePerYear() {
    return this.avoidedKilometersPerTravelerPerYear / PEOPLE_PER_VEHICULE;
  }

  protected get travelTimeSavedPerInhabitantTraveler() {
    return (
      AVERAGE_TIME_SAVED_IN_HOURS *
      this.impactedInhabitants *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_INHABITANTS
    );
  }

  protected get travelTimeSavedPerOtherActivityEmployeeTraveler() {
    return (
      AVERAGE_TIME_SAVED_IN_HOURS *
      this.impactedTertiaryActivityEmployees *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_WORKERS
    );
  }

  protected get travelTimeSavedPerTertiaryActivityEmployeeTraveler() {
    return (
      AVERAGE_TIME_SAVED_IN_HOURS *
      this.impactedOtherActivityEmployees *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_WORKERS
    );
  }

  protected get travelTimeSavedPerWorkerPerYear() {
    return (
      this.travelTimeSavedPerTertiaryActivityEmployeeTraveler +
      this.travelTimeSavedPerOtherActivityEmployeeTraveler
    );
  }

  protected get travelTimeSavedPerTravelerPerYear() {
    return this.travelTimeSavedPerInhabitantTraveler + this.travelTimeSavedPerWorkerPerYear;
  }

  protected get localPollutionPerVehiculeKilometer() {
    const municipalDensity = this.municipalDensityInhabitantPerSquareMeter * 1000000;

    if (municipalDensity < 37) {
      return 0.97 / 100;
    } else if (municipalDensity < 450) {
      return 1.33 / 100;
    } else if (municipalDensity < 1500) {
      return 1.58 / 100;
    } else if (municipalDensity < 4500) {
      return 3.88 / 100;
    } else {
      return 14.05 / 100;
    }
  }

  protected get deathsRatioPerAccident() {
    if (this.cityPopulation < 5000) {
      return 9.6 / 100;
    } else if (this.cityPopulation < 20000) {
      return 4.8 / 100;
    } else if (this.cityPopulation < 50000) {
      return 3 / 100;
    } else if (this.cityPopulation < 100000) {
      return 3.1 / 100;
    } else {
      return 2.3 / 100;
    }
  }

  protected get severeInjuriesRatioPerAccident() {
    if (this.cityPopulation < 5000) {
      return 37.4 / 100;
    } else if (this.cityPopulation < 20000) {
      return 23.4 / 100;
    } else if (this.cityPopulation < 50000) {
      return 12.3 / 100;
    } else if (this.cityPopulation < 100000) {
      return 11.9 / 100;
    } else {
      return 7.7 / 100;
    }
  }

  protected get minorInjuriesRatioPerAccident() {
    if (this.cityPopulation < 5000) {
      return 101.6 / 100;
    } else if (this.cityPopulation < 20000) {
      return 106.3 / 100;
    } else if (this.cityPopulation < 50000) {
      return 115.8 / 100;
    } else if (this.cityPopulation < 100000) {
      return 110.9 / 100;
    } else {
      return 123.2 / 100;
    }
  }

  protected get avoidedAccidentsPerYearForHundredMillionOfVehicule() {
    return this.avoidedKilometersPerVehiculePerYear * 4.77;
  }

  protected get avoidedAccidentsPerYear() {
    return this.avoidedAccidentsPerYearForHundredMillionOfVehicule / 100000000;
  }

  protected get avoidedMinorInjuriesPerYear() {
    return this.avoidedAccidentsPerYear * this.minorInjuriesRatioPerAccident;
  }

  protected get avoidedSevereInjuriesPerYear() {
    return this.avoidedAccidentsPerYear * this.severeInjuriesRatioPerAccident;
  }

  protected get avoidedDeathsPerYear() {
    return this.avoidedAccidentsPerYear * this.deathsRatioPerAccident;
  }

  protected get avoidedPropertyDamageExpensesPerYear() {
    return this.avoidedAccidentsPerYear * 6264;
  }

  protected get avoidedKilometersPerVehiculeExpensesPerYear() {
    return (
      (this.avoidedKilometersPerWorkerVehiculePerYear +
        this.avoidedKilometersPerResidentVehiculePerYear) *
      0.1
    );
  }

  protected get travelTimeAvoidedCostsPerTravelerPerYear() {
    return this.travelTimeSavedPerTravelerPerYear * 10;
  }

  protected get avoidedAirPollutionHealthExpensesPerYear() {
    return this.avoidedKilometersPerVehiculePerYear * this.localPollutionPerVehiculeKilometer;
  }

  protected get avoidedAccidentsInjuriesOrDeathsPerYear() {
    return (
      this.avoidedMinorInjuriesPerYear +
      this.avoidedSevereInjuriesPerYear +
      this.avoidedDeathsPerYear
    );
  }

  protected get avoidedAccidentsMinorInjuriesExpensesPerYear() {
    return this.avoidedMinorInjuriesPerYear * 16000;
  }

  protected get avoidedAccidentsSevereInjuriesExpensesPerYear() {
    return this.avoidedSevereInjuriesPerYear * 400000;
  }

  protected get avoidedAccidentsDeathsExpensesPerYear() {
    return this.avoidedDeathsPerYear * 3200000;
  }

  protected get avoidedAccidentsInjuriesOrExpensesValuePerYear() {
    return (
      this.avoidedAccidentsDeathsExpensesPerYear +
      this.avoidedAccidentsMinorInjuriesExpensesPerYear +
      this.avoidedAccidentsSevereInjuriesExpensesPerYear
    );
  }
}
