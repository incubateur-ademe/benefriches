import {
  BuildingsUseDistribution,
  BUILDINGS_ECONOMIC_ACTIVITY_USE,
  filterObjectWithKeys,
  sumObjectValues,
  BuildingsUse,
} from "shared";

import { InfluenceAreaService } from "../influence-area-service/InfluenceAreaService";

const AVOIDED_KILOMETER_FOR_TRAVELERS = 1.2;
const PERCENT_OF_PEOPLE_IMPACTED = 0.5;
const PEOPLE_PER_VEHICULE = 1.45;
const AVERAGE_TIME_SAVED_IN_HOURS = 2 / 60;
const DAYS_IMPACTED_PER_YEAR_FOR_INHABITANTS = 365;
const DAYS_IMPACTED_PER_YEAR_FOR_WORKERS = 220;

const NB_OF_WORKERS_PER_OFFICE_SQUARE_METERS = 15;
const NB_OF_WORKERS_PER_OTHER_ECONOMIC_ACTIVITY_SQUARE_METERS = 70;

const NB_OF_ACCIDENTS_PER_100000000_VEHICULES = 4.77;

const PROPERTY_DAMAGE_EURO_VALUE = 6264;
const STATISTICAL_LIFE_EURO_VALUE = 3_877_066;
const SEVERE_INJURY_EURO_VALUE = 484_633;
const MINOR_INJURY_EURO_VALUE = 19_385;
const FRENCH_TIME_EURO_VALUE_PER_HOUR = 9.97;
const TRAVEL_COST_EURO_PER_KILOMETER = 0.12;

const PUBLIC_CULTURAL_AND_SPORTS_FACILITIES: BuildingsUse[] = [
  "OTHER_CULTURAL_PLACE",
  "CINEMA",
  "MUSEUM",
  "THEATER",
  "SPORTS_FACILITIES",
  "RECREATIONAL_FACILITY",
];

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
    const { RESIDENTIAL = 0, OFFICES = 0 } = buildingsFloorAreaDistribution;
    this.projectHousingSurfaceArea = RESIDENTIAL;
    this.projectOfficesSurface = OFFICES;

    const economicActivityBuildings = filterObjectWithKeys(
      buildingsFloorAreaDistribution,
      BUILDINGS_ECONOMIC_ACTIVITY_USE.filter((use) => use !== "OFFICES"),
    );

    this.projectOtherEconomicActivitySurface = sumObjectValues(economicActivityBuildings);
    this.publicCulturalAndSportsFacilitiesSurface = sumObjectValues(
      filterObjectWithKeys(buildingsFloorAreaDistribution, PUBLIC_CULTURAL_AND_SPORTS_FACILITIES),
    );

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
    return this.projectOfficesSurface / NB_OF_WORKERS_PER_OFFICE_SQUARE_METERS;
  }

  protected get impactedOtherActivityEmployees() {
    return (
      this.projectOtherEconomicActivitySurface /
      NB_OF_WORKERS_PER_OTHER_ECONOMIC_ACTIVITY_SQUARE_METERS
    );
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
    return this.avoidedKilometersPerVehiculePerYear * NB_OF_ACCIDENTS_PER_100000000_VEHICULES;
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
    return this.avoidedAccidentsPerYear * PROPERTY_DAMAGE_EURO_VALUE;
  }

  protected get avoidedKilometersPerVehiculeExpensesPerYear() {
    return this.avoidedKilometersPerVehiculePerYear * TRAVEL_COST_EURO_PER_KILOMETER;
  }

  protected get travelTimeAvoidedCostsPerTravelerPerYear() {
    return this.travelTimeSavedPerTravelerPerYear * FRENCH_TIME_EURO_VALUE_PER_HOUR;
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
    return this.avoidedMinorInjuriesPerYear * MINOR_INJURY_EURO_VALUE;
  }

  protected get avoidedAccidentsSevereInjuriesExpensesPerYear() {
    return this.avoidedSevereInjuriesPerYear * SEVERE_INJURY_EURO_VALUE;
  }

  protected get avoidedAccidentsDeathsExpensesPerYear() {
    return this.avoidedDeathsPerYear * STATISTICAL_LIFE_EURO_VALUE;
  }

  protected get avoidedAccidentsInjuriesOrExpensesValuePerYear() {
    return (
      this.avoidedAccidentsDeathsExpensesPerYear +
      this.avoidedAccidentsMinorInjuriesExpensesPerYear +
      this.avoidedAccidentsSevereInjuriesExpensesPerYear
    );
  }
}
